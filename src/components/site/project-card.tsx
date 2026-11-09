import { Link } from "@tanstack/react-router";

import { coverImage, mediaUrl, type Project } from "@/lib/content-types";

/** Kartu proyek: foto bersudut diagonal (HDR) + judul & data singkat. */
export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const cover = coverImage(project);
  return (
    <Link
      to="/portofolio/$slug"
      params={{ slug: project.slug }}
      className="group block focus-visible:outline-offset-4"
    >
      <div className="overflow-hidden rounded-bl-[2.5rem] rounded-tr-[2.5rem] bg-pasir">
        {cover ? (
          <img
            src={mediaUrl(cover.id, 800)}
            srcSet={`${mediaUrl(cover.id, 800)} 800w, ${mediaUrl(cover.id, 1200)} 1200w`}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw"
            alt={cover.alt || project.title}
            loading={priority ? "eager" : "lazy"}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[4/3]" />
        )}
      </div>
      <p className="mt-4 font-mono text-[0.8125rem] text-abu">
        {[project.jenis, project.kota].filter(Boolean).join(" · ")}
      </p>
      <h3 className="mt-1 text-xl font-normal leading-snug tracking-[-0.01em] text-arang group-hover:text-emas-ink">
        {project.title}
      </h3>
      {project.ringkasan && (
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-abu">
          {project.ringkasan}
        </p>
      )}
    </Link>
  );
}
