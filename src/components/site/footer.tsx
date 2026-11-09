import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

import { CONTACT, NAV, SITE, waLink } from "@/content/site";

import { Wordmark } from "./header";
import { WhatsAppIcon } from "./whatsapp-float";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="kontak"
      className="scroll-mt-20 bg-arang px-4 pb-24 pt-16 text-kapur sm:px-8 sm:pb-12"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark size="lg" tone="dark" />
            <p className="mt-6 max-w-sm font-serif text-[1.75rem] italic leading-tight text-kapur">
              {SITE.headline}
            </p>
            <p className="mt-3 text-sm text-kapur/60">Melayani area {SITE.area}.</p>
          </div>

          <div>
            <p className="label-mono text-emas">Navigasi</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-kapur/75 transition-colors hover:text-emas"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-mono text-emas">Hubungi Kami</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-kapur/75 transition-colors hover:text-emas"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp <span className="tabular">{CONTACT.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-kapur/75 transition-colors hover:text-emas"
                >
                  <Instagram className="h-4 w-4" />
                  {CONTACT.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-kapur/50 sm:flex-row sm:justify-between">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="label-mono text-[0.625rem]">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
