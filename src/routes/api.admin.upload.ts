import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png"]);

/** Upload foto (khusus admin). Body: multipart/form-data dengan field "file". */
export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Tolak request lintas situs (CSRF): Origin harus sama dengan host.
        const origin = request.headers.get("origin");
        const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
        if (!origin || !host || new URL(origin).host !== host) {
          return Response.json({ error: "Origin tidak valid" }, { status: 403 });
        }
        const { isAdmin } = await import("@/server/admin-auth");
        if (!(await isAdmin())) return Response.json({ error: "Tidak diizinkan" }, { status: 401 });

        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File))
          return Response.json({ error: "File tidak ada" }, { status: 400 });
        if (!ALLOWED.has(file.type)) {
          return Response.json({ error: "Format harus JPG, PNG, atau WebP" }, { status: 415 });
        }
        if (file.size > MAX_BYTES) {
          return Response.json({ error: "Ukuran maksimal 6 MB" }, { status: 413 });
        }
        const bytes = new Uint8Array(await file.arrayBuffer());
        // Cek tanda tangan file (bukan hanya header Content-Type).
        const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8;
        const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
        const isWebp =
          String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
        if (!isJpg && !isPng && !isWebp) {
          return Response.json({ error: "File bukan gambar yang valid" }, { status: 415 });
        }
        const mime = isJpg ? "image/jpeg" : isPng ? "image/png" : "image/webp";
        const { getContentStores } = await import("@/server/content-store");
        const id = await getContentStores().media.put(bytes, mime);
        return Response.json({ id });
      },
    },
  },
});
