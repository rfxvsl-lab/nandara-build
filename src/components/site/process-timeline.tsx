import { PROCESS_STEPS } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Jadwal tahapan kerja sebagai tabel (desktop) / daftar bernomor (HP).
 * Kolom "Yang Anda terima" adalah inti informasinya.
 */
export function ProcessTable({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const line = dark ? "border-kapur/20" : "border-batu";
  const muted = dark ? "text-kapur/60" : "text-abu";
  const strong = dark ? "text-kapur" : "text-arang";

  return (
    <div>
      <div
        className={cn(
          "hidden grid-cols-[3rem_1.1fr_2fr_1.2fr] gap-6 border-b pb-3 text-sm md:grid",
          line,
          muted,
        )}
      >
        <span>No</span>
        <span>Tahap</span>
        <span>Yang terjadi</span>
        <span>Yang Anda terima</span>
      </div>
      <ol>
        {PROCESS_STEPS.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              "grid grid-cols-[2.25rem_1fr] gap-x-4 gap-y-1 border-b py-5 md:grid-cols-[3rem_1.1fr_2fr_1.2fr] md:gap-6",
              line,
            )}
          >
            <span className={cn("tabular text-sm md:text-base", muted)}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={cn("text-base font-bold md:text-lg", strong)}>{step.title}</h3>
            <p
              className={cn(
                "col-start-2 text-[0.9375rem] leading-relaxed md:col-start-auto",
                muted,
              )}
            >
              {step.body}
            </p>
            <p
              className={cn(
                "col-start-2 text-[0.9375rem] font-semibold md:col-start-auto",
                dark ? "text-emas" : "text-emas-ink",
              )}
            >
              {step.doc}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
