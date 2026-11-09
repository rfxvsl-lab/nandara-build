import { useId, useState } from "react";

import { CONTACT, PRICING, type JobKey, type TierKey } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn, formatRupiah, formatRupiahShort } from "@/lib/utils";

const JOBS = Object.keys(PRICING.jobs) as JobKey[];
const TIERS = Object.keys(PRICING.tierLabels) as TierKey[];
const MIN_AREA = 10;
const MAX_AREA = 500;

/** Kalkulator estimasi biaya kasar (design.md §5.5). Hasil berupa RENTANG, bukan penawaran. */
export function Estimator() {
  const [job, setJob] = useState<JobKey>("bangun");
  const [tier, setTier] = useState<TierKey>("menengah");
  const [area, setArea] = useState(72);
  const [areaText, setAreaText] = useState("72");
  const areaId = useId();

  const [lo, hi] = PRICING.jobs[job].tiers[tier];
  const min = lo * area;
  const max = hi * area;

  const message =
    `Halo Nandara Build, saya mencoba kalkulator estimasi di website:\n` +
    `• Pekerjaan: ${PRICING.jobs[job].label}\n` +
    `• Luas: ${area} m²\n` +
    `• Kualitas: ${PRICING.tierLabels[tier]}\n` +
    `• Estimasi: ${formatRupiahShort(min)} – ${formatRupiahShort(max)}\n` +
    `Saya ingin RAB detail. Lokasi saya di `;
  const href = `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(message)}`;

  const clamp = (n: number) => Math.min(MAX_AREA, Math.max(MIN_AREA, Math.round(n) || MIN_AREA));

  return (
    <div className="grid border border-arang bg-white lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-8 p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-semibold text-arang">Jenis pekerjaan</legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {JOBS.map((key) => (
              <OptionCard
                key={key}
                name="job"
                checked={job === key}
                onChange={() => setJob(key)}
                label={PRICING.jobs[key].label}
              />
            ))}
          </div>
        </fieldset>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label htmlFor={areaId} className="text-sm font-semibold text-arang">
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
                className="tabular h-11 w-24 rounded-sm border border-arang bg-white px-3 text-right text-base font-semibold text-arang"
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
          <div className="tabular mt-1 flex justify-between text-xs text-abu">
            <span>{MIN_AREA} m²</span>
            <span>{MAX_AREA} m²</span>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-arang">Kualitas material</legend>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {TIERS.map((key) => (
              <OptionCard
                key={key}
                name="tier"
                checked={tier === key}
                onChange={() => setTier(key)}
                label={PRICING.tierLabels[key]}
                hint={tierHint(PRICING.jobs[job].tiers[key])}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="relative flex flex-col justify-between gap-8 bg-arang p-6 text-kapur sm:p-8">
        <div aria-live="polite">
          <p className="text-sm font-semibold text-kapur/70">Perkiraan biaya</p>
          <p className="tabular mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.5rem]">
            {formatRupiahShort(min)}
            <span className="text-kapur/40"> – </span>
            {formatRupiahShort(max)}
          </p>
          <p className="tabular mt-2 text-sm text-kapur/70">
            {formatRupiah(min)} – {formatRupiah(max)}
          </p>
          <p className="mt-6 border-t border-kapur/20 pt-4 text-sm leading-relaxed text-kapur/60">
            Kisaran umum pasar, diperbarui {PRICING.updated}. Bukan penawaran. Biaya pasti
            ditentukan lewat survei dan RAB rinci.
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          data-track="kalkulator"
          onClick={() => track("use_calculator", { pekerjaan: job, kualitas: tier, luas: area })}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-emas px-5 text-[0.9375rem] font-semibold text-arang transition-colors hover:bg-emas-muda"
        >
          Minta RAB rinci (gratis)
        </a>
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
        "flex min-h-12 cursor-pointer flex-col justify-center rounded-sm border px-3 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-emas-ink",
        checked
          ? "border-arang bg-arang text-kapur"
          : "border-batu bg-kapur text-arang hover:border-abu",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm font-semibold">{label}</span>
      {hint ? (
        <span
          className={cn("tabular mt-1 text-[0.6875rem]", checked ? "text-emas-muda" : "text-abu")}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
