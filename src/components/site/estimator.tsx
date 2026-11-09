import { Download, Loader2 } from "lucide-react";
import { useId, useState } from "react";

import { CONTACT } from "@/content/site";
import { track } from "@/lib/analytics";
import { TIERS, TIER_LABEL, type PricingSettings, type TierKey } from "@/lib/pricing";
import { cn, formatRupiah, formatRupiahShort } from "@/lib/utils";

const MIN_AREA = 10;
const MAX_AREA = 500;

/**
 * Kalkulator estimasi biaya kasar + simulasi termin + unduh PDF.
 * Harga & termin berasal dari pengaturan admin (getPricing). Hasil berupa RENTANG.
 */
export function Estimator({ pricing }: { pricing: PricingSettings }) {
  const [jobId, setJobId] = useState(pricing.jobs[0]?.id ?? "");
  const [tier, setTier] = useState<TierKey>("menengah");
  const [area, setArea] = useState(72);
  const [areaText, setAreaText] = useState("72");
  const [pdfBusy, setPdfBusy] = useState(false);
  const areaId = useId();

  const job = pricing.jobs.find((j) => j.id === jobId) ?? pricing.jobs[0];
  if (!job) return null;
  const [lo, hi] = job.tiers[tier];
  const min = lo * area;
  const max = hi * area;

  const message =
    `Halo Nandara Build, saya mencoba kalkulator estimasi di website:\n` +
    `• Pekerjaan: ${job.label}\n` +
    `• Luas: ${area} m²\n` +
    `• Kualitas: ${TIER_LABEL[tier]}\n` +
    `• Estimasi: ${formatRupiahShort(min)} – ${formatRupiahShort(max)}\n` +
    `Saya ingin RAB detail. Lokasi saya di `;
  const href = `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(message)}`;

  const clamp = (n: number) => Math.min(MAX_AREA, Math.max(MIN_AREA, Math.round(n) || MIN_AREA));

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const { downloadEstimatePdf } = await import("@/lib/estimate-pdf");
      await downloadEstimatePdf({
        jobLabel: job!.label,
        tierLabel: TIER_LABEL[tier],
        area,
        pricePerM2: [lo, hi],
        min,
        max,
        termin: pricing.termin,
        updated: pricing.updated,
      });
      track("download_estimate_pdf", { pekerjaan: job!.id, kualitas: tier, luas: area });
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8 p-6 sm:p-8">
          <fieldset>
            <legend className="text-[0.9375rem] text-arang">Jenis pekerjaan</legend>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pricing.jobs.map((j) => (
                <OptionCard
                  key={j.id}
                  name="job"
                  checked={job.id === j.id}
                  onChange={() => setJobId(j.id)}
                  label={j.label}
                />
              ))}
            </div>
          </fieldset>

          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={areaId} className="text-[0.9375rem] text-arang">
                Luas bangunan
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_AREA}
                  max={MAX_AREA}
                  value={areaText}
                  onChange={(e) => {
                    setAreaText(e.target.value);
                    const n = Number(e.target.value);
                    if (n >= MIN_AREA && n <= MAX_AREA) setArea(Math.round(n));
                  }}
                  onBlur={() => {
                    const n = clamp(Number(areaText));
                    setArea(n);
                    setAreaText(String(n));
                  }}
                  aria-label="Luas dalam meter persegi"
                  className="tabular h-11 w-24 rounded-md border border-batu bg-white px-3 text-right text-base text-arang"
                />
                <span className="text-sm text-abu">m²</span>
              </div>
            </div>
            <input
              id={areaId}
              type="range"
              min={MIN_AREA}
              max={MAX_AREA}
              step={1}
              value={area}
              onChange={(e) => {
                setArea(Number(e.target.value));
                setAreaText(e.target.value);
              }}
              aria-valuetext={`${area} meter persegi`}
              className="mt-4 h-2 w-full cursor-pointer accent-[var(--color-emas-ink)]"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-abu">
              <span>{MIN_AREA} m²</span>
              <span>{MAX_AREA} m²</span>
            </div>
          </div>

          <fieldset>
            <legend className="text-[0.9375rem] text-arang">Kualitas material</legend>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {TIERS.map((key) => (
                <OptionCard
                  key={key}
                  name="tier"
                  checked={tier === key}
                  onChange={() => setTier(key)}
                  label={TIER_LABEL[key]}
                  hint={tierHint(job.tiers[key])}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="relative flex flex-col justify-between gap-8 bg-[#2b2a27] p-6 text-kapur sm:p-8">
          <div aria-live="polite">
            <p className="font-mono text-sm text-kapur/70">Perkiraan biaya</p>
            <p className="tabular mt-4 whitespace-nowrap text-[1.875rem] font-normal leading-tight tracking-[-0.03em] sm:text-[2.75rem]">
              {formatRupiahShort(min)}
              <span className="text-kapur/40"> – </span>
              {formatRupiahShort(max)}
            </p>
            <p className="tabular mt-2 text-sm text-kapur/70">
              {formatRupiah(min)} – {formatRupiah(max)}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-kapur/60">
              Kisaran umum pasar, diperbarui {pricing.updated}. Bukan penawaran. Biaya pasti
              ditentukan lewat survei dan RAB rinci.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              data-track="kalkulator"
              onClick={() =>
                track("use_calculator", { pekerjaan: job.id, kualitas: tier, luas: area })
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emas px-6 text-[0.9375rem] font-medium text-arang transition-colors hover:bg-emas-muda"
            >
              Minta RAB rinci gratis
            </a>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-kapur/40 px-6 text-[0.9375rem] font-medium text-kapur transition-colors hover:border-kapur hover:bg-kapur/10 disabled:opacity-70"
            >
              {pdfBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Download className="h-4 w-4" aria-hidden />
              )}
              Unduh estimasi (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Simulasi termin */}
      <div className="border-t border-batu p-6 sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-lg font-normal text-arang">Simulasi pembayaran bertahap</h3>
          <p className="text-sm text-abu">Skema final tertulis di SPK</p>
        </div>
        <ol className="mt-4">
          {pricing.termin.map((t, i) => (
            <li
              key={t.label}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-t border-batu py-3 text-[0.9375rem] sm:grid-cols-[1fr_4rem_auto]"
            >
              <span className="text-beton">
                <span className="font-mono text-sm text-abu">{i + 1}.</span> {t.label}
              </span>
              <span className="tabular text-right text-abu sm:order-none">{t.persen}%</span>
              <span className="tabular col-span-2 text-arang sm:col-span-1 sm:text-right">
                {formatRupiahShort((min * t.persen) / 100)} –{" "}
                {formatRupiahShort((max * t.persen) / 100)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function tierHint([lo, hi]: readonly [number, number]) {
  const jt = (n: number) => (n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 });
  return `${jt(lo)}–${jt(hi)} jt/m²`;
}

function OptionCard({
  name,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer flex-col justify-center rounded-lg border px-3 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-emas-ink",
        checked
          ? "border-emas-ink bg-emas/15 text-arang"
          : "border-batu bg-white text-arang hover:border-abu",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm font-medium">{label}</span>
      {hint ? (
        <span
          className={cn("tabular mt-1 text-[0.6875rem]", checked ? "text-emas-ink" : "text-abu")}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
