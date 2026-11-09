import { createFileRoute } from "@tanstack/react-router";

import { PUBLIC_PATHS, siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = siteUrl(request);
        const urls = PUBLIC_PATHS.map(
          (p) => `  <url><loc>${base}${p.path}</loc><priority>${p.priority}</priority></url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
