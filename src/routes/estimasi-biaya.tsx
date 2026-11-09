import { createFileRoute } from "@tanstack/react-router";

import { Estimator } from "@/components/site/estimator";
import { GoldButton, Section, SectionHead } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { RabSheet } from "@/components/site/rab-preview";
import { PRICING, SITE, waLink } from "@/content/site";
import { formatRupiah } from "@/lib/utils";

export const Route = createFileRoute("/estimasi-biaya")({
  head: () => ({
    meta: [
      { title: `Kalkulator Biaya Bangun & Renovasi Rumah | ${SITE.name}` },
      {
        name: "description",
        content:
          "Hitung kisaran biaya bangun rumah atau renovasi per m² (standar, menengah, premium). RAB rinci gratis setelah survei.",
      },
    ],
  }),
  component: EstimasiPage,
});

const LEVELS = [
  {
    title: "Perkiraan kasar",
    body: "Luas × harga acuan per m² sesuai kualitas. Cepat, tapi hanya gambaran awal.",
    where: "Halaman ini",
  },
  {
    title: "Survei lokasi",
    body: "Kami ukur langsung, cek struktur dan kondisi bangunan, lalu catat kebutuhan Anda.",
    where: "Gratis",
  },
  {
    title: "RAB rinci",
    body: "Volume × harga satuan untuk setiap item pekerjaan. Angka inilah yang dikunci di SPK.",
    where: "Gratis",
  },
];

function EstimasiPage() {
  const jobs = Object.values(PRICING.jobs);
  const tiers = Object.entries(PRICING.tierLabels) as [keyof typeof PRICING.tierLabels, string][];

  return (
    <>
      <PageHero
        label="Perkiraan biaya"
        title="Berapa kira-kira biaya rumah Anda?"
        intro="Kalkulator ini memberi kisaran awal. Biaya pasti selalu dari RAB rinci setelah survei, dan survei itu gratis."
      />

      <Section className="!pt-10 md:!pt-14">
        <div className="md:ml-[calc(220px+2rem)]">
          <Estimator />
        </div>
      </Section>

      <Section className="bg-pasir">
        <SectionHead
          number="01"
          label="Harga acuan"
          title="Harga acuan per m²"
          intro={`Kisaran umum pasar Jawa Timur, diperbarui ${PRICING.updated}. Bukan penawaran harga.`}
        />
        <div className="mt-10 md:ml-[calc(220px+2rem)]">
          <div className="overflow-x-auto border border-arang bg-white">
            <table className="tabular w-full min-w-[600px] text-left text-[0.9375rem]">
              <caption className="sr-only">Harga acuan per meter persegi</caption>
              <thead>
                <tr className="border-b border-arang text-sm text-abu">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Pekerjaan
                  </th>
                  {tiers.map(([key, label]) => (
                    <th key={key} scope="col" className="px-5 py-3 font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.label} className="border-b border-batu last:border-0">
                    <th scope="row" className="px-5 py-4 font-semibold text-arang">
                      {job.label}
                    </th>
                    {tiers.map(([key]) => (
                      <td key={key} className="whitespace-nowrap px-5 py-4 text-beton">
                        {formatRupiah(job.tiers[key][0])} – {formatRupiah(job.tiers[key][1])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-abu">
            Kualitas menentukan jenis dan merek material: lantai, sanitair, kusen, atap, dan cat.
            Rinciannya tertulis di RAB.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHead number="02" label="Ketelitian" title="Dari perkiraan ke angka pasti" />
        <div className="mt-10 grid gap-10 md:ml-[calc(220px+2rem)] xl:grid-cols-[1fr_1.4fr]">
          <ol className="border-t border-arang">
            {LEVELS.map((l, i) => (
              <li
                key={l.title}
                className="grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-batu py-5"
              >
                <span className="tabular text-sm text-abu">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="flex flex-wrap items-baseline justify-between gap-2 text-lg font-bold text-arang">
                    {l.title}
                    <span className="text-sm font-semibold text-emas-ink">{l.where}</span>
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-abu">{l.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <RabSheet />
        </div>
      </Section>

      <CtaBand
        title="Ingin angka yang pasti?"
        body="Jadwalkan survei gratis dan terima RAB rinci untuk rumah Anda."
      >
        <GoldButton href={waLink("survei & RAB rinci")}>Minta RAB rinci</GoldButton>
      </CtaBand>
    </>
  );
}
