import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Compass,
  FileSpreadsheet,
  Gift,
  HardHat,
  Instagram,
  Facebook,
  MessageCircle,
  PencilRuler,
  ScrollText,
  ShieldCheck,
  Target,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import logo from "@/assets/nandara-logo.png.asset.json";
import heroVilla from "@/assets/hero-villa.jpg";
import detailMaterial from "@/assets/detail-material.jpg";
import interiorSpace from "@/assets/interior-space.jpg";
import processSite from "@/assets/process-site.jpg";
import {
  Eyebrow,
  GhostButton,
  GoldButton,
  Italic,
  Section,
  WA_LINK,
  WA_NUMBER,
} from "@/components/site/nandara";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nandara Build — Solusi Konstruksi & Renovasi Tanpa Repot" },
      {
        name: "description",
        content:
          "Jasa arsitektur, perencanaan RAB transparan, dan kontraktor renovasi di Jawa Timur. Gratis survei, gratis desain, SPK resmi, tepat waktu.",
      },
      {
        property: "og:title",
        content: "Nandara Build — We Design. We Build. You Enjoy.",
      },
      {
        property: "og:description",
        content:
          "Perencanaan matang, RAB 100% transparan, dan garansi ketepatan waktu untuk rumah impian Anda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Layanan", href: "#layanan" },
  { label: "Visi & Misi", href: "#visi-misi" },
  { label: "Mengapa Kami", href: "#mengapa-kami" },
  { label: "Kontak", href: "#kontak" },
];

const HERO_CARDS = [
  {
    icon: ScrollText,
    title: "SPK Resmi & Legal",
    body: "Berpayung hukum & amanah",
  },
  {
    icon: Wallet,
    title: "RAB 100% Transparan",
    body: "Tanpa biaya tak terduga",
  },
  {
    icon: Gift,
    title: "Free Design & Survey",
    body: "Konsultasi awal tanpa biaya",
  },
];

const SERVICES = [
  {
    icon: PencilRuler,
    name: "Jasa Arsitektur & Desain",
    body: "Konsep rancangan gambar, visual 3D, dan penataan tata ruang yang matang sebelum dibangun.",
    image: detailMaterial,
  },
  {
    icon: FileSpreadsheet,
    name: "Jasa Perencanaan & RAB",
    body: "Estimasi biaya terperinci, akurat, dan transparan yang disesuaikan dengan budget Anda.",
    image: interiorSpace,
  },
  {
    icon: HardHat,
    name: "Kontraktor Bangunan & Renovasi",
    body: "Pelaksanaan konstruksi rumah baru, renovasi fasad, hingga pengerjaan interior.",
    image: processSite,
  },
];

const REASONS = [
  {
    icon: Compass,
    title: "Gratis Biaya Survei & Konsultasi",
    body: "Diskusi kebutuhan dan cek lokasi langsung tanpa biaya.",
  },
  {
    icon: PencilRuler,
    title: "Gratis Desain & Perencanaan",
    body: "Untuk klien yang melanjutkan eksekusi konstruksi bersama kami.",
  },
  {
    icon: ShieldCheck,
    title: "SPK Resmi & Legal",
    body: "Spesifikasi material dan garansi tertulis yang berpayung hukum.",
  },
  {
    icon: CalendarCheck,
    title: "Tepat Waktu (Time Schedule)",
    body: "Proyek terpantau rapi tanpa keterlambatan yang merugikan Anda.",
  },
  {
    icon: BadgeCheck,
    title: "RAB Jujur & Transparan",
    body: "Berdasarkan standar harga material terbaru, tanpa jebakan biaya siluman.",
  },
];

const MISSION = [
  "Memahami kebutuhan dan gaya hidup setiap klien.",
  "Mengutamakan transparansi biaya di setiap tahap.",
  "Menjaga kerapian dan profesionalitas di lapangan.",
  "Memberikan garansi dan tanggung jawab atas hasil kerja.",
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:px-8">
        <a href="#home" className="flex min-w-0 items-center gap-3">
          <img
            src={logo.url}
            alt="Logo Nandara Build"
            className="h-11 w-11 shrink-0 object-contain"
            width={44}
            height={44}
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-extrabold uppercase tracking-[0.22em] text-navy">
              Nandara
            </span>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-gold-deep">
              Build
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy/70 transition-colors hover:text-gold-deep"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <GoldButton href={WA_LINK} className="hidden px-5 py-3 sm:inline-flex">
            Konsultasi Gratis
          </GoldButton>
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-navy/10 text-navy lg:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-navy/5 bg-white px-5 py-4 lg:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-navy/5 py-3 text-sm font-medium text-navy/80"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <GoldButton href={WA_LINK} className="mt-4 w-full">
            Konsultasi Gratis
          </GoldButton>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="px-5 pb-8 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy">
          <img
            src={heroVilla}
            alt="Fasad rumah minimalis dua lantai modern"
            width={1920}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,oklch(0.21_0.04_262/0.94)_0%,oklch(0.21_0.04_262/0.72)_46%,oklch(0.21_0.04_262/0.25)_100%)]" />

          <div className="relative grid gap-10 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            <div className="animate-rise">
              <Eyebrow>Jawa Timur & Sekitarnya</Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Solusi Konstruksi & Renovasi{" "}
                <Italic>Tanpa Repot</Italic>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
                <span className="font-semibold text-white">
                  We Design. We Build. You Enjoy.
                </span>{" "}
                Perencanaan matang, RAB transparan, dan garansi ketepatan waktu
                untuk rumah impian Anda.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <GoldButton href={WA_LINK}>
                  Konsultasi & Gratis Survei
                  <ArrowRight className="h-4 w-4" />
                </GoldButton>
                <GhostButton href="#layanan">Lihat Layanan Kami</GhostButton>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:justify-self-end">
              {HERO_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className="animate-rise rounded-2xl border border-white/15 bg-white/90 p-5 shadow-[0_24px_60px_-30px_oklch(0.21_0.04_262/0.9)] backdrop-blur-md lg:max-w-xs"
                  style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-deep">
                      <card.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-navy">{card.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-navy/60">
                        {card.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <Section id="layanan">
      <div className="max-w-2xl">
        <Eyebrow>Layanan Kami</Eyebrow>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Dari gambar pertama hingga <Italic>kunci diserahkan</Italic>
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s) => (
          <article
            key={s.name}
            className="group overflow-hidden rounded-3xl border border-navy/8 bg-white transition-all hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_30px_60px_-40px_oklch(0.21_0.04_262/0.6)]"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-soft text-gold-deep">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function WhyUs() {
  return (
    <Section id="mengapa-kami" className="bg-[oklch(0.984_0.003_247.858)]">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Eyebrow>Value Kami</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
            Mengapa Memilih <Italic>Nandara Build?</Italic>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-navy/60">
            Kami bekerja dengan angka yang bisa Anda periksa dan jadwal yang bisa
            Anda pantau — arsitektural, tapi mudah dipahami.
          </p>
          <GoldButton href={WA_LINK} className="mt-8">
            <MessageCircle className="h-4 w-4" />
            Tanya Kami di WhatsApp
          </GoldButton>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((r) => (
            <li
              key={r.title}
              className="rounded-2xl border border-navy/8 bg-white p-5 transition-all hover:-translate-y-1 hover:border-gold/50"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-gold">
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy">{r.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-navy/60">
                    {r.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function VisionMission() {
  return (
    <Section id="visi-misi">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-navy/8 bg-[oklch(0.984_0.003_247.858)] p-8 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold-deep">
            <Target className="h-6 w-6" />
          </span>
          <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            Visi
          </h2>
          <p className="mt-4 text-xl font-semibold leading-snug text-navy sm:text-2xl">
            Menjadi partner konstruksi terpercaya yang menghadirkan solusi
            bangunan berkualitas, terukur, dan{" "}
            <Italic>bernilai jangka panjang.</Italic>
          </p>
        </div>

        <div className="rounded-3xl border border-navy/8 bg-white p-8 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-gold">
            <Compass className="h-6 w-6" />
          </span>
          <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            Misi
          </h2>
          <ul className="mt-5 space-y-3.5">
            {MISSION.map((m) => (
              <li key={m} className="flex gap-3 text-sm leading-relaxed text-navy/70">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Promo() {
  return (
    <Section id="promo">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-14 sm:px-12 sm:py-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Eyebrow>Penawaran Khusus</Eyebrow>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-[2.6rem]">
            Niat Mau Hemat Bangun Rumah, Tapi Biaya{" "}
            <Italic>Malah Membengkak?</Italic>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Jangan mau tergiur borongan murah jika tanpa SPK dan RAB jelas. Di
            Nandara Build, sebelum bayar DP sepeser pun, Anda sudah memegang RAB
            terperinci dan draf SPK resmi.
          </p>
          <GoldButton href={WA_LINK} className="mt-9">
            <MessageCircle className="h-4 w-4" />
            Hubungi WA {WA_NUMBER} Sekarang
          </GoldButton>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer id="kontak" className="scroll-mt-24 border-t border-navy/8 bg-white px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo.url}
                alt="Logo Nandara Build"
                className="h-12 w-12 object-contain"
                loading="lazy"
                width={48}
                height={48}
              />
              <span>
                <span className="block text-sm font-extrabold uppercase tracking-[0.22em] text-navy">
                  Nandara
                </span>
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-gold-deep">
                  Build
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm font-serif text-xl italic text-navy">
              Solusi Konstruksi & Renovasi Tanpa Repot
            </p>
            <p className="mt-3 text-sm text-navy/60">
              Melayani area Jawa Timur & sekitarnya.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-navy/40">
              Navigasi
            </p>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-navy/70 transition-colors hover:text-gold-deep"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-navy/40">
              Hubungi Kami
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-navy/70 transition-colors hover:text-gold-deep"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp {WA_NUMBER}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/nandara_build"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-navy/70 transition-colors hover:text-gold-deep"
                >
                  <Instagram className="h-4 w-4" />
                  @nandara_build
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-navy/70 transition-colors hover:text-gold-deep"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              </li>
            </ul>
            <GoldButton href={WA_LINK} className="mt-6 px-5 py-3">
              Konsultasi Gratis
            </GoldButton>
          </div>
        </div>

        <p className="mt-14 border-t border-navy/8 pt-6 text-xs text-navy/50">
          Copyright © 2026 Nandara Build. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">
      <Header />
      <Hero />
      <Services />
      <WhyUs />
      <VisionMission />
      <Promo />
      <Footer />
    </main>
  );
}
