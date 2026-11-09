import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { BeforeAfter } from "@/components/site/before-after";
import { GoldButton, Section } from "@/components/site/nandara";
import { CtaBand } from "@/components/site/page-hero";
import { SITE, waLink } from "@/content/site";
import { coverImage, mediaUrl } from "@/lib/content-types";
import { getProjectBySlug } from "@/lib/content.functions";

export const Route = createFileRoute("/portofolio/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlug({ data: { slug: params.slug } });
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const cover = coverImage(loaderData);
    const desc =
      loaderData.ringkasan || `${loaderData.jenis} di ${loaderData.kota} oleh ${SITE.name}.`;
    return {
      meta: [
        { title: `${loaderData.title} | Portofolio ${SITE.name}` },
        { name: "description", content: desc },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: desc },
        ...(cover ? [{ property: "og:image", content: mediaUrl(cover.id, 1200) }] : []),
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const p = Route.useLoaderData();
  const before = p.images.find((i) => i.role === "sebelum");
  const after = p.images.find((i) => i.role === "sesudah");
  const cover = coverImage(p);
  // Foto yang sudah tampil di atas (slider atau sampul) tidak diulang di galeri.
  const shownAbove = before && after ? [before.id, after.id] : cover ? [cover.id] : [];
  const gallery = p.images.filter((i) => !shownAbove.includes(i.id));
  const facts = [
    ["Lokasi", p.kota],
    ["Jenis pekerjaan", p.jenis],
    ["Luas", p.luas],
    ["Durasi", p.durasi],
    ["Selesai", p.tahun],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
        <nav aria-label="Breadcrumb" className="font-mono text-[0.8125rem] text-abu">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-arang hover:underline">
                Beranda
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/portofolio" className="hover:text-arang hover:underline">
                Portofolio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-arang">
              {p.title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-8 max-w-4xl text-[2.25rem] font-normal uppercase leading-[1] tracking-[-0.03em] text-arang sm:text-[3.5rem]">
          {p.title}
        </h1>
        {p.ringkasan && (
          <p className="mt-5 max-w-[40rem] font-mono text-[0.9375rem] leading-relaxed text-beton">
            {p.ringkasan}
          </p>
        )}
        {facts.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 border-t border-garis sm:grid-cols-3 lg:grid-cols-5">
            {facts.map(([k, v]) => (
              <div key={k} className="border-b border-garis py-4 pr-4">
                <dt className="text-sm text-abu">{k}</dt>
                <dd className="mt-1 text-[1.0625rem] text-arang">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <Section inner="pt-10 md:pt-14">
        {before && after ? (
          <div className="mx-auto max-w-5xl">
            <BeforeAfter
              before={mediaUrl(before.id, 1600)}
              after={mediaUrl(after.id, 1600)}
              beforeAlt={before.alt || `${p.title}, sebelum`}
              afterAlt={after.alt || `${p.title}, sesudah`}
            />
          </div>
        ) : cover ? (
          <img
            src={mediaUrl(cover.id, 1600)}
            alt={cover.alt || p.title}
            className="mx-auto w-full max-w-5xl rounded-xl object-cover"
          />
        ) : null}

        {p.deskripsi && (
          <div className="mx-auto mt-12 max-w-[42rem] space-y-4 text-[1.0625rem] leading-relaxed text-beton">
            {p.deskripsi.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {gallery.length > 0 && (
          <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
            {gallery.map((img) => (
              <figure key={img.id}>
                <img
                  src={mediaUrl(img.id, 1200)}
                  alt={img.alt || p.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                {img.alt && <figcaption className="mt-2 text-sm text-abu">{img.alt}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </Section>

      <CtaBand
        title="Ingin hasil serupa untuk rumah Anda?"
        body="Survei dan konsultasi gratis. RAB rinci sebelum DP."
      >
        <GoldButton href={waLink(`proyek seperti "${p.title}"`)}>Konsultasi Gratis</GoldButton>
      </CtaBand>
    </>
  );
}
