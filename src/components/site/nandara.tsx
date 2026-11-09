import type { ReactNode } from "react";

export const WA_NUMBER = "0851-9418-9182";
export const WA_LINK = "https://wa.me/6285194189182";

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft/50 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" />
      {children}
    </span>
  );
}

export function Italic({ children }: { children: ReactNode }) {
  return (
    <em className="font-serif font-medium italic text-gold-deep">{children}</em>
  );
}

export function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy shadow-[0_12px_30px_-12px_oklch(0.66_0.113_82/0.7)] transition-all hover:-translate-y-0.5 hover:bg-gold-deep hover:text-white ${className}`}
    >
      {children}
    </a>
  );
}

export function GhostButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-navy/15 bg-white/80 px-6 py-3.5 text-sm font-semibold text-navy backdrop-blur transition-all hover:-translate-y-0.5 hover:border-navy/40 ${className}`}
    >
      {children}
    </a>
  );
}
