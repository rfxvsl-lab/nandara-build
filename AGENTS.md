# Panduan untuk Agen AI & Kontributor

- **Sistem desain wajib**: baca [`design.md`](./design.md) sebelum mengubah UI. Keputusan desain baru ditulis dulu di sana.
- **Konten** (teks, nomor WA, layanan, dll.) ada di `src/content/` — jangan hardcode di komponen.
- **Routing**: file-based TanStack Start di `src/routes/` (lihat `src/routes/README.md`). `routeTree.gen.ts` dibuat otomatis.
- **Warna**: pakai token (`text-gold-ink`, `bg-paper`, …). Jangan pakai `text-gold` di latar terang (kontras gagal).
- **Sebelum commit**: `npm run check` (lint + typecheck + build) harus lolos.
- **Hosting**: Appwrite Sites (Node SSR, output `./.output`). Tidak memakai Lovable.
