import { createFileRoute } from "@tanstack/react-router";

const MAX_IMAGE = 6 * 1024 * 1024;
const MAX_PDF = 15 * 1024 * 1024;
const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png", "application/pdf"]);

/**
 * Upload file (khusus admin). Body multipart: "file" + opsional "scope".
 * scope=public  → foto portofolio (gambar saja), disajikan publik lewat /media/:id
 * scope=private → foto progres & dokumen klien (gambar/PDF), hanya lewat /api/portal/file/:id
 */
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
        const isPrivate = form?.get("scope") === "private";
        if (!ALLOWED.has(file.type) || (!isPrivate && file.type === "application/pdf")) {
          return Response.json(
            {
              error: isPrivate
                ? "Format harus JPG, PNG, WebP, atau PDF"
                : "Format harus JPG, PNG, atau WebP",
            },
            { status: 415 },
          );
        }
        const max = file.type === "application/pdf" ? MAX_PDF : MAX_IMAGE;
        if (file.size > max) {
          return Response.json(
            { error: `Ukuran maksimal ${max / 1024 / 1024} MB` },
            { status: 413 },
          );
        }
        const bytes = new Uint8Array(await file.arrayBuffer());
        // Cek tanda tangan file (bukan hanya header Content-Type).
        const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8;
        const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
        const isWebp =
          String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
        const isPdf = isPrivate && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
        if (!isJpg && !isPng && !isWebp && !isPdf) {
          return Response.json({ error: "File tidak valid" }, { status: 415 });
        }
        const mime = isPdf
          ? "application/pdf"
          : isJpg
            ? "image/jpeg"
            : isPng
              ? "image/png"
              : "image/webp";
        const { getContentStores } = await import("@/server/content-store");
        const stores = getContentStores();
        const id = await (isPrivate ? stores.privateMedia : stores.media).put(bytes, mime);
        return Response.json({ id, mime });
      },
    },
  },
});
