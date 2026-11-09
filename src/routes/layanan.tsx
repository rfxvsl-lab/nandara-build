import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FileCheck2 } from "lucide-react";

import { GoldButton, Italic, OutlineButton, Section } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { SERVICES, SITE, waLink } from "@/content/site";

export const Route = createFileRoute("/layanan")({
  head: () => ({
    meta: [
      { title: `Layanan — Arsitektur, RAB & Kontraktor | ${SITE.name}` },
      {
        name: "description",
        content:
          "Jasa desain arsitektur, perencanaan RAB rinci, dan kontraktor bangun/renovasi rumah di Jawa Timur. Satu tim dari gambar pertama hingga serah kunci.",
      },
    ],
  }),
  component: LayananPage,
});

function LayananPage() {
  return (
    <>
      <PageHero
        label="Layanan"
        title={
          <>
            Satu tim, dari gambar pertama hingga <Italic tone="dark">kunci diserahkan</Italic>
          </>
        }
        intro="Anda bisa memakai satu layanan saja, atau semuanya sekaligus. Jika melanjutkan pembangunan bersama kami, desain & perencanaan gratis."
      >
        <GoldButton href={waLink("layanan Nandara Build")}>
          Konsultasi gratis <ArrowRight className="h-4 w-4" />
        </GoldButton>
      </PageHero>

      <Section inner="pt-6 md:pt-10">
        <div className="space-y-16 md:space-y-24">
          {SERVICES.map((s, i) => (
            <article
              key={s.name}
              id={`layanan-${i + 1}`}
              className="grid scroll-mt-24 gap-8 md:grid-cols-2 md:items-center md:gap-14"
            >
              <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                <img
                  src={s.image.src}
                  srcSet={s.image.srcSet}
                  sizes="(min-width: 768px) 560px, 100vw"
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  width={s.image.width}
                  height={s.image.height}
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
              </div>
              <div>
                <p className="label-mono text-emas-ink">Layanan {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-arang sm:text-[2.25rem]">
                  <s.icon
                    className="h-7 w-7 shrink-0 text-emas-ink"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  {s.name}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-abu sm:text-lg">{s.body}</p>
                <h3 className="label-mono mt-8 text-abu">Yang termasuk</h3>
                <ul className="mt-4 space-y-3">
                  {s.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9375rem] text-beton">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emas-ink" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 inline-flex items-center gap-2 rounded-sm border border-batu bg-pasir px-3 py-2 text-sm font-semibold text-arang">
                  <FileCheck2 className="h-4 w-4 text-emas-ink" aria-hidden />
                  Anda menerima: {s.deliverable}
                </p>
                <div className="mt-8">
                  <OutlineButton href={waLink(s.waTopic)}>Tanya layanan ini</OutlineButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Belum yakin butuh layanan yang mana?"
        body="Ceritakan kondisi rumah dan rencana Anda — kami bantu tentukan langkah pertamanya."
      >
        <GoldButton href={waLink()}>Chat WhatsApp</GoldButton>
        <Link
          to="/estimasi-biaya"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-emas/50 px-6 py-3 text-sm font-semibold text-kapur transition-colors hover:border-emas hover:bg-white/5"
        >
          Hitung estimasi biaya
        </Link>
      </CtaBand>
    </>
  );
}
