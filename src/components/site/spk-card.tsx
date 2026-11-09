import { Check, Stamp } from "lucide-react";

import { SPK_POINTS } from "@/content/site";

/** Kartu bergaya dokumen kontrak: apa saja yang dijamin di SPK. */
export function SpkCard() {
  return (
    <div className="relative rounded-md border border-batu bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-dashed border-batu pb-5">
        <div>
          <p className="label-mono text-abu">Dokumen</p>
          <p className="mt-1 text-lg font-bold text-arang">Surat Perjanjian Kerja (SPK)</p>
        </div>
        <span className="grid h-12 w-12 shrink-0 rotate-[-8deg] place-items-center rounded-full border-2 border-bata/60 text-bata">
          <Stamp className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </div>
      <p className="mt-5 text-sm text-abu">Yang tertulis & dijamin di SPK Anda:</p>
      <ol className="mt-4 space-y-3">
        {SPK_POINTS.map((p, i) => (
          <li key={p} className="flex gap-3 text-[0.9375rem] text-beton">
            <span className="label-mono mt-0.5 w-6 shrink-0 text-emas-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">{p}</span>
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
          </li>
        ))}
      </ol>
    </div>
  );
}
