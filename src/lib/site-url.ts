/**
 * URL publik situs. Set env SITE_URL (mis. https://nandarabuild.com) di Appwrite;
 * jika kosong, dipakai origin dari request.
 */
export function siteUrl(request: Request): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  const fromEnv = env?.["SITE_URL"];
  return (fromEnv || new URL(request.url).origin).replace(/\/$/, "");
}

/** Halaman publik untuk sitemap. Tambahkan di sini saat membuat halaman baru. */
export const PUBLIC_PATHS = [
  { path: "/", priority: "1.0" },
  { path: "/layanan", priority: "0.9" },
  { path: "/portofolio", priority: "0.9" },
  { path: "/artikel", priority: "0.8" },
  { path: "/estimasi-biaya", priority: "0.9" },
  { path: "/proses", priority: "0.8" },
  { path: "/kontak", priority: "0.8" },
  { path: "/tentang", priority: "0.6" },
] as const;
