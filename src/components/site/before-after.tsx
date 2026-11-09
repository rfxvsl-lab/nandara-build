import { useId, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Slider sebelum–sesudah (design.md §5.5).
 * Memakai <input type="range"> asli agar bisa dipakai keyboard & screen reader.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Sebelum",
  afterLabel = "Sesudah",
  className,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div
      className={cn(
        "relative aspect-[4/3] select-none overflow-hidden rounded-lg bg-pasir",
        className,
      )}
    >
      <img
        src={after}
        alt={afterAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={before}
        alt={beforeAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className="label-mono absolute left-3 top-3 rounded-sm bg-arang/80 px-2 py-1 text-[0.6875rem] text-kapur">
        {beforeLabel}
      </span>
      <span className="label-mono absolute right-3 top-3 rounded-sm bg-emas px-2 py-1 text-[0.6875rem] text-arang">
        {afterLabel}
      </span>

      {/* Garis & pegangan */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-kapur"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-kapur bg-arang text-kapur shadow-card">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Geser untuk membandingkan {beforeLabel.toLowerCase()} dan {afterLabel.toLowerCase()}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos}% ${beforeLabel.toLowerCase()}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
