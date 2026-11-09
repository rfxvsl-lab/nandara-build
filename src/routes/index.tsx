import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";

import { Estimator } from "@/components/site/estimator";
import { ProjectCard } from "@/components/site/project-card";
import { FaqList } from "@/components/site/faq";
import {
  CenteredTitle,
  GhostButton,
  GoldButton,
  OutlineButton,
  Section,
  SectionHeading,
  TextLink,
} from "@/components/site/nandara";
import { IMAGES, type ResponsiveImage } from "@/content/images";
import { CONTACT, SERVICES, SITE, waLink } from "@/content/site";
import type { Project, Testimonial } from "@/lib/content-types";
import {
  getPricing,
  getPublishedProjects,
  getPublishedTestimonials,
} from "@/lib/content.functions";
import type { PricingSettings } from "@/lib/pricing";
import { faqJsonLd } from "@/lib/seo";

const TITLE = `${SITE.name} | Kontraktor Bangun & Renovasi Rumah Jawa Timur`;

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
  loader: async () => {
    const [projects, testimonials, pricing] = await Promise.all([
      getPublishedProjects(),
      getPublishedTestimonials(),
      getPricing(),
    ]);
    return { projects, testimonials, pricing };
  },
  component: Index,
});

function Photo({
  image,
  alt = "",
  sizes,
  className,
  priority = false,
}: {
  image: ResponsiveImage;
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      alt={alt}
      width={image.width}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={className}
    />
  );
}

/* ── Hero (Block): foto penuh, judul kapital besar, subjudul mono, satu tombol ── */
function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[600px] items-end overflow-hidden md:min-h-[min(86vh,780px)]"
    >
      <Photo
        image={IMAGES.heroVilla}
        alt="Fasad rumah modern dua lantai"
        sizes="100vw"
        priority
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(28_26_23/0.78)_0%,rgb(28_26_23/0.45)_55%,rgb(28_26_23/0.15)_100%)]" />
      <div className="w-full px-5 pb-14 pt-24 sm:px-8 md:pb-20">
        <h1 className="max-w-[14ch] text-[3rem] font-normal uppercase leading-[0.95] tracking-[-0.04em] text-kapur sm:text-[4.5rem] lg:text-[6.25rem]">
          Bangun &amp; renovasi tanpa repot
        </h1>
        <p className="mt-6 max-w-[34rem] font-mono text-[0.9375rem] leading-relaxed text-kapur/90 sm:text-base">
          Desain, RAB rinci, dan SPK resmi sudah di tangan Anda sebelum membayar DP. Survei gratis.
        </p>
        <GoldButton href={waLink("konsultasi & survei gratis")} className="mt-8">
          Konsultasi Gratis
        </GoldButton>
      </div>
    </section>
  );
}

/* ── Cara kerja (Block): 4 kolom bersekat garis, foto kecil di bawah ── */
const STEPS = [
  {
    title: "Ceritakan kebutuhan Anda",
    body: "Chat kami lewat WhatsApp: rencana, kondisi rumah, dan budget. Konsultasinya gratis.",
    link: { label: "Chat WhatsApp", href: waLink() },
    image: IMAGES.interiorSpace,
  },
  {
    title: "Survei lokasi gratis",
    body: "Tim kami datang mengukur dan mengecek kondisi bangunan, tanpa biaya dan tanpa kewajiban lanjut.",
    link: { label: "Jadwalkan survei", href: waLink("survei lokasi gratis") },
    image: IMAGES.processSite,
  },
  {
    title: "Terima desain & RAB rinci",
    body: "Gambar rancangan dan rincian biaya per item pekerjaan, sebelum Anda membayar DP.",
    link: { label: "Lihat contoh RAB", href: "/proses#transparansi" },
    image: IMAGES.detailMaterial,
  },
  {
    title: "Bangun dengan tenang",
    body: "Harga dikunci di SPK, pembayaran bertahap sesuai progres, garansi tertulis.",
    link: { label: "Lihat proses lengkap", href: "/proses" },
    image: IMAGES.heroVilla,
  },
];

function HowItWorks() {
  return (
    <section id="cara-kerja" className="scroll-mt-20">
      <div className="flex flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between md:py-16">
        <h2 className="max-w-[40rem] text-[1.75rem] font-normal leading-[1.2] tracking-[-0.02em] text-arang sm:text-[2.25rem]">
          Kontraktor rumah tinggal di Jawa Timur dengan RAB yang bisa Anda periksa
        </h2>
        <OutlineButton href="/proses" className="shrink-0 self-start md:self-auto">
          Pelajari cara kerja kami
        </OutlineButton>
      </div>
      <ol className="grid border-t border-garis sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={[
              "flex flex-col border-garis px-5 pb-8 pt-7 sm:px-8",
              i > 0 ? "border-t sm:border-t-0" : "",
              i % 2 === 1 ? "sm:border-l" : "",
              i >= 2 ? "sm:border-t lg:border-t-0" : "",
              i > 0 ? "lg:border-l" : "",
            ].join(" ")}
          >
            <h3 className="text-xl font-normal leading-snug tracking-[-0.01em] text-arang">
              {s.title}
            </h3>
            <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-abu">{s.body}</p>
            <TextLink href={s.link.href} className="mt-4">
              {s.link.label}
            </TextLink>
            <Photo
              image={s.image}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
              className="mt-8 aspect-[5/3] w-full rounded-lg object-cover"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── Layanan (HDR): judul tengah kapital, foto bersudut diagonal + label bergaris ── */
function Services() {
  return (
    <Section id="layanan" className="bg-white">
      <CenteredTitle>Desain, RAB &amp; konstruksi</CenteredTitle>
      <div className="mx-auto mt-12 grid max-w-[1120px] gap-10 md:grid-cols-3 md:gap-6">
        {SERVICES.map((s) => (
          <article key={s.name} className="flex flex-col">
            <div className="relative overflow-hidden rounded-bl-[2.5rem] rounded-tr-[2.5rem]">
              <Photo
                image={s.image}
                sizes="(min-width: 768px) 360px, 90vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-arang/25" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border-2 border-kapur px-5 py-2 text-center text-lg font-semibold text-kapur [text-shadow:0_1px_8px_rgb(0_0_0/0.35)] sm:text-xl">
                {s.short}
              </span>
            </div>
            <h3 className="sr-only">{s.name}</h3>
            <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-abu">{s.body}</p>
            <TextLink href={waLink(s.waTopic)} className="mt-3">
              Tanya layanan ini
            </TextLink>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ── Panel bukti (Block "Trusted by…") ── */
const PROOF = [
  {
    title: "Biaya jelas sebelum mulai",
    items: [
      { big: "Rp 0", text: "biaya survei lokasi & konsultasi" },
      { big: "100%", text: "item pekerjaan tertulis di RAB, lengkap volume & harga satuan" },
    ],
  },
  {
    title: "Kerja tertulis & bergaransi",
    items: [
      { big: "1 harga", text: "dikunci di SPK, tidak berubah tanpa persetujuan Anda" },
      { big: "Tertulis", text: "garansi setelah serah terima pekerjaan" },
    ],
  },
];

function Proof() {
  return (
    <Section id="bukti">
      <SectionHeading title="Yang Anda pegang sejak hari pertama" />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {PROOF.map((panel) => (
          <div key={panel.title} className="rounded-xl bg-white p-5 sm:p-6">
            <h3 className="text-[1.0625rem] text-arang">{panel.title}</h3>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {panel.items.map((it) => (
                <div key={it.big} className="rounded-lg bg-pasir/70 p-4 sm:p-5">
                  <p className="text-[2rem] font-normal leading-none tracking-[-0.03em] text-emas-ink sm:text-[2.75rem]">
                    {it.big}
                  </p>
                  <p className="mt-3 text-sm leading-snug text-abu">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── Dengan vs tanpa (Block "With / Without") ── */
const COMPARE_ROWS = [
  "Gambar rancangan sebelum pekerjaan dimulai",
  "RAB rinci per item pekerjaan sebelum DP",
  "Merek & spesifikasi material tertulis",
  "Harga dikunci di SPK resmi",
  "Pembayaran bertahap sesuai progres",
  "Garansi tertulis setelah serah terima",
];

function Compare() {
  return (
    <Section id="transparansi">
      <SectionHeading title="Kenapa pemilik rumah memilih Nandara Build" />
      <div className="mx-auto mt-10 max-w-[44rem]">
        <table className="w-full text-left">
          <caption className="sr-only">
            Perbandingan Nandara Build dengan borongan tanpa dokumen
          </caption>
          <thead>
            <tr className="text-center text-[0.9375rem] text-arang">
              <th scope="col" className="w-full" />
              <th scope="col" className="px-3 pb-4 font-normal leading-tight sm:px-6">
                Nandara
                <br />
                Build
              </th>
              <th scope="col" className="px-3 pb-4 font-normal leading-tight sm:px-6">
                Borongan tanpa
                <br />
                dokumen
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row} className="border-t border-batu">
                <th scope="row" className="py-4 pr-4 text-[0.9375rem] font-normal text-beton">
                  {row}
                </th>
                <td className="text-center">
                  <Check className="mx-auto h-5 w-5 text-emas-ink" aria-label="Ya" />
                </td>
                <td className="text-center">
                  <X className="mx-auto h-5 w-5 text-abu" aria-label="Tidak" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ── Panel perlindungan (Block "Protections") ── */
const PROTECTIONS = [
  { title: "Harga terkunci", body: "Nilai kontrak sesuai RAB, tertulis di SPK." },
  {
    title: "Pembayaran sesuai progres",
    body: "Termin dibayar bertahap mengikuti pekerjaan yang selesai.",
  },
  { title: "Garansi tertulis", body: "Berlaku setelah serah terima, tercantum di SPK." },
  { title: "Laporan progres", body: "Anda tahu posisi pekerjaan tanpa harus selalu ke lokasi." },
];

function Protection() {
  return (
    <Section inner="px-5 py-10 sm:px-8 md:py-14">
      <div className="grid gap-8 rounded-xl bg-pasir px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <h2 className="text-[1.75rem] font-normal leading-tight tracking-[-0.02em] text-arang sm:text-[2rem]">
            Tenang dengan perlindungan SPK resmi
          </h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-abu">
            Banyak biaya membengkak bermula dari kesepakatan yang tidak tertulis. Di Nandara Build,
            semuanya tertulis sebelum pekerjaan dimulai.
          </p>
          <OutlineButton href="/proses" className="mt-6 bg-batu hover:bg-[#cfc3ae]">
            Pelajari isi SPK
          </OutlineButton>
        </div>
        <ul>
          {PROTECTIONS.map((p) => (
            <li
              key={p.title}
              className="border-b border-batu py-4 first:pt-0 last:border-0 last:pb-0"
            >
              <p className="text-[1.0625rem] text-arang">{p.title}</p>
              <p className="mt-1 text-[0.9375rem] text-abu">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Estimate({ pricing }: { pricing: PricingSettings }) {
  return (
    <Section id="estimasi">
      <SectionHeading
        title="Hitung perkiraan biayanya"
        intro="Kisaran umum pasar untuk gambaran awal. Angka pasti untuk rumah Anda keluar dari RAB setelah survei gratis."
      />
      <div className="mt-10">
        <Estimator pricing={pricing} />
      </div>
    </Section>
  );
}

/* ── Proyek pilihan (tampil bila ada proyek di admin) ── */
function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <Section id="portofolio">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading title="Proyek pilihan" />
        <OutlineButton href="/portofolio" className="self-start md:self-auto">
          Lihat semua proyek
        </OutlineButton>
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  );
}

/* ── Testimoni (HDR "A premier experience"), dari admin ── */
function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="testimoni" className="bg-white">
      <CenteredTitle>Kata klien kami</CenteredTitle>
      <div className="mx-auto mt-12 grid max-w-[1120px] gap-10 md:grid-cols-3">
        {items.slice(0, 6).map((t) => (
          <figure key={t.id}>
            <blockquote className="text-[0.9375rem] leading-relaxed text-beton">
              “{t.kutipan}”
            </blockquote>
            <figcaption className="mt-3 text-sm text-abu">
              — {[t.nama, t.kota].filter(Boolean).join(", ")}
              {t.proyek ? ` · ${t.proyek}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ── Banner foto penuh (HDR "Ready to start building?") ── */
function PhotoCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-garis">
      <Photo
        image={IMAGES.interiorSpace}
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-arang/55" />
      <div className="px-5 py-20 text-center sm:px-8 md:py-28">
        <h2 className="text-[1.75rem] font-normal uppercase tracking-[0.01em] text-kapur sm:text-[2.5rem]">
          Siap mulai membangun?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-kapur/85 sm:text-base">
          Ceritakan rencana Anda. Kami jadwalkan survei ke lokasi, gratis dan tanpa kewajiban.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <GoldButton href={waLink("konsultasi & survei gratis")}>Chat WhatsApp</GoldButton>
          <GhostButton href="/kontak">Isi form survei</GhostButton>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ (Block): judul kiri, daftar kanan ── */
function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <h2 className="text-[1.875rem] font-normal leading-tight tracking-[-0.02em] text-arang sm:text-[2.375rem] lg:pl-6">
          Pertanyaan yang sering diajukan
        </h2>
        <FaqList />
      </div>
    </Section>
  );
}

/* ── Ajakan penutup (Block "Renovate confidently") ── */
function ClosingCta() {
  return (
    <Section id="mulai" className="text-center">
      <h2 className="text-[1.875rem] font-normal tracking-[-0.02em] text-arang sm:text-[2.375rem]">
        Bangun dengan tenang
      </h2>
      <ul className="mt-6 flex flex-col items-center justify-center gap-3 text-[0.9375rem] text-abu sm:flex-row sm:gap-8">
        {["Survei gratis", "RAB rinci sebelum DP", "Garansi tertulis"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emas-ink" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      <GoldButton href={waLink("konsultasi & survei gratis")} className="mt-8">
        Konsultasi Gratis
      </GoldButton>
    </Section>
  );
}

function Index() {
  const { projects, testimonials, pricing } = Route.useLoaderData();
  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <FeaturedProjects projects={projects} />
      <Proof />
      <Compare />
      <Protection />
      <Estimate pricing={pricing} />
      <Testimonials items={testimonials} />
      <PhotoCta />
      <Faq />
      <ClosingCta />
    </>
  );
}
