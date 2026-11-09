import { useId, useState, type FormEvent } from "react";

import { CONTACT } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const JOB_OPTIONS = [
  "Bangun rumah baru",
  "Renovasi rumah",
  "Desain arsitektur saja",
  "Perencanaan & RAB saja",
  "Lainnya",
] as const;

type Errors = Partial<Record<"nama" | "wa" | "kota", string>>;

/**
 * Form "Minta Survei Gratis" (design.md §5.6).
 * Sementara belum ada backend: data dikirim sebagai pesan WhatsApp yang sudah terisi.
 */
export function LeadForm({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();
  const dark = tone === "dark";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nama = String(data.get("nama") ?? "").trim();
    const wa = String(data.get("wa") ?? "").replace(/\D/g, "");
    const kota = String(data.get("kota") ?? "").trim();
    const jenis = String(data.get("jenis") ?? "");
    const catatan = String(data.get("catatan") ?? "").trim();

    const next: Errors = {};
    if (nama.length < 2) next.nama = "Mohon isi nama Anda.";
    if (wa.length < 10) next.wa = "Nomor WhatsApp minimal 10 digit.";
    if (kota.length < 2) next.kota = "Mohon isi kota/lokasi proyek.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const text =
      `Halo Nandara Build, saya ingin minta survei gratis.\n` +
      `• Nama: ${nama}\n• No. WA: ${wa}\n• Lokasi: ${kota}\n• Pekerjaan: ${jenis}` +
      (catatan ? `\n• Catatan: ${catatan}` : "");
    track("submit_form", { jenis });
    window.open(
      `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
  }

  const labelCls = cn("mb-2 block text-sm font-semibold", dark ? "text-kapur" : "text-arang");
  const inputCls = (err?: string) =>
    cn(
      "h-12 w-full rounded-sm border bg-white px-4 text-base text-arang placeholder:text-abu/70",
      err ? "border-danger" : dark ? "border-transparent" : "border-arang/40",
    );
  const errCls = cn("mt-1.5 text-sm", dark ? "text-[#f2b8b5]" : "text-danger");

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-nama`} className={labelCls}>
          Nama
        </label>
        <input
          id={`${uid}-nama`}
          name="nama"
          autoComplete="name"
          className={inputCls(errors.nama)}
          aria-invalid={!!errors.nama}
          aria-describedby={errors.nama ? `${uid}-nama-err` : undefined}
        />
        {errors.nama && (
          <p id={`${uid}-nama-err`} className={errCls}>
            {errors.nama}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${uid}-wa`} className={labelCls}>
          No. WhatsApp
        </label>
        <input
          id={`${uid}-wa`}
          name="wa"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08xx-xxxx-xxxx"
          className={inputCls(errors.wa)}
          aria-invalid={!!errors.wa}
          aria-describedby={errors.wa ? `${uid}-wa-err` : undefined}
        />
        {errors.wa && (
          <p id={`${uid}-wa-err`} className={errCls}>
            {errors.wa}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${uid}-kota`} className={labelCls}>
          Kota / lokasi proyek
        </label>
        <input
          id={`${uid}-kota`}
          name="kota"
          autoComplete="address-level2"
          placeholder="mis. Sidoarjo"
          className={inputCls(errors.kota)}
          aria-invalid={!!errors.kota}
          aria-describedby={errors.kota ? `${uid}-kota-err` : undefined}
        />
        {errors.kota && (
          <p id={`${uid}-kota-err`} className={errCls}>
            {errors.kota}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${uid}-jenis`} className={labelCls}>
          Jenis pekerjaan
        </label>
        <select
          id={`${uid}-jenis`}
          name="jenis"
          className={inputCls()}
          defaultValue={JOB_OPTIONS[1]}
        >
          {JOB_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-catatan`} className={labelCls}>
          Catatan{" "}
          <span className={dark ? "font-normal text-kapur/60" : "font-normal text-abu"}>
            (opsional)
          </span>
        </label>
        <textarea
          id={`${uid}-catatan`}
          name="catatan"
          rows={3}
          placeholder="mis. renovasi dapur & kamar mandi, budget ±150 jt"
          className={cn(
            "w-full rounded-sm border bg-white px-4 py-3 text-base text-arang placeholder:text-abu/70",
            dark ? "border-transparent" : "border-arang/40",
          )}
        />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn("text-sm", dark ? "text-kapur/60" : "text-abu")}>
          Data Anda terkirim sebagai pesan WhatsApp ke kami.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-emas px-5 text-[0.9375rem] font-semibold text-arang transition-colors hover:bg-emas-muda"
        >
          Kirim lewat WhatsApp
        </button>
      </div>
    </form>
  );
}
