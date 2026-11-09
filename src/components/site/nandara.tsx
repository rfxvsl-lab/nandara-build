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
  index?: string | undefined;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-2",
        tone === "dark" ? "text-emas" : "text-emas-ink",
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
        tone === "dark" ? "text-emas" : "text-emas-ink",
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
      className={cn(buttonBase, "bg-emas text-arang hover:bg-emas-muda", className)}
    >
      {children}
    </a>
  );
}

/** Tombol sekunder bergaris arang (latar terang). */
export function OutlineButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border-[1.5px] border-arang text-arang hover:bg-arang hover:text-kapur",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Tombol sekunder untuk section gelap (arang). */
export function GhostButton({ href, children, className }: ButtonProps) {
  return (
    <a
      href={href}
      {...linkTarget(href)}
      className={cn(
        buttonBase,
        "border border-emas/50 text-kapur hover:border-emas hover:bg-white/5",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Kepala section: label bernomor + judul + paragraf opsional. */
export function SectionHeading({
  index,
  label,
  title,
  intro,
  tone = "light",
  align = "left",
}: {
  index?: string | undefined;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow index={index} tone={tone}>
        {label}
      </Eyebrow>
      <h2
        className={cn(
          "mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2.5rem]",
          tone === "dark" ? "text-kapur" : "text-arang",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-kapur/75" : "text-abu",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** Garis ukur gaya gambar kerja: |——— LABEL ———| (design.md §4.1). */
export function MeasureLine({
  label,
  tone = "light",
  className,
}: {
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "dark" ? "text-emas-muda/70" : "text-abu";
  return (
    <div className={cn("flex items-center gap-2", color, className)} aria-hidden>
      <span className="h-3 w-px bg-current" />
      <span className="h-px flex-1 bg-current opacity-60" />
      <span className="label-mono whitespace-nowrap text-[0.6875rem]">{label}</span>
      <span className="h-px flex-1 bg-current opacity-60" />
      <span className="h-3 w-px bg-current" />
    </div>
  );
}

/** Badge kecil penanda konten contoh/ilustrasi — agar tidak dikira data asli. */
export function SampleBadge({ children = "Contoh ilustrasi" }: { children?: ReactNode }) {
  return (
    <span className="label-mono inline-flex items-center gap-1.5 rounded-sm border border-bata/40 bg-kapur px-2 py-1 text-[0.625rem] text-bata">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
