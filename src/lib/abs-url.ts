/**
 * URL absolut untuk meta tag (og:image wajib absolut di Facebook/WhatsApp).
 * Diisi dari VITE_SITE_URL saat build, mis. https://nandarabuild.com
 */
const ORIGIN = String(import.meta.env["VITE_SITE_URL"] ?? "").replace(/\/$/, "");

export function absUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${ORIGIN}${path}`;
}
