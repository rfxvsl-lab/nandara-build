/** Kompres foto di browser (maks 2000 px, WebP/JPEG) lalu unggah ke /api/admin/upload. */
const MAX_SIDE = 2000;

async function toBlob(canvas: HTMLCanvasElement, type: string, q: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, q));
}

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // Safari lama tidak bisa encode WebP → jatuh ke JPEG.
  const webp = await toBlob(canvas, "image/webp", 0.82);
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await toBlob(canvas, "image/jpeg", 0.85);
  if (!jpeg) throw new Error("Gagal memproses gambar");
  return jpeg;
}

async function send(blob: Blob, name: string, scope: "public" | "private") {
  const fd = new FormData();
  fd.append("file", blob, name);
  fd.append("scope", scope);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = (await res.json().catch(() => ({}))) as {
    id?: string;
    mime?: string;
    error?: string;
  };
  if (!res.ok || !json.id) throw new Error(json.error ?? "Upload gagal");
  return { id: json.id, mime: json.mime ?? blob.type };
}

/** Foto: dikompres dulu. scope "private" untuk foto progres klien. */
export async function uploadImage(
  file: File,
  scope: "public" | "private" = "public",
): Promise<string> {
  const blob = await compressImage(file);
  return (await send(blob, blob.type === "image/webp" ? "foto.webp" : "foto.jpg", scope)).id;
}

/** Dokumen klien (PDF dikirim apa adanya; gambar dikompres). Selalu privat. */
export async function uploadDocument(file: File): Promise<{ id: string; mime: string }> {
  if (file.type === "application/pdf") return send(file, file.name, "private");
  const blob = await compressImage(file);
  return send(blob, "dokumen.webp", "private");
}
