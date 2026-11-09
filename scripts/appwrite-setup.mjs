/**
 * Membuat database & tabel "leads" di Appwrite (sekali jalan).
 *
 * Pemakaian:
 *   APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT_ID=xxx APPWRITE_API_KEY=xxx \
 *   node scripts/appwrite-setup.mjs
 *
 * API key butuh scope: databases.read, databases.write, tables.read, tables.write,
 * columns.read, columns.write, indexes.read, indexes.write, rows.read, rows.write,
 * buckets.read, buckets.write, files.read, files.write.
 * Aman dijalankan ulang: bagian yang sudah ada dilewati.
 */
import { Client, OrderBy, Storage, TablesDB, TablesDBIndexType } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID ?? "nandara";
const tableId = process.env.APPWRITE_LEADS_TABLE_ID ?? "leads";

if (!endpoint || !projectId || !apiKey) {
  console.error("Isi APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, dan APPWRITE_API_KEY.");
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const db = new TablesDB(client);
const storage = new Storage(client);
const projectsTable = process.env.APPWRITE_PROJECTS_TABLE_ID ?? "projects";
const testimonialsTable = process.env.APPWRITE_TESTIMONIALS_TABLE_ID ?? "testimonials";
const bucketId = process.env.APPWRITE_MEDIA_BUCKET_ID ?? "media";

async function step(label, fn) {
  try {
    await fn();
    console.log("✓", label);
  } catch (e) {
    if (e?.code === 409) console.log("•", label, "(sudah ada)");
    else throw e;
  }
}

await step(`database "${databaseId}"`, () => db.create(databaseId, "Nandara Build"));
// Tanpa izin publik: hanya server (API key) yang bisa membaca/menulis.
await step(`tabel "${tableId}"`, () =>
  db.createTable(databaseId, tableId, "Leads", [], false, true),
);

const str = (key, size, required = false) =>
  step(`kolom ${key}`, () => db.createStringColumn(databaseId, tableId, key, size, required));

await str("nama", 100, true);
await str("wa", 20, true);
await str("kota", 100, true);
await str("jenis", 60, true);
await str("tanggal", 10);
await str("waktu", 40);
await str("catatan", 1000);
await str("halaman", 200);
await str("adminNote", 2000);
await step("kolom status", () =>
  db.createEnumColumn(
    databaseId,
    tableId,
    "status",
    ["baru", "dihubungi", "disurvei", "rab_dikirim", "deal", "batal"],
    false,
    "baru",
  ),
);

// Kolom dibuat asinkron; tunggu sebentar sebelum membuat index.
await new Promise((r) => setTimeout(r, 3000));
await step("index status", () =>
  db.createIndex(
    databaseId,
    tableId,
    "idx_status",
    TablesDBIndexType.Key,
    ["status"],
    [OrderBy.Asc],
  ),
);

/* ── Portofolio ── */
const col = (table) => ({
  str: (key, size, required = false) =>
    step(`${table}.${key}`, () => db.createStringColumn(databaseId, table, key, size, required)),
  text: (key) => step(`${table}.${key}`, () => db.createTextColumn(databaseId, table, key, false)),
  bool: (key) =>
    step(`${table}.${key}`, () => db.createBooleanColumn(databaseId, table, key, false, false)),
  int: (key) =>
    step(`${table}.${key}`, () =>
      db.createIntegerColumn(databaseId, table, key, false, 0, 9999, 0),
    ),
});

await step(`tabel "${projectsTable}"`, () =>
  db.createTable(databaseId, projectsTable, "Portofolio", [], false, true),
);
{
  const c = col(projectsTable);
  await c.str("slug", 80, true);
  await c.str("title", 200, true);
  await c.str("kota", 100);
  await c.str("jenis", 60);
  await c.str("luas", 20);
  await c.str("durasi", 40);
  await c.str("tahun", 10);
  await c.str("ringkasan", 500);
  await c.text("deskripsi");
  await c.text("images");
  await c.bool("published");
  await c.int("urutan");
}

await step(`tabel "${testimonialsTable}"`, () =>
  db.createTable(databaseId, testimonialsTable, "Testimoni", [], false, true),
);
{
  const c = col(testimonialsTable);
  await c.str("nama", 100, true);
  await c.str("kota", 100);
  await c.str("proyek", 120);
  await c.str("kutipan", 1000, true);
  await c.bool("published");
  await c.int("urutan");
}

await new Promise((r) => setTimeout(r, 3000));
await step("index slug proyek", () =>
  db.createIndex(databaseId, projectsTable, "idx_slug", TablesDBIndexType.Unique, ["slug"]),
);

/* ── Pengaturan (harga & termin) ── */
const settingsTable = process.env.APPWRITE_SETTINGS_TABLE_ID ?? "settings";
await step(`tabel "${settingsTable}"`, () =>
  db.createTable(databaseId, settingsTable, "Pengaturan", [], false, true),
);
await col(settingsTable).text("value");

/* ── Portal klien: proyek berjalan ── */
const clientTable = process.env.APPWRITE_CLIENT_PROJECTS_TABLE_ID ?? "client_projects";
await step(`tabel "${clientTable}"`, () =>
  db.createTable(databaseId, clientTable, "Proyek berjalan", [], false, true),
);
await col(clientTable).str("kode", 20, true);
await col(clientTable).text("data");
await new Promise((r) => setTimeout(r, 3000));
await step("index kode akses", () =>
  db.createIndex(databaseId, clientTable, "idx_kode", TablesDBIndexType.Unique, ["kode"]),
);

/* ── Bucket privat portal (foto progres & dokumen klien) ── */
const portalBucket = process.env.APPWRITE_PORTAL_BUCKET_ID ?? "portal";
await step(`bucket "${portalBucket}"`, () =>
  storage.createBucket(portalBucket, "Portal klien", [], false, true, 15 * 1024 * 1024, [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "pdf",
  ]),
);

/* ── Bucket foto (privat; disajikan lewat /media/:id di server) ── */
await step(`bucket "${bucketId}"`, () =>
  storage.createBucket(bucketId, "Media", [], false, true, 6 * 1024 * 1024, [
    "jpg",
    "jpeg",
    "png",
    "webp",
  ]),
);

console.log(
  "\nSelesai. Env berikut sudah sesuai nilai bawaan aplikasi (isi bila Anda memakai ID lain):",
);
for (const [k, v] of [
  ["APPWRITE_DATABASE_ID", databaseId],
  ["APPWRITE_LEADS_TABLE_ID", tableId],
  ["APPWRITE_PROJECTS_TABLE_ID", projectsTable],
  ["APPWRITE_TESTIMONIALS_TABLE_ID", testimonialsTable],
  ["APPWRITE_SETTINGS_TABLE_ID", settingsTable],
  ["APPWRITE_CLIENT_PROJECTS_TABLE_ID", clientTable],
  ["APPWRITE_MEDIA_BUCKET_ID", bucketId],
  ["APPWRITE_PORTAL_BUCKET_ID", portalBucket],
]) {
  console.log(`  ${k}=${v}`);
}
