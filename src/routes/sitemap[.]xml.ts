import { createFileRoute } from "@tanstack/react-router";

import { PUBLIC_PATHS, siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = siteUrl(request);
        const { getContentStores } = await import("@/server/content-store");
        const projects = await getContentStores()
          .projects.list()
          .catch(() => []);
        const today = new Date().toISOString().slice(0, 10);
        const articles = await getContentStores()
          .articles.list()
          .catch(() => []);
        const paths = [
          ...PUBLIC_PATHS,
          ...projects
            .filter((p) => p.published)
            .map((p) => ({ path: `/portofolio/${p.slug}`, priority: "0.7" })),
          ...articles
            .filter((a) => a.published && a.tanggal <= today)
            .map((a) => ({ path: `/artikel/${a.slug}`, priority: "0.7" })),
        ];
        const urls = paths
          .map((p) => `  <url><loc>${base}${p.path}</loc><priority>${p.priority}</priority></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            // Tanpa SITE_URL, URL diambil dari Host request — jangan di-cache bersama.
            "cache-control": process.env["SITE_URL"] ? "public, max-age=3600" : "no-store",
          },
        });
      },
    },
  },
});
