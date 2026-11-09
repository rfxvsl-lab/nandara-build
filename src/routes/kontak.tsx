import { createFileRoute } from "@tanstack/react-router";

import { LeadForm } from "@/components/site/lead-form";
import { Section } from "@/components/site/nandara";
import { PageHero } from "@/components/site/page-hero";
import { CONTACT, SITE, waLink } from "@/content/site";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: `Kontak & Survei Gratis | ${SITE.name}` },
      {
        name: "description",
        content: `Hubungi Nandara Build via WhatsApp ${CONTACT.whatsappDisplay} atau isi form survei gratis. Melayani ${SITE.area}.`,
      },
    ],
  }),
  component: KontakPage,
});

function KontakPage() {
  const rows = [
    {
      k: "WhatsApp",
      v: (
        <a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          className="tabular font-bold text-arang underline decoration-emas-ink underline-offset-4"
        >
          {CONTACT.whatsappDisplay}
        </a>
      ),
    },
    {
      k: "Instagram",
      v: (
        <a
          href={CONTACT.instagram.url}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-arang underline decoration-emas-ink underline-offset-4"
        >
          {CONTACT.instagram.handle}
        </a>
      ),
    },
    { k: "Area layanan", v: SITE.area },
    { k: "Waktu respons", v: "Pesan dibalas pada jam kerja." },
  ];

  return (
    <>
      <PageHero
        label="Kontak"
        title="Mulai dengan survei gratis"
        intro="Isi form singkat atau chat langsung. Kami jadwalkan survei ke lokasi Anda tanpa biaya."
      />

      <Section className="!pt-10 md:!pt-14">
        <div className="grid gap-12 md:ml-[calc(220px+2rem)] lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div>
            <h2 className="text-xl font-bold text-arang">Form survei</h2>
            <p className="mt-1 text-sm text-abu">Wajib: nama, nomor WhatsApp, dan lokasi.</p>
            <div className="mt-6">
              <LeadForm tone="light" />
            </div>
          </div>
          <dl className="h-fit border-t border-arang text-[0.9375rem]">
            {rows.map((r) => (
              <div key={r.k} className="border-b border-batu py-4">
                <dt className="text-sm text-abu">{r.k}</dt>
                <dd className="mt-1 text-arang">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}
