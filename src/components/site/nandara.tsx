import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Primitif desain Nandara Build — v2 "Block × HDR" (design.md §13).
 * Kerangka: garis bingkai tipis (Block). Rasa: hangat, foto, judul tengah kapital (HDR).
 */

/** Section dengan garis pemisah atas yang menyambung ke garis bingkai halaman. */
export function Section({
  id,
  className,
  inner,
  children,
}: {
  id?: string;
  className?: string;
  inner?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 border-t border-garis", className)}>
      <div className={cn("px-5 py-16 sm:px-8 md:py-24", inner)}>{children}</div>
    </section>
  );
}

/** Label kecil berhuruf mono (gaya subjudul Block). */
export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  index?: string | undefined;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "font-mono text-[0.8125rem] tracking-tight",
        tone === "dark" ? "text-kapur/80" : "text-abu",
      )}
    >
      {children}
    </span>
  );
}

/** Dulu aksen serif-italic. Kini sengaja polos — mewarisi gaya judul (design.md §13). */
export function Italic({ children }: { children: ReactNode; tone?: "light" | "dark" }) {
  return <>{children}</>;
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
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-[0.9375rem] font-medium transition-colors duration-150";

/** Tombol utama (emas). */
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

/** Tombol sekunder berlatar pasir (gaya "Learn more" Block). */
export function OutlineButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(buttonBase, "bg-pasir text-arang hover:bg-batu", className)}
    >
      {children}
    </a>
  );
}

/** Tombol bergaris untuk latar gelap/foto. */
export function GhostButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border border-kapur/60 text-kapur hover:border-kapur hover:bg-kapur/10",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Tautan teks bergaris bawah warna aksen (gaya Block). */
export function TextLink({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        "inline-flex w-fit text-[0.9375rem] text-emas-ink underline decoration-1 underline-offset-4 hover:text-arang",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Judul section rata kiri, berbobot normal (Block). */
export function SectionHeading({
  label,
  title,
  intro,
  tone = "light",
  align = "left",
}: {
  index?: string;
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {label ? <Eyebrow tone={tone}>{label}</Eyebrow> : null}
      <h2
        className={cn(
          "text-[1.875rem] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[2.375rem]",
          label && "mt-3",
          tone === "dark" ? "text-kapur" : "text-arang",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-[1.0625rem]",
            tone === "dark" ? "text-kapur/75" : "text-abu",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** Judul tengah huruf kapital + garis kecil (HDR). */
export function CenteredTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <h2 className="text-[1.5rem] font-normal uppercase tracking-[0.02em] text-emas-ink sm:text-[2rem]">
        {children}
      </h2>
      <span aria-hidden className="mx-auto mt-4 block h-px w-12 bg-emas-ink" />
    </div>
  );
}

/** (Lama) garis ukur — kini tidak dipakai; dipertahankan agar impor lama tetap aman. */
export function MeasureLine(_: { label: string; tone?: "light" | "dark"; className?: string }) {
  return null;
}

/** Penanda konten contoh — agar tidak dikira data asli. */
export function SampleBadge({ children = "Contoh ilustrasi" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-pasir px-2 py-1 font-mono text-[0.6875rem] text-bata">
      {children}
    </span>
  );
}
