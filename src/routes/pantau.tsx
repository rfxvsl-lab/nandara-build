import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { CalendarDays, Download, FileText, Loader2, LogOut, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Wordmark } from "@/components/site/header";
import { WhatsAppIcon } from "@/components/site/whatsapp-float";
import { waLink } from "@/content/site";
import {
  PAY_STATUS_LABEL,
  PROJECT_STATUS_LABEL,
  STAGE_STATUS_LABEL,
  portalFileUrl,
  type PortalView,
} from "@/lib/portal-types";
import { getPortalState, portalLogin, portalLogout } from "@/lib/portal.functions";
import { cn, formatRupiah } from "@/lib/utils";

export const Route = createFileRoute("/pantau")({
  head: () => ({
    meta: [
      { title: "Pantau Proyek | Nandara Build" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => getPortalState(),
  component: PantauPage,
});

function formatDate(d: string, long = false) {
  if (!d) return "–";
  return new Date(`${d}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
  });
}

function PantauPage() {
  const state = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-kapur">
      <header className="border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label="Ke website Nandara Build">
            <Wordmark />
          </Link>
          {state.status === "ok" ? (
            <LogoutButton />
          ) : (
            <span className="font-mono text-sm text-abu">Pantau Proyek</span>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 md:py-14">
        {state.status === "disabled" && (
          <p className="mx-auto max-w-md rounded-xl bg-white p-8 text-center text-abu">
            Portal klien belum aktif.
          </p>
        )}
        {state.status === "login" && <Login />}
        {state.status === "ok" && <Dashboard p={state.project} />}
      </main>
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await portalLogout();
        await router.invalidate();
      }}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-abu hover:bg-pasir hover:text-arang"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Keluar
    </button>
  );
}

function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const kode = String(fd.get("kode") ?? "");
    const wa4 = String(fd.get("wa4") ?? "").replace(/\D/g, "");
    if (wa4.length !== 4) {
      setError("Masukkan 4 digit terakhir nomor WhatsApp Anda.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await portalLogin({ data: { kode, wa4 } });
      if (res.ok) await router.invalidate();
      else setError(res.error);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-[2.25rem] font-normal uppercase leading-none tracking-[-0.03em] text-arang sm:text-[2.75rem]">
        Pantau proyek Anda
      </h1>
      <p className="mt-4 font-mono text-[0.9375rem] leading-relaxed text-beton">
        Lihat progres, foto laporan, termin pembayaran, dan dokumen proyek Anda kapan saja.
      </p>
      <form onSubmit={onSubmit} className="mt-8 rounded-xl bg-white p-6 sm:p-8">
        <label htmlFor="kode" className="block text-sm font-medium text-arang">
          Kode akses
        </label>
        <input
          id="kode"
          name="kode"
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="XXXX-XXXX"
          maxLength={12}
          className="mt-2 h-12 w-full rounded-md border border-batu px-4 font-mono text-lg uppercase tracking-[0.2em] text-arang"
        />
        <label htmlFor="wa4" className="mt-5 block text-sm font-medium text-arang">
          4 digit terakhir nomor WhatsApp
        </label>
        <input
          id="wa4"
          name="wa4"
          required
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          placeholder="1234"
          className="mt-2 h-12 w-32 rounded-md border border-batu px-4 font-mono text-lg tracking-[0.3em] text-arang"
        />
        {error && (
          <p role="alert" className="mt-4 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-emas px-6 font-medium text-arang hover:bg-emas-muda disabled:opacity-70"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Masuk
        </button>
      </form>
      <p className="mt-6 text-sm leading-relaxed text-abu">
        Kode akses dikirim tim Nandara Build lewat WhatsApp setelah SPK ditandatangani. Belum punya
        atau lupa?{" "}
        <a
          href={waLink("kode akses Pantau Proyek")}
          target="_blank"
          rel="noreferrer"
          className="text-emas-ink underline underline-offset-4"
        >
          Hubungi kami
        </a>
        .
      </p>
    </div>
  );
}

const STAGE_DOT: Record<string, string> = {
  belum: "border-batu bg-white",
  berjalan: "border-emas-ink bg-emas",
  selesai: "border-success bg-success",
};
const PAY_CHIP: Record<string, string> = {
  belum: "bg-pasir text-abu",
  ditagih: "bg-emas/25 text-[#5c4415]",
  lunas: "bg-[#dcefe2] text-[#1f5a35]",
};

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl bg-white p-5 sm:p-6", className)}>
      <h2 className="text-lg font-normal text-arang">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Dashboard({ p }: { p: PortalView }) {
  const paid = p.termin.filter((t) => t.status === "lunas");
  const paidTotal = paid.reduce((s, t) => s + t.nominal, 0);
  const reports = [...p.laporan].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return (
    <div>
      {/* Ringkasan */}
      <section className="rounded-xl bg-[#2b2a27] p-6 text-kapur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-sm text-kapur/70">Halo, {p.namaKlien}</p>
            <h1 className="mt-2 text-[1.875rem] font-normal uppercase leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
              {p.judul}
            </h1>
            {p.lokasi && (
              <p className="mt-3 flex items-center gap-2 text-sm text-kapur/75">
                <MapPin className="h-4 w-4" aria-hidden /> {p.lokasi}
              </p>
            )}
          </div>
          <span className="self-start rounded-full bg-emas px-4 py-1.5 text-sm font-medium text-arang lg:self-auto">
            {PROJECT_STATUS_LABEL[p.status]}
          </span>
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-kapur/70">Progres keseluruhan</span>
            <span className="tabular text-[2.5rem] font-normal leading-none tracking-[-0.03em]">
              {p.progres}%
            </span>
          </div>
          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-kapur/15"
            role="progressbar"
            aria-valuenow={p.progres}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progres proyek"
          >
            <div className="h-full rounded-full bg-emas" style={{ width: `${p.progres}%` }} />
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-kapur/15 pt-6 sm:grid-cols-4">
          {[
            ["Mulai", formatDate(p.mulai, true)],
            ["Target selesai", formatDate(p.target, true)],
            ["Nilai kontrak", p.nilaiKontrak ? formatRupiah(p.nilaiKontrak) : "–"],
            ["Diperbarui", formatDate(p.updatedAt.slice(0, 10), true)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-kapur/60">{k}</dt>
              <dd className="tabular mt-1 text-[0.9375rem]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* Laporan progres */}
        <Card title="Laporan progres">
          {reports.length === 0 ? (
            <p className="text-[0.9375rem] text-abu">Laporan pertama akan muncul di sini.</p>
          ) : (
            <ol className="space-y-8">
              {reports.map((l) => (
                <li key={l.id} className="border-t border-batu pt-5 first:border-0 first:pt-0">
                  <p className="flex items-center gap-2 font-mono text-sm text-abu">
                    <CalendarDays className="h-4 w-4" aria-hidden /> {formatDate(l.tanggal, true)}
                  </p>
                  <h3 className="mt-1 text-[1.0625rem] text-arang">{l.judul}</h3>
                  {l.catatan && (
                    <p className="mt-2 whitespace-pre-line text-[0.9375rem] leading-relaxed text-beton">
                      {l.catatan}
                    </p>
                  )}
                  {l.foto.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {l.foto.map((id) => (
                        <a
                          key={id}
                          href={portalFileUrl(id)}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-lg bg-pasir"
                        >
                          <img
                            src={portalFileUrl(id, { w: 800 })}
                            alt={`Foto laporan ${l.judul}`}
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover transition-transform hover:scale-[1.03]"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Tahapan pekerjaan">
            {p.tahapan.length === 0 ? (
              <p className="text-[0.9375rem] text-abu">Jadwal tahapan akan diisi tim kami.</p>
            ) : (
              <ol className="relative">
                {p.tahapan.map((t, i) => (
                  <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < p.tahapan.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[0.4375rem] top-5 h-full w-px bg-batu"
                      />
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        "relative mt-1 h-4 w-4 shrink-0 rounded-full border-2",
                        STAGE_DOT[t.status],
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-[0.9375rem]",
                          t.status === "belum" ? "text-abu" : "text-arang",
                        )}
                      >
                        {t.nama}
                      </p>
                      <p className="text-xs text-abu">
                        {STAGE_STATUS_LABEL[t.status]}
                        {t.tanggal ? ` · ${formatDate(t.tanggal)}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <Card title="Termin pembayaran">
            {p.termin.length === 0 ? (
              <p className="text-[0.9375rem] text-abu">Rincian termin mengikuti SPK.</p>
            ) : (
              <>
                <p className="tabular text-sm text-abu">
                  {paid.length} dari {p.termin.length} termin lunas · {formatRupiah(paidTotal)}
                </p>
                <ul className="mt-3">
                  {p.termin.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start justify-between gap-3 border-t border-batu py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] text-arang">{t.label}</p>
                        <p className="tabular text-sm text-beton">
                          {formatRupiah(t.nominal)}
                          {t.tanggal ? ` · ${formatDate(t.tanggal)}` : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                          PAY_CHIP[t.status],
                        )}
                      >
                        {PAY_STATUS_LABEL[t.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          <Card title="Dokumen">
            {p.dokumen.length === 0 ? (
              <p className="text-[0.9375rem] text-abu">
                RAB, SPK, dan gambar kerja akan tersedia di sini.
              </p>
            ) : (
              <ul>
                {p.dokumen.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 border-t border-batu py-3 first:border-0 first:pt-0"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-emas-ink" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <a
                        href={portalFileUrl(d.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-[0.9375rem] text-arang hover:underline"
                      >
                        {d.nama}
                      </a>
                      <p className="text-xs text-abu">{d.jenis}</p>
                    </div>
                    <a
                      href={portalFileUrl(d.id, { download: true })}
                      aria-label={`Unduh ${d.nama}`}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-pasir"
                    >
                      <Download className="h-4 w-4 text-beton" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <a
            href={waLink(`proyek "${p.judul}"`)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl bg-pasir p-5 text-arang hover:bg-batu"
          >
            <WhatsAppIcon className="h-6 w-6 shrink-0 text-whatsapp" />
            <span>
              <span className="block text-[0.9375rem]">Ada pertanyaan soal proyek?</span>
              <span className="block text-sm text-abu">Chat tim Nandara Build</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
