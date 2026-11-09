/**
 * Pelacakan konversi ringan, tanpa vendor terkunci.
 * Event dikirim ke Google Analytics 4 (gtag), Google Tag Manager (dataLayer),
 * atau Plausible — mana saja yang dipasang. Jika belum ada, event hanya diabaikan.
 *
 * Event: click_whatsapp { lokasi }, submit_form { jenis }, use_calculator { pekerjaan, kualitas }
 */
type Params = Record<string, string | number>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Params }) => void;
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    window.dataLayer?.push({ event, ...params });
    window.plausible?.(event, { props: params });
    if (import.meta.env.DEV) console.info("[track]", event, params);
  } catch {
    // pelacakan tidak boleh mengganggu pengguna
  }
}

/**
 * Pasang satu listener global: setiap klik link wa.me tercatat sebagai click_whatsapp,
 * dengan lokasi dari atribut data-track terdekat, id section, atau header/footer.
 */
export function installWhatsAppTracking(): () => void {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.('a[href*="wa.me"]');
    if (!link) return;
    const tagged = link.closest<HTMLElement>("[data-track]")?.dataset["track"];
    const section = link.closest("section[id]")?.id;
    const region = link.closest("header, footer, nav")?.tagName.toLowerCase();
    track("click_whatsapp", {
      lokasi: tagged ?? section ?? region ?? "lainnya",
      halaman: window.location.pathname,
    });
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
