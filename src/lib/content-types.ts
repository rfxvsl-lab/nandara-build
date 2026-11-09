/**
 * Tipe & skema konten yang dikelola dari /admin: proyek portofolio & testimoni.
 * Aman dipakai di client maupun server.
 */
import { z } from "zod";

export const PROJECT_TYPES = [
  "Bangun rumah baru",
  "Renovasi rumah",
  "Renovasi dapur",
  "Renovasi kamar mandi",
  "Renovasi fasad",
  "Tambah lantai",
  "Interior",
  "Desain arsitektur",
] as const;

export type ImageRole = "sebelum" | "sesudah" | "galeri";
export type ProjectImage = { id: string; role: ImageRole; alt: string };

export type Project = {
  id: string;
  slug: string;
  title: string;
  kota: string;
  jenis: string;
  luas: string;
  durasi: string;
  tahun: string;
  ringkasan: string;
  deskripsi: string;
  images: ProjectImage[];
  published: boolean;
  urutan: number;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  nama: string;
  kota: string;
  proyek: string;
  kutipan: string;
  published: boolean;
  urutan: number;
  createdAt: string;
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const imageSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9._-]{1,64}$/),
  role: z.enum(["sebelum", "sesudah", "galeri"]),
  alt: z.string().max(200),
});

export const projectInputSchema = z.object({
  id: z.string().max(64).optional(),
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9-]*$/, "Slug hanya huruf kecil, angka, dan tanda hubung")
    .optional(),
  kota: z.string().trim().max(100),
  jenis: z.enum(PROJECT_TYPES),
  luas: z.string().trim().max(20),
  durasi: z.string().trim().max(40),
  tahun: z.string().trim().max(10),
  ringkasan: z.string().trim().max(500),
  deskripsi: z.string().trim().max(5000),
  images: z.array(imageSchema).max(30),
  published: z.boolean(),
  urutan: z.number().int().min(0).max(9999),
});
export type ProjectInput = z.input<typeof projectInputSchema>;

export const testimonialInputSchema = z.object({
  id: z.string().max(64).optional(),
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  kota: z.string().trim().max(100),
  proyek: z.string().trim().max(120),
  kutipan: z.string().trim().min(10, "Kutipan minimal 10 karakter").max(1000),
  published: z.boolean(),
  urutan: z.number().int().min(0).max(9999),
});
export type TestimonialInput = z.input<typeof testimonialInputSchema>;

/** URL gambar yang disajikan oleh route /media/$id (w = lebar maks opsional). */
export function mediaUrl(id: string, w?: number): string {
  return `/media/${encodeURIComponent(id)}${w ? `?w=${w}` : ""}`;
}

export function coverImage(p: Project): ProjectImage | undefined {
  return (
    p.images.find((i) => i.role === "sesudah") ??
    p.images.find((i) => i.role === "galeri") ??
    p.images[0]
  );
}
