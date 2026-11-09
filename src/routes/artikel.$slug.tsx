import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { GoldButton, OutlineButton, Section } from "@/components/site/nandara";
import { CtaBand } from "@/components/site/page-hero";
import { RichText } from "@/components/site/rich-text";
import { SITE, waLink } from "@/content/site";
import { absUrl } from "@/lib/abs-url";
import { mediaUrl, readingMinutes } from "@/lib/content-types";
import { getArticleBySlug } from "@/lib/content.functions";
import { formatTanggal } from "@/lib/utils";

export const Route = createFileRoute("/artikel/$slug")({
  loader: async ({ params }) => {
    const article = await getArticleBySlug({ data: { slug: params.slug } });
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: a }) => {
    if (!a) return {};
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.ringkasan,
      datePublished: a.tanggal,
      dateModified: a.tanggal,
      inLanguage: "id-ID",
      author: { "@type": "Organization", name: SITE.name },
      publisher: { "@type": "Organization", name: SITE.name },
      ...(a.cover ? { image: absUrl(mediaUrl(a.cover, 1200)) } : {}),
    };
    return {
      meta: [
        { title: `${a.title} | ${SITE.name}` },
        { name: "description", content: a.ringkasan },
        { property: "og:type", content: "article" },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.ringkasan },
        ...(a.cover ? [{ property: "og:image", content: absUrl(mediaUrl(a.cover, 1200)) }] : []),
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: ArtikelDetail,
});

function ArtikelDetail() {
  const a = Route.useLoaderData();
  return (
    <>
      <article>
        <header className="px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
          <nav aria-label="Breadcrumb" className="font-mono text-[0.8125rem] text-abu">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-arang hover:underline">
                  Beranda
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/artikel" className="hover:text-arang hover:underline">
                  Artikel
                </Link>
              </li>
            </ol>
          </nav>
          <div className="mx-auto mt-8 max-w-[44rem]">
            <p className="font-mono text-sm text-emas-ink">{a.kategori}</p>
            <h1 className="mt-3 text-[2.25rem] font-normal leading-[1.08] tracking-[-0.03em] text-arang sm:text-[3rem]">
              {a.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-beton">{a.ringkasan}</p>
            <p className="mt-5 font-mono text-[0.8125rem] text-abu">
              {formatTanggal(a.tanggal)} · {readingMinutes(a.isi)} menit baca · {SITE.name}
            </p>
          </div>
        </header>
        {a.cover && (
          <div className="px-5 sm:px-8">
            <img
              src={mediaUrl(a.cover, 1600)}
              alt=""
              className="mx-auto aspect-[16/9] w-full max-w-5xl rounded-xl object-cover"
            />
          </div>
        )}
        <Section inner="pt-10 md:pt-14">
          <RichText text={a.isi} className="mx-auto max-w-[44rem]" />
          <div className="mx-auto mt-12 flex max-w-[44rem] flex-wrap gap-3 border-t border-batu pt-8">
            <OutlineButton href="/estimasi-biaya">Hitung perkiraan biaya</OutlineButton>
            <OutlineButton href="/artikel">Artikel lainnya</OutlineButton>
          </div>
        </Section>
      </article>
      <CtaBand
        title="Rencanakan proyek Anda bersama kami"
        body="Survei gratis dan RAB rinci sebelum DP."
      >
        <GoldButton href={waLink(`artikel "${a.title}"`)}>Konsultasi Gratis</GoldButton>
      </CtaBand>
    </>
  );
}
