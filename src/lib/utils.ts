import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rupiah = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** Format Rupiah Indonesia: 4500000 → "Rp 4.500.000" (design.md §3.2) */
export function formatRupiah(value: number): string {
  return `Rp ${rupiah.format(Math.round(value))}`;
}

/** Ringkas untuk rentang besar: 450000000 → "Rp 450 jt", 5500000 → "Rp 5,5 jt", 1250000000 → "Rp 1,25 M" */
export function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
  }
  const jt = value / 1_000_000;
  return `Rp ${jt.toLocaleString("id-ID", { maximumFractionDigits: jt < 100 ? 1 : 0 })} jt`;
}
