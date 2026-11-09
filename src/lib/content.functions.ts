/**
 * Server functions konten (portofolio & testimoni).
 * Modul server diimpor dinamis di dalam handler agar tidak ikut ke bundle browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { DEFAULT_PRICING, pricingSchema, type PricingSettings } from "./pricing";
import {
  articleInputSchema,
  type Article,
  projectInputSchema,
  slugify,
  testimonialInputSchema,
  type Project,
  type Testimonial,
} from "./content-types";

async function requireAdmin() {
  const { isAdmin } = await import("@/server/admin-auth");
  if (!(await isAdmin())) throw new Error("Tidak diizinkan");
}

async function stores() {
  const { getContentStores } = await import("@/server/content-store");
  return getContentStores();
}

/* ───────────── Publik ───────────── */

export const getPublishedProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[]> => {
    try {
      return (await (await stores()).projects.list()).filter((p) => p.published);
    } catch (error) {
      console.error("Gagal memuat proyek", error);
      return [];
    }
  },
);

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().max(80) }))
  .handler(async ({ data }): Promise<Project | null> => {
    try {
      const all = await (await stores()).projects.list();
      return all.find((p) => p.published && p.slug === data.slug) ?? null;
    } catch (error) {
      console.error("Gagal memuat proyek", error);
      return null;
    }
  });

export const getPublishedTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<Testimonial[]> => {
    try {
      return (await (await stores()).testimonials.list()).filter((t) => t.published);
    } catch (error) {
      console.error("Gagal memuat testimoni", error);
      return [];
    }
  },
);

/* ───────────── Admin ───────────── */

export const adminListContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ projects: Project[]; testimonials: Testimonial[] }> => {
    await requireAdmin();
    const s = await stores();
    const [projects, testimonials] = await Promise.all([s.projects.list(), s.testimonials.list()]);
    return { projects, testimonials };
  },
);

export const adminSaveProject = createServerFn({ method: "POST" })
  .inputValidator(projectInputSchema)
  .handler(async ({ data }): Promise<Project> => {
    await requireAdmin();
    const s = await stores();
    const all = await s.projects.list();
    // Slug unik: dari input atau judul, tambah angka bila bentrok.
    const base = slugify(data.slug || data.title) || "proyek";
    let slug = base;
    for (let n = 2; all.some((p) => p.slug === slug && p.id !== data.id); n++)
      slug = `${base}-${n}`;
    return s.projects.upsert({ ...data, slug });
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const s = await stores();
    const project = await s.projects.get(data.id);
    await s.projects.remove(data.id);
    if (project) await Promise.all(project.images.map((img) => s.media.remove(img.id)));
    return { ok: true };
  });

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().regex(/^[A-Za-z0-9._-]{1,64}$/) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await (await stores()).media.remove(data.id);
    return { ok: true };
  });

export const adminSaveTestimonial = createServerFn({ method: "POST" })
  .inputValidator(testimonialInputSchema)
  .handler(async ({ data }): Promise<Testimonial> => {
    await requireAdmin();
    return (await stores()).testimonials.upsert(data);
  });

export const adminDeleteTestimonial = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await (await stores()).testimonials.remove(data.id);
    return { ok: true };
  });

/* ───────────── Harga & termin ───────────── */

export const getPricing = createServerFn({ method: "GET" }).handler(
  async (): Promise<PricingSettings> => {
    try {
      const saved = await (await stores()).settings.get<PricingSettings>("pricing");
      const parsed = pricingSchema.safeParse(saved);
      return parsed.success ? (parsed.data as PricingSettings) : DEFAULT_PRICING;
    } catch {
      return DEFAULT_PRICING;
    }
  },
);

export const adminSavePricing = createServerFn({ method: "POST" })
  .inputValidator(pricingSchema)
  .handler(async ({ data }): Promise<PricingSettings> => {
    await requireAdmin();
    await (await stores()).settings.set("pricing", data);
    return data as PricingSettings;
  });

/* ───────────── Artikel ───────────── */

/** Artikel terbit, terbaru dulu. Tanggal terbit di masa depan belum tampil. */
export const getPublishedArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Article[]> => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      return (await (await stores()).articles.list())
        .filter((a) => a.published && a.tanggal <= today)
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    } catch (error) {
      console.error("Gagal memuat artikel", error);
      return [];
    }
  },
);

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().max(80) }))
  .handler(async ({ data }): Promise<Article | null> => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const all = await (await stores()).articles.list();
      return all.find((a) => a.published && a.tanggal <= today && a.slug === data.slug) ?? null;
    } catch (error) {
      console.error("Gagal memuat artikel", error);
      return null;
    }
  });

export const adminListArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Article[]> => {
    await requireAdmin();
    return (await (await stores()).articles.list()).sort((a, b) =>
      b.tanggal.localeCompare(a.tanggal),
    );
  },
);

export const adminSaveArticle = createServerFn({ method: "POST" })
  .inputValidator(articleInputSchema)
  .handler(async ({ data }): Promise<Article> => {
    await requireAdmin();
    const s = await stores();
    const all = await s.articles.list();
    const base = slugify(data.slug || data.title) || "artikel";
    let slug = base;
    for (let n = 2; all.some((a) => a.slug === slug && a.id !== data.id); n++)
      slug = `${base}-${n}`;
    return s.articles.upsert({ ...data, slug });
  });

export const adminDeleteArticle = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const s = await stores();
    const article = await s.articles.get(data.id);
    await s.articles.remove(data.id);
    if (article?.cover) await s.media.remove(article.cover);
    return { ok: true };
  });
