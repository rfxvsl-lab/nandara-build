# Panduan untuk Agen AI & Kontributor

- **Sistem desain wajib**: baca [`design.md`](./design.md), terutama **§13 gaya v2 "Block × HDR"** (berlaku di atas bagian lama yang bertentangan). Keputusan desain baru ditulis dulu di sana.
- **Konten statis** (nomor WA, layanan, FAQ) ada di `src/content/`. Konten dinamis (proyek, testimoni, artikel, harga & termin, proyek berjalan) dikelola dari `/admin`.
- **Routing**: file-based TanStack Start di `src/routes/` (lihat `src/routes/README.md`). `routeTree.gen.ts` dibuat otomatis.
- **Warna**: pakai token `arang`, `beton`, `abu`, `kapur`, `pasir`, `batu`, `garis`, `emas`, `emas-muda`, `emas-ink`, `bata`. Jangan pakai `text-emas` di latar terang (kontras gagal) — pakai `text-emas-ink`.
- **Server**: kode server di `src/server/` & `*.functions.ts`; impor modul server secara dinamis di dalam handler. Setiap fungsi admin wajib cek `isAdmin()`. Jangan pernah render HTML mentah dari data pengguna (pakai `RichText`).
- **Sebelum commit**: `npm run check` (lint + typecheck + build) dan `npm run test:e2e` harus lolos.
- **Hosting**: Appwrite Sites (Node SSR, output `./.output`). Tidak memakai Lovable.
