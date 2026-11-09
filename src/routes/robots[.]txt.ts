import { createFileRoute } from "@tanstack/react-router";

import { siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(
          `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${siteUrl(request)}/sitemap.xml\n`,
          {
            headers: { "content-type": "text/plain; charset=utf-8" },
          },
        ),
    },
  },
});
