import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Kepala halaman dalam (gaya Block): terang, judul besar berbobot normal, breadcrumb mono. */
export function PageHero({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
      <nav aria-label="Breadcrumb" className="font-mono text-[0.8125rem] text-abu">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="underline-offset-4 hover:text-arang hover:underline">
              Beranda
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-arang">
            {label}
          </li>
        </ol>
      </nav>
      <div className="mt-8 max-w-4xl">
        <h1 className="text-[2.5rem] font-normal uppercase leading-[0.98] tracking-[-0.035em] text-arang sm:text-[4rem]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-[38rem] font-mono text-[0.9375rem] leading-relaxed text-beton sm:text-base">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

/** Panel ajakan penutup (gaya panel krem Block). */
export function CtaBand({
  title,
  body,
  children,
}: {
  title: ReactNode;
  body?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-garis px-5 py-10 sm:px-8 md:py-14">
      <div className="flex flex-col gap-6 rounded-xl bg-pasir px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-[1.75rem] font-normal leading-tight tracking-[-0.02em] text-arang sm:text-[2.125rem]">
            {title}
          </h2>
          {body ? <p className="mt-3 text-[0.9375rem] text-abu">{body}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">{children}</div>
      </div>
    </section>
  );
}
