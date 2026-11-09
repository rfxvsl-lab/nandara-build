/**
 * Portal klien "Pantau Proyek": tipe & skema proyek berjalan.
 * Aman dipakai di client maupun server.
 */
import { z } from "zod";

export const STAGE_STATUS = ["belum", "berjalan", "selesai"] as const;
export const PAY_STATUS = ["belum", "ditagih", "lunas"] as const;
export const PROJECT_STATUS = ["persiapan", "berjalan", "selesai"] as const;
export const DOC_TYPES = ["RAB", "SPK", "Gambar kerja", "Berita acara", "Lainnya"] as const;

export const PROJECT_STATUS_LABEL: Record<(typeof PROJECT_STATUS)[number], string> = {
  persiapan: "Persiapan",
  berjalan: "Sedang dikerjakan",
  selesai: "Selesai",
};
export const STAGE_STATUS_LABEL: Record<(typeof STAGE_STATUS)[number], string> = {
  belum: "Belum mulai",
  berjalan: "Berjalan",
  selesai: "Selesai",
};
export const PAY_STATUS_LABEL: Record<(typeof PAY_STATUS)[number], string> = {
  belum: "Belum jatuh tempo",
  ditagih: "Ditagih",
  lunas: "Lunas",
};

const fileId = z.string().regex(/^[A-Za-z0-9._-]{1,64}$/);
const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
  .or(z.literal(""));

export const clientProjectSchema = z.object({
  id: z.string().max(64).optional(),
  namaKlien: z.string().trim().min(2, "Isi nama klien").max(100),
  waKlien: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Nomor WhatsApp klien minimal 10 digit").max(15)),
  judul: z.string().trim().min(3, "Isi judul proyek").max(200),
  lokasi: z.string().trim().max(200),
  mulai: dateStr,
  target: dateStr,
  nilaiKontrak: z.number().int().min(0).max(100_000_000_000),
  progres: z.number().int().min(0).max(100),
  status: z.enum(PROJECT_STATUS),
  tahapan: z
    .array(
      z.object({
        nama: z.string().trim().min(2, "Nama tahapan minimal 2 karakter").max(120),
        status: z.enum(STAGE_STATUS),
        tanggal: dateStr,
      }),
    )
    .max(30),
  termin: z
    .array(
      z.object({
        label: z.string().trim().min(2, "Nama termin minimal 2 karakter").max(120),
        nominal: z.number().int().min(0).max(100_000_000_000),
        status: z.enum(PAY_STATUS),
        tanggal: dateStr,
      }),
    )
    .max(12),
  laporan: z
    .array(
      z.object({
        id: z.string().max(64),
        tanggal: dateStr,
        judul: z.string().trim().min(2, "Judul laporan minimal 2 karakter").max(200),
        catatan: z.string().trim().max(3000),
        foto: z.array(fileId).max(20),
      }),
    )
    .max(200),
  dokumen: z
    .array(
      z.object({
        id: fileId,
        nama: z.string().trim().min(2, "Nama dokumen minimal 2 karakter").max(150),
        jenis: z.enum(DOC_TYPES),
        mime: z.string().max(60),
      }),
    )
    .max(50),
  aktif: z.boolean(),
});

export type ClientProjectInput = z.input<typeof clientProjectSchema>;
export type ClientProject = z.output<typeof clientProjectSchema> & {
  id: string;
  kode: string;
  createdAt: string;
  updatedAt: string;
};

/** Data yang dikirim ke klien (tanpa nomor WA lengkap). */
export type PortalView = Omit<ClientProject, "waKlien" | "aktif" | "kode">;

/** Semua id file privat yang dimiliki proyek (untuk cek izin unduh). */
export function projectFileIds(p: Pick<ClientProject, "laporan" | "dokumen">): Set<string> {
  return new Set([...p.laporan.flatMap((l) => l.foto), ...p.dokumen.map((d) => d.id)]);
}

export function portalFileUrl(id: string, opts: { w?: number; download?: boolean } = {}): string {
  const q = new URLSearchParams();
  if (opts.w) q.set("w", String(opts.w));
  if (opts.download) q.set("dl", "1");
  const qs = q.toString();
  return `/api/portal/file/${encodeURIComponent(id)}${qs ? `?${qs}` : ""}`;
}

/** Kode akses: 8 karakter tanpa huruf/angka yang mirip (0/O, 1/I/L). */
export const KODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function normalizeKode(input: string): string {
  const c = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return c.length === 8 ? `${c.slice(0, 4)}-${c.slice(4)}` : c;
}
