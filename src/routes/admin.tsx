import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Download, Loader2, LogOut, Search } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { ClientProjectsAdmin } from "@/components/admin/client-projects-admin";
import { PricingAdmin } from "@/components/admin/pricing-admin";
import { ProjectsAdmin } from "@/components/admin/projects-admin";
import { TestimonialsAdmin } from "@/components/admin/testimonials-admin";

import { Wordmark } from "@/components/site/header";
import { WhatsAppIcon } from "@/components/site/whatsapp-float";
import { LEAD_STATUSES, STATUS_LABEL, toIntlPhone, type Lead, type LeadStatus } from "@/lib/leads";
import type { Project, Testimonial } from "@/lib/content-types";
import { adminListContent, getPricing } from "@/lib/content.functions";
import type { PricingSettings } from "@/lib/pricing";
import type { ClientProject } from "@/lib/portal-types";
import { adminListClientProjects } from "@/lib/portal.functions";
import { adminLogin, adminLogout, adminUpdateLead, getAdminState } from "@/lib/leads.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin | Nandara Build" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  loader: () => getAdminState(),
  component: AdminPage,
});

function AdminPage() {
  const state = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-kapur">
      <header className="border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label="Ke website">
            <Wordmark />
          </Link>
          {state.status === "ok" && <LogoutButton />}
        </div>
      </header>
      <main className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8">
        {state.status === "disabled" && <Disabled />}
        {state.status === "login" && <Login />}
        {state.status === "ok" && <AdminTabs leads={state.leads} storage={state.storage} />}
      </main>
    </div>
  );
}

type Tab = "leads" | "proyek" | "portofolio" | "testimoni" | "harga";
const TABS: { id: Tab; label: string }[] = [
  { id: "leads", label: "Calon klien" },
  { id: "proyek", label: "Proyek berjalan" },
  { id: "portofolio", label: "Portofolio" },
  { id: "testimoni", label: "Testimoni" },
  { id: "harga", label: "Harga & termin" },
];

function AdminTabs({ leads, storage }: { leads: Lead[]; storage: "appwrite" | "lokal" }) {
  const [tab, setTab] = useState<Tab>("leads");
  const [content, setContent] = useState<{
    projects: Project[];
    testimonials: Testimonial[];
  } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [pricing, setPricing] = useState<PricingSettings | null>(null);
  const [clientProjects, setClientProjects] = useState<ClientProject[] | null>(null);

  useEffect(() => {
    if (tab !== "proyek" || clientProjects) return;
    adminListClientProjects()
      .then(setClientProjects)
      .catch(() => setLoadError("Gagal memuat proyek berjalan."));
  }, [tab, clientProjects]);

  useEffect(() => {
    if (tab !== "harga" || pricing) return;
    getPricing()
      .then(setPricing)
      .catch(() => setLoadError("Gagal memuat harga."));
  }, [tab, pricing]);

  useEffect(() => {
    if (tab === "leads" || tab === "harga" || tab === "proyek" || content) return;
    adminListContent()
      .then(setContent)
      .catch(() => setLoadError("Gagal memuat konten."));
  }, [tab, content]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Menu admin"
        className="mb-8 flex gap-1 overflow-x-auto border-b border-garis"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-[0.9375rem] transition-colors",
              tab === t.id
                ? "border-emas-ink text-arang"
                : "border-transparent text-abu hover:text-arang",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "leads" && <Dashboard leads={leads} storage={storage} />}
      {tab === "proyek" &&
        (clientProjects ? (
          <ClientProjectsAdmin items={clientProjects} onChange={setClientProjects} />
        ) : (
          <p className="flex items-center gap-2 text-abu">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Memuat…
          </p>
        ))}
      {tab === "harga" &&
        (pricing ? (
          <PricingAdmin initial={pricing} />
        ) : (
          <p className="flex items-center gap-2 text-abu">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Memuat…
          </p>
        ))}
      {tab !== "leads" &&
        tab !== "harga" &&
        tab !== "proyek" &&
        (loadError ? (
          <p className="text-danger">{loadError}</p>
        ) : !content ? (
          <p className="flex items-center gap-2 text-abu">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Memuat…
          </p>
        ) : tab === "portofolio" ? (
          <ProjectsAdmin
            projects={content.projects}
            onChange={(projects) => setContent({ ...content, projects })}
          />
        ) : (
          <TestimonialsAdmin
            items={content.testimonials}
            onChange={(testimonials) => setContent({ ...content, testimonials })}
          />
        ))}
    </div>
  );
}

function Disabled() {
  return (
    <div className="mx-auto max-w-lg rounded-xl bg-white p-8">
      <h1 className="text-2xl font-normal text-arang">Dashboard admin belum aktif</h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-abu">
        Isi environment variable <code className="font-mono text-arang">ADMIN_PASSWORD</code>{" "}
        (minimal 12 karakter) dan <code className="font-mono text-arang">SESSION_SECRET</code>{" "}
        (minimal 32 karakter acak, mis. hasil{" "}
        <code className="font-mono">openssl rand -hex 32</code>) di pengaturan hosting, lalu deploy
        ulang.
      </p>
    </div>
  );
}

function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const res = await adminLogin({ data: { password } });
    setBusy(false);
    if (res.ok) await router.invalidate();
    else setError(res.error);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm rounded-xl bg-white p-8">
      <h1 className="text-2xl font-normal text-arang">Masuk admin</h1>
      <label htmlFor="admin-password" className="mt-6 block text-sm font-medium text-arang">
        Kata sandi
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-2 h-12 w-full rounded-md border border-batu px-4 text-base"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-arang px-6 font-medium text-kapur disabled:opacity-70"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Masuk
      </button>
    </form>
  );
}

function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await adminLogout();
        await router.invalidate();
      }}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-abu hover:bg-pasir hover:text-arang"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Keluar
    </button>
  );
}

const STATUS_STYLE: Record<LeadStatus, string> = {
  baru: "bg-emas/20 text-[#5c4415]",
  dihubungi: "bg-[#dfe8f2] text-[#28456b]",
  disurvei: "bg-[#e6e1f3] text-[#46386e]",
  rab_dikirim: "bg-[#f5e3d4] text-[#7a3f12]",
  deal: "bg-[#dcefe2] text-[#1f5a35]",
  batal: "bg-batu/60 text-abu",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Dashboard({ leads: initial, storage }: { leads: Lead[]; storage: "appwrite" | "lokal" }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState<LeadStatus | "semua">("semua");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>;
    for (const l of leads) c[l.status] += 1;
    return c;
  }, [leads]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (filter === "semua" || l.status === filter) &&
        (!term || [l.nama, l.kota, l.wa, l.jenis].some((v) => v.toLowerCase().includes(term))),
    );
  }, [leads, filter, q]);

  async function update(id: string, patch: { status?: LeadStatus; adminNote?: string }) {
    const updated = await adminUpdateLead({ data: { id, ...patch } });
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-normal tracking-[-0.02em] text-arang">Calon klien</h1>
          <p className="mt-1 text-sm text-abu">{leads.length} permintaan survei tercatat</p>
        </div>
        <a
          href="/api/leads.csv"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-md bg-pasir px-4 text-sm font-medium text-arang hover:bg-batu"
        >
          <Download className="h-4 w-4" aria-hidden />
          Export CSV
        </a>
      </div>

      {storage === "lokal" && (
        <p className="mt-6 rounded-md bg-bata/10 p-4 text-sm text-bata">
          Mode penyimpanan <strong>lokal</strong> (file di server). Cocok untuk uji coba saja. Di
          hosting, isi <code className="font-mono">APPWRITE_*</code> agar data tersimpan permanen.
        </p>
      )}

      {/* Ringkasan per status */}
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter status">
        {(["semua", ...LEAD_STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              filter === s
                ? "border-arang bg-arang text-kapur"
                : "border-batu bg-white text-beton hover:border-abu",
            )}
          >
            {s === "semua" ? "Semua" : STATUS_LABEL[s]}{" "}
            <span className="font-mono text-xs opacity-70">
              {s === "semua" ? leads.length : counts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-abu"
          aria-hidden
        />
        <label htmlFor="cari" className="sr-only">
          Cari nama, kota, atau nomor
        </label>
        <input
          id="cari"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama, kota, nomor…"
          className="h-11 w-full rounded-md border border-batu bg-white pl-9 pr-3 text-sm"
        />
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-xl bg-white p-10 text-center text-abu">
          {leads.length === 0
            ? "Belum ada permintaan survei. Lead dari form website akan muncul di sini."
            : "Tidak ada yang cocok dengan filter."}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {shown.map((l) => (
            <LeadRow key={l.id} lead={l} onUpdate={update} />
          ))}
        </ul>
      )}
    </div>
  );
}

function LeadRow({
  lead,
  onUpdate,
}: {
  lead: Lead;
  onUpdate: (id: string, patch: { status?: LeadStatus; adminNote?: string }) => Promise<void>;
}) {
  const [note, setNote] = useState(lead.adminNote);
  const [saving, setSaving] = useState(false);
  const dirty = note !== lead.adminNote;

  return (
    <li className="grid gap-4 rounded-xl bg-white p-5 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-start">
      <div>
        <p className="text-lg text-arang">{lead.nama}</p>
        <p className="mt-0.5 font-mono text-xs text-abu">Masuk {formatDate(lead.createdAt)}</p>
        <a
          href={`https://wa.me/${toIntlPhone(lead.wa)}?text=${encodeURIComponent(`Halo ${lead.nama}, kami dari Nandara Build terkait permintaan survei Anda.`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 font-mono text-sm text-arang underline decoration-emas-ink underline-offset-4"
        >
          <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
          {lead.wa}
        </a>
      </div>
      <dl className="grid gap-1 text-sm">
        <div>
          <dt className="sr-only">Lokasi</dt>
          <dd className="text-arang">{lead.kota}</dd>
        </div>
        <div>
          <dt className="sr-only">Pekerjaan</dt>
          <dd className="text-beton">{lead.jenis}</dd>
        </div>
        <div>
          <dt className="sr-only">Jadwal survei</dt>
          <dd className="text-abu">
            {lead.tanggal
              ? `Survei: ${lead.tanggal}${lead.waktu ? `, ${lead.waktu}` : ""}`
              : "Jadwal belum dipilih"}
          </dd>
        </div>
        {lead.catatan && (
          <div>
            <dt className="sr-only">Catatan klien</dt>
            <dd className="mt-1 text-beton">“{lead.catatan}”</dd>
          </div>
        )}
      </dl>
      <div>
        <label htmlFor={`note-${lead.id}`} className="text-xs text-abu">
          Catatan internal
        </label>
        <textarea
          id={`note-${lead.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-batu px-3 py-2 text-sm"
        />
        {dirty && (
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onUpdate(lead.id, { adminNote: note });
              setSaving(false);
            }}
            className="mt-1 rounded-md bg-arang px-3 py-1.5 text-xs text-kapur disabled:opacity-70"
          >
            {saving ? "Menyimpan…" : "Simpan catatan"}
          </button>
        )}
      </div>
      <div>
        <label htmlFor={`status-${lead.id}`} className="sr-only">
          Status
        </label>
        <select
          id={`status-${lead.id}`}
          value={lead.status}
          onChange={(e) => onUpdate(lead.id, { status: e.target.value as LeadStatus })}
          className={cn(
            "h-10 rounded-full border-0 px-4 text-sm font-medium",
            STATUS_STYLE[lead.status],
          )}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
