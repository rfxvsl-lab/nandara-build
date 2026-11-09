import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 px-4 py-16 sm:px-8 md:py-28", className)}>
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

/** Label teknis bergaya gambar kerja, mis. "01 — Layanan" (design.md §4.1). */
export function Eyebrow({
  children,
  index,
  tone = "light",
}: {
  children: ReactNode;
  index?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-2",
        tone === "dark" ? "text-gold" : "text-gold-ink",
      )}
    >
      {index ? <span>{index} —</span> : <span aria-hidden className="h-px w-6 bg-current" />}
      {children}
    </span>
  );
}

/** Aksen serif italic untuk 1–3 kata di judul. */
export function Italic({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <em
      className={cn(
        "font-serif font-normal italic tracking-normal",
        tone === "dark" ? "text-gold" : "text-gold-ink",
      )}
    >
      {children}
    </em>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function linkTarget(href: string) {
  return href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors duration-150";

/** Tombol utama (emas). Maksimal satu per layar HP — design.md §2.3. */
export function GoldButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(buttonBase, "bg-gold text-navy hover:bg-gold-300", className)}
    >
      {children}
    </a>
  );
}

/** Tombol sekunder bergaris navy (latar terang). */
export function OutlineButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-paper",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Tombol sekunder untuk section gelap (navy). */
export function GhostButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border border-gold/50 text-paper hover:border-gold hover:bg-white/5",
        className,
      )}
    >
      {children}
    </a>
  );
}
