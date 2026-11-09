import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  testimonialInputSchema,
  type Testimonial,
  type TestimonialInput,
} from "@/lib/content-types";
import { adminDeleteTestimonial, adminSaveTestimonial } from "@/lib/content.functions";

import { Btn, Field, PublishedBadge, inputCls } from "./ui";

const EMPTY: TestimonialInput = {
  nama: "",
  kota: "",
  proyek: "",
  kutipan: "",
  published: false,
  urutan: 0,
};

export function TestimonialsAdmin({
  items,
  onChange,
}: {
  items: Testimonial[];
  onChange: (items: Testimonial[]) => void;
}) {
  const [editing, setEditing] = useState<TestimonialInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!editing) return;
    const parsed = testimonialInputSchema.safeParse(editing);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data belum lengkap");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await adminSaveTestimonial({ data: parsed.data });
      const exists = items.some((t) => t.id === saved.id);
      onChange(exists ? items.map((t) => (t.id === saved.id ? saved : t)) : [...items, saved]);
      setEditing(null);
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  const set = <K extends keyof TestimonialInput>(k: K, v: TestimonialInput[K]) =>
    setEditing((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div>
      {editing ? (
        <div className="rounded-xl bg-white p-5 sm:p-8">
          <h2 className="text-2xl font-normal text-arang">
            {editing.id ? "Ubah testimoni" : "Testimoni baru"}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Nama klien" hint="Boleh disingkat, mis. Bu Rina S.">
              <input
                className={inputCls}
                value={editing.nama}
                onChange={(e) => set("nama", e.target.value)}
              />
            </Field>
            <Field label="Kota">
              <input
                className={inputCls}
                value={editing.kota}
                onChange={(e) => set("kota", e.target.value)}
              />
            </Field>
            <Field label="Proyek" hint="mis. Renovasi dapur">
              <input
                className={inputCls}
                value={editing.proyek}
                onChange={(e) => set("proyek", e.target.value)}
              />
            </Field>
            <Field label="Urutan tampil">
              <input
                className={inputCls}
                type="number"
                min={0}
                value={editing.urutan}
                onChange={(e) => set("urutan", Math.max(0, Number(e.target.value) || 0))}
              />
            </Field>
            <Field
              label="Kutipan"
              hint="Kata-kata asli klien (dengan izin)"
              className="md:col-span-2"
            >
              <textarea
                className={`${inputCls} h-auto py-2`}
                rows={4}
                maxLength={1000}
                value={editing.kutipan}
                onChange={(e) => set("kutipan", e.target.value)}
              />
            </Field>
          </div>
          <label className="mt-6 flex items-center gap-3 text-[0.9375rem] text-arang">
            <input
              type="checkbox"
              checked={editing.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-5 w-5 accent-[var(--color-emas-ink)]"
            />
            Tampilkan di website
          </label>
          {error && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {error}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <Btn onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Simpan testimoni
            </Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
              Batal
            </Btn>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-abu">
              {items.length} testimoni · {items.filter((t) => t.published).length} tampil di website
            </p>
            <Btn onClick={() => setEditing({ ...EMPTY })}>
              <Plus className="h-4 w-4" aria-hidden />
              Tambah testimoni
            </Btn>
          </div>
          {items.length === 0 ? (
            <p className="mt-6 rounded-xl bg-white p-10 text-center text-abu">
              Belum ada testimoni. Section testimoni di beranda muncul otomatis begitu ada yang
              ditampilkan.
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {items.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col gap-4 rounded-xl bg-white p-5 sm:flex-row sm:items-start"
                >
                  <div className="flex-1">
                    <p className="text-[0.9375rem] leading-relaxed text-beton">“{t.kutipan}”</p>
                    <p className="mt-2 text-sm text-abu">
                      {[t.nama, t.kota, t.proyek].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PublishedBadge published={t.published} />
                    <Btn variant="ghost" onClick={() => setEditing({ ...t })}>
                      <Pencil className="h-4 w-4" aria-hidden />
                      Ubah
                    </Btn>
                    <Btn
                      variant="danger"
                      onClick={async () => {
                        if (!confirm(`Hapus testimoni dari ${t.nama}?`)) return;
                        await adminDeleteTestimonial({ data: { id: t.id } });
                        onChange(items.filter((x) => x.id !== t.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Hapus
                    </Btn>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
