import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

import { CONTACT, NAV, SITE, waLink } from "@/content/site";

import { Wordmark } from "./header";
import { WhatsAppIcon } from "./whatsapp-float";

/** Footer gelap (HDR) dengan kalimat mono di kiri (Block). */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#2b2a27] px-5 pb-28 pt-14 text-kapur sm:px-8">
      <div className="mx-auto w-full max-w-[1296px]">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark size="lg" tone="dark" />
            <p className="mt-6 max-w-sm font-mono text-sm leading-relaxed text-kapur/80">
              {SITE.headline}. RAB rinci dan SPK resmi sebelum DP, survei gratis. Melayani{" "}
              {SITE.area}.
            </p>
          </div>

          <div>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-kapur/70">
              Navigasi
            </p>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-kapur/80 transition-colors hover:text-emas"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-kapur/70">
              Hubungi kami
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-kapur/80 transition-colors hover:text-emas"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span className="font-mono">{CONTACT.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <Link to="/pantau" className="text-kapur/80 transition-colors hover:text-emas">
                  Pantau proyek (klien)
                </Link>
              </li>
              <li>
                <a
                  href={CONTACT.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-kapur/80 transition-colors hover:text-emas"
                >
                  <Instagram className="h-4 w-4" />
                  {CONTACT.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-kapur/15 pt-6 text-xs text-kapur/70 sm:flex-row sm:justify-between">
          <p>
            © {year} {SITE.name}
          </p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
