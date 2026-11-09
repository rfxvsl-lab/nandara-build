import { Copy, FileText, ImagePlus, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

import { WhatsAppIcon } from "@/components/site/whatsapp-float";
import { getPricing } from "@/lib/content.functions";
import { toIntlPhone } from "@/lib/leads";
import {
  adminDeleteClientProject,
  adminDeletePrivateFile,
  adminSaveClientProject,
} from "@/lib/portal.functions";
import {
  DOC_TYPES,
  PAY_STATUS,
  PAY_STATUS_LABEL,
  PROJECT_STATUS,
  PROJECT_STATUS_LABEL,
  STAGE_STATUS,
  STAGE_STATUS_LABEL,
  clientProjectSchema,
  portalFileUrl,
  type ClientProject,
  type ClientProjectInput,
} from "@/lib/portal-types";
import { formatRupiah } from "@/lib/utils";

import { Btn, Field, inputCls } from "./ui";
import { uploadDocument, uploadImage } from "./upload";

const today = () => new Date().toISOString().slice(0, 10);

const STANDARD_STAGES = [
  "Persiapan & pembongkaran",
  "Pekerjaan struktur",
  "Pekerjaan atap",
  "Dinding & plester",
  "Instalasi listrik & air",
  "Finishing (lantai, cat, kusen)",
  "Serah terima",
];

const EMPTY: ClientProjectInput = {
  namaKlien: "",
  waKlien: "",
  judul: "",
  lokasi: "",
  mulai: "",
  target: "",
  nilaiKontrak: 0,
  progres: 0,
  status: "persiapan",
  tahapan: [],
  termin: [],
  laporan: [],
  dokumen: [],
  aktif: true,
};

function accessMessage(p: ClientProject) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return (
    `Halo ${p.namaKlien}, berikut akses *Pantau Proyek* Nandara Build untuk "${p.judul}":\n\n` +
    `${origin}/pantau\nKode akses: *${p.kode}*\n\n` +
    `Masuk dengan kode di atas dan 4 digit terakhir nomor WhatsApp Anda. ` +
    `Di sana Anda bisa melihat progres, foto laporan, termin pembayaran, dan dokumen proyek.`
  );
}

export function ClientProjectsAdmin({
  items,
  onChange,
}: {
  items: ClientProject[];
  onChange: (items: ClientProject[]) => void;
}) {
  const [editing, setEditing] = useState<ClientProjectInput | null>(null);
  const [copied, setCopied] = useState("");

  if (editing) {
    return (
      <Editor
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={(saved) => {
          const exists = items.some((p) => p.id === saved.id);
          onChange(exists ? items.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...items]);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-abu">
          {items.length} proyek · klien memantau lewat <span className="font-mono">/pantau</span>
        </p>
        <Btn onClick={() => setEditing({ ...EMPTY, mulai: today() })}>
          <Plus className="h-4 w-4" aria-hidden />
          Proyek berjalan baru
        </Btn>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-10 text-center text-abu">
          Belum ada proyek berjalan. Buat satu setelah SPK ditandatangani, lalu kirim kode aksesnya
          ke klien.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((p) => (
            <li key={p.id} className="rounded-xl bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-lg text-arang">{p.judul}</p>
                  <p className="mt-0.5 text-sm text-abu">
                    {p.namaKlien} · {PROJECT_STATUS_LABEL[p.status]}
                    {!p.aktif && " · akses dinonaktifkan"}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 w-48 overflow-hidden rounded-full bg-pasir">
                      <div className="h-full bg-emas" style={{ width: `${p.progres}%` }} />
                    </div>
                    <span className="font-mono text-sm text-beton">{p.progres}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-pasir px-3 py-2 font-mono text-sm tracking-wider text-arang">
                    {p.kode}
                  </span>
                  <Btn
                    variant="ghost"
                    onClick={async () => {
                      await navigator.clipboard.writeText(accessMessage(p));
                      setCopied(p.id);
                      setTimeout(() => setCopied(""), 2000);
                    }}
                  >
                    <Copy className="h-4 w-4" aria-hidden />
                    {copied === p.id ? "Tersalin" : "Salin akses"}
                  </Btn>
                  <a
                    href={`https://wa.me/${toIntlPhone(p.waKlien)}?text=${encodeURIComponent(accessMessage(p))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-md bg-pasir px-4 text-sm font-medium text-arang hover:bg-batu"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                    Kirim akses
                  </a>
                  <Btn variant="ghost" onClick={() => setEditing({ ...p })}>
                    <Pencil className="h-4 w-4" aria-hidden />
                    Ubah
                  </Btn>
                  <Btn
                    variant="danger"
                    aria-label={`Hapus ${p.judul}`}
                    onClick={async () => {
                      if (!confirm(`Hapus proyek "${p.judul}" beserta foto & dokumennya?`)) return;
                      await adminDeleteClientProject({ data: { id: p.id } });
                      onChange(items.filter((x) => x.id !== p.id));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Btn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="border-t border-batu pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg text-arang">{title}</h3>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Editor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: ClientProjectInput;
  onCancel: () => void;
  onSaved: (p: ClientProject) => void;
}) {
  const [f, setF] = useState<ClientProjectInput>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const uploaded = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());

  const set = <K extends keyof ClientProjectInput>(k: K, v: ClientProjectInput[K]) =>
    setF((x) => ({ ...x, [k]: v }));
  const dropFile = (id: string) => {
    if (uploaded.current.delete(id))
      adminDeletePrivateFile({ data: { id } }).catch(() => undefined);
    else removed.current.add(id);
  };

  async function save() {
    const parsed = clientProjectSchema.safeParse(f);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data belum lengkap");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await adminSaveClientProject({ data: parsed.data });
      await Promise.all(
        [...removed.current].map((id) =>
          adminDeletePrivateFile({ data: { id } }).catch(() => undefined),
        ),
      );
      onSaved(saved);
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  async function cancel() {
    await Promise.all(
      [...uploaded.current].map((id) =>
        adminDeletePrivateFile({ data: { id } }).catch(() => undefined),
      ),
    );
    onCancel();
  }

  async function fillTermin() {
    if (!f.nilaiKontrak) {
      setError("Isi nilai kontrak dulu untuk menghitung termin.");
      return;
    }
    const pricing = await getPricing();
    set(
      "termin",
      pricing.termin.map((t) => ({
        label: t.label,
        nominal: Math.round((f.nilaiKontrak * t.persen) / 100),
        status: "belum" as const,
        tanggal: "",
      })),
    );
  }

  async function addPhotos(reportIndex: number, files: FileList | null) {
    if (!files?.length) return;
    setBusy(`laporan-${reportIndex}`);
    setError("");
    try {
      for (const file of [...files]) {
        const id = await uploadImage(file, "private");
        uploaded.current.add(id);
        setF((x) => ({
          ...x,
          laporan: x.laporan.map((l, i) =>
            i === reportIndex ? { ...l, foto: [...l.foto, id] } : l,
          ),
        }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setBusy("");
    }
  }

  async function addDocs(files: FileList | null) {
    if (!files?.length) return;
    setBusy("dokumen");
    setError("");
    try {
      for (const file of [...files]) {
        const { id, mime } = await uploadDocument(file);
        uploaded.current.add(id);
        const nama = file.name.replace(/\.[^.]+$/, "").slice(0, 150) || "Dokumen";
        const jenis = /rab/i.test(nama) ? "RAB" : /spk/i.test(nama) ? "SPK" : "Lainnya";
        setF((x) => ({ ...x, dokumen: [...x.dokumen, { id, nama, jenis, mime }] }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setBusy("");
    }
  }

  const totalTermin = f.termin.reduce((s, t) => s + t.nominal, 0);

  return (
    <div className="rounded-xl bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-normal text-arang">
          {initial.id ? "Ubah proyek berjalan" : "Proyek berjalan baru"}
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

      <div className="mt-6 space-y-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Judul proyek" className="md:col-span-2">
            <input
              className={inputCls}
              value={f.judul}
              onChange={(e) => set("judul", e.target.value)}
              placeholder="mis. Renovasi Rumah Jl. Melati 12"
            />
          </Field>
          <Field label="Nama klien">
            <input
              className={inputCls}
              value={f.namaKlien}
              onChange={(e) => set("namaKlien", e.target.value)}
            />
          </Field>
          <Field label="No. WhatsApp klien" hint="4 digit terakhirnya dipakai klien untuk masuk">
            <input
              className={inputCls}
              value={f.waKlien}
              inputMode="tel"
              onChange={(e) => set("waKlien", e.target.value)}
              placeholder="08xx-xxxx-xxxx"
            />
          </Field>
          <Field label="Lokasi" className="md:col-span-2">
            <input
              className={inputCls}
              value={f.lokasi}
              onChange={(e) => set("lokasi", e.target.value)}
            />
          </Field>
          <Field label="Tanggal mulai">
            <input
              type="date"
              className={inputCls}
              value={f.mulai}
              onChange={(e) => set("mulai", e.target.value)}
            />
          </Field>
          <Field label="Target selesai">
            <input
              type="date"
              className={inputCls}
              value={f.target}
              onChange={(e) => set("target", e.target.value)}
            />
          </Field>
          <Field
            label="Nilai kontrak (Rp)"
            hint={f.nilaiKontrak ? formatRupiah(f.nilaiKontrak) : "Sesuai SPK"}
          >
            <input
              className={`${inputCls} tabular`}
              inputMode="numeric"
              value={f.nilaiKontrak || ""}
              onChange={(e) => set("nilaiKontrak", Number(e.target.value.replace(/\D/g, "")) || 0)}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputCls}
              value={f.status}
              onChange={(e) => set("status", e.target.value as ClientProjectInput["status"])}
            >
              {PROJECT_STATUS.map((s) => (
                <option key={s} value={s}>
                  {PROJECT_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Progres keseluruhan: ${f.progres}%`} className="md:col-span-2">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={f.progres}
              onChange={(e) => set("progres", Number(e.target.value))}
              className="w-full accent-[var(--color-emas-ink)]"
            />
          </Field>
        </div>

        <Section
          title="Tahapan pekerjaan"
          action={
            f.tahapan.length === 0 && (
              <Btn
                variant="ghost"
                onClick={() =>
                  set(
                    "tahapan",
                    STANDARD_STAGES.map((nama) => ({ nama, status: "belum", tanggal: "" })),
                  )
                }
              >
                Isi tahapan standar
              </Btn>
            )
          }
        >
          <div className="space-y-2">
            {f.tahapan.map((t, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_10rem_10rem_auto]">
                <input
                  aria-label={`Tahapan ${i + 1}`}
                  className={inputCls}
                  value={t.nama}
                  onChange={(e) =>
                    set(
                      "tahapan",
                      f.tahapan.map((x, k) => (k === i ? { ...x, nama: e.target.value } : x)),
                    )
                  }
                />
                <select
                  aria-label={`Status tahapan ${i + 1}`}
                  className={inputCls}
                  value={t.status}
                  onChange={(e) =>
                    set(
                      "tahapan",
                      f.tahapan.map((x, k) =>
                        k === i ? { ...x, status: e.target.value as typeof t.status } : x,
                      ),
                    )
                  }
                >
                  {STAGE_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {STAGE_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Tanggal tahapan ${i + 1}`}
                  type="date"
                  className={inputCls}
                  value={t.tanggal}
                  onChange={(e) =>
                    set(
                      "tahapan",
                      f.tahapan.map((x, k) => (k === i ? { ...x, tanggal: e.target.value } : x)),
                    )
                  }
                />
                <Btn
                  variant="danger"
                  aria-label={`Hapus tahapan ${i + 1}`}
                  onClick={() =>
                    set(
                      "tahapan",
                      f.tahapan.filter((_, k) => k !== i),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            ))}
          </div>
          <Btn
            variant="ghost"
            className="mt-3"
            onClick={() =>
              set("tahapan", [...f.tahapan, { nama: "", status: "belum", tanggal: "" }])
            }
          >
            <Plus className="h-4 w-4" aria-hidden /> Tambah tahapan
          </Btn>
        </Section>

        <Section
          title="Termin pembayaran"
          action={
            <Btn variant="ghost" onClick={fillTermin}>
              Hitung dari skema termin
            </Btn>
          }
        >
          <div className="space-y-2">
            {f.termin.map((t, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_10rem_12rem_10rem_auto]">
                <input
                  aria-label={`Termin ${i + 1}`}
                  className={inputCls}
                  value={t.label}
                  onChange={(e) =>
                    set(
                      "termin",
                      f.termin.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)),
                    )
                  }
                />
                <input
                  aria-label={`Nominal termin ${i + 1}`}
                  className={`${inputCls} tabular`}
                  inputMode="numeric"
                  value={t.nominal || ""}
                  onChange={(e) =>
                    set(
                      "termin",
                      f.termin.map((x, k) =>
                        k === i
                          ? { ...x, nominal: Number(e.target.value.replace(/\D/g, "")) || 0 }
                          : x,
                      ),
                    )
                  }
                />
                <select
                  aria-label={`Status termin ${i + 1}`}
                  className={inputCls}
                  value={t.status}
                  onChange={(e) =>
                    set(
                      "termin",
                      f.termin.map((x, k) =>
                        k === i ? { ...x, status: e.target.value as typeof t.status } : x,
                      ),
                    )
                  }
                >
                  {PAY_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {PAY_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Tanggal termin ${i + 1}`}
                  type="date"
                  className={inputCls}
                  value={t.tanggal}
                  onChange={(e) =>
                    set(
                      "termin",
                      f.termin.map((x, k) => (k === i ? { ...x, tanggal: e.target.value } : x)),
                    )
                  }
                />
                <Btn
                  variant="danger"
                  aria-label={`Hapus termin ${i + 1}`}
                  onClick={() =>
                    set(
                      "termin",
                      f.termin.filter((_, k) => k !== i),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <Btn
              variant="ghost"
              onClick={() =>
                set("termin", [
                  ...f.termin,
                  { label: "", nominal: 0, status: "belum", tanggal: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" aria-hidden /> Tambah termin
            </Btn>
            {f.termin.length > 0 && (
              <p
                className={`tabular text-sm ${f.nilaiKontrak && totalTermin !== f.nilaiKontrak ? "text-danger" : "text-abu"}`}
              >
                Total termin {formatRupiah(totalTermin)}
                {f.nilaiKontrak && totalTermin !== f.nilaiKontrak
                  ? " (beda dengan nilai kontrak)"
                  : ""}
              </p>
            )}
          </div>
        </Section>

        <Section
          title="Laporan progres"
          action={
            <Btn
              variant="ghost"
              onClick={() =>
                set("laporan", [
                  { id: crypto.randomUUID(), tanggal: today(), judul: "", catatan: "", foto: [] },
                  ...f.laporan,
                ])
              }
            >
              <Plus className="h-4 w-4" aria-hidden /> Tambah laporan
            </Btn>
          }
        >
          {f.laporan.length === 0 && (
            <p className="text-sm text-abu">
              Belum ada laporan. Tambahkan foto & catatan progres mingguan.
            </p>
          )}
          <div className="space-y-4">
            {f.laporan.map((l, i) => (
              <div key={l.id} className="rounded-lg border border-batu p-4">
                <div className="grid gap-3 sm:grid-cols-[10rem_1fr_auto]">
                  <input
                    aria-label={`Tanggal laporan ${i + 1}`}
                    type="date"
                    className={inputCls}
                    value={l.tanggal}
                    onChange={(e) =>
                      set(
                        "laporan",
                        f.laporan.map((x, k) => (k === i ? { ...x, tanggal: e.target.value } : x)),
                      )
                    }
                  />
                  <input
                    aria-label={`Judul laporan ${i + 1}`}
                    className={inputCls}
                    placeholder="mis. Minggu 3: pengecoran dak"
                    value={l.judul}
                    onChange={(e) =>
                      set(
                        "laporan",
                        f.laporan.map((x, k) => (k === i ? { ...x, judul: e.target.value } : x)),
                      )
                    }
                  />
                  <Btn
                    variant="danger"
                    aria-label={`Hapus laporan ${i + 1}`}
                    onClick={() => {
                      l.foto.forEach(dropFile);
                      set(
                        "laporan",
                        f.laporan.filter((_, k) => k !== i),
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Btn>
                </div>
                <textarea
                  aria-label={`Catatan laporan ${i + 1}`}
                  className={`${inputCls} mt-3 h-auto py-2`}
                  rows={3}
                  placeholder="Pekerjaan minggu ini, kendala, rencana minggu depan"
                  value={l.catatan}
                  onChange={(e) =>
                    set(
                      "laporan",
                      f.laporan.map((x, k) => (k === i ? { ...x, catatan: e.target.value } : x)),
                    )
                  }
                />
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {l.foto.map((id) => (
                    <div
                      key={id}
                      className="relative aspect-square overflow-hidden rounded-md bg-pasir"
                    >
                      <img
                        src={portalFileUrl(id, { w: 400 })}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Hapus foto"
                        onClick={() => {
                          dropFile(id);
                          set(
                            "laporan",
                            f.laporan.map((x, k) =>
                              k === i ? { ...x, foto: x.foto.filter((p) => p !== id) } : x,
                            ),
                          );
                        }}
                        className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-arang/80 text-kapur"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <label className="grid aspect-square cursor-pointer place-items-center rounded-md border-2 border-dashed border-batu text-xs text-abu hover:border-emas-ink">
                    {busy === `laporan-${i}` ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ImagePlus className="h-5 w-5" />
                    )}
                    <span className="sr-only">Tambah foto laporan</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        void addPhotos(i, e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Dokumen"
          action={
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-pasir px-4 text-sm font-medium text-arang hover:bg-batu">
              {busy === "dokumen" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Unggah dokumen
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => {
                  void addDocs(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          }
        >
          {f.dokumen.length === 0 && (
            <p className="text-sm text-abu">
              RAB, SPK, gambar kerja, berita acara (PDF atau foto, maks. 15 MB).
            </p>
          )}
          <div className="space-y-2">
            {f.dokumen.map((d, i) => (
              <div
                key={d.id}
                className="grid items-center gap-2 sm:grid-cols-[auto_1fr_11rem_auto]"
              >
                <FileText className="hidden h-5 w-5 text-emas-ink sm:block" aria-hidden />
                <input
                  aria-label={`Nama dokumen ${i + 1}`}
                  className={inputCls}
                  value={d.nama}
                  onChange={(e) =>
                    set(
                      "dokumen",
                      f.dokumen.map((x, k) => (k === i ? { ...x, nama: e.target.value } : x)),
                    )
                  }
                />
                <select
                  aria-label={`Jenis dokumen ${i + 1}`}
                  className={inputCls}
                  value={d.jenis}
                  onChange={(e) =>
                    set(
                      "dokumen",
                      f.dokumen.map((x, k) =>
                        k === i ? { ...x, jenis: e.target.value as typeof d.jenis } : x,
                      ),
                    )
                  }
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <Btn
                  variant="danger"
                  aria-label={`Hapus dokumen ${i + 1}`}
                  onClick={() => {
                    dropFile(d.id);
                    set(
                      "dokumen",
                      f.dokumen.filter((_, k) => k !== i),
                    );
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            ))}
          </div>
        </Section>

        <label className="flex items-center gap-3 border-t border-batu pt-6 text-[0.9375rem] text-arang">
          <input
            type="checkbox"
            checked={f.aktif}
            onChange={(e) => set("aktif", e.target.checked)}
            className="h-5 w-5 accent-[var(--color-emas-ink)]"
          />
          Akses portal klien aktif
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Btn onClick={save} disabled={saving || !!busy}>
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
