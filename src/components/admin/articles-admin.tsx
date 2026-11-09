import { Eye, ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

import { RichText } from "@/components/site/rich-text";
import {
  ARTICLE_CATEGORIES,
  articleInputSchema,
  mediaUrl,
  type Article,
  type ArticleInput,
} from "@/lib/content-types";
import { adminDeleteArticle, adminDeleteMedia, adminSaveArticle } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

import { Btn, Field, PublishedBadge, inputCls } from "./ui";
import { uploadImage } from "./upload";

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY: ArticleInput = {
  title: "",
  slug: "",
  kategori: "Panduan biaya",
  ringkasan: "",
  isi: "",
  cover: "",
  tanggal: today(),
  published: false,
  urutan: 0,
};

const CHEATSHEET = `## Judul bagian
### Subjudul

Paragraf biasa. Pisahkan paragraf dengan satu baris kosong.
**Teks tebal**, *miring*, dan [tautan](https://wa.me/6285194189182).

- Butir daftar
- Butir berikutnya

1. Langkah pertama
2. Langkah kedua

> Kutipan atau catatan penting`;

export function ArticlesAdmin({
  items,
  onChange,
}: {
  items: Article[];
  onChange: (items: Article[]) => void;
}) {
  const [editing, setEditing] = useState<ArticleInput | null>(null);

  if (editing) {
    return (
      <Editor
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={(saved) => {
          const exists = items.some((a) => a.id === saved.id);
          onChange(exists ? items.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...items]);
          setEditing(null);
        }}
      />
    );
  }

  const now = today();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-abu">
          {items.length} artikel · {items.filter((a) => a.published && a.tanggal <= now).length}{" "}
          terbit di <span className="font-mono">/artikel</span>
        </p>
        <Btn onClick={() => setEditing({ ...EMPTY, tanggal: today() })}>
          <Plus className="h-4 w-4" aria-hidden />
          Tulis artikel
        </Btn>
      </div>
      {items.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-10 text-center text-abu">
          Belum ada artikel. Panduan biaya & tips renovasi membantu calon klien menemukan Nandara
          Build lewat Google.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-full shrink-0 overflow-hidden rounded-md bg-pasir sm:w-32">
                {a.cover && (
                  <img src={mediaUrl(a.cover, 400)} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[1.0625rem] text-arang">{a.title}</p>
                <p className="mt-0.5 text-sm text-abu">
                  {a.kategori} · {a.tanggal}
                  {a.published && a.tanggal > now ? " · terjadwal" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PublishedBadge published={a.published} />
                <Btn
                  variant="ghost"
                  onClick={() =>
                    setEditing({ ...a, kategori: a.kategori as ArticleInput["kategori"] })
                  }
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                  Ubah
                </Btn>
                <Btn
                  variant="danger"
                  aria-label={`Hapus ${a.title}`}
                  onClick={async () => {
                    if (!confirm(`Hapus artikel "${a.title}"?`)) return;
                    await adminDeleteArticle({ data: { id: a.id } });
                    onChange(items.filter((x) => x.id !== a.id));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: ArticleInput;
  onCancel: () => void;
  onSaved: (a: Article) => void;
}) {
  const [f, setF] = useState<ArticleInput>(initial);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const uploaded = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const set = <K extends keyof ArticleInput>(k: K, v: ArticleInput[K]) =>
    setF((x) => ({ ...x, [k]: v }));

  function replaceCover(next: string) {
    if (f.cover) {
      if (uploaded.current.delete(f.cover))
        adminDeleteMedia({ data: { id: f.cover } }).catch(() => undefined);
      else removed.current.add(f.cover);
    }
    set("cover", next);
  }

  async function save() {
    const parsed = articleInputSchema.safeParse(f);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data belum lengkap");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await adminSaveArticle({ data: parsed.data });
      await Promise.all(
        [...removed.current].map((id) => adminDeleteMedia({ data: { id } }).catch(() => undefined)),
      );
      onSaved(saved);
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  async function cancel() {
    await Promise.all(
      [...uploaded.current].map((id) => adminDeleteMedia({ data: { id } }).catch(() => undefined)),
    );
    onCancel();
  }

  return (
    <div className="rounded-xl bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-normal text-arang">
          {initial.id ? "Ubah artikel" : "Artikel baru"}
        </h2>
        <button
          type="button"
          onClick={cancel}
          aria-label="Tutup"
          className="rounded-md p-2 hover:bg-pasir"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_12rem_11rem]">
        <Field label="Judul" className="md:col-span-3">
          <input
            className={inputCls}
            value={f.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="mis. Biaya Renovasi Kamar Mandi 2026: Rincian per Item"
          />
        </Field>
        <Field label="Kategori">
          <select
            className={inputCls}
            value={f.kategori}
            onChange={(e) => set("kategori", e.target.value as ArticleInput["kategori"])}
          >
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Tanggal terbit" hint="Tanggal depan = terjadwal">
          <input
            type="date"
            className={inputCls}
            value={f.tanggal}
            onChange={(e) => set("tanggal", e.target.value)}
          />
        </Field>
        <Field label="Slug URL" hint="Kosongkan = otomatis dari judul">
          <input
            className={`${inputCls} font-mono text-sm`}
            value={f.slug ?? ""}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>
        <Field
          label="Ringkasan"
          hint="1–2 kalimat; tampil di daftar artikel & hasil Google"
          className="md:col-span-3"
        >
          <textarea
            className={`${inputCls} h-auto py-2`}
            rows={2}
            maxLength={300}
            value={f.ringkasan}
            onChange={(e) => set("ringkasan", e.target.value)}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-arang">Foto sampul (opsional)</legend>
        <div className="flex items-center gap-4">
          <div className="h-24 w-40 overflow-hidden rounded-md bg-pasir">
            {f.cover && (
              <img src={mediaUrl(f.cover, 400)} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-pasir px-4 text-sm font-medium text-arang hover:bg-batu">
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {f.cover ? "Ganti foto" : "Pilih foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setBusy(true);
                try {
                  const id = await uploadImage(file);
                  uploaded.current.add(id);
                  replaceCover(id);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload gagal");
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          {f.cover && (
            <Btn variant="danger" onClick={() => replaceCover("")}>
              Hapus
            </Btn>
          )}
        </div>
      </fieldset>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-arang">Isi artikel</span>
          <div
            role="tablist"
            aria-label="Mode isi"
            className="flex rounded-md bg-pasir p-1 text-sm"
          >
            {[
              [false, "Tulis"],
              [true, "Pratinjau"],
            ].map(([mode, label]) => (
              <button
                key={String(label)}
                type="button"
                role="tab"
                aria-selected={preview === mode}
                onClick={() => setPreview(mode as boolean)}
                className={cn(
                  "rounded px-3 py-1.5",
                  preview === mode ? "bg-white text-arang" : "text-abu",
                )}
              >
                {mode ? <Eye className="mr-1 inline h-3.5 w-3.5" aria-hidden /> : null}
                {String(label)}
              </button>
            ))}
          </div>
        </div>
        {preview ? (
          <div className="mt-2 min-h-[24rem] rounded-md border border-batu p-5">
            {f.isi.trim() ? <RichText text={f.isi} /> : <p className="text-abu">Belum ada isi.</p>}
          </div>
        ) : (
          <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_17rem]">
            <textarea
              aria-label="Isi artikel"
              className={`${inputCls} h-auto min-h-[24rem] py-3 font-mono text-sm leading-relaxed`}
              value={f.isi}
              onChange={(e) => set("isi", e.target.value)}
              maxLength={30_000}
            />
            <div className="rounded-md bg-pasir p-4">
              <p className="text-sm font-medium text-arang">Format</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-beton">
                {CHEATSHEET}
              </pre>
            </div>
          </div>
        )}
      </div>

      <label className="mt-6 flex items-center gap-3 text-[0.9375rem] text-arang">
        <input
          type="checkbox"
          checked={f.published}
          onChange={(e) => set("published", e.target.checked)}
          className="h-5 w-5 accent-[var(--color-emas-ink)]"
        />
        Terbitkan di website
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Btn onClick={save} disabled={saving || busy}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Simpan artikel
        </Btn>
        <Btn variant="ghost" onClick={cancel} disabled={saving}>
          Batal
        </Btn>
      </div>
    </div>
  );
}
