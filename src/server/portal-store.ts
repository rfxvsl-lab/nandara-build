/**
 * Penyimpanan proyek berjalan (portal klien).
 * Appwrite: tabel client_projects (kolom kode + data JSON). Lokal: DATA_DIR/client-projects.json.
 */
import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { Client, ID, Query, TablesDB } from "node-appwrite";

import { KODE_ALPHABET, type ClientProject } from "@/lib/portal-types";

import { appwriteConfigured, contentTables, env } from "./env";

export type NewClientProject = Omit<ClientProject, "id" | "kode" | "createdAt" | "updatedAt">;

export interface ClientProjectStore {
  list(): Promise<ClientProject[]>;
  get(id: string): Promise<ClientProject | undefined>;
  findByKode(kode: string): Promise<ClientProject | undefined>;
  save(input: NewClientProject & { id?: string | undefined }): Promise<ClientProject>;
  remove(id: string): Promise<void>;
  /** Buat kode akses baru (kode lama langsung tidak berlaku). */
  regenerateKode(id: string): Promise<ClientProject>;
}

export function newKode(): string {
  const pick = () => KODE_ALPHABET[randomInt(KODE_ALPHABET.length)];
  const s = Array.from({ length: 8 }, pick).join("");
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

function appwriteStore(): ClientProjectStore {
  const db = new TablesDB(
    new Client()
      .setEndpoint(env.appwrite.endpoint)
      .setProject(env.appwrite.projectId)
      .setKey(env.appwrite.apiKey),
  );
  const dbId = env.appwrite.databaseId;
  const table = contentTables.clientProjects;
  const fromRow = (r: Record<string, unknown>): ClientProject => ({
    ...(JSON.parse(String(r["data"] ?? "{}")) as Omit<
      ClientProject,
      "id" | "kode" | "createdAt" | "updatedAt"
    >),
    id: String(r["$id"]),
    kode: String(r["kode"]),
    createdAt: String(r["$createdAt"]),
    updatedAt: String(r["$updatedAt"]),
  });
  return {
    async list() {
      const res = await db.listRows(dbId, table, [Query.orderDesc("$createdAt"), Query.limit(500)]);
      return res.rows.map((r) => fromRow(r as unknown as Record<string, unknown>));
    },
    async get(id) {
      try {
        return fromRow((await db.getRow(dbId, table, id)) as unknown as Record<string, unknown>);
      } catch {
        return undefined;
      }
    },
    async findByKode(kode) {
      const res = await db.listRows(dbId, table, [Query.equal("kode", kode), Query.limit(1)]);
      const row = res.rows[0];
      return row ? fromRow(row as unknown as Record<string, unknown>) : undefined;
    },
    async save(input) {
      const { id, ...data } = input;
      const row = id
        ? await db.updateRow(dbId, table, id, { data: JSON.stringify(data) })
        : await db.createRow(dbId, table, ID.unique(), {
            kode: newKode(),
            data: JSON.stringify(data),
          });
      return fromRow(row as unknown as Record<string, unknown>);
    },
    async remove(id) {
      await db.deleteRow(dbId, table, id);
    },
    async regenerateKode(id) {
      const row = await db.updateRow(dbId, table, id, { kode: newKode() });
      return fromRow(row as unknown as Record<string, unknown>);
    },
  };
}

function localStore(): ClientProjectStore {
  const file = path.resolve(env.dataDir, "client-projects.json");
  let queue: Promise<unknown> = Promise.resolve();
  const lock = <T>(fn: () => Promise<T>) => {
    const next = queue.then(fn, fn);
    queue = next.catch(() => undefined);
    return next;
  };
  const readAll = async (): Promise<ClientProject[]> => {
    try {
      return JSON.parse(await readFile(file, "utf8")) as ClientProject[];
    } catch {
      return [];
    }
  };
  const writeAll = async (all: ClientProject[]) => {
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(all, null, 2), "utf8");
    await rename(tmp, file);
  };
  return {
    list: async () => (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    get: async (id) => (await readAll()).find((p) => p.id === id),
    findByKode: async (kode) => (await readAll()).find((p) => p.kode === kode),
    save: (input) =>
      lock(async () => {
        const all = await readAll();
        const now = new Date().toISOString();
        const { id, ...data } = input;
        if (id) {
          const i = all.findIndex((p) => p.id === id);
          if (i === -1) throw new Error("Proyek tidak ditemukan");
          all[i] = { ...all[i]!, ...data, updatedAt: now };
          await writeAll(all);
          return all[i]!;
        }
        let kode = newKode();
        while (all.some((p) => p.kode === kode)) kode = newKode();
        const created: ClientProject = {
          ...data,
          id: randomUUID(),
          kode,
          createdAt: now,
          updatedAt: now,
        };
        all.push(created);
        await writeAll(all);
        return created;
      }),
    remove: (id) =>
      lock(async () => {
        await writeAll((await readAll()).filter((p) => p.id !== id));
      }),
    regenerateKode: (id) =>
      lock(async () => {
        const all = await readAll();
        const i = all.findIndex((p) => p.id === id);
        if (i === -1) throw new Error("Proyek tidak ditemukan");
        let kode = newKode();
        while (all.some((p) => p.kode === kode)) kode = newKode();
        all[i] = { ...all[i]!, kode, updatedAt: new Date().toISOString() };
        await writeAll(all);
        return all[i]!;
      }),
  };
}

let store: ClientProjectStore | undefined;
export function getClientProjectStore(): ClientProjectStore {
  store ??= appwriteConfigured() ? appwriteStore() : localStore();
  return store;
}
