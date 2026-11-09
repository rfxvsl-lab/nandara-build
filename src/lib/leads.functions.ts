/**
 * Server functions untuk lead & dashboard admin.
 * Modul server diimpor dinamis di dalam handler agar tidak ikut ke bundle browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { LEAD_STATUSES, leadInputSchema, type Lead } from "./leads";

/* Batas kirim sederhana per IP (memori proses). */
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(leadInputSchema)
  .handler(async ({ data }): Promise<{ ok: true; id: string } | { ok: false; error: string }> => {
    // Honeypot terisi → anggap sukses agar bot tidak tahu, tapi jangan disimpan.
    if (data.website) return { ok: true, id: "ignored" };

    const { getRequestIP } = await import("@tanstack/react-start/server");
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (rateLimited(ip)) {
      return {
        ok: false,
        error: "Terlalu banyak permintaan. Silakan coba lagi beberapa menit lagi.",
      };
    }

    const { getLeadStore } = await import("@/server/leads-store");
    const { notifyNewLead } = await import("@/server/notify");
    try {
      const lead = await getLeadStore().create({
        nama: data.nama,
        wa: data.wa,
        kota: data.kota,
        jenis: data.jenis,
        tanggal: data.tanggal ?? "",
        waktu: data.waktu ?? "",
        catatan: data.catatan ?? "",
        halaman: data.halaman ?? "",
      });
      await notifyNewLead(lead);
      return { ok: true, id: lead.id };
    } catch (error) {
      console.error("Gagal menyimpan lead", error);
      return { ok: false, error: "Data gagal tersimpan. Silakan hubungi kami lewat WhatsApp." };
    }
  });

/* ───────────── Admin ───────────── */

export type AdminState =
  | { status: "disabled" }
  | { status: "login" }
  | { status: "ok"; storage: "appwrite" | "lokal"; leads: Lead[] };

export const getAdminState = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminState> => {
    const { adminEnabled, isAdmin } = await import("@/server/admin-auth");
    if (!adminEnabled()) return { status: "disabled" };
    if (!(await isAdmin())) return { status: "login" };
    const { getLeadStore } = await import("@/server/leads-store");
    const store = getLeadStore();
    return { status: "ok", storage: store.kind, leads: await store.list() };
  },
);

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().max(200) }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { getAdminSession, passwordMatches } = await import("@/server/admin-auth");
    // Jeda kecil memperlambat tebakan kata sandi.
    await new Promise((r) => setTimeout(r, 400));
    if (!passwordMatches(data.password)) return { ok: false };
    const session = await getAdminSession();
    await session.update({ admin: true });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("@/server/admin-auth");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true };
});

export const adminUpdateLead = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1).max(64),
      status: z.enum(LEAD_STATUSES).optional(),
      adminNote: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data }): Promise<Lead> => {
    const { isAdmin } = await import("@/server/admin-auth");
    if (!(await isAdmin())) throw new Error("Tidak diizinkan");
    const { getLeadStore } = await import("@/server/leads-store");
    const patch: { status?: Lead["status"]; adminNote?: string } = {};
    if (data.status) patch.status = data.status;
    if (data.adminNote !== undefined) patch.adminNote = data.adminNote;
    return getLeadStore().update(data.id, patch);
  });
