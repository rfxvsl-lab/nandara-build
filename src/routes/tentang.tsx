import { createFileRoute } from "@tanstack/react-router";

import { GoldButton, Section, SectionHead } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { MISSION, REASONS, SITE, VISION, waLink } from "@/content/site";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: `Tentang Kami | ${SITE.name}` },
      {
        name: "description",
        content:
          "Nandara Build: kontraktor rumah tinggal di Jawa Timur yang bekerja dengan RAB rinci, SPK resmi, dan jadwal tertulis.",
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <>
      <PageHero
        label="Tentang"
        title="Membangun rumah seharusnya tidak membuat cemas"
        intro="Nandara Build bekerja dengan angka yang bisa Anda periksa, kesepakatan yang tertulis, dan jadwal yang bisa Anda pantau."
      />

      <Section className="!pt-10 md:!pt-14">
        <div className="grid gap-10 md:ml-[calc(220px+2rem)] lg:grid-cols-2 lg:gap-14">
          <div className="border-t border-arang pt-5">
            <h2 className="text-sm font-semibold text-abu">Visi</h2>
            <p className="mt-3 text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-arang sm:text-2xl">
              {VISION}
            </p>
          </div>
          <div className="border-t border-arang pt-5">
            <h2 className="text-sm font-semibold text-abu">Misi</h2>
            <ol className="mt-3">
              {MISSION.map((m, i) => (
                <li
                  key={m}
                  className="grid grid-cols-[2rem_1fr] border-b border-batu py-3 text-[1.0625rem] text-beton last:border-0"
                >
                  <span className="tabular text-sm text-abu">{i + 1}.</span>
                  {m}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section className="bg-pasir">
        <SectionHead number="01" label="Prinsip kerja" title="Lima hal yang kami pegang" />
        <ol className="mt-10 md:ml-[calc(220px+2rem)]">
          {REASONS.map((r, i) => (
            <li
              key={r.title}
              className="grid gap-2 border-t border-batu py-5 sm:grid-cols-[2.5rem_1fr_1.4fr] sm:gap-6"
            >
              <span className="tabular text-sm text-abu">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-bold text-arang">{r.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-abu">{r.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand title="Mari diskusikan rumah Anda" body={`Melayani ${SITE.area}.`}>
        <GoldButton href={waLink()}>Konsultasi gratis</GoldButton>
      </CtaBand>
    </>
  );
}
