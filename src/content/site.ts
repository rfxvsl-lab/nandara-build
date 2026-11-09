/**
 * Data konten Nandara Build.
 * Ubah teks, nomor, dan daftar di sini — komponen halaman hanya menampilkan.
 */
import {
  BadgeCheck,
  CalendarCheck,
  Compass,
  FileSpreadsheet,
  Gift,
  HardHat,
  PencilRuler,
  ScrollText,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { IMAGES, type ResponsiveImage } from "./images";

export const SITE = {
  name: "Nandara Build",
  tagline: "We Design. We Build. You Enjoy.",
  headline: "Solusi Konstruksi & Renovasi Tanpa Repot",
  description:
    "Jasa arsitektur, perencanaan RAB transparan, dan kontraktor renovasi di Jawa Timur. Gratis survei, SPK resmi, tepat waktu.",
  area: "Jawa Timur & sekitarnya",
} as const;

export const CONTACT = {
  /** Nomor tampil untuk manusia */
  whatsappDisplay: "0851-9418-9182",
  /** Nomor format internasional tanpa + untuk wa.me */
  whatsappIntl: "6285194189182",
  instagram: { handle: "@nandara_build", url: "https://instagram.com/nandara_build" },
  // TODO: isi URL halaman Facebook bisnis yang benar, lalu tampilkan lagi di footer.
  facebook: null as string | null,
} as const;

/**
 * Link WhatsApp dengan pesan template sesuai konteks (design.md §5.3).
 * Contoh: waLink("Renovasi Rumah") → "Halo Nandara Build, saya tertarik Renovasi Rumah. …"
 */
export function waLink(topik = "konsultasi gratis"): string {
  const text = `Halo Nandara Build, saya tertarik ${topik}. Lokasi saya di `;
  return `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

export const NAV = [
  { label: "Layanan", to: "/layanan" },
  { label: "Proses", to: "/proses" },
  { label: "Estimasi Biaya", to: "/estimasi-biaya" },
  { label: "Tentang", to: "/tentang" },
  { label: "Kontak", to: "/kontak" },
] as const;

type IconItem = { icon: LucideIcon; title: string; body: string };

export const HERO_POINTS: IconItem[] = [
  { icon: ScrollText, title: "SPK Resmi & Legal", body: "Berpayung hukum & amanah" },
  { icon: Wallet, title: "RAB 100% Transparan", body: "Tanpa biaya tak terduga" },
  // Disamakan dengan bagian "Mengapa Kami": yang gratis untuk semua adalah survei & konsultasi.
  { icon: Gift, title: "Gratis Survei & Konsultasi", body: "Cek lokasi & diskusi tanpa biaya" },
];

export type Service = {
  icon: LucideIcon;
  name: string;
  /** Label pendek (1 baris) untuk foto layanan */
  short: string;
  body: string;
  image: ResponsiveImage;
  /** Topik untuk pesan template WhatsApp */
  waTopic: string;
  /** Rincian untuk halaman /layanan */
  includes: readonly string[];
  deliverable: string;
};

export const SERVICES: Service[] = [
  {
    icon: PencilRuler,
    name: "Jasa Arsitektur & Desain",
    short: "Arsitektur & Desain",
    body: "Konsep rancangan gambar, visual 3D, dan penataan tata ruang yang matang sebelum dibangun.",
    image: IMAGES.detailMaterial,
    waTopic: "jasa arsitektur & desain",
    includes: [
      "Diskusi kebutuhan, gaya hidup, dan budget",
      "Konsep rancangan & penataan tata ruang",
      "Gambar kerja untuk pelaksanaan",
      "Visual 3D eksterior / interior",
    ],
    deliverable: "Gambar rancangan + visual 3D",
  },
  {
    icon: FileSpreadsheet,
    name: "Jasa Perencanaan & RAB",
    short: "Perencanaan & RAB",
    body: "Estimasi biaya terperinci, akurat, dan transparan yang disesuaikan dengan budget Anda.",
    image: IMAGES.interiorSpace,
    waTopic: "jasa perencanaan & RAB",
    includes: [
      "Survei & pengukuran lokasi",
      "Perhitungan volume tiap item pekerjaan",
      "Harga satuan dari standar harga material terbaru",
      "Penyesuaian spesifikasi dengan budget Anda",
    ],
    deliverable: "RAB rinci per item pekerjaan",
  },
  {
    icon: HardHat,
    name: "Kontraktor Bangunan & Renovasi",
    short: "Bangun & Renovasi",
    body: "Pelaksanaan konstruksi rumah baru, renovasi fasad, hingga pengerjaan interior.",
    image: IMAGES.processSite,
    waTopic: "kontraktor bangun / renovasi rumah",
    includes: [
      "Pembangunan rumah baru",
      "Renovasi fasad, ruang, dan atap",
      "Pengerjaan interior",
      "Laporan progres & jadwal kerja tertulis",
    ],
    deliverable: "SPK resmi + garansi tertulis",
  },
];

export const REASONS: IconItem[] = [
  {
    icon: Compass,
    title: "Gratis Biaya Survei & Konsultasi",
    body: "Diskusi kebutuhan dan cek lokasi langsung tanpa biaya.",
  },
  {
    icon: PencilRuler,
    title: "Gratis Desain & Perencanaan",
    body: "Untuk klien yang melanjutkan eksekusi konstruksi bersama kami.",
  },
  {
    icon: ShieldCheck,
    title: "SPK Resmi & Legal",
    body: "Spesifikasi material dan garansi tertulis yang berpayung hukum.",
  },
  {
    icon: CalendarCheck,
    title: "Tepat Waktu (Time Schedule)",
    body: "Proyek terpantau rapi tanpa keterlambatan yang merugikan Anda.",
  },
  {
    icon: BadgeCheck,
    title: "RAB Jujur & Transparan",
    body: "Berdasarkan standar harga material terbaru, tanpa jebakan biaya siluman.",
  },
];

export const VISION =
  "Menjadi partner konstruksi terpercaya yang menghadirkan solusi bangunan berkualitas, terukur, dan bernilai jangka panjang.";

export const MISSION = [
  "Memahami kebutuhan dan gaya hidup setiap klien.",
  "Mengutamakan transparansi biaya di setiap tahap.",
  "Menjaga kerapian dan profesionalitas di lapangan.",
  "Memberikan garansi dan tanggung jawab atas hasil kerja.",
] as const;

/* ───────────────────────── Data Tahap C ───────────────────────── */

/**
 * Statistik — HANYA isi dengan angka nyata (design.md §10).
 * Selama kosong, baris statistik tidak ditampilkan.
 */
export const STATS: { value: string; label: string }[] = [
  // { value: "120+", label: "Proyek selesai" },
  // { value: "8", label: "Kota dilayani" },
];

/** Testimoni nyata (dengan izin klien). Selama kosong, section testimoni disembunyikan. */
export const TESTIMONIALS: { quote: string; name: string; city: string; project: string }[] = [];

export const TRUST_STRIP = [
  { icon: Compass, label: "Gratis survei lokasi" },
  { icon: ScrollText, label: "SPK resmi & legal" },
  { icon: FileSpreadsheet, label: "RAB rinci sebelum DP" },
  { icon: CalendarCheck, label: "Jadwal kerja tertulis" },
] as const;

/**
 * Contoh format RAB untuk section Transparansi.
 * Angka adalah ILUSTRASI format (ditandai di UI), bukan penawaran.
 * TODO: ganti dengan cuplikan RAB asli Nandara (boleh disamarkan).
 */
export const RAB_SAMPLE = {
  title: "Contoh RAB — Renovasi fasad & teras",
  updated: "November 2026",
  rows: [
    { item: "Bongkar keramik & plester lama", volume: 32, unit: "m²", price: 45_000 },
    { item: "Pasangan bata ringan + plester aci", volume: 18, unit: "m²", price: 210_000 },
    { item: "Rangka atap baja ringan teras", volume: 14, unit: "m²", price: 285_000 },
    { item: "Lantai granit 60×60 (merek tertulis)", volume: 24, unit: "m²", price: 365_000 },
    { item: "Cat eksterior weathershield 2 lapis", volume: 68, unit: "m²", price: 48_000 },
  ],
} as const;

export const SPK_POINTS = [
  "Lingkup pekerjaan & gambar kerja yang disepakati",
  "Spesifikasi & merek material tertulis",
  "Nilai kontrak yang dikunci sesuai RAB",
  "Jadwal pelaksanaan & tanggal serah terima",
  "Termin pembayaran sesuai progres",
  "Garansi tertulis setelah serah terima",
] as const;

export const PROCESS_STEPS = [
  {
    title: "Konsultasi",
    body: "Ceritakan kebutuhan & budget Anda lewat WhatsApp atau telepon.",
    doc: "Konsultasi gratis",
  },
  {
    title: "Survei lokasi",
    body: "Tim kami datang mengukur dan mengecek kondisi bangunan.",
    doc: "Hasil ukur lokasi (gratis)",
  },
  {
    title: "Desain & RAB",
    body: "Gambar rancangan dan RAB rinci per item pekerjaan.",
    doc: "Gambar + RAB",
  },
  {
    title: "Tanda tangan SPK",
    body: "Semua kesepakatan dikunci di kontrak resmi sebelum DP.",
    doc: "SPK resmi",
  },
  {
    title: "Pembangunan",
    body: "Pekerjaan sesuai jadwal, dengan laporan progres berkala.",
    doc: "Laporan progres",
  },
  {
    title: "Serah terima",
    body: "Pengecekan bersama, serah kunci, dan masa garansi dimulai.",
    doc: "Berita acara + garansi",
  },
] as const;

/**
 * Harga acuan per m² untuk kalkulator estimasi (rentang, Rupiah).
 * Bangun baru mengacu pada kisaran umum pasar 2026
 * (standar ±Rp4–5 jt/m², menengah ±Rp5,5–7 jt/m²).
 * TODO: konfirmasi & sesuaikan dengan harga Nandara sendiri.
 */
export const PRICING = {
  updated: "November 2026",
  jobs: {
    bangun: {
      label: "Bangun rumah baru",
      tiers: {
        standar: [4_000_000, 5_000_000],
        menengah: [5_500_000, 7_000_000],
        premium: [7_500_000, 10_000_000],
      },
    },
    renovasi: {
      label: "Renovasi total",
      tiers: {
        standar: [2_500_000, 3_500_000],
        menengah: [3_500_000, 5_000_000],
        premium: [5_000_000, 7_500_000],
      },
    },
  },
  tierLabels: {
    standar: "Standar",
    menengah: "Menengah",
    premium: "Premium",
  },
} as const;

export type JobKey = keyof typeof PRICING.jobs;
export type TierKey = keyof typeof PRICING.tierLabels;

export const FAQ = [
  {
    q: "Apakah survei dan konsultasi benar-benar gratis?",
    a: "Ya. Konsultasi dan survei lokasi tidak dipungut biaya, tanpa kewajiban melanjutkan kerja sama.",
  },
  {
    q: "Kapan desain gratis berlaku?",
    a: "Desain & perencanaan gratis untuk klien yang melanjutkan pembangunan atau renovasi bersama Nandara Build. Jika hanya membutuhkan jasa desain, biayanya kami sampaikan di awal.",
  },
  {
    q: "Apa yang saya terima sebelum membayar DP?",
    a: "RAB terperinci per item pekerjaan dan draf SPK resmi. Anda bisa memeriksa dan mendiskusikannya dulu sebelum memutuskan.",
  },
  {
    q: "Apakah harga bisa berubah di tengah pekerjaan?",
    a: "Nilai kontrak dikunci di SPK sesuai RAB. Perubahan hanya terjadi jika Anda meminta tambahan atau perubahan pekerjaan, dan selalu disepakati tertulis lebih dulu.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Pembayaran bertahap (termin) mengikuti progres pekerjaan, sesuai yang tertulis di SPK.",
  },
  {
    q: "Area mana saja yang dilayani?",
    a: "Jawa Timur dan sekitarnya. Kirim lokasi Anda lewat WhatsApp untuk memastikan jangkauan survei.",
  },
  {
    q: "Apakah ada garansi?",
    a: "Ya. Garansi tertulis di SPK dan berlaku setelah serah terima pekerjaan.",
  },
] as const;
