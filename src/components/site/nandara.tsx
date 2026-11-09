import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Primitif desain Nandara Build — lihat design.md §12 (aturan anti-template).
 * Bahasa visual: lembar dokumen proyek. Garis tipis, tabel, angka. Tanpa dekorasi.
 */

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
    <section id={id} className={cn("scroll-mt-20 px-4 py-16 sm:px-8 md:py-24", className)}>
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

/**
 * Kepala section bergaya kop dokumen: garis atas, nomor & nama bagian di kolom kiri,
 * judul di kolom kanan. Nomor dipakai untuk navigasi dokumen, bukan hiasan.
 */
export function SectionHead({
  number,
  label,
  title,
  intro,
  tone = "light",
  aside,
}: {
  number: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  aside?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <header
      className={cn(
        "grid gap-4 border-t pt-5 md:grid-cols-[220px_1fr] md:gap-8",
        dark ? "border-kapur/25" : "border-arang",
      )}
    >
      <p className={cn("text-sm font-semibold", dark ? "text-kapur/70" : "text-abu")}>
        <span className="tabular">{number}</span>
        <span className="mx-2" aria-hidden>
          /
        </span>
        {label}
      </p>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[44rem]">
          <h2
            className={cn(
              "text-[1.875rem] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem]",
              dark ? "text-kapur" : "text-arang",
            )}
          >
            {title}
          </h2>
          {intro ? (
            <p
              className={cn(
                "mt-4 max-w-[38rem] text-base leading-relaxed sm:text-[1.0625rem]",
                dark ? "text-kapur/70" : "text-abu",
              )}
            >
              {intro}
            </p>
          ) : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </header>
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
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-5 text-[0.9375rem] font-semibold transition-colors duration-150";

/** Tombol utama. Maksimal satu per layar HP (design.md §2.3). */
export function GoldButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(buttonBase, "bg-emas text-arang hover:bg-emas-muda", className)}
    >
      {children}
    </a>
  );
}

/** Tombol gelap solid untuk latar terang. */
export function DarkButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(buttonBase, "bg-arang text-kapur hover:bg-beton", className)}
    >
      {children}
    </a>
  );
}

/** Tombol bergaris untuk latar terang. */
export function OutlineButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border border-arang text-arang hover:bg-arang hover:text-kapur",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Tombol bergaris untuk latar gelap. */
export function GhostButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border border-kapur/40 text-kapur hover:border-kapur hover:bg-kapur/5",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Tautan teks dengan garis bawah — untuk aksi sekunder di dalam konten. */
export function TextLink({
  href,
  children,
  tone = "light",
  className,
}: ButtonProps & { tone?: "light" | "dark" }) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        "inline-flex w-fit items-center gap-1 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-[6px] transition-colors",
        tone === "dark"
          ? "text-kapur decoration-emas hover:text-emas"
          : "text-arang decoration-emas-ink hover:text-emas-ink",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Catatan kecil penanda format contoh — agar tidak dikira data asli. */
export function SampleNote({ children = "Contoh format" }: { children?: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-bata">{children}</span>
  );
}
