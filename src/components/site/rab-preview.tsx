import { RAB_SAMPLE } from "@/content/site";
import { cn, formatRupiah } from "@/lib/utils";

import { SampleNote } from "./nandara";

/**
 * Lembar RAB bergaya dokumen proyek (kop + tabel + kolom persetujuan).
 * Ini "produk" Nandara yang ditampilkan apa adanya — bukti klaim RAB transparan.
 */
export function RabSheet({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const rows = RAB_SAMPLE.rows.map((r) => ({ ...r, total: r.volume * r.price }));
  const grand = rows.reduce((sum, r) => sum + r.total, 0);
  const shown = compact ? rows.slice(0, 4) : rows;

  return (
    <figure
      className={cn("border border-arang bg-white text-arang", className)}
      aria-label="Contoh lembar Rencana Anggaran Biaya"
    >
      {/* Kop dokumen */}
      <div className="grid grid-cols-[1fr_auto] border-b border-arang">
        <div className="px-4 py-3 sm:px-5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-abu">
            Nandara Build
          </p>
          <p className="mt-1 text-base font-bold sm:text-lg">Rencana Anggaran Biaya</p>
        </div>
        <div className="flex items-center border-l border-arang px-4 sm:px-5">
          <SampleNote />
        </div>
      </div>
      <dl className="grid grid-cols-2 border-b border-arang text-[0.8125rem] sm:grid-cols-3">
        <div className="border-r border-batu px-4 py-2.5 sm:px-5">
          <dt className="text-abu">Pekerjaan</dt>
          <dd className="font-semibold">{RAB_SAMPLE.title.replace("Contoh RAB — ", "")}</dd>
        </div>
        <div className="px-4 py-2.5 sm:border-r sm:border-batu sm:px-5">
          <dt className="text-abu">Harga per</dt>
          <dd className="font-semibold">{RAB_SAMPLE.updated}</dd>
        </div>
        <div className="col-span-2 border-t border-batu px-4 py-2.5 sm:col-span-1 sm:border-t-0 sm:px-5">
          <dt className="text-abu">Status</dt>
          <dd className="font-semibold">Menunggu persetujuan klien</dd>
        </div>
      </dl>

      {/* HP: daftar */}
      <ul className="tabular divide-y divide-batu sm:hidden">
        {shown.map((r) => (
          <li key={r.item} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm">{r.item}</p>
              <p className="mt-0.5 text-xs text-abu">
                {r.volume} {r.unit} × {formatRupiah(r.price)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold">{formatRupiah(r.total)}</p>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop: tabel */}
      <table className="tabular hidden w-full text-left text-[0.8125rem] sm:table">
        <thead>
          <tr className="whitespace-nowrap border-b border-batu text-abu">
            <th scope="col" className="w-8 px-5 py-2.5 font-medium">
              No
            </th>
            <th scope="col" className="py-2.5 pr-3 font-medium">
              Uraian pekerjaan
            </th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">
              Volume
            </th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">
              Harga satuan
            </th>
            <th scope="col" className="px-5 py-2.5 text-right font-medium">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r, i) => (
            <tr key={r.item} className="border-b border-batu/70 last:border-0">
              <td className="px-5 py-2.5 text-abu">{i + 1}</td>
              <td className="py-2.5 pr-3">{r.item}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-right">
                {r.volume} {r.unit}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-right">{formatRupiah(r.price)}</td>
              <td className="whitespace-nowrap px-5 py-2.5 text-right font-semibold">
                {formatRupiah(r.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {compact && rows.length > shown.length ? (
        <p className="border-t border-batu px-4 py-2 text-xs text-abu sm:px-5">
          + {rows.length - shown.length} item lainnya
        </p>
      ) : null}

      <div className="tabular flex items-baseline justify-between border-t-2 border-arang px-4 py-3 sm:px-5">
        <span className="text-sm font-bold">Total</span>
        <span className="text-lg font-bold">{formatRupiah(grand)}</span>
      </div>

      {!compact && (
        <div className="grid grid-cols-2 border-t border-arang text-[0.8125rem]">
          <div className="border-r border-batu px-4 pb-8 pt-2.5 sm:px-5">
            <p className="text-abu">Disusun oleh</p>
            <p className="font-semibold">Nandara Build</p>
          </div>
          <div className="px-4 pb-8 pt-2.5 sm:px-5">
            <p className="text-abu">Disetujui klien</p>
            <p className="font-semibold">( . . . . . . . . . . )</p>
          </div>
        </div>
      )}
    </figure>
  );
}
