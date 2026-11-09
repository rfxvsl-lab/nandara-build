import { createFileRoute } from "@tanstack/react-router";

import { Estimator } from "@/components/site/estimator";
import { FaqList } from "@/components/site/faq";
import { LeadForm } from "@/components/site/lead-form";
import { GoldButton, Section, SectionHead, TextLink } from "@/components/site/nandara";
import { ProcessTable } from "@/components/site/process-timeline";
import { RabSheet } from "@/components/site/rab-preview";
import { SpkSheet } from "@/components/site/spk-card";
import { COMPARISON, CONTACT, SERVICES, SITE, STATS, TESTIMONIALS, waLink } from "@/content/site";
import { faqJsonLd } from "@/lib/seo";

const TITLE = `${SITE.name}: Kontraktor Bangun & Renovasi Rumah Jawa Timur`;

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: SITE.name,
  slogan: SITE.tagline,
  description: SITE.description,
  telephone: `+${CONTACT.whatsappIntl}`,
  areaServed: { "@type": "AdministrativeArea", name: "Jawa Timur" },
  sameAs: [CONTACT.instagram.url],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: SITE.description },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content: "RAB rinci dan SPK resmi sudah Anda pegang sebelum membayar DP. Survei gratis.",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(businessJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd()) },
    ],
  }),
  component: Index,
});

/* Hero: produknya sendiri (lembar RAB) sebagai visual utama, bukan foto stok. */
function Hero() {
  return (
    <section id="home" className="border-b border-batu px-4 pb-14 pt-10 sm:px-8 md:pb-20 md:pt-16">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-abu">
            Arsitek, RAB &amp; kontraktor rumah tinggal · {SITE.area}
          </p>
          <h1 className="mt-5 text-[2.5rem] font-bold leading-[1.04] tracking-[-0.03em] text-arang sm:text-[3.5rem] lg:text-[4rem]">
            Bangun dan renovasi rumah dengan RAB yang bisa Anda periksa
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-beton sm:text-lg">
            Sebelum membayar DP, Anda sudah memegang gambar rancangan, rincian biaya per item
            pekerjaan, dan draf SPK resmi. Survei dan konsultasinya gratis.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <GoldButton href={waLink("konsultasi & survei gratis")}>
              Jadwalkan survei gratis
            </GoldButton>
            <TextLink href="#estimasi">Hitung perkiraan biaya</TextLink>
          </div>

          <dl className="mt-auto grid grid-cols-3 border-t border-batu pt-5 text-sm lg:mt-14">
            {[
              ["Survei", "Gratis"],
              ["Harga", "Dikunci di SPK"],
              ["Garansi", "Tertulis"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="border-r border-batu pr-3 last:border-0 [&:not(:first-child)]:pl-3"
              >
                <dt className="text-abu">{k}</dt>
                <dd className="mt-0.5 font-bold text-arang">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:pt-2">
          <RabSheet compact />
          <p className="mt-3 text-sm text-abu">
            Format RAB yang Anda terima: setiap angka bisa ditelusuri ke volume dan harga satuannya.
          </p>
        </div>
      </div>

      {STATS.length > 0 && (
        <dl className="mx-auto mt-14 grid w-full max-w-[1200px] grid-cols-2 gap-6 border-t border-batu pt-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-sm text-abu">{s.label}</dt>
              <dd className="tabular mt-1 text-3xl font-bold text-arang">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function Services() {
  return (
    <Section id="layanan">
      <SectionHead
        number="01"
        label="Layanan"
        title="Tiga layanan, bisa dipakai terpisah atau sekaligus"
        intro="Desain dan perencanaan gratis untuk klien yang melanjutkan pembangunan bersama kami."
        aside={<TextLink href="/layanan">Detail layanan</TextLink>}
      />
      <div className="mt-10 grid gap-10 md:ml-[calc(220px+2rem)] md:grid-cols-3 md:gap-8">
        {SERVICES.map((s, i) => (
          <article key={s.name} className="border-t border-batu pt-5">
            <p className="tabular text-sm text-abu">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-xl font-bold leading-snug text-arang">{s.name}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-abu">{s.body}</p>
            <ul className="mt-5 space-y-1.5 text-[0.9375rem] text-beton">
              {s.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emas-ink" aria-hidden>
                    –
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-batu pt-3 text-sm">
              <span className="text-abu">Anda menerima: </span>
              <span className="font-semibold text-arang">{s.deliverable}</span>
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Transparency() {
  return (
    <Section id="transparansi" className="bg-pasir">
      <SectionHead
        number="02"
        label="Transparansi"
        title="Bedanya borongan murah dengan kontrak yang jelas"
        intro="Banyak biaya membengkak bermula dari kesepakatan yang tidak tertulis. Ini yang kami tulis sebelum pekerjaan dimulai."
      />
      <div className="mt-10 grid gap-10 md:ml-[calc(220px+2rem)] xl:grid-cols-[1.5fr_1fr]">
        <div>
          {/* HP: daftar per aspek */}
          <dl className="border border-arang bg-white sm:hidden">
            {COMPARISON.map((row) => (
              <div key={row.aspect} className="border-b border-batu px-4 py-3.5 last:border-0">
                <dt className="text-sm font-bold text-arang">{row.aspect}</dt>
                <dd className="mt-1.5 text-sm text-abu">
                  <span className="font-semibold">Borongan: </span>
                  {row.them}
                </dd>
                <dd className="mt-1 text-sm font-semibold text-arang">
                  <span className="text-emas-ink">{SITE.name}: </span>
                  {row.us}
                </dd>
              </div>
            ))}
          </dl>

          {/* Tablet & desktop: tabel */}
          <table className="hidden w-full border border-arang bg-white text-left text-[0.9375rem] sm:table">
            <caption className="sr-only">
              Perbandingan borongan tanpa dokumen dengan cara kerja Nandara Build
            </caption>
            <thead>
              <tr className="border-b border-arang text-sm">
                <th scope="col" className="w-32 px-4 py-3 font-semibold text-abu">
                  Aspek
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-abu">
                  Borongan tanpa dokumen
                </th>
                <th scope="col" className="bg-arang px-4 py-3 font-semibold text-kapur">
                  {SITE.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.aspect} className="border-b border-batu align-top last:border-0">
                  <th scope="row" className="px-4 py-3.5 font-semibold text-arang">
                    {row.aspect}
                  </th>
                  <td className="px-4 py-3.5 text-abu">{row.them}</td>
                  <td className="bg-kapur px-4 py-3.5 font-semibold text-arang">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SpkSheet />
      </div>
    </Section>
  );
}

function Process() {
  return (
    <section id="proses" className="scroll-mt-20 bg-arang px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHead
          number="03"
          label="Proses"
          tone="dark"
          title="Enam tahap, masing-masing dengan dokumennya"
          aside={
            <TextLink href="/proses" tone="dark">
              Proses lengkap
            </TextLink>
          }
        />
        <div className="mt-10 md:ml-[calc(220px+2rem)]">
          <ProcessTable />
        </div>
      </div>
    </section>
  );
}

function Estimate() {
  return (
    <Section id="estimasi">
      <SectionHead
        number="04"
        label="Perkiraan biaya"
        title="Hitung kisaran biayanya dulu"
        intro="Angka di bawah adalah kisaran umum pasar. Angka pasti untuk rumah Anda keluar dari RAB setelah survei."
      />
      <div className="mt-10 md:ml-[calc(220px+2rem)]">
        <Estimator />
      </div>
    </Section>
  );
}

function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <Section id="testimoni">
      <SectionHead number="05" label="Klien" title="Kata klien kami" />
      <div className="mt-10 grid gap-8 md:ml-[calc(220px+2rem)] md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="border-t border-batu pt-5">
            <blockquote className="text-base leading-relaxed text-beton">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-bold text-arang">{t.name}</span>
              <span className="text-abu">
                {" "}
                · {t.city} · {t.project}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section id="faq" className="bg-pasir">
      <SectionHead number="05" label="Tanya jawab" title="Pertanyaan yang sering masuk" />
      <div className="mt-10 grid gap-10 md:ml-[calc(220px+2rem)] lg:grid-cols-[1.6fr_1fr]">
        <FaqList />
        <aside className="border-t border-arang pt-4 text-[0.9375rem]">
          <p className="font-bold text-arang">Area layanan</p>
          <p className="mt-2 leading-relaxed text-abu">
            {SITE.area}. Kirim titik lokasi Anda lewat WhatsApp untuk memastikan jadwal survei.
          </p>
          <TextLink href={waLink("cek area layanan")} className="mt-4">
            Cek lokasi saya
          </TextLink>
        </aside>
      </div>
    </Section>
  );
}

function ClosingCta() {
  return (
    <section id="survei" className="scroll-mt-20 bg-arang px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <h2 className="text-[1.875rem] font-bold leading-[1.12] tracking-[-0.02em] text-kapur sm:text-[2.5rem]">
            Jadwalkan survei gratis
          </h2>
          <p className="mt-4 max-w-[28rem] text-base leading-relaxed text-kapur/70">
            Isi data singkat dan kami hubungi Anda untuk menentukan jadwal. Atau chat langsung ke{" "}
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="tabular font-semibold text-kapur underline decoration-emas underline-offset-4"
            >
              {CONTACT.whatsappDisplay}
            </a>
            .
          </p>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Hero />
      <Services />
      <Transparency />
      <Process />
      <Estimate />
      <Testimonials />
      <Faq />
      <ClosingCta />
    </>
  );
}
