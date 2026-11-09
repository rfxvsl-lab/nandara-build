import { createFileRoute } from "@tanstack/react-router";
import { Calculator, ClipboardCheck, Ruler } from "lucide-react";

import { Estimator } from "@/components/site/estimator";
import { GoldButton, Italic, Section, SectionHeading } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { RabPreview } from "@/components/site/rab-preview";
import { PRICING, SITE, waLink } from "@/content/site";
import { formatRupiah } from "@/lib/utils";

export const Route = createFileRoute("/estimasi-biaya")({
  head: () => ({
    meta: [
      { title: `Kalkulator Estimasi Biaya Bangun & Renovasi Rumah | ${SITE.name}` },
      {
        name: "description",
        content:
          "Hitung kisaran biaya bangun rumah atau renovasi per m² (standar, menengah, premium). Dapatkan RAB rinci gratis setelah survei.",
      },
    ],
  }),
  component: EstimasiPage,
});

const HOW = [
  {
    icon: Calculator,
    title: "Estimasi kasar (halaman ini)",
    body: "Luas × harga acuan per m² sesuai kualitas. Cepat, tapi hanya gambaran awal.",
  },
  {
    icon: Ruler,
    title: "Survei lokasi (gratis)",
    body: "Kami ukur langsung, cek struktur & kondisi bangunan, dan catat kebutuhan Anda.",
  },
  {
    icon: ClipboardCheck,
    title: "RAB rinci",
    body: "Volume × harga satuan untuk setiap item pekerjaan. Angka inilah yang dikunci di SPK.",
  },
];

function EstimasiPage() {
  const jobs = Object.values(PRICING.jobs);
  const tiers = Object.entries(PRICING.tierLabels) as [keyof typeof PRICING.tierLabels, string][];

  return (
    <>
      <PageHero
        label="Estimasi biaya"
        title={
          <>
            Kira-kira butuh <Italic tone="dark">berapa biaya?</Italic>
          </>
        }
        intro="Gunakan kalkulator untuk gambaran awal. Biaya pasti selalu dari RAB rinci setelah survei — dan itu gratis."
      />

      <Section inner="pt-10 md:pt-14">
        <Estimator />
      </Section>

      <Section className="bg-pasir">
        <SectionHeading
          index="01"
          label="Tabel acuan"
          title={
            <>
              Harga acuan <Italic>per m²</Italic>
            </>
          }
          intro={`Kisaran umum pasar untuk Jawa Timur, diperbarui ${PRICING.updated}. Bukan penawaran harga.`}
        />
        <div className="mt-10 overflow-x-auto rounded-md border border-batu bg-white">
          <table className="tabular w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Harga acuan per meter persegi</caption>
            <thead>
              <tr className="label-mono border-b border-batu text-[0.6875rem] text-abu">
                <th scope="col" className="px-5 py-4 font-medium">
                  Pekerjaan
                </th>
                {tiers.map(([key, label]) => (
                  <th key={key} scope="col" className="px-5 py-4 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.label} className="border-b border-batu/70 last:border-0">
                  <th scope="row" className="px-5 py-4 font-semibold text-arang">
                    {job.label}
                  </th>
                  {tiers.map(([key]) => (
                    <td key={key} className="px-5 py-4 text-beton">
                      {formatRupiah(job.tiers[key][0])} – {formatRupiah(job.tiers[key][1])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-abu">
          Kualitas menentukan jenis & merek material (lantai, sanitair, kusen, atap, cat). Detailnya
          tertulis di RAB.
        </p>
      </Section>

      <Section>
        <SectionHeading
          index="02"
          label="Dari estimasi ke angka pasti"
          title={
            <>
              Tiga tingkat ketelitian, <Italic>satu tujuan</Italic>
            </>
          }
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {HOW.map((h, i) => (
            <li key={h.title} className="rounded-md border border-batu bg-white p-6">
              <div className="flex items-center justify-between">
                <h.icon className="h-6 w-6 text-emas-ink" strokeWidth={1.5} aria-hidden />
                <span className="label-mono text-abu">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-arang">{h.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-abu">{h.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <RabPreview />
        </div>
      </Section>

      <CtaBand
        title="Ingin angka yang pasti?"
        body="Jadwalkan survei gratis, dan terima RAB rinci untuk rumah Anda."
      >
        <GoldButton href={waLink("survei & RAB rinci")}>Minta RAB rinci</GoldButton>
      </CtaBand>
    </>
  );
}
