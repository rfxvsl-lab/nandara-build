/**
 * Penyimpanan konten (proyek & testimoni) dan media (foto).
 * - Appwrite (TablesDB + Storage) bila APPWRITE_* diisi.
 * - Fallback lokal: DATA_DIR/{projects,testimonials}.json + DATA_DIR/media/*.
 */
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { Client, ID, Query, Storage, TablesDB } from "node-appwrite";

import type { Project, Testimonial } from "@/lib/content-types";

import { appwriteConfigured, contentTables, env } from "./env";

type Row = Record<string, unknown>;

export interface Collection<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  upsert(item: Omit<T, "id" | "createdAt"> & { id?: string | undefined }): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface MediaStore {
  put(data: Uint8Array, mime: string): Promise<string>;
  get(id: string, width?: number): Promise<{ data: Uint8Array; mime: string } | undefined>;
  remove(id: string): Promise<void>;
}

/* ───────────── Mapping kolom ───────────── */
const projectFromRow = (r: Row): Project => ({
  id: String(r["$id"] ?? r["id"]),
  createdAt: String(r["$createdAt"] ?? r["createdAt"] ?? ""),
  slug: String(r["slug"] ?? ""),
  title: String(r["title"] ?? ""),
  kota: String(r["kota"] ?? ""),
  jenis: String(r["jenis"] ?? ""),
  luas: String(r["luas"] ?? ""),
  durasi: String(r["durasi"] ?? ""),
  tahun: String(r["tahun"] ?? ""),
  ringkasan: String(r["ringkasan"] ?? ""),
  deskripsi: String(r["deskripsi"] ?? ""),
  images: (() => {
    const v = r["images"];
    if (Array.isArray(v)) return v as Project["images"];
    try {
      return JSON.parse(String(v ?? "[]")) as Project["images"];
    } catch {
      return [];
    }
  })(),
  published: Boolean(r["published"]),
  urutan: Number(r["urutan"] ?? 0),
});

const testimonialFromRow = (r: Row): Testimonial => ({
  id: String(r["$id"] ?? r["id"]),
  createdAt: String(r["$createdAt"] ?? r["createdAt"] ?? ""),
  nama: String(r["nama"] ?? ""),
  kota: String(r["kota"] ?? ""),
  proyek: String(r["proyek"] ?? ""),
  kutipan: String(r["kutipan"] ?? ""),
  published: Boolean(r["published"]),
  urutan: Number(r["urutan"] ?? 0),
});

const byOrder = <T extends { urutan: number; createdAt: string }>(a: T, b: T) =>
  a.urutan - b.urutan || b.createdAt.localeCompare(a.createdAt);

/* ───────────── Appwrite ───────────── */
function appwriteClient() {
  return new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apiKey);
}

function appwriteCollection<T extends { id: string; urutan: number; createdAt: string }>(
  tableId: string,
  fromRow: (r: Row) => T,
  toRow: (item: Omit<T, "id" | "createdAt">) => Row,
): Collection<T> {
  const db = new TablesDB(appwriteClient());
  const dbId = env.appwrite.databaseId;
  return {
    async list() {
      const res = await db.listRows(dbId, tableId, [Query.limit(500)]);
      return res.rows.map((r) => fromRow(r as unknown as Row)).sort(byOrder);
    },
    async get(id) {
      try {
        return fromRow((await db.getRow(dbId, tableId, id)) as unknown as Row);
      } catch {
        return undefined;
      }
    },
    async upsert(item) {
      const { id, ...rest } = item as typeof item & { createdAt?: string };
      delete (rest as { createdAt?: string }).createdAt;
      const data = toRow(rest as Omit<T, "id" | "createdAt">);
      const row = id
        ? await db.updateRow(dbId, tableId, id, data)
        : await db.createRow(dbId, tableId, ID.unique(), data);
      return fromRow(row as unknown as Row);
    },
    async remove(id) {
      await db.deleteRow(dbId, tableId, id);
    },
  };
}

function appwriteMedia(): MediaStore {
  const storage = new Storage(appwriteClient());
  const bucket = contentTables.bucket;
  return {
    async put(data, mime) {
      const ext = mime === "image/png" ? "png" : mime === "image/jpeg" ? "jpg" : "webp";
      const file = await storage.createFile(
        bucket,
        ID.unique(),
        new File([data as BlobPart], `foto.${ext}`, { type: mime }),
      );
      return file.$id;
    },
    async get(id, width) {
      try {
        const meta = await storage.getFile(bucket, id);
        let buf: ArrayBuffer;
        try {
          buf = width
            ? await storage.getFilePreview(bucket, id, width)
            : await storage.getFileView(bucket, id);
        } catch {
          buf = await storage.getFileView(bucket, id);
        }
        return { data: new Uint8Array(buf), mime: width ? "image/webp" : meta.mimeType };
      } catch {
        return undefined;
      }
    },
    async remove(id) {
      await storage.deleteFile(bucket, id).catch(() => undefined);
    },
  };
}

/* ───────────── Lokal ───────────── */
const queues = new Map<string, Promise<unknown>>();
function locked<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = queues.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  queues.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

async function readJson<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T[];
  } catch {
    return [];
  }
}
async function writeJson(file: string, data: unknown) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, file);
}

function localCollection<T extends { id: string; urutan: number; createdAt: string }>(
  name: string,
): Collection<T> {
  const file = path.resolve(env.dataDir, `${name}.json`);
  return {
    list: async () => (await readJson<T>(file)).sort(byOrder),
    get: async (id) => (await readJson<T>(file)).find((x) => x.id === id),
    upsert: (item) =>
      locked(file, async () => {
        const all = await readJson<T>(file);
        const { id, ...rest } = item;
        if (id) {
          const i = all.findIndex((x) => x.id === id);
          if (i === -1) throw new Error("Data tidak ditemukan");
          all[i] = { ...all[i]!, ...rest, id };
          await writeJson(file, all);
          return all[i]!;
        }
        const created = { ...rest, id: randomUUID(), createdAt: new Date().toISOString() } as T;
        all.push(created);
        await writeJson(file, all);
        return created;
      }),
    remove: (id) =>
      locked(file, async () => {
        await writeJson(
          file,
          (await readJson<T>(file)).filter((x) => x.id !== id),
        );
      }),
  };
}

const MIME_EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const EXT_MIME = Object.fromEntries(Object.entries(MIME_EXT).map(([m, e]) => [e, m]));

function localMedia(): MediaStore {
  const dir = path.resolve(env.dataDir, "media");
  const safe = (id: string) => /^[a-f0-9]{24}\.(webp|jpg|png)$/.test(id);
  return {
    async put(data, mime) {
      const id = `${randomBytes(12).toString("hex")}.${MIME_EXT[mime] ?? "webp"}`;
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, id), data);
      return id;
    },
    async get(id) {
      if (!safe(id)) return undefined;
      try {
        const data = await readFile(path.join(dir, id));
        return { data: new Uint8Array(data), mime: EXT_MIME[id.split(".").pop()!] ?? "image/webp" };
      } catch {
        return undefined;
      }
    },
    async remove(id) {
      if (safe(id)) await unlink(path.join(dir, id)).catch(() => undefined);
    },
  };
}

/* ───────────── Pengaturan (key → JSON) ───────────── */
export interface SettingsStore {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
}

function appwriteSettings(): SettingsStore {
  const db = new TablesDB(appwriteClient());
  const dbId = env.appwrite.databaseId;
  const table = contentTables.settings;
  return {
    async get<T>(key: string) {
      try {
        const row = (await db.getRow(dbId, table, key)) as unknown as Row;
        return JSON.parse(String(row["value"])) as T;
      } catch {
        return undefined;
      }
    },
    async set(key, value) {
      const data = { value: JSON.stringify(value) };
      try {
        await db.updateRow(dbId, table, key, data);
      } catch {
        await db.createRow(dbId, table, key, data);
      }
    },
  };
}

function localSettings(): SettingsStore {
  const file = path.resolve(env.dataDir, "settings.json");
  const readAll = async (): Promise<Record<string, unknown>> => {
    try {
      return JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>;
    } catch {
      return {};
    }
  };
  return {
    get: async <T>(key: string) => (await readAll())[key] as T | undefined,
    set: (key, value) =>
      locked(file, async () => {
        const all = await readAll();
        all[key] = value;
        await writeJson(file, all);
      }),
  };
}

/* ───────────── Ekspor ───────────── */
let cache:
  | {
      projects: Collection<Project>;
      testimonials: Collection<Testimonial>;
      media: MediaStore;
      settings: SettingsStore;
    }
  | undefined;

export function getContentStores() {
  if (cache) return cache;
  if (appwriteConfigured()) {
    cache = {
      projects: appwriteCollection<Project>(contentTables.projects, projectFromRow, (p) => ({
        ...p,
        images: JSON.stringify(p.images),
      })),
      testimonials: appwriteCollection<Testimonial>(
        contentTables.testimonials,
        testimonialFromRow,
        (t) => ({ ...t }),
      ),
      media: appwriteMedia(),
      settings: appwriteSettings(),
    };
  } else {
    cache = {
      projects: localCollection<Project>("projects"),
      testimonials: localCollection<Testimonial>("testimonials"),
      media: localMedia(),
      settings: localSettings(),
    };
  }
  return cache;
}
