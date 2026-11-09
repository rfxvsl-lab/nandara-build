/**
 * Server functions portal klien (/pantau) & pengelolaannya di /admin.
 * Modul server diimpor dinamis di dalam handler agar tidak ikut ke bundle browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  clientProjectSchema,
  normalizeKode,
  type ClientProject,
  type PortalView,
} from "./portal-types";

async function requireAdmin() {
  const { isAdmin } = await import("@/server/admin-auth");
  if (!(await isAdmin())) throw new Error("Tidak diizinkan");
}

async function store() {
  const { getClientProjectStore } = await import("@/server/portal-store");
  return getClientProjectStore();
}

function toView(p: ClientProject): PortalView {
  const { waKlien: _wa, aktif: _aktif, kode: _kode, ...rest } = p;
  return rest;
}

/* Pembatas percobaan login per IP (memori proses). */
const attempts = new Map<string, number[]>();
function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  attempts.set(ip, recent);
  return recent.length >= 8;
}
function recordFailure(ip: string) {
  attempts.set(ip, [...(attempts.get(ip) ?? []), Date.now()]);
}

/* ───────────── Klien ───────────── */

export type PortalState =
  { status: "disabled" } | { status: "login" } | { status: "ok"; project: PortalView };

export const getPortalState = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortalState> => {
    const { adminEnabled, getPortalSession } = await import("@/server/admin-auth");
    if (!adminEnabled()) return { status: "disabled" };
    const session = await getPortalSession();
    const id = session.data.projectId;
    if (!id) return { status: "login" };
    const project = await (await store()).get(id);
    if (!project || !project.aktif) {
      await session.clear();
      return { status: "login" };
    }
    return { status: "ok", project: toView(project) };
  },
);

export const portalLogin = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      kode: z.string().max(20),
      wa4: z.string().regex(/^\d{4}$/, "Masukkan 4 digit terakhir nomor WhatsApp"),
    }),
  )
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const { adminEnabled, getPortalSession } = await import("@/server/admin-auth");
    if (!adminEnabled()) return { ok: false, error: "Portal belum aktif." };
    const { getRequestIP } = await import("@tanstack/react-start/server");
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (tooManyAttempts(ip)) {
      return { ok: false, error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." };
    }
    await new Promise((r) => setTimeout(r, 300));
    const project = await (await store()).findByKode(normalizeKode(data.kode));
    if (!project || !project.aktif || !project.waKlien.endsWith(data.wa4)) {
      recordFailure(ip);
      return { ok: false, error: "Kode akses atau nomor WhatsApp tidak cocok." };
    }
    const session = await getPortalSession();
    await session.update({ projectId: project.id });
    return { ok: true };
  });

export const portalLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getPortalSession } = await import("@/server/admin-auth");
  await (await getPortalSession()).clear();
  return { ok: true };
});

/* ───────────── Admin ───────────── */

export const adminListClientProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClientProject[]> => {
    await requireAdmin();
    return (await store()).list();
  },
);

export const adminSaveClientProject = createServerFn({ method: "POST" })
  .inputValidator(clientProjectSchema)
  .handler(async ({ data }): Promise<ClientProject> => {
    await requireAdmin();
    return (await store()).save(data);
  });

export const adminDeleteClientProject = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const s = await store();
    const project = await s.get(data.id);
    await s.remove(data.id);
    if (project) {
      const { getContentStores } = await import("@/server/content-store");
      const { projectFileIds } = await import("./portal-types");
      const media = getContentStores().privateMedia;
      await Promise.all([...projectFileIds(project)].map((id) => media.remove(id)));
    }
    return { ok: true };
  });

export const adminDeletePrivateFile = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().regex(/^[A-Za-z0-9._-]{1,64}$/) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getContentStores } = await import("@/server/content-store");
    await getContentStores().privateMedia.remove(data.id);
    return { ok: true };
  });
