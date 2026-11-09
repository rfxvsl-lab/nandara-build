import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/nandara-logo.png";
import { CONTACT, NAV, SITE, waLink } from "@/content/site";
import { cn } from "@/lib/utils";

import { GoldButton } from "./nandara";
import { WhatsAppIcon } from "./whatsapp-float";

export function Wordmark({
  size = "md",
  tone = "light",
}: {
  size?: "md" | "lg";
  tone?: "light" | "dark";
}) {
  const px = size === "lg" ? 48 : 40;
  return (
    <span className="flex min-w-0 items-center gap-3">
      <img
        src={logo}
        alt=""
        className="shrink-0"
        width={px}
        height={px}
        style={{ width: px, height: px }}
      />
      <span className="min-w-0 leading-none">
        <span
          className={cn(
            "block text-sm font-extrabold uppercase tracking-[0.22em]",
            tone === "dark" ? "text-kapur" : "text-arang",
          )}
        >
          Nandara
        </span>
        <span
          className={cn(
            "mt-1 block text-[0.625rem] font-semibold uppercase tracking-[0.42em]",
            tone === "dark" ? "text-emas" : "text-emas-ink",
          )}
        >
          Build
        </span>
      </span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-batu bg-kapur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/" aria-label={`${SITE.name} — beranda`} onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[0.9375rem] font-medium text-beton transition-colors hover:text-arang"
                activeProps={{
                  className:
                    "!text-arang font-semibold underline decoration-emas-ink underline-offset-[6px]",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <GoldButton href={waLink()} className="ml-4 hidden sm:inline-flex">
            Konsultasi Gratis
          </GoldButton>
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-arang text-arang lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigasi utama"
          className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-kapur px-4 pb-8 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item, i) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-batu py-4 text-2xl font-bold tracking-[-0.02em] text-arang"
                >
                  {item.label}
                  <span className="tabular text-sm font-normal text-abu">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-emas px-5 text-[0.9375rem] font-semibold text-arang"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Konsultasi Gratis via WhatsApp
          </a>
          <p className="tabular mt-4 text-center text-sm text-abu">
            atau hubungi {CONTACT.whatsappDisplay}
          </p>
        </nav>
      )}
    </header>
  );
}
