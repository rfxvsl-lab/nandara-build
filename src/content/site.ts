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

import detailMaterial from "@/assets/detail-material.jpg";
import interiorSpace from "@/assets/interior-space.jpg";
import processSite from "@/assets/process-site.jpg";

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
  { label: "Home", href: "#home" },
  { label: "Layanan", href: "#layanan" },
  { label: "Visi & Misi", href: "#visi-misi" },
  { label: "Mengapa Kami", href: "#mengapa-kami" },
  { label: "Kontak", href: "#kontak" },
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
  body: string;
  image: string;
  /** Topik untuk pesan template WhatsApp */
  waTopic: string;
};

export const SERVICES: Service[] = [
  {
    icon: PencilRuler,
    name: "Jasa Arsitektur & Desain",
    body: "Konsep rancangan gambar, visual 3D, dan penataan tata ruang yang matang sebelum dibangun.",
    image: detailMaterial,
    waTopic: "jasa arsitektur & desain",
  },
  {
    icon: FileSpreadsheet,
    name: "Jasa Perencanaan & RAB",
    body: "Estimasi biaya terperinci, akurat, dan transparan yang disesuaikan dengan budget Anda.",
    image: interiorSpace,
    waTopic: "jasa perencanaan & RAB",
  },
  {
    icon: HardHat,
    name: "Kontraktor Bangunan & Renovasi",
    body: "Pelaksanaan konstruksi rumah baru, renovasi fasad, hingga pengerjaan interior.",
    image: processSite,
    waTopic: "kontraktor bangun / renovasi rumah",
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
