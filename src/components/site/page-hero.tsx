import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Kepala halaman dalam: breadcrumb + judul besar + garis bawah. Terang, tanpa dekorasi. */
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
    <section className="border-b border-arang px-4 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="text-sm text-abu">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="underline-offset-4 hover:text-arang hover:underline">
                Beranda
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-arang">
              {label}
            </li>
          </ol>
        </nav>
        <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr] md:gap-8">
          <div className="hidden md:block" />
          <div className="max-w-[46rem]">
            <h1 className="text-[2.25rem] font-bold leading-[1.06] tracking-[-0.03em] text-arang sm:text-[3.25rem]">
              {title}
            </h1>
            {intro ? (
              <p className="mt-5 max-w-[38rem] text-[1.0625rem] leading-relaxed text-beton sm:text-lg">
                {intro}
              </p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pita penutup halaman dalam: latar arang penuh, satu ajakan. */
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
    <section className="bg-arang px-4 py-14 sm:px-8 md:py-20">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[36rem]">
          <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-kapur sm:text-[2.25rem]">
            {title}
          </h2>
          {body ? <p className="mt-3 text-base text-kapur/70">{body}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}
