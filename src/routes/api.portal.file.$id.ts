import { createFileRoute } from "@tanstack/react-router";

/**
 * File privat portal (foto progres & dokumen).
 * Hanya untuk admin, atau klien yang sedang login dan pemilik proyek berisi file tsb.
 */
export const Route = createFileRoute("/api/portal/file/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const id = params.id;
        if (!/^[A-Za-z0-9._-]{1,64}$/.test(id))
          return new Response("Tidak ditemukan", { status: 404 });

        const { isAdmin, getPortalSession, adminEnabled } = await import("@/server/admin-auth");
        if (!adminEnabled()) return new Response("Tidak ditemukan", { status: 404 });
        const { getClientProjectStore } = await import("@/server/portal-store");
        const { projectFileIds } = await import("@/lib/portal-types");

        let docName: string | undefined;
        if (!(await isAdmin())) {
          const projectId = (await getPortalSession()).data.projectId;
          const project = projectId ? await getClientProjectStore().get(projectId) : undefined;
          if (!project || !project.aktif || !projectFileIds(project).has(id)) {
            return new Response("Tidak diizinkan", { status: 403 });
          }
          docName = project.dokumen.find((d) => d.id === id)?.nama;
        }

        const url = new URL(request.url);
        const w = Number(url.searchParams.get("w") ?? 0);
        const width = [400, 800, 1200, 1600].includes(w) ? w : undefined;
        const { getContentStores } = await import("@/server/content-store");
        const file = await getContentStores().privateMedia.get(id, width);
        if (!file) return new Response("Tidak ditemukan", { status: 404 });

        const ext = file.mime === "application/pdf" ? "pdf" : (file.mime.split("/")[1] ?? "bin");
        const safeName = (docName ?? "dokumen").replace(/[^\w\- ]+/g, "").trim() || "dokumen";
        const disposition = url.searchParams.get("dl") ? "attachment" : "inline";
        return new Response(file.data as BodyInit, {
          headers: {
            "content-type": file.mime,
            "content-disposition": `${disposition}; filename="${safeName}.${ext}"`,
            // Dokumen tidak di-cache; foto hanya 5 menit agar pencabutan akses cepat berlaku.
            "cache-control":
              file.mime === "application/pdf" ? "private, no-store" : "private, max-age=300",
            "x-content-type-options": "nosniff",
            "x-robots-tag": "noindex",
          },
        });
      },
    },
  },
});
