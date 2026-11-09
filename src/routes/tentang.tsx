import { createFileRoute } from "@tanstack/react-router";
import { Check, Compass, Target } from "lucide-react";

import { GoldButton, Italic, Section, SectionHeading } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { MISSION, REASONS, SITE, VISION, waLink } from "@/content/site";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: `Tentang Kami — Visi, Misi & Nilai | ${SITE.name}` },
      {
        name: "description",
        content:
          "Nandara Build: partner konstruksi di Jawa Timur yang bekerja dengan RAB transparan, SPK resmi, dan jadwal tertulis.",
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <>
      <PageHero
        label="Tentang kami"
        title={
          <>
            {SITE.tagline.split(". ").slice(0, 2).join(". ")}.{" "}
            <Italic tone="dark">You Enjoy.</Italic>
          </>
        }
        intro="Nandara Build hadir untuk satu hal: membuat membangun dan merenovasi rumah terasa tenang. Angka yang bisa Anda periksa, kesepakatan yang tertulis, dan jadwal yang bisa Anda pantau."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-batu bg-white p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-sm bg-pasir text-emas-ink">
              <Target className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </span>
            <h2 className="label-mono mt-6 text-emas-ink">Visi</h2>
            <p className="mt-4 text-xl font-semibold leading-snug text-arang sm:text-2xl">
              {VISION}
            </p>
          </div>
          <div className="rounded-md border border-batu bg-white p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-sm bg-arang text-emas">
              <Compass className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </span>
            <h2 className="label-mono mt-6 text-emas-ink">Misi</h2>
            <ul className="mt-5 space-y-3.5">
              {MISSION.map((m) => (
                <li key={m} className="flex gap-3 text-base leading-relaxed text-beton">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emas-ink" aria-hidden />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-pasir">
        <SectionHeading
          index="01"
          label="Nilai kami"
          title={
            <>
              Mengapa memilih <Italic>Nandara Build?</Italic>
            </>
          }
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <li key={r.title} className="rounded-md border border-batu bg-white p-6">
              <r.icon className="h-6 w-6 text-emas-ink" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-arang">{r.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-abu">{r.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="h-16 md:h-28" />
      <CtaBand title="Mari diskusikan rumah Anda." body={`Melayani ${SITE.area}.`}>
        <GoldButton href={waLink()}>Konsultasi gratis</GoldButton>
      </CtaBand>
    </>
  );
}
