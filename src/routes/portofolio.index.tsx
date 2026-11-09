import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { GoldButton, Section } from "@/components/site/nandara";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { SITE, waLink } from "@/content/site";
import { getPublishedProjects } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portofolio/")({
  head: () => ({
    meta: [
      { title: `Portofolio Proyek Bangun & Renovasi | ${SITE.name}` },
      {
        name: "description",
        content:
          "Proyek bangun rumah dan renovasi Nandara Build di Jawa Timur: foto sebelum-sesudah, lokasi, luas, dan durasi pengerjaan.",
      },
    ],
  }),
  loader: () => getPublishedProjects(),
  component: PortofolioPage,
});

function PortofolioPage() {
  const projects = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("Semua");
  const types = useMemo(() => ["Semua", ...new Set(projects.map((p) => p.jenis))], [projects]);
  const shown = filter === "Semua" ? projects : projects.filter((p) => p.jenis === filter);

  return (
    <>
      <PageHero
        label="Portofolio"
        title="Hasil kerja kami"
        intro="Proyek bangun dan renovasi yang sudah kami selesaikan, lengkap dengan foto sebelum dan sesudah."
      />

      <Section inner="pt-10 md:pt-14">
        {projects.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-xl bg-white p-10 text-center">
            <p className="text-xl text-arang">Portofolio sedang kami lengkapi</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-abu">
              Ingin melihat contoh proyek yang mirip dengan rencana Anda? Kami kirimkan foto dan
              datanya lewat WhatsApp.
            </p>
            <GoldButton href={waLink("contoh proyek")} className="mt-6">
              Minta contoh proyek
            </GoldButton>
          </div>
        ) : (
          <>
            {types.length > 2 && (
              <div
                className="mb-10 flex flex-wrap gap-2"
                role="group"
                aria-label="Filter jenis pekerjaan"
              >
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={filter === t}
                    onClick={() => setFilter(t)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      filter === t
                        ? "border-arang bg-arang text-kapur"
                        : "border-batu bg-white text-beton hover:border-abu",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p, i) => (
                <ProjectCard key={p.id} project={p} priority={i < 3} />
              ))}
            </div>
          </>
        )}
      </Section>

      <CtaBand title="Rencanakan proyek Anda" body="Survei dan konsultasi gratis, tanpa kewajiban.">
        <GoldButton href={waLink("konsultasi & survei gratis")}>Konsultasi Gratis</GoldButton>
      </CtaBand>
    </>
  );
}
