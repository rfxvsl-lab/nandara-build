/**
 * Penyimpanan lead.
 * - Appwrite TablesDB bila APPWRITE_* diisi (produksi).
 * - File JSON lokal (DATA_DIR/leads.json) sebagai cadangan untuk pengembangan.
 *   Catatan: di hosting serverless file lokal bisa hilang — wajib pakai Appwrite di produksi.
 */
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { Client, ID, Query, TablesDB } from "node-appwrite";

import type { Lead, LeadStatus } from "@/lib/leads";

import { appwriteConfigured, env } from "./env";

export type NewLead = Omit<Lead, "id" | "createdAt" | "status" | "adminNote">;

export interface LeadStore {
  kind: "appwrite" | "lokal";
  create(lead: NewLead): Promise<Lead>;
  list(): Promise<Lead[]>;
  update(id: string, patch: Partial<Pick<Lead, "status" | "adminNote">>): Promise<Lead>;
}

/* ───────────── Appwrite ───────────── */
function appwriteStore(): LeadStore {
  const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apiKey);
  const db = new TablesDB(client);
  const { databaseId, leadsTableId } = env.appwrite;

  const fromRow = (r: Record<string, unknown>): Lead => ({
    id: String(r["$id"]),
    createdAt: String(r["$createdAt"]),
    nama: String(r["nama"] ?? ""),
    wa: String(r["wa"] ?? ""),
    kota: String(r["kota"] ?? ""),
    jenis: String(r["jenis"] ?? ""),
    tanggal: String(r["tanggal"] ?? ""),
    waktu: String(r["waktu"] ?? ""),
    catatan: String(r["catatan"] ?? ""),
    halaman: String(r["halaman"] ?? ""),
    status: (r["status"] as LeadStatus) ?? "baru",
    adminNote: String(r["adminNote"] ?? ""),
  });

  return {
    kind: "appwrite",
    async create(lead) {
      const row = await db.createRow(databaseId, leadsTableId, ID.unique(), {
        ...lead,
        status: "baru",
        adminNote: "",
      });
      return fromRow(row as unknown as Record<string, unknown>);
    },
    async list() {
      // Ambil semua halaman (cursor), bukan hanya 500 pertama.
      const out: Lead[] = [];
      let cursor: string | undefined;
      for (let page = 0; page < 100; page++) {
        const res = await db.listRows(databaseId, leadsTableId, [
          Query.orderDesc("$createdAt"),
          Query.limit(500),
          ...(cursor ? [Query.cursorAfter(cursor)] : []),
        ]);
        out.push(...res.rows.map((r) => fromRow(r as unknown as Record<string, unknown>)));
        if (res.rows.length < 500) break;
        cursor = String((res.rows.at(-1) as unknown as Record<string, unknown>)["$id"]);
      }
      return out;
    },
    async update(id, patch) {
      const row = await db.updateRow(databaseId, leadsTableId, id, patch);
      return fromRow(row as unknown as Record<string, unknown>);
    },
  };
}

/* ───────────── File lokal ───────────── */
function localStore(): LeadStore {
  const file = path.resolve(env.dataDir, "leads.json");
  let queue: Promise<unknown> = Promise.resolve();

  async function readAll(): Promise<Lead[]> {
    try {
      return JSON.parse(await readFile(file, "utf8")) as Lead[];
    } catch {
      return [];
    }
  }
  async function writeAll(leads: Lead[]) {
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(leads, null, 2), "utf8");
    await rename(tmp, file);
  }
  /** Serialisasi tulis agar tidak saling timpa. */
  function locked<T>(fn: () => Promise<T>): Promise<T> {
    const next = queue.then(fn, fn);
    queue = next.catch(() => undefined);
    return next;
  }

  return {
    kind: "lokal",
    create: (lead) =>
      locked(async () => {
        const all = await readAll();
        const created: Lead = {
          ...lead,
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          status: "baru",
          adminNote: "",
        };
        all.unshift(created);
        await writeAll(all);
        return created;
      }),
    list: async () => (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    update: (id, patch) =>
      locked(async () => {
        const all = await readAll();
        const i = all.findIndex((l) => l.id === id);
        if (i === -1) throw new Error("Lead tidak ditemukan");
        all[i] = { ...all[i]!, ...patch };
        await writeAll(all);
        return all[i]!;
      }),
  };
}

let store: LeadStore | undefined;
export function getLeadStore(): LeadStore {
  store ??= appwriteConfigured() ? appwriteStore() : localStore();
  return store;
}
