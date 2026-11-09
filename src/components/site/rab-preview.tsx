import { RAB_SAMPLE } from "@/content/site";
import { formatRupiah } from "@/lib/utils";

import { SampleBadge } from "./nandara";

/** Tabel mini contoh RAB — bukti visual klaim "RAB transparan" (design.md §5.5). */
export function RabPreview() {
  const rows = RAB_SAMPLE.rows.map((r) => ({ ...r, total: r.volume * r.price }));
  const grand = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <figure className="overflow-hidden rounded-md border border-batu bg-white shadow-card">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-batu bg-pasir/60 px-5 py-4">
        <div>
          <p className="label-mono text-abu">Rencana Anggaran Biaya</p>
          <p className="mt-1 text-sm font-bold text-arang">{RAB_SAMPLE.title}</p>
        </div>
        <SampleBadge />
      </figcaption>

      {/* HP: daftar bertumpuk */}
      <ul className="tabular divide-y divide-batu/70 sm:hidden">
        {rows.map((r) => (
          <li key={r.item} className="flex items-start justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <p className="text-sm text-beton">{r.item}</p>
              <p className="mt-1 text-xs text-abu">
                {r.volume} {r.unit} × {formatRupiah(r.price)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-arang">{formatRupiah(r.total)}</p>
          </li>
        ))}
        <li className="flex items-center justify-between border-t-2 !border-arang px-5 py-4">
          <span className="text-sm font-bold text-arang">Total</span>
          <span className="text-base font-extrabold text-arang">{formatRupiah(grand)}</span>
        </li>
      </ul>

      {/* Tablet & desktop: tabel */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="tabular w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="label-mono text-[0.6875rem] text-abu">
              <th scope="col" className="px-5 py-3 font-medium">
                Uraian pekerjaan
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                Vol
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Sat
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                Harga sat.
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.item} className="border-t border-batu/70 text-beton">
                <td className="px-5 py-3">{r.item}</td>
                <td className="px-3 py-3 text-right">{r.volume}</td>
                <td className="px-3 py-3">{r.unit}</td>
                <td className="px-3 py-3 text-right">{formatRupiah(r.price)}</td>
                <td className="px-5 py-3 text-right font-semibold text-arang">
                  {formatRupiah(r.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-arang">
              <th scope="row" colSpan={4} className="px-5 py-4 text-sm font-bold text-arang">
                Total
              </th>
              <td className="px-5 py-4 text-right text-base font-extrabold text-arang">
                {formatRupiah(grand)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="border-t border-batu px-5 py-3 text-xs text-abu">
        Format contoh. RAB Anda disusun dari hasil survei, dengan harga material terbaru (diperbarui{" "}
        {RAB_SAMPLE.updated}).
      </p>
    </figure>
  );
}
