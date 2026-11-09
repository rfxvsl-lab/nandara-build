import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";

import heroVilla from "@/assets/hero-villa.jpg";
import processSite from "@/assets/process-site.jpg";
import { BeforeAfter } from "@/components/site/before-after";
import { Estimator } from "@/components/site/estimator";
import { FaqList } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { LeadForm } from "@/components/site/lead-form";
import {
  Eyebrow,
  GhostButton,
  GoldButton,
  Italic,
  MeasureLine,
  OutlineButton,
  SampleBadge,
  Section,
  SectionHeading,
} from "@/components/site/nandara";
import { ProcessTimeline } from "@/components/site/process-timeline";
import { RabPreview } from "@/components/site/rab-preview";
import { SpkCard } from "@/components/site/spk-card";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { CONTACT, SERVICES, SITE, STATS, TESTIMONIALS, TRUST_STRIP, waLink } from "@/content/site";
import { faqJsonLd } from "@/lib/seo";

const TITLE = `${SITE.name} — Kontraktor Bangun & Renovasi Rumah Jawa Timur`;

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
        content:
          "RAB rinci & SPK resmi di tangan Anda sebelum membayar DP. Gratis survei & konsultasi.",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(businessJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd()) },
    ],
  }),
  component: Index,
});

/* ───────────── 02 Hero ───────────── */
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-arang bg-blueprint text-kapur">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-4 pb-14 pt-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="animate-rise">
          <Eyebrow tone="dark">Kontraktor · {SITE.area}</Eyebrow>
          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-[3.5rem] lg:text-[4.25rem]">
            Bangun & Renovasi Rumah dengan RAB yang <Italic tone="dark">Bisa Anda Periksa</Italic>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-kapur/75 sm:text-lg">
            Desain, RAB rinci, dan SPK resmi sudah di tangan Anda{" "}
            <strong className="font-semibold text-kapur">sebelum membayar DP sepeser pun</strong>.{" "}
            {SITE.tagline}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <GoldButton href={waLink("konsultasi & survei gratis")}>
              Konsultasi via WhatsApp
              <ArrowRight className="h-4 w-4" />
            </GoldButton>
            <GhostButton href="#estimasi">Hitung Estimasi Biaya</GhostButton>
          </div>

          {STATS.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="label-mono text-[0.6875rem] text-emas-muda/80">{s.label}</dt>
                  <dd className="tabular mt-2 text-3xl font-extrabold text-kapur">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <figure className="animate-rise relative" style={{ animationDelay: "0.15s" }}>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <img
              src={heroVilla}
              alt="Fasad rumah modern dua lantai dengan pencahayaan sore"
              width={1920}
              height={1200}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
            />
          </div>
          <MeasureLine label="We Design · We Build · You Enjoy" tone="dark" className="mt-4" />
          <figcaption className="absolute -bottom-2 left-4 right-4 translate-y-[-3.5rem] rounded-md bg-kapur p-4 text-arang shadow-card sm:left-auto sm:w-72">
            <p className="label-mono text-[0.6875rem] text-emas-ink">Sebelum DP, Anda pegang</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              <li>✓ Gambar rancangan</li>
              <li>✓ RAB rinci per item</li>
              <li>✓ Draf SPK resmi</li>
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ───────────── 03 Strip kepercayaan ───────────── */
function TrustStrip() {
  return (
    <div className="border-b border-batu bg-pasir">
      <ul className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-x-4 gap-y-5 px-4 py-7 sm:px-8 lg:grid-cols-4">
        {TRUST_STRIP.map((t) => (
          <li key={t.label} className="flex items-center gap-3 text-sm font-semibold text-arang">
            <t.icon className="h-5 w-5 shrink-0 text-emas-ink" strokeWidth={1.5} aria-hidden />
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── 04 Layanan ───────────── */
function Services() {
  return (
    <Section id="layanan">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          index="01"
          label="Layanan"
          title={
            <>
              Dari gambar pertama hingga <Italic>kunci diserahkan</Italic>
            </>
          }
        />
        <OutlineButton href={waLink("layanan Nandara Build")} className="self-start md:self-auto">
          Diskusikan kebutuhan Anda
        </OutlineButton>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <article
            key={s.name}
            className="group flex flex-col overflow-hidden rounded-md border border-batu bg-white transition-shadow duration-150 hover:shadow-card"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={s.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="label-mono text-abu">Layanan {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 flex items-center gap-2 text-xl font-bold text-arang">
                <s.icon className="h-5 w-5 shrink-0 text-emas-ink" strokeWidth={1.5} aria-hidden />
                {s.name}
              </h3>
              <p className="mt-2 flex-1 text-base leading-relaxed text-abu">{s.body}</p>
              <a
                href={waLink(s.waTopic)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emas-ink hover:underline"
              >
                Tanya layanan ini <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ───────────── 05 Hasil kerja ───────────── */
function Showcase() {
  return (
    <Section id="portofolio" className="bg-pasir">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            index="02"
            label="Hasil kerja"
            title={
              <>
                Dari lahan proyek menjadi <Italic>rumah yang dinikmati</Italic>
              </>
            }
            intro="Setiap proyek kami dokumentasikan sejak tahap awal. Geser untuk melihat perbedaan sebelum dan sesudah."
          />
          <div className="mt-6">
            <SampleBadge>Ilustrasi — portofolio asli segera hadir</SampleBadge>
          </div>
        </div>
        <BeforeAfter
          before={processSite}
          after={heroVilla}
          beforeLabel="Proses"
          afterLabel="Hasil"
          beforeAlt="Rangka bangunan saat tahap konstruksi"
          afterAlt="Rumah modern dua lantai setelah selesai dibangun"
        />
      </div>
    </Section>
  );
}

/* ───────────── 06 Transparansi ───────────── */
function Transparency() {
  return (
    <Section id="transparansi" className="bg-blueprint-light">
      <SectionHeading
        index="03"
        label="Transparansi"
        title={
          <>
            Ini yang Anda terima <Italic>sebelum membayar DP</Italic>
          </>
        }
        intro="Borongan murah tanpa RAB dan SPK yang jelas sering berujung biaya membengkak. Di Nandara Build, semua angka dan kesepakatan tertulis dulu — Anda periksa, baru putuskan."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        <RabPreview />
        <SpkCard />
      </div>
    </Section>
  );
}

/* ───────────── 07 Proses ───────────── */
function Process() {
  return (
    <section id="proses" className="scroll-mt-20 bg-arang bg-blueprint px-4 py-16 sm:px-8 md:py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHeading
          index="04"
          label="Proses kerja"
          tone="dark"
          title={
            <>
              Enam langkah, <Italic tone="dark">tanpa kejutan</Italic>
            </>
          }
          intro="Setiap tahap punya dokumen yang jelas, jadi Anda selalu tahu posisi proyek dan biayanya."
        />
        <div className="mt-14">
          <ProcessTimeline />
        </div>
      </div>
    </section>
  );
}

/* ───────────── 08 Estimasi ───────────── */
function Estimate() {
  return (
    <Section id="estimasi">
      <SectionHeading
        index="05"
        label="Estimasi biaya"
        title={
          <>
            Kira-kira butuh <Italic>berapa biaya?</Italic>
          </>
        }
        intro="Hitung rentang biaya kasar dalam 10 detik. Untuk angka pasti, kami buatkan RAB rinci setelah survei — gratis."
      />
      <div className="mt-12">
        <Estimator />
      </div>
    </Section>
  );
}

/* ───────────── 09 Testimoni (tampil jika ada data asli) ───────────── */
function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <Section id="testimoni" className="bg-pasir">
      <SectionHeading index="06" label="Kata klien" title="Mereka sudah membuktikan" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="rounded-md border border-batu bg-white p-6">
            <blockquote className="text-base leading-relaxed text-beton">“{t.quote}”</blockquote>
            <figcaption className="mt-5 border-t border-batu pt-4">
              <p className="font-bold text-arang">{t.name}</p>
              <p className="label-mono mt-1 text-[0.6875rem] text-abu">
                {t.city} · {t.project}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ───────────── 10 Area + 11 FAQ ───────────── */
function AreaAndFaq() {
  return (
    <Section id="faq" className="bg-pasir">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            index="06"
            label="Pertanyaan umum"
            title={
              <>
                Yang sering <Italic>ditanyakan</Italic>
              </>
            }
          />
          <div className="mt-10 rounded-md border border-batu bg-kapur p-6">
            <p className="flex items-center gap-2 font-bold text-arang">
              <MapPin className="h-5 w-5 text-emas-ink" aria-hidden />
              Area layanan
            </p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-abu">
              Kami melayani {SITE.area}. Kirim titik lokasi Anda untuk memastikan jadwal survei.
            </p>
            <a
              href={waLink("cek area layanan")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emas-ink hover:underline"
            >
              Cek lokasi saya <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <FaqList />
      </div>
    </Section>
  );
}

/* ───────────── 12 CTA penutup ───────────── */
function ClosingCta() {
  return (
    <Section id="survei">
      <div className="relative overflow-hidden rounded-lg bg-arang bg-blueprint px-6 py-12 sm:px-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Eyebrow tone="dark">Survei gratis</Eyebrow>
            <h2 className="mt-6 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-kapur sm:text-[2.5rem]">
              Niat hemat bangun rumah, jangan sampai biaya{" "}
              <Italic tone="dark">malah membengkak.</Italic>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-kapur/75">
              Isi data singkat, kami hubungi Anda untuk jadwal survei. Atau chat langsung di{" "}
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="tabular font-semibold text-emas underline-offset-4 hover:underline"
              >
                {CONTACT.whatsappDisplay}
              </a>
              .
            </p>
          </div>
          <LeadForm />
        </div>
      </div>
    </Section>
  );
}

function Index() {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-arang focus:px-4 focus:py-3 focus:text-kapur"
      >
        Langsung ke konten
      </a>
      <Header />
      <main id="konten">
        <Hero />
        <TrustStrip />
        <Services />
        <Showcase />
        <Transparency />
        <Process />
        <Estimate />
        <Testimonials />
        <AreaAndFaq />
        <ClosingCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
