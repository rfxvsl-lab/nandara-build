import { CheckCircle2, Loader2 } from "lucide-react";
import { useId, useMemo, useState, type FormEvent } from "react";

import { CONTACT } from "@/content/site";
import { track } from "@/lib/analytics";
import { JOB_OPTIONS, TIME_SLOTS, leadInputSchema } from "@/lib/leads";
import { submitLead } from "@/lib/leads.functions";
import { cn } from "@/lib/utils";

type Field = "nama" | "wa" | "kota";
type Errors = Partial<Record<Field, string>>;
type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; nama: string; waText: string }
  | { kind: "error"; message: string; waText: string };

function waHref(text: string) {
  return `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Form "Minta Survei Gratis": tersimpan ke database (Appwrite / lokal) lewat server function,
 * lalu klien bisa melanjutkan chat di WhatsApp dengan pesan yang sudah terisi.
 */
export function LeadForm({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const uid = useId();
  const dark = tone === "dark";
  const minDate = useMemo(tomorrowISO, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    const raw = {
      nama: String(fd.get("nama") ?? ""),
      wa: String(fd.get("wa") ?? ""),
      kota: String(fd.get("kota") ?? ""),
      jenis: String(fd.get("jenis") ?? ""),
      tanggal: String(fd.get("tanggal") ?? ""),
      waktu: String(fd.get("waktu") ?? ""),
      catatan: String(fd.get("catatan") ?? ""),
      website: String(fd.get("website") ?? ""),
      halaman: window.location.pathname,
    };

    const parsed = leadInputSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (["nama", "wa", "kota"].includes(key) && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    const d = parsed.data;
    const waText =
      `Halo Nandara Build, saya baru mengisi form survei di website.\n` +
      `• Nama: ${d.nama}\n• Lokasi: ${d.kota}\n• Pekerjaan: ${d.jenis}` +
      (d.tanggal ? `\n• Jadwal survei: ${d.tanggal}${d.waktu ? `, ${d.waktu}` : ""}` : "") +
      (d.catatan ? `\n• Catatan: ${d.catatan}` : "");

    setState({ kind: "sending" });
    try {
      const res = await submitLead({ data: parsed.data });
      if (res.ok) {
        track("submit_form", { jenis: d.jenis });
        setState({ kind: "done", nama: d.nama, waText });
      } else {
        setState({ kind: "error", message: res.error, waText });
      }
    } catch {
      setState({
        kind: "error",
        message: "Koneksi bermasalah. Silakan kirim lewat WhatsApp.",
        waText,
      });
    }
  }

  if (state.kind === "done") {
    return (
      <div
        role="status"
        className={cn(
          "rounded-xl p-6 sm:p-8",
          dark ? "bg-kapur/10 text-kapur" : "bg-pasir text-arang",
        )}
      >
        <CheckCircle2 className="h-8 w-8 text-emas-ink" aria-hidden />
        <h3 className="mt-4 text-2xl font-normal tracking-[-0.01em]">
          Terima kasih, {state.nama.split(" ")[0]}.
        </h3>
        <p
          className={cn(
            "mt-2 text-[0.9375rem] leading-relaxed",
            dark ? "text-kapur/80" : "text-abu",
          )}
        >
          Data Anda sudah kami terima. Tim kami akan menghubungi Anda lewat WhatsApp untuk
          memastikan jadwal survei. Ingin lebih cepat? Lanjutkan chat sekarang.
        </p>
        <a
          href={waHref(state.waText)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-emas px-6 text-[0.9375rem] font-medium text-arang hover:bg-emas-muda"
        >
          Lanjutkan chat di WhatsApp
        </a>
      </div>
    );
  }

  const labelCls = cn("mb-2 block text-sm font-medium", dark ? "text-kapur" : "text-arang");
  const inputCls = (err?: string) =>
    cn(
      "h-12 w-full rounded-md border bg-white px-4 text-base text-arang placeholder:text-abu/70",
      err ? "border-danger" : "border-batu",
    );
  const errCls = cn("mt-1.5 text-sm", dark ? "text-[#f2b8b5]" : "text-danger");
  const sending = state.kind === "sending";

  const textField = (name: Field, label: string, props: Record<string, string> = {}) => (
    <div>
      <label htmlFor={`${uid}-${name}`} className={labelCls}>
        {label}
      </label>
      <input
        id={`${uid}-${name}`}
        name={name}
        className={inputCls(errors[name])}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${uid}-${name}-err` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`${uid}-${name}-err`} className={errCls}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-5 sm:grid-cols-2">
      {textField("nama", "Nama", { autoComplete: "name" })}
      {textField("wa", "No. WhatsApp", {
        type: "tel",
        inputMode: "tel",
        autoComplete: "tel",
        placeholder: "08xx-xxxx-xxxx",
      })}
      {textField("kota", "Kota / lokasi proyek", {
        autoComplete: "address-level2",
        placeholder: "mis. Sidoarjo",
      })}
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

      <fieldset className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
        <legend className={cn(labelCls, "mb-3")}>
          Jadwal survei yang Anda inginkan{" "}
          <span className={dark ? "font-normal text-kapur/60" : "font-normal text-abu"}>
            (opsional)
          </span>
        </legend>
        <div>
          <label htmlFor={`${uid}-tanggal`} className="sr-only">
            Tanggal survei
          </label>
          <input
            id={`${uid}-tanggal`}
            name="tanggal"
            type="date"
            min={minDate}
            className={inputCls()}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-waktu`} className="sr-only">
            Waktu survei
          </label>
          <select id={`${uid}-waktu`} name="waktu" className={inputCls()} defaultValue="">
            <option value="">Pilih waktu</option>
            {TIME_SLOTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </fieldset>

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
          maxLength={1000}
          placeholder="mis. renovasi dapur & kamar mandi, budget ±150 jt"
          className="w-full rounded-md border border-batu bg-white px-4 py-3 text-base text-arang placeholder:text-abu/70"
        />
      </div>

      {/* Honeypot anti-spam: tersembunyi dari manusia */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.kind === "error" && (
        <div role="alert" className="rounded-md bg-danger/10 p-4 text-sm text-danger sm:col-span-2">
          {state.message}{" "}
          <a
            href={waHref(state.waText)}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline"
          >
            Kirim via WhatsApp
          </a>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn("text-sm", dark ? "text-kapur/60" : "text-abu")}>
          Data Anda hanya dipakai untuk menghubungi Anda soal survei.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emas px-6 text-[0.9375rem] font-medium text-arang transition-colors hover:bg-emas-muda disabled:opacity-70"
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {sending ? "Mengirim…" : "Minta Survei Gratis"}
        </button>
      </div>
    </form>
  );
}
