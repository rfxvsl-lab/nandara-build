import { SPK_POINTS } from "@/content/site";

/** Isi SPK sebagai daftar pasal — bergaya dokumen kontrak, tanpa ikon dekoratif. */
export function SpkSheet() {
  return (
    <div className="border border-arang bg-white text-arang">
      <div className="border-b border-arang px-4 py-3 sm:px-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-abu">
          Dokumen kontrak
        </p>
        <p className="mt-1 text-base font-bold sm:text-lg">Surat Perjanjian Kerja (SPK)</p>
      </div>
      <ol>
        {SPK_POINTS.map((p, i) => (
          <li
            key={p}
            className="grid grid-cols-[5.25rem_1fr] border-b border-batu text-sm last:border-0"
          >
            <span className="tabular whitespace-nowrap border-r border-batu px-4 py-3 text-abu">
              Pasal {i + 1}
            </span>
            <span className="px-4 py-3 sm:px-5">{p}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
