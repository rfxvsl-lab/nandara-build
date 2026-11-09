import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

import {
  PROJECT_TYPES,
  coverImage,
  mediaUrl,
  projectInputSchema,
  type ImageRole,
  type Project,
  type ProjectImage,
  type ProjectInput,
} from "@/lib/content-types";
import { adminDeleteMedia, adminDeleteProject, adminSaveProject } from "@/lib/content.functions";

import { Btn, Field, PublishedBadge, inputCls } from "./ui";
import { uploadImage } from "./upload";

const EMPTY: ProjectInput = {
  title: "",
  slug: "",
  kota: "",
  jenis: "Renovasi rumah",
  luas: "",
  durasi: "",
  tahun: String(new Date().getFullYear()),
  ringkasan: "",
  deskripsi: "",
  images: [],
  published: false,
  urutan: 0,
};

const ROLES: { role: ImageRole; label: string; hint: string }[] = [
  { role: "sebelum", label: "Foto sebelum", hint: "Kondisi awal" },
  { role: "sesudah", label: "Foto sesudah", hint: "Hasil akhir. Foto pertama jadi sampul." },
  { role: "galeri", label: "Galeri & proses", hint: "Foto proses, detail, sudut lain" },
];

export function ProjectsAdmin({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}) {
  const [editing, setEditing] = useState<ProjectInput | null>(null);

  if (editing) {
    return (
      <ProjectEditor
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={(saved) => {
          const exists = projects.some((p) => p.id === saved.id);
          onChange(
            exists ? projects.map((p) => (p.id === saved.id ? saved : p)) : [...projects, saved],
          );
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-abu">
          {projects.length} proyek · {projects.filter((p) => p.published).length} tampil di website
        </p>
        <Btn onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="h-4 w-4" aria-hidden />
          Tambah proyek
        </Btn>
      </div>

      {projects.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-10 text-center text-abu">
          Belum ada proyek. Klik <strong>Tambah proyek</strong> untuk mengisi portofolio.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const cover = coverImage(p);
            return (
              <li key={p.id} className="overflow-hidden rounded-xl bg-white">
                <div className="aspect-[4/3] bg-pasir">
                  {cover ? (
                    <img
                      src={mediaUrl(cover.id, 800)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-abu">
                      Belum ada foto
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[1.0625rem] leading-snug text-arang">{p.title}</p>
                    <PublishedBadge published={p.published} />
                  </div>
                  <p className="mt-1 text-sm text-abu">
                    {[p.jenis, p.kota, p.tahun].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Btn
                      variant="ghost"
                      onClick={() => setEditing({ ...p, jenis: p.jenis as ProjectInput["jenis"] })}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      Ubah
                    </Btn>
                    <Btn
                      variant="danger"
                      onClick={async () => {
                        if (!confirm(`Hapus proyek "${p.title}" beserta fotonya?`)) return;
                        await adminDeleteProject({ data: { id: p.id } });
                        onChange(projects.filter((x) => x.id !== p.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Hapus
                    </Btn>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ProjectEditor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: ProjectInput;
  onCancel: () => void;
  onSaved: (p: Project) => void;
}) {
  const [form, setForm] = useState<ProjectInput>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Foto baru diunggah di sesi ini (dihapus bila batal) & foto lama yang dihapus (dihapus saat simpan).
  const uploaded = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    const parsed = projectInputSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data belum lengkap");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await adminSaveProject({ data: parsed.data });
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
          {initial.id ? "Ubah proyek" : "Proyek baru"}
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

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Judul proyek" className="md:col-span-2">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="mis. Renovasi Rumah 2 Lantai Pak Budi"
          />
        </Field>
        <Field label="Jenis pekerjaan">
          <select
            className={inputCls}
            value={form.jenis}
            onChange={(e) => set("jenis", e.target.value as ProjectInput["jenis"])}
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Kota / lokasi">
          <input
            className={inputCls}
            value={form.kota}
            onChange={(e) => set("kota", e.target.value)}
            placeholder="mis. Sidoarjo"
          />
        </Field>
        <Field label="Luas" hint="mis. 120 m²">
          <input
            className={inputCls}
            value={form.luas}
            onChange={(e) => set("luas", e.target.value)}
          />
        </Field>
        <Field label="Durasi pengerjaan" hint="mis. 4 bulan">
          <input
            className={inputCls}
            value={form.durasi}
            onChange={(e) => set("durasi", e.target.value)}
          />
        </Field>
        <Field label="Tahun selesai">
          <input
            className={inputCls}
            value={form.tahun}
            onChange={(e) => set("tahun", e.target.value)}
            inputMode="numeric"
          />
        </Field>
        <Field label="Urutan tampil" hint="Angka kecil tampil lebih dulu">
          <input
            className={inputCls}
            type="number"
            min={0}
            value={form.urutan}
            onChange={(e) => set("urutan", Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
        <Field
          label="Ringkasan"
          hint="1–2 kalimat, tampil di kartu portofolio"
          className="md:col-span-2"
        >
          <textarea
            className={`${inputCls} h-auto py-2`}
            rows={2}
            maxLength={500}
            value={form.ringkasan}
            onChange={(e) => set("ringkasan", e.target.value)}
          />
        </Field>
        <Field
          label="Cerita proyek"
          hint="Kebutuhan klien, solusi, hasil. Boleh beberapa paragraf."
          className="md:col-span-2"
        >
          <textarea
            className={`${inputCls} h-auto py-2`}
            rows={6}
            maxLength={5000}
            value={form.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-8 space-y-6">
        {ROLES.map((r) => (
          <ImageGroup
            key={r.role}
            label={r.label}
            hint={r.hint}
            images={form.images.filter((i) => i.role === r.role)}
            onAdd={(img) => {
              uploaded.current.add(img.id);
              setForm((f) => ({ ...f, images: [...f.images, img] }));
            }}
            onAlt={(id, alt) =>
              setForm((f) => ({
                ...f,
                images: f.images.map((i) => (i.id === id ? { ...i, alt } : i)),
              }))
            }
            onRemove={(id) => {
              if (!uploaded.current.delete(id)) removed.current.add(id);
              else adminDeleteMedia({ data: { id } }).catch(() => undefined);
              setForm((f) => ({ ...f, images: f.images.filter((i) => i.id !== id) }));
            }}
            role={r.role}
          />
        ))}
      </div>

      <label className="mt-8 flex items-center gap-3 text-[0.9375rem] text-arang">
        <input
          type="checkbox"
          checked={form.published}
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
          Simpan proyek
        </Btn>
        <Btn variant="ghost" onClick={cancel} disabled={saving}>
          Batal
        </Btn>
      </div>
    </div>
  );
}

function ImageGroup({
  label,
  hint,
  role,
  images,
  onAdd,
  onAlt,
  onRemove,
}: {
  label: string;
  hint: string;
  role: ImageRole;
  images: ProjectImage[];
  onAdd: (img: ProjectImage) => void;
  onAlt: (id: string, alt: string) => void;
  onRemove: (id: string) => void;
}) {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = [...files];
    setBusy((b) => b + list.length);
    for (const file of list) {
      try {
        const id = await uploadImage(file);
        onAdd({ id, role, alt: "" });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload gagal");
      } finally {
        setBusy((b) => b - 1);
      }
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-arang">{label}</legend>
      <p className="text-xs text-abu">{hint}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-lg border border-batu">
            <div className="relative aspect-[4/3] bg-pasir">
              <img src={mediaUrl(img.id, 400)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(img.id)}
                aria-label="Hapus foto"
                className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-arang/80 text-kapur hover:bg-arang"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              aria-label="Keterangan foto"
              value={img.alt}
              onChange={(e) => onAlt(img.id, e.target.value)}
              placeholder="Keterangan foto"
              maxLength={200}
              className="w-full border-t border-batu px-2 py-1.5 text-xs"
            />
          </div>
        ))}
        <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-batu text-sm text-abu hover:border-emas-ink hover:text-arang">
          <span className="flex flex-col items-center gap-1">
            {busy > 0 ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
            {busy > 0 ? `Mengunggah ${busy}…` : "Tambah foto"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => {
              void onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </fieldset>
  );
}
