import { PROCESS_STEPS } from "@/content/site";

/** Enam tahap kerja dalam grid bersekat garis (gaya kolom "How it works" Block). */
export function ProcessTimeline() {
  return (
    <ol className="grid overflow-hidden rounded-xl border border-garis bg-white sm:grid-cols-2 lg:grid-cols-3">
      {PROCESS_STEPS.map((step, i) => (
        <li
          key={step.title}
          className="-ml-px -mt-px flex flex-col border-l border-t border-garis p-6 sm:p-7"
        >
          <span className="font-mono text-sm text-abu">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-xl font-normal tracking-[-0.01em] text-arang">{step.title}</h3>
          <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-abu">{step.body}</p>
          <p className="mt-5 border-t border-batu pt-3 text-sm text-emas-ink">
            Anda menerima: {step.doc}
          </p>
        </li>
      ))}
    </ol>
  );
}
