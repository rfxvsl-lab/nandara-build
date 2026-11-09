import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ArticleCard } from "@/components/site/article-card";
import { GoldButton, Section } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { SITE, waLink } from "@/content/site";
import { getPublishedArticles } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/artikel/")({
  head: () => ({
    meta: [
      { title: `Artikel & Panduan Biaya Bangun Rumah | ${SITE.name}` },
      {
        name: "description",
        content:
          "Panduan biaya bangun & renovasi rumah, cara membaca RAB, tips memilih kontraktor, dan perizinan di Jawa Timur.",
      },
    ],
  }),
  loader: () => getPublishedArticles(),
  component: ArtikelPage,
});

function ArtikelPage() {
  const articles = Route.useLoaderData();
  const [filter, setFilter] = useState("Semua");
  const cats = useMemo(() => ["Semua", ...new Set(articles.map((a) => a.kategori))], [articles]);
  const shown = filter === "Semua" ? articles : articles.filter((a) => a.kategori === filter);

  return (
    <>
      <PageHero
        label="Artikel"
        title="Panduan bangun & renovasi"
        intro="Biaya, RAB, perizinan, dan tips praktis supaya Anda bisa merencanakan rumah dengan tenang."
      />
      <Section inner="pt-10 md:pt-14">
        {articles.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-xl bg-white p-10 text-center">
            <p className="text-xl text-arang">Artikel sedang kami siapkan</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-abu">
              Punya pertanyaan soal biaya atau RAB? Tanyakan langsung, kami jawab gratis.
            </p>
            <GoldButton href={waLink("pertanyaan biaya bangun/renovasi")} className="mt-6">
              Tanya lewat WhatsApp
            </GoldButton>
          </div>
        ) : (
          <>
            {cats.length > 2 && (
              <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
                {cats.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={filter === c}
                    onClick={() => setFilter(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      filter === c
                        ? "border-arang bg-arang text-kapur"
                        : "border-batu bg-white text-beton hover:border-abu",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}
      </Section>
      <CtaBand
        title="Ingin angka pasti untuk rumah Anda?"
        body="Survei gratis dan RAB rinci sebelum DP."
      >
        <GoldButton href={waLink("konsultasi & survei gratis")}>Konsultasi Gratis</GoldButton>
      </CtaBand>
    </>
  );
}
