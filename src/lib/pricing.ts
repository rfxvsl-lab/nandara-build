/**
 * Pengaturan harga acuan & skema termin (diatur dari /admin → Harga & termin).
 * Aman dipakai di client maupun server.
 */
import { z } from "zod";

export const TIERS = ["standar", "menengah", "premium"] as const;
export type TierKey = (typeof TIERS)[number];
export const TIER_LABEL: Record<TierKey, string> = {
  standar: "Standar",
  menengah: "Menengah",
  premium: "Premium",
};

export type PriceJob = { id: string; label: string; tiers: Record<TierKey, [number, number]> };
export type TerminStep = { label: string; persen: number };
export type PricingSettings = { updated: string; jobs: PriceJob[]; termin: TerminStep[] };

/**
 * Nilai awal. Bangun baru mengacu kisaran umum pasar 2026
 * (standar ±Rp4–5 jt/m², menengah ±Rp5,5–7 jt/m²). Renovasi & skema termin
 * adalah CONTOH awal — sesuaikan dari admin.
 */
export const DEFAULT_PRICING: PricingSettings = {
  updated: "November 2026",
  jobs: [
    {
      id: "bangun",
      label: "Bangun rumah baru",
      tiers: {
        standar: [4_000_000, 5_000_000],
        menengah: [5_500_000, 7_000_000],
        premium: [7_500_000, 10_000_000],
      },
    },
    {
      id: "renovasi",
      label: "Renovasi total",
      tiers: {
        standar: [2_500_000, 3_500_000],
        menengah: [3_500_000, 5_000_000],
        premium: [5_000_000, 7_500_000],
      },
    },
  ],
  termin: [
    { label: "DP setelah SPK ditandatangani", persen: 30 },
    { label: "Termin 1: pekerjaan struktur selesai", persen: 30 },
    { label: "Termin 2: pekerjaan finishing berjalan", persen: 30 },
    { label: "Pelunasan saat serah terima", persen: 10 },
  ],
};

const rupiah = z
  .number({ invalid_type_error: "Harga harus berupa angka" })
  .int()
  .min(1, "Semua harga wajib diisi (lebih dari 0)")
  .max(1_000_000_000, "Harga terlalu besar");
const range = z
  .tuple([rupiah, rupiah])
  .refine(([lo, hi]) => lo <= hi, "Harga minimum harus ≤ maksimum");

export const pricingSchema = z.object({
  updated: z.string().trim().min(3, "Isi tanggal pembaruan, mis. November 2026").max(40),
  jobs: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]{1,40}$/, "Nama pekerjaan tidak valid"),
        label: z.string().trim().min(3, "Nama pekerjaan minimal 3 karakter").max(60),
        tiers: z.object({ standar: range, menengah: range, premium: range }),
      }),
    )
    .min(1, "Minimal satu jenis pekerjaan")
    .max(12, "Maksimal 12 jenis pekerjaan"),
  termin: z
    .array(
      z.object({
        label: z.string().trim().min(3, "Nama termin minimal 3 karakter").max(80),
        persen: z
          .number({ invalid_type_error: "Persentase harus angka" })
          .min(1, "Persentase tiap tahap minimal 1%")
          .max(100, "Persentase maksimal 100%"),
      }),
    )
    .min(1)
    .max(8)
    .refine(
      (t) => Math.round(t.reduce((s, x) => s + x.persen, 0)) === 100,
      "Total termin harus 100%",
    ),
});
