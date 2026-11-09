import { createFileRoute } from "@tanstack/react-router";

import { FaqList } from "@/components/site/faq";
import { GoldButton, Italic, Section, SectionHeading } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { ProcessTimeline } from "@/components/site/process-timeline";
import { RabPreview } from "@/components/site/rab-preview";
import { SpkCard } from "@/components/site/spk-card";
import { SITE, waLink } from "@/content/site";
import { faqJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/proses")({
  head: () => ({
    meta: [
      { title: `Proses Kerja & Transparansi RAB | ${SITE.name}` },
      {
        name: "description",
        content:
          "Enam langkah kerja Nandara Build: konsultasi, survei, desain & RAB, SPK resmi, pembangunan, serah terima. Semua tertulis sebelum DP.",
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd()) }],
  }),
  component: ProsesPage,
});

function ProsesPage() {
  return (
    <>
      <PageHero
        label="Proses kerja"
        title="Enam langkah, tanpa kejutan"
        intro="Setiap tahap punya dokumen yang jelas. Anda tahu apa yang dikerjakan, berapa biayanya, dan kapan selesai sebelum membayar DP."
      />

      <Section inner="pt-10 md:pt-14">
        <ProcessTimeline />
      </Section>

      <Section id="transparansi">
        <SectionHeading
          index="01"
          label="Dokumen"
          title={
            <>
              RAB & SPK: <Italic>dua dokumen kunci</Italic> Anda
            </>
          }
          intro="RAB menunjukkan dari mana setiap rupiah berasal. SPK mengunci harga, spesifikasi, jadwal, dan garansi secara hukum."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <RabPreview />
          <SpkCard />
        </div>
      </Section>

      <Section className="bg-pasir">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading index="02" label="Pertanyaan umum" title="Yang sering ditanyakan" />
          <FaqList />
        </div>
      </Section>

      <CtaBand title="Mulai dari langkah pertama: konsultasi gratis.">
        <GoldButton href={waLink("konsultasi & survei gratis")}>Jadwalkan survei</GoldButton>
      </CtaBand>
    </>
  );
}
