import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Eyebrow } from "./nandara";

/** Kepala halaman dalam: latar arang + grid blueprint + breadcrumb. */
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
    <section className="bg-arang bg-blueprint px-4 pb-14 pt-10 text-kapur sm:px-8 sm:pb-20 sm:pt-14">
      <div className="mx-auto w-full max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="label-mono text-[0.6875rem] text-kapur/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-emas">
                Beranda
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-emas-muda">
              {label}
            </li>
          </ol>
        </nav>
        <div className="mt-8 max-w-3xl animate-rise">
          <Eyebrow tone="dark">{label}</Eyebrow>
          <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-[3.5rem]">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-kapur/75 sm:text-lg">
              {intro}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** Pita CTA penutup halaman dalam. */
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
    <section className="px-4 pb-16 sm:px-8 md:pb-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 rounded-lg bg-arang bg-blueprint px-6 py-10 sm:px-12 sm:py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-kapur sm:text-[2.25rem]">
            {title}
          </h2>
          {body ? <p className="mt-3 text-base text-kapur/70">{body}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">{children}</div>
      </div>
    </section>
  );
}
