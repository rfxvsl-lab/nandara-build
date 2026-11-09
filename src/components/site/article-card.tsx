import { Link } from "@tanstack/react-router";

import { mediaUrl, readingMinutes, type Article } from "@/lib/content-types";
import { formatTanggal } from "@/lib/utils";

/** Kartu artikel: sampul (opsional), kategori · tanggal, judul, ringkasan. */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to="/artikel/$slug" params={{ slug: article.slug }} className="group flex flex-col">
      {article.cover ? (
        <div className="overflow-hidden rounded-lg bg-pasir">
          <img
            src={mediaUrl(article.cover, 800)}
            alt=""
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-end rounded-lg bg-pasir p-5">
          <span className="font-mono text-sm text-emas-ink">{article.kategori}</span>
        </div>
      )}
      <p className="mt-4 font-mono text-[0.8125rem] text-abu">
        {article.kategori} · {formatTanggal(article.tanggal)} · {readingMinutes(article.isi)} mnt
      </p>
      <h3 className="mt-1 text-xl font-normal leading-snug tracking-[-0.01em] text-arang group-hover:text-emas-ink">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-abu">
        {article.ringkasan}
      </p>
    </Link>
  );
}
