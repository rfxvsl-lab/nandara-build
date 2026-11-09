import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { slugify } from "@/lib/content-types";
import { adminSavePricing } from "@/lib/content.functions";
import {
  TIERS,
  TIER_LABEL,
  pricingSchema,
  type PriceJob,
  type PricingSettings,
  type TierKey,
} from "@/lib/pricing";
import { formatRupiah } from "@/lib/utils";

import { Btn, Field, inputCls } from "./ui";

/** Angka juta (boleh koma) ↔ rupiah. */
const toJt = (n: number) => String(n / 1_000_000).replace(".", ",");
const fromJt = (s: string) => Math.round(Number(s.replace(",", ".")) * 1_000_000) || 0;

export function PricingAdmin({ initial }: { initial: PricingSettings }) {
  const [data, setData] = useState<PricingSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  // Key stabil per baris agar input tidak tertukar saat baris dihapus.
  const nextKey = useRef(initial.jobs.length);
  const [keys, setKeys] = useState(() => initial.jobs.map((_, i) => i));

  const total = data.termin.reduce((s, t) => s + (Number(t.persen) || 0), 0);

  function setJob(i: number, patch: Partial<PriceJob>) {
    setData((d) => ({ ...d, jobs: d.jobs.map((j, k) => (k === i ? { ...j, ...patch } : j)) }));
  }
  function setTier(i: number, tier: TierKey, idx: 0 | 1, value: string) {
    setData((d) => ({
      ...d,
      jobs: d.jobs.map((j, k) => {
        if (k !== i) return j;
        const next = [...j.tiers[tier]] as [number, number];
        next[idx] = fromJt(value);
        return { ...j, tiers: { ...j.tiers, [tier]: next } };
      }),
    }));
  }

  async function save() {
    // ID pekerjaan dibuat dari nama bila baru; pastikan unik.
    const seen = new Set<string>();
    const jobs = data.jobs.map((j) => {
      let id = j.id || slugify(j.label) || "pekerjaan";
      for (let n = 2; seen.has(id); n++) id = `${slugify(j.label)}-${n}`;
      seen.add(id);
      return { ...j, id };
    });
    const parsed = pricingSchema.safeParse({ ...data, jobs });
    if (!parsed.success) {
      setMsg({ ok: false, text: parsed.error.issues[0]?.message ?? "Data belum valid" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const saved = await adminSavePricing({ data: parsed.data });
      setData(saved);
      setMsg({ ok: true, text: "Tersimpan. Kalkulator di website langsung memakai angka baru." });
    } catch {
      setMsg({ ok: false, text: "Gagal menyimpan. Coba lagi." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-5 sm:p-8">
        <h2 className="text-2xl font-normal text-arang">Harga acuan per m²</h2>
        <p className="mt-1 text-sm text-abu">
          Isi dalam <strong>juta rupiah</strong>, mis. <code className="font-mono">4,5</code> = Rp
          4.500.000/m². Dipakai kalkulator di beranda & halaman Estimasi Biaya.
        </p>

        <Field
          label="Diperbarui"
          hint="Tampil di kalkulator & PDF, mis. November 2026"
          className="mt-6 max-w-xs"
        >
          <input
            className={inputCls}
            value={data.updated}
            onChange={(e) => setData({ ...data, updated: e.target.value })}
          />
        </Field>

        <div className="mt-6 space-y-4">
          {data.jobs.map((j, i) => (
            <div key={keys[i]} className="rounded-lg border border-batu p-4">
              <div className="flex items-end gap-3">
                <Field label="Jenis pekerjaan" className="flex-1">
                  <input
                    className={inputCls}
                    value={j.label}
                    onChange={(e) => setJob(i, { label: e.target.value })}
                  />
                </Field>
                <Btn
                  variant="danger"
                  aria-label={`Hapus ${j.label}`}
                  disabled={data.jobs.length <= 1}
                  onClick={() => {
                    setData((d) => ({ ...d, jobs: d.jobs.filter((_, k) => k !== i) }));
                    setKeys((ks) => ks.filter((_, k) => k !== i));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {TIERS.map((t) => (
                  <fieldset key={t}>
                    <legend className="mb-1.5 text-sm font-medium text-arang">
                      {TIER_LABEL[t]}
                    </legend>
                    <div className="flex items-center gap-2">
                      <input
                        aria-label={`${j.label} ${TIER_LABEL[t]} minimum (juta)`}
                        className={`${inputCls} tabular`}
                        inputMode="decimal"
                        defaultValue={toJt(j.tiers[t][0])}
                        onChange={(e) => setTier(i, t, 0, e.target.value)}
                      />
                      <span className="text-abu">–</span>
                      <input
                        aria-label={`${j.label} ${TIER_LABEL[t]} maksimum (juta)`}
                        className={`${inputCls} tabular`}
                        inputMode="decimal"
                        defaultValue={toJt(j.tiers[t][1])}
                        onChange={(e) => setTier(i, t, 1, e.target.value)}
                      />
                    </div>
                    <p className="tabular mt-1 text-xs text-abu">
                      {formatRupiah(j.tiers[t][0])} – {formatRupiah(j.tiers[t][1])}
                    </p>
                  </fieldset>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Btn
          variant="ghost"
          className="mt-4"
          disabled={data.jobs.length >= 12}
          onClick={() => {
            setKeys((ks) => [...ks, nextKey.current++]);
            setData((d) => ({
              ...d,
              jobs: [
                ...d.jobs,
                {
                  id: "",
                  label: "",
                  tiers: { standar: [0, 0], menengah: [0, 0], premium: [0, 0] },
                },
              ],
            }));
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah jenis pekerjaan
        </Btn>
      </div>

      <div className="rounded-xl bg-white p-5 sm:p-8">
        <h2 className="text-2xl font-normal text-arang">Skema termin pembayaran</h2>
        <p className="mt-1 text-sm text-abu">
          Dipakai untuk simulasi di kalkulator & PDF. Total harus 100%.
        </p>
        <div className="mt-6 space-y-3">
          {data.termin.map((t, i) => (
            <div key={i} className="flex items-end gap-3">
              <Field label={`Tahap ${i + 1}`} className="flex-1">
                <input
                  className={inputCls}
                  value={t.label}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      termin: d.termin.map((x, k) =>
                        k === i ? { ...x, label: e.target.value } : x,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="%" className="w-24">
                <input
                  className={`${inputCls} tabular`}
                  type="number"
                  min={1}
                  max={100}
                  value={t.persen}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      termin: d.termin.map((x, k) =>
                        k === i ? { ...x, persen: Number(e.target.value) || 0 } : x,
                      ),
                    }))
                  }
                />
              </Field>
              <Btn
                variant="danger"
                aria-label={`Hapus tahap ${i + 1}`}
                disabled={data.termin.length <= 1}
                onClick={() =>
                  setData((d) => ({ ...d, termin: d.termin.filter((_, k) => k !== i) }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Btn>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Btn
            variant="ghost"
            disabled={data.termin.length >= 8}
            onClick={() =>
              setData((d) => ({ ...d, termin: [...d.termin, { label: "", persen: 0 }] }))
            }
          >
            <Plus className="h-4 w-4" aria-hidden />
            Tambah tahap
          </Btn>
          <p className={`tabular text-sm ${total === 100 ? "text-success" : "text-danger"}`}>
            Total {total}%
          </p>
        </div>
      </div>

      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-success" : "text-danger"}>
          {msg.text}
        </p>
      )}
      <Btn onClick={save} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Simpan harga & termin
      </Btn>
    </div>
  );
}
