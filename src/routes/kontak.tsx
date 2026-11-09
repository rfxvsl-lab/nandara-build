import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, MapPin } from "lucide-react";

import { LeadForm } from "@/components/site/lead-form";
import { Italic, Section } from "@/components/site/nandara";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppIcon } from "@/components/site/whatsapp-float";
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
  return (
    <>
      <PageHero
        label="Kontak"
        title={
          <>
            Mulai dengan <Italic tone="dark">survei gratis</Italic>
          </>
        }
        intro="Isi form singkat atau chat langsung. Kami jadwalkan survei di lokasi Anda tanpa biaya."
      />

      <Section inner="pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <div className="rounded-lg border border-batu bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-arang">Form survei gratis</h2>
            <p className="mt-1 text-sm text-abu">
              Hanya nama, nomor WhatsApp, dan lokasi yang wajib.
            </p>
            <div className="mt-6">
              <LeadForm tone="light" />
            </div>
          </div>

          <aside className="space-y-4">
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-md bg-arang p-5 text-kapur transition-colors hover:bg-beton"
            >
              <WhatsAppIcon className="h-8 w-8 shrink-0 text-whatsapp" />
              <span>
                <span className="label-mono block text-[0.6875rem] text-emas-muda">WhatsApp</span>
                <span className="tabular mt-1 block text-lg font-bold">
                  {CONTACT.whatsappDisplay}
                </span>
              </span>
            </a>
            <a
              href={CONTACT.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-md border border-batu bg-white p-5 transition-colors hover:border-abu"
            >
              <Instagram className="h-7 w-7 shrink-0 text-emas-ink" strokeWidth={1.5} aria-hidden />
              <span>
                <span className="label-mono block text-[0.6875rem] text-abu">Instagram</span>
                <span className="mt-1 block font-bold text-arang">{CONTACT.instagram.handle}</span>
              </span>
            </a>
            <div className="flex items-start gap-4 rounded-md border border-batu bg-white p-5">
              <MapPin
                className="mt-1 h-6 w-6 shrink-0 text-emas-ink"
                strokeWidth={1.5}
                aria-hidden
              />
              <span>
                <span className="label-mono block text-[0.6875rem] text-abu">Area layanan</span>
                <span className="mt-1 block text-[0.9375rem] text-beton">{SITE.area}</span>
              </span>
            </div>
            <div className="flex items-start gap-4 rounded-md border border-batu bg-white p-5">
              <Clock
                className="mt-1 h-6 w-6 shrink-0 text-emas-ink"
                strokeWidth={1.5}
                aria-hidden
              />
              <span>
                <span className="label-mono block text-[0.6875rem] text-abu">Waktu respons</span>
                <span className="mt-1 block text-[0.9375rem] text-beton">
                  Kami membalas pesan pada jam kerja.
                </span>
              </span>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
