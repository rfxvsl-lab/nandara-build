/**
 * Membuat database & tabel "leads" di Appwrite (sekali jalan).
 *
 * Pemakaian:
 *   APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT_ID=xxx APPWRITE_API_KEY=xxx \
 *   node scripts/appwrite-setup.mjs
 *
 * API key butuh scope: databases.read, databases.write, tables.read, tables.write,
 * columns.read, columns.write, indexes.read, indexes.write, rows.read, rows.write.
 * Aman dijalankan ulang: bagian yang sudah ada dilewati.
 */
import { Client, TablesDB, TablesDBIndexType, OrderBy } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID ?? "nandara";
const tableId = process.env.APPWRITE_LEADS_TABLE_ID ?? "leads";

if (!endpoint || !projectId || !apiKey) {
  console.error("Isi APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, dan APPWRITE_API_KEY.");
  process.exit(1);
}

const db = new TablesDB(new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey));

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

console.log("\nSelesai. Isi env berikut di Appwrite Sites:");
console.log(`  APPWRITE_DATABASE_ID=${databaseId}\n  APPWRITE_LEADS_TABLE_ID=${tableId}`);
