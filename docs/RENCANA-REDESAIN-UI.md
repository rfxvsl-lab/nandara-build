# Rencana Rombak Ulang Desain UI — Nandara Build

_Acuan wajib: [`/design.md`](../design.md) · Dokumen terkait: [`ANALISIS-DAN-RENCANA.md`](./ANALISIS-DAN-RENCANA.md)_

---

## 1. Tujuan Redesain

| Masalah desain sekarang | Arah redesain |
| --- | --- |
| Terlihat seperti template AI/landing page generik (kartu sangat membulat, foto villa pantai) | Identitas **arsitektural** yang khas: motif gambar kerja, sudut tegas, foto relevan Jawa Timur |
| Klaim "RAB transparan / SPK resmi" hanya berupa teks | **Bukti visual**: contoh tabel RAB, cuplikan SPK, timeline, portofolio before–after |
| Satu-satunya jalur konversi adalah tombol WA biasa | WA floating + pesan template, kalkulator estimasi, form survei |
| Warna emas dipakai untuk teks di latar putih (kontras rendah) | Token `gold-ink` untuk teks, emas murni hanya untuk aksen/latar gelap |
| Logo rusak, brand tidak terlihat di HP | Logo self-hosted + wordmark tetap tampil di HP |
| Hanya 1 halaman | Struktur multi-halaman untuk SEO lokal |

**Ukuran keberhasilan**
- Klik WhatsApp + form per 100 pengunjung naik ≥ 50% dibanding desain lama (diukur 30 hari setelah rilis).
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
- Ukuran halaman utama < 1 MB, LCP < 2,5 detik (4G).

---

## 2. Arsitektur Informasi (Sitemap Baru)

```
/                              Beranda
/layanan                       Ringkasan layanan
  /layanan/desain-arsitektur
  /layanan/perencanaan-rab
  /layanan/bangun-rumah
  /layanan/renovasi
/portofolio                    Grid proyek + filter (jenis, kota)
  /portofolio/$slug            Detail proyek: before–after, data, cerita, testimoni
/estimasi-biaya                Kalkulator estimasi
/proses                        6 langkah kerja + dokumen yang diterima klien
/tentang                       Cerita, tim, legalitas, visi & misi
/area/$kota                    Halaman lokal (Surabaya, Sidoarjo, Gresik, Malang, …)
/artikel, /artikel/$slug       Blog (fase berikutnya)
/kontak                        Form survei, WA, alamat, peta, jam kerja
```

Menu utama (maks. 5): **Layanan · Portofolio · Estimasi Biaya · Proses · Tentang**, ditambah tombol **Konsultasi Gratis**.

---

## 3. Wireframe Beranda Baru (urut dari atas)

> Panjang target di HP: ± 9–10 layar (versi lama ± 7 layar tetapi minim bukti). Setiap section punya **satu** pesan.

### 01 — Header
Logo + wordmark "NANDARA BUILD" · menu · tombol primary "Konsultasi Gratis". Di HP: logo + wordmark + tombol menu 48 px.

### 02 — Hero
```
┌──────────────────────────────────────────────────────────┐
│ [grid blueprint tipis di latar navy]                     │
│ JAWA TIMUR & SEKITARNYA                       (label mono)│
│ Bangun & Renovasi Rumah                                  │
│ dengan RAB yang *Bisa Anda Periksa*          (display)   │
│ Desain, RAB, dan SPK resmi di tangan Anda                │
│ sebelum membayar DP sepeser pun.                         │
│ [Konsultasi via WhatsApp]  [Hitung Estimasi Biaya]       │
│ ───────────────────────────────────────────             │
│ ★ [rating] Google · [n] proyek · [n] kota  (angka nyata) │
├──────────────────────────────────────────────────────────┤
│ Foto proyek asli Nandara (16:9 desktop / 4:5 HP)         │
│ + label ukur, contoh: "[KOTA] · 2 LANTAI · [n] HARI"     │
└──────────────────────────────────────────────────────────┘
```
Headline ditekankan pada **pembeda** (RAB yang bisa diperiksa), bukan janji umum.

### 03 — Strip Kepercayaan
4 poin ringkas dengan ikon: Gratis Survei · SPK Resmi · RAB Rinci · Garansi Tertulis [X] bulan.

### 04 — Layanan (`01 — LAYANAN`)
4 kartu: Desain Arsitektur · Perencanaan & RAB · Bangun Rumah · Renovasi. Setiap kartu: foto, 1 kalimat, "mulai dari Rp …/m²", link ke halaman layanan.

### 05 — Portofolio Pilihan (`02 — PORTOFOLIO`)
1 proyek unggulan dengan **Before/After Slider** besar + 3 kartu proyek lain. Tombol "Lihat semua proyek".

### 06 — Bukti Transparansi (`03 — TRANSPARANSI`) ⭐ section pembeda utama
```
┌───────────────────────────┬────────────────────────────┐
│ Ini contoh RAB yang       │  RAB PREVIEW (tabel mini)   │
│ Anda terima sebelum DP.   │  Uraian | Vol | Sat | Harga │
│ • Volume & harga satuan   │  ...                        │
│ • Merek material tertulis │  TOTAL        Rp 3xx.xxx.xxx│
│ • Harga dikunci di SPK    │  [Lihat contoh RAB (PDF)]   │
└───────────────────────────┴────────────────────────────┘
```
Di bawahnya terdapat kartu **Dokumen SPK** (cuplikan pasal garansi, denda keterlambatan, termin pembayaran).

### 07 — Proses Kerja (`04 — PROSES`)
Timeline 6 langkah: Konsultasi → Survei Lokasi → Desain & RAB → Tanda Tangan SPK → Pembangunan (laporan progres mingguan) → Serah Terima & Garansi. Setiap langkah mencantumkan durasi tipikal dan dokumen yang diterima.

### 08 — Kalkulator Estimasi Ringkas (`05 — ESTIMASI`)
Versi mini: jenis pekerjaan + luas + kualitas → rentang biaya → CTA WA berisi hasil estimasi. Link ke halaman kalkulator lengkap.

### 09 — Testimoni (`06 — KATA KLIEN`)
3 testimoni nyata (nama, kota, jenis proyek, foto) + rating & link ulasan Google Business.

### 10 — Area Layanan
Peta SVG Jawa Timur + chip kota (link ke `/area/$kota`).

### 11 — FAQ
6–8 pertanyaan (accordion, + JSON-LD FAQPage).

### 12 — CTA Penutup (section navy)
"Niat hemat, jangan sampai biaya *membengkak*." (copy promo lama dipertahankan) + tombol WA + form singkat (nama, WA, kota, jenis pekerjaan).

### 13 — Footer (ink)
Logo, ringkasan, navigasi, area, kontak, NIB, sosial media, © tahun berjalan.

**Section lama yang dipindahkan**: *Visi & Misi* → halaman `/tentang`. *Mengapa Kami* (5 poin) → dilebur ke strip kepercayaan dan section transparansi.

---

## 4. Tahapan Pengerjaan

### Tahap A — Fondasi (± 2–3 hari)
1. Ekstrak `nandara-build-source.zip` menjadi source code biasa di repo, lalu hapus ZIP.
2. Self-host logo (PNG/SVG) dan font (Plus Jakarta Sans, Instrument Serif, JetBrains Mono).
3. Terapkan **token design.md** di `src/styles.css`, petakan ke variabel shadcn.
4. Hapus komponen `ui/*` yang tidak dipakai. Simpan yang dibutuhkan: `accordion`, `dialog/sheet`, `slider`, `form`, `input`, `select`, `radio-group`, `tabs`, `sonner`.
5. Perbaiki lint, tambah CI (lint · typecheck · build).
6. Pisahkan data konten (layanan, proyek, testimoni, FAQ, harga/m², kota) ke `src/content/*.ts` agar mudah diubah.

**Selesai bila**: build hijau, token terpasang, beranda lama tampil dengan font & warna baru tanpa error.

### Tahap B — Komponen Inti (± 3–4 hari)
Bangun dan uji komponen terpisah (halaman `/_dev/komponen` khusus development):
`Button` (4 varian) · `SectionLabel` (mono bernomor) · `BlueprintGrid` · `MeasureLine` · `ServiceCard` · `ProjectCard` · `BeforeAfterSlider` · `RabPreview` · `SpkCard` · `ProcessTimeline` · `StatRow` · `TestimonialCard` · `FaqAccordion` · `WhatsAppFloat` + util `waLink(konteks)` · `LeadForm`.

**Selesai bila**: semua komponen lolos cek keyboard, kontras, dan tampil benar di 360 px & 1280 px.

### Tahap C — Beranda Baru (± 3 hari)
Rakit 13 section di atas. Isi sementara dengan placeholder yang **ditandai jelas** (`[FOTO PROYEK]`, `[ANGKA NYATA]`) sampai materi asli tersedia. Tidak memakai angka karangan.

**Selesai bila**: Lighthouse mobile ≥ 90/95/100, screenshot 360/768/1280 disetujui pemilik.

### Tahap D — Halaman Dalam (± 4–5 hari)
`/layanan/*`, `/portofolio`, `/portofolio/$slug`, `/proses`, `/tentang`, `/kontak`, `/estimasi-biaya` (kalkulator lengkap), plus meta, OG image per halaman, JSON-LD, `sitemap.xml`.

### Tahap E — Konversi & Pengukuran (± 2 hari)
Form survei → server function (kirim ke email/Telegram/Google Sheets), analytics event `click_whatsapp`, `submit_form`, `use_calculator`, dan dashboard sederhana.

### Tahap F — Halaman Area & Artikel (berkelanjutan)
`/area/$kota` dengan konten unik per kota, blog 2–4 artikel/bulan.

**Total estimasi Tahap A–E: ± 3 minggu kerja.**

---

## 5. Materi yang Dibutuhkan dari Nandara

| Materi | Untuk | Prioritas |
| --- | --- | --- |
| Logo PNG transparan / SVG | Header, footer, OG image | 🔴 Wajib (Tahap A) |
| Foto 3–6 proyek (sebelum, proses, sesudah) + kota, luas, durasi | Hero, portofolio, slider | 🔴 Wajib (Tahap C) |
| 1 contoh RAB asli (boleh disamarkan) + cuplikan SPK | Section transparansi | 🔴 Wajib (Tahap C) |
| Angka nyata: jumlah proyek, tahun berdiri, kota dilayani, rating Google | Statistik | 🟠 Penting |
| 3 testimoni + izin foto | Testimoni | 🟠 Penting |
| Harga/m² per jenis & kualitas (standar/menengah/premium) | Kalkulator | 🟠 Penting |
| Durasi garansi & cakupannya | Strip kepercayaan, FAQ | 🟠 Penting |
| NIB, alamat kantor, jam kerja, URL Facebook | Footer, kontak, JSON-LD | 🟡 Perlu |

---

## 6. Keputusan yang Perlu Disetujui Pemilik

1. **Headline hero baru**: "Bangun & Renovasi Rumah dengan RAB yang *Bisa Anda Periksa*" (menggantikan "Solusi Konstruksi & Renovasi Tanpa Repot", yang dipindah menjadi subjudul/tagline footer). Setuju?
2. **Latar halaman** berubah dari putih ke kapur hangat `#FAF7F0`. Setuju?
3. **Sudut kartu** lebih tegas (8 px, sebelumnya 24–32 px). Setuju?
4. **Font serif aksen** diganti dari Cormorant Garamond ke Instrument Serif. Setuju?
5. Tetap terhubung dengan **Lovable** atau dikelola penuh lewat GitHub? (Mempengaruhi cara aset/logo disimpan.)
