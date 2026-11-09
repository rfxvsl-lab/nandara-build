/**
 * Server functions konten (portofolio & testimoni).
 * Modul server diimpor dinamis di dalam handler agar tidak ikut ke bundle browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
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
    const all = await (await stores()).projects.list();
    return all.find((p) => p.published && p.slug === data.slug) ?? null;
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
