/**
 * Skema & label lead (calon klien). Aman dipakai di client maupun server.
 */
import { z } from "zod";

export const LEAD_STATUSES = [
  "baru",
  "dihubungi",
  "disurvei",
  "rab_dikirim",
  "deal",
  "batal",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  baru: "Baru",
  dihubungi: "Sudah dihubungi",
  disurvei: "Sudah disurvei",
  rab_dikirim: "RAB dikirim",
  deal: "Deal",
  batal: "Batal",
};

export const JOB_OPTIONS = [
  "Bangun rumah baru",
  "Renovasi rumah",
  "Desain arsitektur saja",
  "Perencanaan & RAB saja",
  "Lainnya",
] as const;

export const TIME_SLOTS = [
  "Pagi (08.00–11.00)",
  "Siang (11.00–14.00)",
  "Sore (14.00–17.00)",
] as const;

/** Input dari form survei publik. */
export const leadInputSchema = z.object({
  nama: z.string().trim().min(2, "Mohon isi nama Anda.").max(100),
  wa: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Nomor WhatsApp minimal 10 digit.").max(15, "Nomor terlalu panjang.")),
  kota: z.string().trim().min(2, "Mohon isi kota/lokasi proyek.").max(100),
  jenis: z.enum(JOB_OPTIONS),
  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  waktu: z.enum(TIME_SLOTS).optional().or(z.literal("")),
  catatan: z.string().trim().max(1000).optional().or(z.literal("")),
  halaman: z.string().max(200).optional(),
  /** Honeypot anti-spam: harus kosong. */
  website: z.string().max(0).optional().or(z.literal("")),
});
export type LeadInput = z.input<typeof leadInputSchema>;

export type Lead = {
  id: string;
  createdAt: string;
  nama: string;
  wa: string;
  kota: string;
  jenis: string;
  tanggal: string;
  waktu: string;
  catatan: string;
  halaman: string;
  status: LeadStatus;
  adminNote: string;
};

/** Ubah 08xx → 628xx untuk link wa.me. */
export function toIntlPhone(wa: string): string {
  const digits = wa.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}
