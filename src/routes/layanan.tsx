import { createFileRoute } from "@tanstack/react-router";

import { GoldButton, GhostButton, OutlineButton, Section } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { SERVICES, SITE, waLink } from "@/content/site";

export const Route = createFileRoute("/layanan")({
  head: () => ({
    meta: [
      { title: `Layanan: Arsitektur, RAB & Kontraktor | ${SITE.name}` },
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
        title="Satu tim dari gambar pertama sampai serah kunci"
        intro="Pakai satu layanan saja atau semuanya. Jika Anda melanjutkan pembangunan bersama kami, desain dan perencanaan tidak dipungut biaya."
      />

      <Section className="!pt-4 md:!pt-8">
        {SERVICES.map((s, i) => (
          <article
            key={s.name}
            id={`layanan-${i + 1}`}
            className="grid scroll-mt-24 gap-6 border-b border-batu py-12 last:border-0 md:grid-cols-[220px_1fr] md:gap-8 md:py-16"
          >
            <p className="tabular text-5xl font-bold tracking-[-0.04em] text-batu md:text-6xl">
              {String(i + 1).padStart(2, "0")}
            </p>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              <div>
                <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-arang sm:text-[2.25rem]">
                  {s.name}
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-beton">{s.body}</p>
                <OutlineButton href={waLink(s.waTopic)} className="mt-8">
                  Tanya layanan ini
                </OutlineButton>
              </div>
              <dl className="border-t border-arang text-[0.9375rem]">
                <div className="border-b border-batu py-4">
                  <dt className="text-sm text-abu">Yang termasuk</dt>
                  <dd className="mt-2">
                    <ul className="space-y-1.5 text-beton">
                      {s.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-emas-ink" aria-hidden>
                            –
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-sm text-abu">Yang Anda terima</dt>
                  <dd className="mt-1 font-bold text-arang">{s.deliverable}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </Section>

      <CtaBand
        title="Belum yakin butuh layanan yang mana?"
        body="Ceritakan kondisi rumah dan rencana Anda. Kami bantu tentukan langkah pertamanya."
      >
        <GoldButton href={waLink()}>Chat WhatsApp</GoldButton>
        <GhostButton href="/estimasi-biaya">Hitung perkiraan biaya</GhostButton>
      </CtaBand>
    </>
  );
}
