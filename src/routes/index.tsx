import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Compass,
  Instagram,
  Menu,
  MessageCircle,
  Target,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import heroVilla from "@/assets/hero-villa.jpg";
import logo from "@/assets/nandara-logo.png";
import {
  Eyebrow,
  GhostButton,
  GoldButton,
  Italic,
  OutlineButton,
  Section,
} from "@/components/site/nandara";
import {
  CONTACT,
  HERO_POINTS,
  MISSION,
  NAV,
  REASONS,
  SERVICES,
  SITE,
  VISION,
  waLink,
} from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.headline}` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — ${SITE.tagline}` },
      {
        property: "og:description",
        content:
          "Perencanaan matang, RAB 100% transparan, dan garansi ketepatan waktu untuk rumah impian Anda.",
      },
    ],
  }),
  component: Index,
});

function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <img
        src={logo}
        alt=""
        className={size === "lg" ? "h-12 w-12 shrink-0" : "h-10 w-10 shrink-0"}
        width={size === "lg" ? 48 : 40}
        height={size === "lg" ? 48 : 40}
      />
      <span className="min-w-0 leading-none">
        <span className="block text-sm font-extrabold uppercase tracking-[0.22em] text-navy">
          Nandara
        </span>
        <span className="label-mono mt-1 block text-[0.625rem] tracking-[0.42em] text-gold-ink">
          Build
        </span>
      </span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#home" aria-label={`${SITE.name} — ke atas`}>
          <Wordmark />
        </a>

        <div className="flex items-center gap-2">
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-gold-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <GoldButton href={waLink()} className="ml-4 hidden sm:inline-flex">
            Konsultasi Gratis
          </GoldButton>
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-stone text-navy lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigasi utama"
          className="border-t border-stone bg-paper px-4 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-stone py-4 text-base font-medium text-navy"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <GoldButton href={waLink()} className="mt-6 w-full">
            <MessageCircle className="h-4 w-4" />
            Konsultasi Gratis via WhatsApp
          </GoldButton>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="px-4 pb-8 pt-6 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="relative overflow-hidden rounded-lg bg-navy">
          <img
            src={heroVilla}
            alt="Fasad rumah modern dua lantai"
            width={1920}
            height={1200}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgb(20_33_61/0.95)_0%,rgb(20_33_61/0.75)_50%,rgb(20_33_61/0.3)_100%)]" />

          <div className="relative grid gap-10 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            <div className="animate-rise">
              <Eyebrow tone="dark">{SITE.area}</Eyebrow>
              <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.04] tracking-tight text-paper sm:text-5xl lg:text-[4rem]">
                Solusi Konstruksi & Renovasi <Italic tone="dark">Tanpa Repot</Italic>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">
                <span className="font-semibold text-paper">{SITE.tagline}</span> Perencanaan matang,
                RAB transparan, dan garansi ketepatan waktu untuk rumah impian Anda.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <GoldButton href={waLink("konsultasi & survei gratis")}>
                  Konsultasi & Gratis Survei
                  <ArrowRight className="h-4 w-4" />
                </GoldButton>
                <GhostButton href="#layanan">Lihat Layanan Kami</GhostButton>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:justify-self-end">
              {HERO_POINTS.map((point, i) => (
                <li
                  key={point.title}
                  className="animate-rise rounded-md border border-white/10 bg-paper p-5 shadow-card lg:w-80"
                  style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-sand text-gold-ink">
                      <point.icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-navy">{point.title}</p>
                      <p className="mt-1 text-sm leading-snug text-concrete">{point.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
        <Eyebrow index="01">Layanan Kami</Eyebrow>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-navy sm:text-[2.5rem] sm:leading-tight">
          Dari gambar pertama hingga <Italic>kunci diserahkan</Italic>
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <article
            key={s.name}
            className="group overflow-hidden rounded-md border border-stone bg-white transition-shadow duration-150 hover:shadow-card"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <p className="label-mono text-concrete">Layanan {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 flex items-center gap-2 text-xl font-bold text-navy">
                <s.icon className="h-5 w-5 shrink-0 text-gold-ink" strokeWidth={1.5} />
                {s.name}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-concrete">{s.body}</p>
              <a
                href={waLink(s.waTopic)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink hover:underline"
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

function WhyUs() {
  return (
    <Section id="mengapa-kami" className="bg-sand">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Eyebrow index="02">Value Kami</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-[2.5rem]">
            Mengapa Memilih <Italic>Nandara Build?</Italic>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-concrete">
            Kami bekerja dengan angka yang bisa Anda periksa dan jadwal yang bisa Anda pantau —
            arsitektural, tapi mudah dipahami.
          </p>
          <OutlineButton href={waLink()} className="mt-8">
            <MessageCircle className="h-4 w-4" />
            Tanya Kami di WhatsApp
          </OutlineButton>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((r) => (
            <li key={r.title} className="rounded-md border border-stone bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-navy text-gold">
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold text-navy">{r.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-concrete">{r.body}</p>
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
        <div className="rounded-md border border-stone bg-white p-8 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-sm bg-sand text-gold-ink">
            <Target className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h2 className="label-mono mt-6 text-gold-ink">03 — Visi</h2>
          <p className="mt-4 text-xl font-semibold leading-snug text-navy sm:text-2xl">{VISION}</p>
        </div>

        <div className="rounded-md border border-stone bg-white p-8 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-sm bg-navy text-gold">
            <Compass className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h2 className="label-mono mt-6 text-gold-ink">04 — Misi</h2>
          <ul className="mt-5 space-y-3.5">
            {MISSION.map((m) => (
              <li key={m} className="flex gap-3 text-base leading-relaxed text-navy-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-gold-ink" />
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
      <div className="relative overflow-hidden rounded-lg bg-navy px-6 py-14 sm:px-12 sm:py-20">
        <div className="relative mx-auto max-w-3xl text-center">
          <Eyebrow tone="dark">Penawaran Khusus</Eyebrow>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-paper sm:text-[2.6rem]">
            Niat Mau Hemat Bangun Rumah, Tapi Biaya <Italic tone="dark">Malah Membengkak?</Italic>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-paper/80">
            Jangan mau tergiur borongan murah jika tanpa SPK dan RAB jelas. Di Nandara Build,
            sebelum bayar DP sepeser pun, Anda sudah memegang RAB terperinci dan draf SPK resmi.
          </p>
          <GoldButton href={waLink("minta RAB & draf SPK")} className="mt-9">
            <MessageCircle className="h-4 w-4" />
            Hubungi WA {CONTACT.whatsappDisplay}
          </GoldButton>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="kontak" className="scroll-mt-20 border-t border-stone bg-white px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark size="lg" />
            <p className="mt-5 max-w-sm font-serif text-2xl italic text-navy">{SITE.headline}</p>
            <p className="mt-3 text-sm text-concrete">Melayani area {SITE.area}.</p>
          </div>

          <div>
            <p className="label-mono text-concrete">Navigasi</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-navy-700 transition-colors hover:text-gold-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-mono text-concrete">Hubungi Kami</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-navy-700 transition-colors hover:text-gold-ink"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp <span className="tabular">{CONTACT.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-navy-700 transition-colors hover:text-gold-ink"
                >
                  <Instagram className="h-4 w-4" />
                  {CONTACT.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-stone pt-6 text-xs text-concrete">
          © {year} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navy focus:px-4 focus:py-3 focus:text-paper"
      >
        Langsung ke konten
      </a>
      <Header />
      <main id="konten" className="min-h-screen">
        <Hero />
        <Services />
        <WhyUs />
        <VisionMission />
        <Promo />
      </main>
      <Footer />
    </>
  );
}
