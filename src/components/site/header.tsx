import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { CONTACT, NAV, SITE, waLink } from "@/content/site";
import { cn } from "@/lib/utils";

import { LogoMark } from "./logo-mark";
import { WhatsAppIcon } from "./whatsapp-float";

export function Wordmark({
  size = "md",
  tone = "light",
  stacked = false,
}: {
  size?: "md" | "lg";
  tone?: "light" | "dark";
  stacked?: boolean;
}) {
  const px = size === "lg" ? 48 : 40;
  return (
    <span className={cn("flex min-w-0 items-center gap-3", stacked && "flex-col gap-1")}>
      <LogoMark size={px} className="shrink-0" />
      <span className={cn("min-w-0 leading-none", stacked && "text-center")}>
        <span
          className={cn(
            "-mr-[0.24em] block text-sm font-bold uppercase tracking-[0.24em]",
            tone === "dark" ? "text-kapur" : "text-arang",
          )}
        >
          Nandara
        </span>
        <span
          className={cn(
            "-mr-[0.5em] mt-1 block text-[0.625rem] font-semibold uppercase tracking-[0.5em]",
            tone === "dark" ? "text-emas" : "text-emas-ink",
          )}
        >
          Build
        </span>
      </span>
    </span>
  );
}

const navLink =
  "whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.1em] text-beton transition-colors hover:text-emas-ink xl:tracking-[0.14em]";
const navActive = { className: "!text-emas-ink" };

/** Header: logo di tengah, menu terbagi kiri–kanan (HDR); tombol aksi (Block). */
export function Header() {
  const [open, setOpen] = useState(false);
  const main = NAV.filter((n) => !("footerOnly" in n));
  const left = main.slice(0, 3);
  const right = main.slice(3);

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
    <header className="sticky top-0 z-50 border-b border-garis bg-kapur/95 backdrop-blur">
      {/* Desktop */}
      <div className="mx-auto hidden h-20 w-full max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center px-6 lg:grid xl:px-8">
        <nav aria-label="Navigasi utama (kiri)" className="flex items-center gap-5 xl:gap-8">
          {left.map((item) => (
            <Link key={item.to} to={item.to} className={navLink} activeProps={navActive}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link to="/" aria-label={`${SITE.name}, beranda`} className="px-4 xl:px-10">
          <Wordmark stacked />
        </Link>
        <div className="flex items-center justify-end gap-5 xl:gap-8">
          <nav aria-label="Navigasi utama (kanan)" className="flex items-center gap-5 xl:gap-8">
            {right.map((item) => (
              <Link key={item.to} to={item.to} className={navLink} activeProps={navActive}>
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md bg-emas px-4 text-sm font-medium text-arang transition-colors hover:bg-emas-muda xl:px-5"
          >
            Konsultasi Gratis
          </a>
        </div>
      </div>

      {/* HP & tablet */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:hidden">
        <Link to="/" aria-label={`${SITE.name}, beranda`} onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
          className="grid h-12 w-12 place-items-center rounded-md border border-garis text-arang"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigasi utama"
          className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-kapur px-5 pb-8 pt-2 lg:hidden"
        >
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-garis py-5 text-2xl font-normal tracking-[-0.01em] text-arang"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-emas px-6 text-[0.9375rem] font-medium text-arang"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Konsultasi Gratis via WhatsApp
          </a>
          <p className="mt-4 text-center font-mono text-sm text-abu">{CONTACT.whatsappDisplay}</p>
        </nav>
      )}
    </header>
  );
}
