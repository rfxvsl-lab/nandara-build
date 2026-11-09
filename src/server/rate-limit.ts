/**
 * Pembatas laju sederhana di memori proses + pengambilan IP klien yang tidak bisa dipalsukan.
 */
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

/**
 * IP klien: hop TERAKHIR X-Forwarded-For (ditambahkan proxy hosting), bukan yang pertama
 * (yang bisa diisi bebas oleh klien). Tanpa header, pakai IP koneksi.
 */
export function clientIp(): string {
  const xff = getRequestHeader("x-forwarded-for");
  const last = xff?.split(",").pop()?.trim();
  return last || getRequestIP() || "unknown";
}

export class RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  private recent(key: string, now: number): number[] {
    const list = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (list.length) this.hits.set(key, list);
    else this.hits.delete(key);
    // Bersihkan kunci kedaluwarsa sesekali agar memori tidak tumbuh tanpa batas.
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits)
        if (!v.some((t) => now - t < this.windowMs)) this.hits.delete(k);
    }
    return list;
  }

  /** true bila kunci sudah mencapai batas (tanpa mencatat). */
  blocked(key: string): boolean {
    return this.recent(key, Date.now()).length >= this.max;
  }

  /** Catat satu kejadian untuk kunci. */
  record(key: string): void {
    const now = Date.now();
    this.hits.set(key, [...this.recent(key, now), now]);
  }

  /** Catat lalu kembalikan true bila melebihi batas. */
  hit(key: string): boolean {
    this.record(key);
    return this.recent(key, Date.now()).length > this.max;
  }
}
