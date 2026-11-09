import { createFileRoute } from "@tanstack/react-router";

/** Menyajikan foto yang diunggah admin. ?w=800 meminta versi kecil (Appwrite preview). */
export const Route = createFileRoute("/media/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const id = params.id;
        if (!/^[A-Za-z0-9._-]{1,64}$/.test(id))
          return new Response("Tidak ditemukan", { status: 404 });
        const w = Number(new URL(request.url).searchParams.get("w") ?? 0);
        const width = [400, 800, 1200, 1600, 2000].includes(w) ? w : undefined;
        const { getContentStores } = await import("@/server/content-store");
        const file = await getContentStores().media.get(id, width);
        if (!file) return new Response("Tidak ditemukan", { status: 404 });
        return new Response(file.data as BodyInit, {
          headers: {
            "content-type": file.mime,
            "cache-control": "public, max-age=31536000, immutable",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
