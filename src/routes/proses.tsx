import { createFileRoute } from "@tanstack/react-router";

import { FaqList } from "@/components/site/faq";
import { GoldButton, Section, SectionHead } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { ProcessTable } from "@/components/site/process-timeline";
import { RabSheet } from "@/components/site/rab-preview";
import { SpkSheet } from "@/components/site/spk-card";
import { SITE, waLink } from "@/content/site";
import { faqJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/proses")({
  head: () => ({
    meta: [
      { title: `Proses Kerja & Transparansi RAB | ${SITE.name}` },
      {
        name: "description",
        content:
          "Enam tahap kerja Nandara Build: konsultasi, survei, desain & RAB, SPK resmi, pembangunan, serah terima. Semua tertulis sebelum DP.",
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
        label="Proses"
        title="Enam tahap, masing-masing dengan dokumennya"
        intro="Anda tahu apa yang dikerjakan, berapa biayanya, dan kapan selesai sebelum membayar DP."
      />

      <Section className="!pt-10 md:!pt-14">
        <div className="md:ml-[calc(220px+2rem)]">
          <ProcessTable tone="light" />
        </div>
      </Section>

      <Section className="bg-pasir">
        <SectionHead
          number="01"
          label="Dokumen"
          title="RAB dan SPK, dua dokumen yang melindungi Anda"
          intro="RAB menunjukkan asal setiap rupiah. SPK mengunci harga, spesifikasi, jadwal, dan garansi secara hukum."
        />
        <div className="mt-10 grid gap-8 md:ml-[calc(220px+2rem)] xl:grid-cols-[1.5fr_1fr]">
          <RabSheet />
          <SpkSheet />
        </div>
      </Section>

      <Section>
        <SectionHead number="02" label="Tanya jawab" title="Pertanyaan yang sering masuk" />
        <div className="mt-10 md:ml-[calc(220px+2rem)] md:max-w-[46rem]">
          <FaqList />
        </div>
      </Section>

      <CtaBand title="Mulai dari tahap pertama: konsultasi gratis">
        <GoldButton href={waLink("konsultasi & survei gratis")}>Jadwalkan survei</GoldButton>
      </CtaBand>
    </>
  );
}
