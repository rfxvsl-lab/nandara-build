import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputCls =
  "h-11 w-full rounded-md border border-batu bg-white px-3 text-[0.9375rem] text-arang focus:border-emas-ink";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-arang">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-abu">{hint}</span>}
    </label>
  );
}

export function Btn({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-60",
        variant === "primary" && "bg-arang text-kapur hover:bg-beton",
        variant === "ghost" && "bg-pasir text-arang hover:bg-batu",
        variant === "danger" && "text-danger hover:bg-danger/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        published ? "bg-[#dcefe2] text-[#1f5a35]" : "bg-batu/60 text-abu",
      )}
    >
      {published ? "Tampil" : "Disembunyikan"}
    </span>
  );
}
