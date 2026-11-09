import { PROCESS_STEPS } from "@/content/site";

/** Timeline 6 langkah: vertikal di HP, grid di desktop (design.md §5.5). */
export function ProcessTimeline() {
  return (
    <ol className="relative grid gap-0 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-6 lg:gap-x-4">
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0 md:block md:pb-0">
          {/* garis penghubung vertikal (HP) */}
          {i < PROCESS_STEPS.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[1.375rem] top-12 h-[calc(100%-3rem)] w-px bg-emas/40 md:hidden"
            />
          )}
          <div className="relative flex shrink-0 items-center self-start md:mb-6">
            <span className="tabular grid h-11 w-11 place-items-center rounded-full border border-emas/60 bg-arang font-mono text-sm font-medium text-emas">
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* garis penghubung horizontal (desktop) */}
            {i < PROCESS_STEPS.length - 1 && (
              <span aria-hidden className="ml-3 hidden h-px flex-1 bg-emas/40 lg:block" />
            )}
          </div>
          <div className="min-w-0 pt-1.5 md:pt-0">
            <h3 className="text-lg font-bold text-kapur">{step.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-kapur/70">{step.body}</p>
            <p className="label-mono mt-3 text-[0.6875rem] text-emas-muda">↳ {step.doc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
