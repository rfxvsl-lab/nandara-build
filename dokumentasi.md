# Dokumentasi Teknis — Website Nandara Build

> Dokumen serah terima untuk developer / agen AI berikutnya.
> Status per **9 November 2026**, commit `5331af2` di `rfxvsl-lab/nandara-build` (branch `main`).
> Baca juga: [`README.md`](./README.md) (cara pakai singkat), [`design.md`](./design.md) (sistem desain, **§13 berlaku**), [`AGENTS.md`](./AGENTS.md) (aturan kerja).

---

## Daftar isi

1. [Ringkasan proyek](#1-ringkasan-proyek)
2. [Status saat ini](#2-status-saat-ini)
3. [Tech stack](#3-tech-stack)
4. [Struktur folder](#4-struktur-folder)
5. [Halaman & route](#5-halaman--route)
6. [Fitur & cara kerjanya](#6-fitur--cara-kerjanya)
7. [Data & penyimpanan](#7-data--penyimpanan)
8. [Environment variable](#8-environment-variable)
9. [Menjalankan di lokal](#9-menjalankan-di-lokal)
10. [Pengujian & CI](#10-pengujian--ci)
11. [Keamanan](#11-keamanan)
12. [Sistem desain](#12-sistem-desain)
13. [Deploy](#13-deploy)
14. [Keputusan penting & alasannya](#14-keputusan-penting--alasannya)
15. [Jebakan yang sudah ditemukan](#15-jebakan-yang-sudah-ditemukan)
16. [Pekerjaan tersisa (backlog)](#16-pekerjaan-tersisa-backlog)
17. [Riwayat singkat](#17-riwayat-singkat)

---

## 1. Ringkasan proyek

**Nandara Build** adalah jasa arsitek, perencanaan RAB, dan kontraktor bangun/renovasi rumah tinggal di **Jawa Timur**. Tagline: _"We Design. We Build. You Enjoy."_

Pembeda bisnis yang harus selalu tercermin di website:

- **RAB rinci & SPK resmi sudah dipegang klien sebelum membayar DP**
- Survei & konsultasi **gratis**; desain gratis bila lanjut konstruksi
- Harga dikunci di SPK, pembayaran bertahap (termin) sesuai progres, garansi tertulis

Website ini berfungsi sebagai:

1. **Mesin pencari klien** — beranda, layanan, portofolio, artikel/SEO, kalkulator biaya, form survei, tombol WhatsApp.
2. **Alat kerja internal** — dashboard admin untuk lead, portofolio, testimoni, artikel, harga, dan proyek berjalan.
3. **Portal klien** — klien memantau progres proyeknya sendiri (`/pantau`).

Kontak di website: WhatsApp **0851-9418-9182**, Instagram **@nandara_build** (lihat `src/content/site.ts`).

---

## 2. Status saat ini

| Area                 | Status                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Kode                 | ✅ Lengkap, semua di GitHub `rfxvsl-lab/nandara-build` (`main`)                               |
| CI GitHub Actions    | ✅ Hijau (lint, typecheck, build, 29 test e2e)                                                |
| Integrasi Appwrite   | ✅ Teruji terhadap **Appwrite 2.6.2** (self-hosted Docker)                                    |
| **Hosting produksi** | ❌ **Belum ada.** Belum di-deploy ke Appwrite Sites / server permanen                         |
| Konten asli          | ❌ Belum: logo vektor resmi, foto proyek, testimoni, artikel, harga final, skema termin final |

Deploy demo sempat dijalankan dari container cloud sementara (Tailscale Funnel `https://nandara-build.tail716fa5.ts.net`), tetapi **mati setiap kali container di-restart** — bukan hosting yang layak. Lihat [§13](#13-deploy).

> Repo lama `qonnahfauziah-c1234/uhuyy` hanya berisi ZIP awal dari Lovable dan **tidak dipakai lagi** (akun pemilik tidak punya akses tulis ke sana).

---

## 3. Tech stack

| Lapisan         | Teknologi                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------- |
| Framework       | **TanStack Start** 1.168 (React 19, SSR, file-based routing, server functions)               |
| Build           | Vite 8 + **Nitro** preset `node-server` → output `./.output`                                 |
| Styling         | **Tailwind CSS v4** (token di `src/styles.css`), komponen dasar shadcn/ui (Radix) seperlunya |
| Font            | Self-host: Plus Jakarta Sans (variable) + JetBrains Mono                                     |
| Validasi        | **zod** (dipakai di client & server)                                                         |
| Backend data    | **Appwrite** (`node-appwrite` v31, API **TablesDB** + Storage). Fallback: file JSON lokal    |
| PDF             | **jsPDF** (dimuat dinamis hanya saat tombol diklik)                                          |
| Ikon            | lucide-react                                                                                 |
| Test            | **Playwright** 1.63 (e2e)                                                                    |
| Package manager | **bun** (lockfile `bun.lock`); `npm` juga bisa                                               |
| Node            | ≥ 22                                                                                         |

Tidak ada lagi ketergantungan pada Lovable (config Vite Lovable, error reporting, aset CDN Lovable sudah dihapus).

---

## 4. Struktur folder

```
.
├── design.md                 Sistem desain (WAJIB dibaca sebelum ubah UI; §13 = gaya aktif)
├── dokumentasi.md            Dokumen ini
├── README.md                 Cara pakai singkat
├── AGENTS.md                 Aturan untuk agen AI/kontributor
├── .env.example              Semua environment variable + penjelasan
├── docs/                     Analisa awal & rencana redesain (historis)
├── scripts/appwrite-setup.mjs   Membuat database, tabel, kolom, index, bucket di Appwrite (idempoten)
├── dev/appwrite/             docker-compose Appwrite 2.6.2 minimal untuk uji lokal + panduan
├── public/                   favicon.svg/png, apple-touch-icon, og-image.png
├── playwright.config.ts      Konfigurasi e2e (port 3100, DATA_DIR=.data-test)
├── tests/
│   ├── e2e/*.spec.ts         29 skenario
│   └── fixtures/             Foto uji
└── src/
    ├── routes/               Halaman & endpoint (file-based). routeTree.gen.ts = otomatis
    ├── components/
    │   ├── site/             Komponen situs publik (header, footer, kalkulator, form, dll.)
    │   ├── admin/            Komponen dashboard admin (editor portofolio, artikel, dll.)
    │   └── ui/               shadcn/ui yang masih dipakai (accordion, dialog, dll.)
    ├── content/
    │   ├── site.ts           Konten statis: kontak, NAV, layanan, FAQ, proses, contoh RAB, dll.
    │   └── images.ts         Foto ilustrasi (WebP 800/1600)
    ├── lib/                  Kode bersama client+server: skema zod, tipe, util, server functions
    │   ├── *.functions.ts    Server functions (createServerFn)
    │   ├── leads.ts, content-types.ts, pricing.ts, portal-types.ts   Skema & tipe
    │   └── estimate-pdf.ts, analytics.ts, abs-url.ts, seo.ts, utils.ts
    ├── server/               Kode KHUSUS server (jangan diimpor statis dari client)
    │   ├── env.ts            Membaca environment variable
    │   ├── admin-auth.ts     Sesi admin & sesi portal klien (cookie terenkripsi)
    │   ├── rate-limit.ts     Pembatas laju + IP klien yang aman
    │   ├── leads-store.ts    Penyimpanan lead (Appwrite / lokal)
    │   ├── content-store.ts  Proyek, testimoni, artikel, pengaturan, media publik & privat
    │   └── portal-store.ts   Proyek berjalan (portal klien)
    ├── styles.css            Token desain Tailwind v4
    ├── server.ts             Entry SSR (pembungkus error + gzip HTML)
    └── start.ts              Middleware TanStack Start (error + CSRF server functions)
```

---

## 5. Halaman & route

### Publik

| URL                           | File                                  | Isi                                                                                                                                                               |
| ----------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                           | `routes/index.tsx`                    | Beranda: hero, cara kerja, layanan, proyek pilihan*, bukti, tabel "Dengan vs Tanpa", perlindungan SPK, kalkulator, testimoni*, banner, artikel terbaru*, FAQ, CTA |
| `/layanan`                    | `layanan.tsx`                         | Detail 3 layanan                                                                                                                                                  |
| `/portofolio`                 | `portofolio.index.tsx`                | Grid proyek + filter jenis (dari admin)                                                                                                                           |
| `/portofolio/:slug`           | `portofolio.$slug.tsx`                | Detail proyek: data, slider sebelum–sesudah, cerita, galeri                                                                                                       |
| `/proses`                     | `proses.tsx`                          | 6 tahap kerja, contoh RAB & SPK, FAQ                                                                                                                              |
| `/estimasi-biaya`             | `estimasi-biaya.tsx`                  | Kalkulator + tabel harga acuan per m²                                                                                                                             |
| `/artikel`                    | `artikel.index.tsx`                   | Daftar artikel + filter kategori                                                                                                                                  |
| `/artikel/:slug`              | `artikel.$slug.tsx`                   | Artikel (JSON-LD `Article`)                                                                                                                                       |
| `/tentang`                    | `tentang.tsx`                         | Visi, misi, nilai                                                                                                                                                 |
| `/kontak`                     | `kontak.tsx`                          | Form survei gratis                                                                                                                                                |
| `/sitemap.xml`, `/robots.txt` | `sitemap[.]xml.ts`, `robots[.]txt.ts` | Dinamis (memuat proyek & artikel terbit)                                                                                                                          |

\* section muncul otomatis hanya bila ada data yang ditampilkan.

### Khusus (noindex, tanpa header/footer situs, diblokir robots.txt)

| URL       | Isi                                             |
| --------- | ----------------------------------------------- |
| `/admin`  | Dashboard admin (login sandi)                   |
| `/pantau` | Portal klien (kode akses + 4 digit terakhir WA) |

### Endpoint server

| Route                             | Fungsi                                   | Akses                                  |
| --------------------------------- | ---------------------------------------- | -------------------------------------- |
| `POST /api/admin/upload`          | Upload foto/PDF (`scope=public           | private`)                              | Admin + cek Origin |
| `GET /media/:id?w=`               | Foto publik (portofolio, sampul artikel) | Publik                                 |
| `GET /api/portal/file/:id?w=&dl=` | Foto progres & dokumen klien             | Admin, atau klien pemilik proyek aktif |
| `GET /api/leads.csv`              | Export lead                              | Admin                                  |

Server functions (RPC) ada di `src/lib/*.functions.ts`.

---

## 6. Fitur & cara kerjanya

### 6.1 Form survei & lead (`/kontak`)

- `components/site/lead-form.tsx` → server function `submitLead` (`lib/leads.functions.ts`).
- Validasi zod di client **dan** server (`lib/leads.ts`). Pilihan jadwal survei (tanggal + pagi/siang/sore).
- Anti-spam: honeypot `website`, 5 kiriman / 10 menit per IP, 60 kiriman / jam total.
- Setelah sukses: layar terima kasih + tombol "Lanjutkan chat di WhatsApp" (pesan terisi otomatis).
- Lead **hanya masuk ke `/admin`** (tidak ada notifikasi eksternal — keputusan pemilik). Tab _Calon klien_ menampilkan jumlah lead berstatus _Baru_.

### 6.2 Dashboard admin (`/admin`)

Tab:

| Tab                 | Isi                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Calon klien**     | **Badge jumlah lead berstatus _Baru_** di tab, daftar lead, filter status (Baru → Sudah dihubungi → Sudah disurvei → RAB dikirim → Deal / Batal), cari, catatan internal, tombol WA ke klien, **Export CSV** |
| **Proyek berjalan** | Kelola proyek untuk portal klien (lihat 6.6)                                                                                                                                                                 |
| **Portofolio**      | CRUD proyek + upload foto _sebelum/sesudah/galeri_, urutan, tampil/sembunyikan                                                                                                                               |
| **Testimoni**       | CRUD testimoni                                                                                                                                                                                               |
| **Artikel**         | CRUD artikel, pratinjau, jadwal terbit, sampul                                                                                                                                                               |
| **Harga & termin**  | Harga acuan per m² (per jenis × kualitas), tambah jenis pekerjaan, skema termin (total 100%)                                                                                                                 |

Foto dikompres **di browser** (WebP, maks 2000 px) sebelum diunggah (`components/admin/upload.ts`).

### 6.3 Kalkulator estimasi

- `components/site/estimator.tsx`, data dari `getPricing()` (pengaturan admin; default di `lib/pricing.ts`).
- Hasil: rentang biaya, **simulasi termin**, tombol WhatsApp berisi hasil, **Unduh PDF** (`lib/estimate-pdf.ts`, jsPDF lazy-load).
- ⚠️ Harga renovasi & skema termin default adalah **contoh** — wajib dikonfirmasi pemilik dan diubah lewat admin.

### 6.4 Portofolio & testimoni

- Data dari admin; tampil di `/portofolio`, detail, dan beranda.
- Foto disajikan lewat `/media/:id` (Appwrite preview untuk `?w=`).

### 6.5 Artikel

- Isi memakai **format teks sederhana** dirender oleh `components/site/rich-text.tsx` **tanpa innerHTML**:
  `## Judul`, `### Subjudul`, `- daftar`, `1. langkah`, `> kutipan`, `**tebal**`, `*miring*`, `[teks](https://…)`.
- Tanggal terbit di masa depan = terjadwal (belum tampil).
- JSON-LD `Article`, og:image dari sampul, masuk sitemap.

### 6.6 Portal klien "Pantau Proyek" (`/pantau`)

- Admin membuat proyek berjalan → server membuat **kode akses** 8 karakter (`XXXX-XXXX`, tanpa karakter mirip).
- Tombol **Kirim akses** membuka WhatsApp ke klien dengan link + kode. Tombol kunci = **ganti kode** (kode lama langsung mati).
- Klien masuk dengan **kode + 4 digit terakhir nomor WA**; maks 8 salah / 15 menit per IP.
- Klien melihat: progres %, status, tanggal, nilai kontrak, tahapan (timeline), termin (lunas/ditagih/belum), laporan progres berfoto, dokumen (lihat/unduh).
- File klien disimpan **privat** (bucket `portal`), hanya bisa dibuka admin / klien pemilik proyek **aktif**. PDF `no-store`, foto cache 5 menit. Matikan "Akses portal klien aktif" untuk mencabut akses seketika.
- Login tanpa OTP (tidak ada layanan WA/SMTP berbayar). Bisa ditambah OTP bila ada WhatsApp Business API.

### 6.7 SEO & analytics

- Meta per halaman, JSON-LD `GeneralContractor` + `FAQPage` (beranda), `Article` (artikel).
- `og-image.png` 1200×630; URL absolut dari `VITE_SITE_URL`.
- Sitemap & robots dinamis (`SITE_URL`).
- Event analytics: `click_whatsapp` (dengan lokasi tombol), `submit_form`, `use_calculator`, `download_estimate_pdf` → GA4 / GTM / Plausible bila `VITE_GA_ID` / `VITE_PLAUSIBLE_DOMAIN` diisi (`lib/analytics.ts`).

---

## 7. Data & penyimpanan

Pilihan backend otomatis di runtime:

- **Appwrite** bila `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY` diisi.
- **Fallback lokal** (`DATA_DIR`, default `.data/`) bila tidak — **hanya untuk pengembangan**; di hosting serverless file lokal bisa hilang. Dashboard admin menampilkan peringatan bila mode lokal aktif.

### Skema Appwrite (dibuat oleh `npm run appwrite:setup`)

Database `nandara` (semua tabel **tanpa izin publik**, hanya diakses server via API key):

| Tabel             | Kolom penting                                                                                                            | Catatan                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `leads`           | nama, wa, kota, jenis, tanggal, waktu, catatan, halaman, status (enum), adminNote                                        | index `status`                 |
| `projects`        | slug (unik), title, kota, jenis, luas, durasi, tahun, ringkasan, deskripsi (text), images (text JSON), published, urutan |                                |
| `testimonials`    | nama, kota, proyek, kutipan, published, urutan                                                                           |                                |
| `articles`        | slug, title, kategori, ringkasan, isi (text), cover, tanggal, published, urutan                                          |                                |
| `settings`        | value (text JSON)                                                                                                        | row id = kunci, mis. `pricing` |
| `client_projects` | kode (unik), data (text JSON seluruh proyek)                                                                             | portal klien                   |

Bucket Storage (privat; disajikan lewat server):

| Bucket   | Isi                                                     | Disajikan lewat                     |
| -------- | ------------------------------------------------------- | ----------------------------------- |
| `media`  | Foto portofolio & sampul artikel (jpg/png/webp, ≤ 6 MB) | `/media/:id` (publik)               |
| `portal` | Foto progres & dokumen klien (+pdf, ≤ 15 MB)            | `/api/portal/file/:id` (terkontrol) |

API key butuh scope: `databases`, `tables`, `columns`, `indexes`, `rows`, `buckets`, `files` (read & write).

### Fallback lokal (`DATA_DIR`)

`leads.json`, `projects.json`, `testimonials.json`, `articles.json`, `settings.json`, `client-projects.json`, `media/`, `private/`.

---

## 8. Environment variable

Lengkap dengan komentar di [`.env.example`](./.env.example).

| Variabel                                                       | Wajib                 | Keterangan                                                                                                            |
| -------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ADMIN_PASSWORD`                                               | ✅ untuk admin/portal | Minimal **12** karakter                                                                                               |
| `SESSION_SECRET`                                               | ✅ untuk admin/portal | Minimal **32 karakter acak** (`openssl rand -hex 32`). **Tanpa ini admin & portal nonaktif** (lihat §11)              |
| `SITE_URL`                                                     | disarankan            | Domain final; dipakai sitemap/robots                                                                                  |
| `VITE_SITE_URL`                                                | disarankan (build)    | Domain final untuk URL absolut og:image. Dibaca **saat build**                                                        |
| `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY` | ✅ produksi           | Tanpa ini memakai file lokal                                                                                          |
| `APPWRITE_*_TABLE_ID`, `APPWRITE_*_BUCKET_ID`                  | tidak                 | Default: `nandara`, `leads`, `projects`, `testimonials`, `articles`, `settings`, `client_projects`, `media`, `portal` |
| `COOKIE_SECURE`                                                | tidak                 | Default `true`. Set `false` hanya untuk http non-localhost                                                            |
| `DATA_DIR`                                                     | tidak                 | Folder fallback lokal (default `.data`)                                                                               |
| `VITE_GA_ID`, `VITE_PLAUSIBLE_DOMAIN`                          | tidak                 | Analytics (build time)                                                                                                |
| `PORT`, `HOST`                                                 | tidak                 | Server Node (default 3000)                                                                                            |

---

## 9. Menjalankan di lokal

```sh
bun install            # atau npm install
npm run dev            # pengembangan → http://localhost:8080
```

Production build:

```sh
npm run build
ADMIN_PASSWORD='sandi-minimal-12' SESSION_SECRET="$(openssl rand -hex 32)" npm start   # → :3000
```

Dengan Appwrite lokal (untuk uji integrasi): ikuti [`dev/appwrite/README.md`](./dev/appwrite/README.md) — Appwrite 2.6.2 minimal (API, worker, PostgreSQL, Redis; tanpa mount socket Docker), lalu:

```sh
export APPWRITE_ENDPOINT=http://127.0.0.1:9080/v1 APPWRITE_PROJECT_ID=nandara APPWRITE_API_KEY=...
npm run appwrite:setup
```

Perintah kualitas:

```sh
npm run check       # lint + typecheck + build
npm run test:e2e    # butuh build lebih dulu
```

---

## 10. Pengujian & CI

- **29 skenario Playwright** di `tests/e2e/`:
  - `public` — 7 halaman (200, satu `h1`, tanpa error console, tanpa scroll samping di 360 px), 404, sitemap/robots, og:image, menu HP + Esc, kalkulator + PDF + pesan WA
  - `leads` — validasi, simpan, badge lead baru (muncul & berkurang), status & catatan, export CSV, 401 tanpa login, sandi salah
  - `content` — proyek + foto + testimoni dari admin tampil di situs; upload tanpa login 401
  - `pricing` — validasi termin 100%, jenis pekerjaan baru dipakai kalkulator
  - `articles` — tulis/pratinjau, terjadwal tersembunyi, **XSS** (`<script>`, `javascript:`) tidak dieksekusi
  - `portal` — kode akses, login, dashboard, file privat (pemilik 200 / anonim 403 / `/media` 404), ganti kode, cabut akses
  - `security` — spam lead dengan IP palsu tetap dibatasi, login admin terkunci setelah 10 salah
- Server uji: port **3100**, `DATA_DIR=.data-test` (dihapus tiap run), sandi & secret uji di `playwright.config.ts`.
- Set `APPWRITE_*` di environment untuk menjalankan suite yang sama terhadap Appwrite sungguhan (sudah lolos terhadap 2.6.2).
- **CI** (`.github/workflows/ci.yml`): job `check` (lint, typecheck, build) + job `e2e` (install chromium, test, unggah hasil bila gagal).
- Tips menulis test: banyak teks muncul dua kali (kalkulator & tabel harga, tab & judul admin, tautan & tombol unduh). Pakai `getByRole(..., { exact: true })`, helper `chooseOption()` untuk pilihan kalkulator, dan selektor yang di-scope.

---

## 11. Keamanan

Review keamanan independen sudah dilakukan; temuan sudah diperbaiki & diuji.

- **Sesi**: cookie terenkripsi h3 (`nb_admin` 12 jam, `nb_portal` 30 hari), `httpOnly`, `sameSite=lax`, `secure`.
  ⚠️ h3 v2 (dipakai TanStack Start) menyegel cookie dengan **PBKDF2 1 iterasi** → kunci **harus** acak berentropi tinggi. Karena itu `SESSION_SECRET` ≥ 32 karakter **wajib**; tidak ada lagi turunan dari sandi.
- **Otorisasi**: setiap server function & route admin memanggil `isAdmin()`. Portal hanya membuka proyek di sesi klien yang `aktif`.
- **CSRF**: server functions dilindungi middleware CSRF TanStack (`src/start.ts`); route upload memeriksa `Origin` = host.
- **Upload**: tipe & **tanda tangan file** (magic bytes) diperiksa; PDF hanya untuk scope privat; batas ukuran.
- **XSS**: tidak ada `dangerouslySetInnerHTML`; artikel via `RichText` (hanya URL http(s)/path internal jadi tautan).
- **CSV**: nilai berawalan `= + - @ \t \r` dinetralkan.
- **Rate limit** (`src/server/rate-limit.ts`): IP diambil dari **hop terakhir** `X-Forwarded-For` (yang ditambahkan proxy). Bila hosting tidak memakai proxy yang menambahkan header ini, sesuaikan `clientIp()`.
- **Batas yang diketahui** (belum dikerjakan): sesi stateless — logout tidak membatalkan cookie yang sudah dicuri sampai kedaluwarsa; pembatas laju di memori proses (hilang saat restart, tidak dibagi antar instance); tidak ada batas ukuran body di level aplikasi untuk request anonim (atur di proxy/hosting).

---

## 12. Sistem desain

Sumber kebenaran: [`design.md`](./design.md). **Gaya aktif = §13 "Block × HDR"** (dipilih pemilik dari papan referensi):

- Referensi: [Block Renovation](https://www.blockrenovation.com/) (kerangka, tipografi, panel angka, tabel "Dengan vs Tanpa") × [HDR Remodeling](https://hdrremodeling.com/) (logo tengah, judul tengah kapital, foto bersudut diagonal, banner foto, footer gelap).
- Bingkai garis tipis (`border-garis`) di tepi konten & antar section.
- Judul berbobot normal; hero huruf kapital besar; subjudul **font mono**.
- Palet "Material Tropis": `arang #1C1A17`, `beton`, `abu`, `kapur #F6F2EA`, `pasir`, `batu`, `garis #E4D3A8`, **`emas #C9A35A`** (aksen logo), `emas-ink #7A5B26` (emas untuk teks di latar terang), `bata`.
- **Jangan**: kata serif-italic berwarna di judul, label "01 — LABEL" di atas setiap judul, grid blueprint, kartu ikon berulang, foto stok AI yang tidak relevan (pemilik menilai pola-pola ini "AI slop").
- Logo: `components/site/logo-mark.tsx` = SVG atap + gedung **digambar ulang** dari favicon resolusi rendah — **ganti dengan vektor resmi** bila tersedia. Favicon/og-image dibuat dari bentuk yang sama.
- Lighthouse mobile (terakhir diukur): beranda Performance ~91, halaman dalam 96–97; Accessibility/Best Practices/SEO 100 (kecuali `/pantau` SEO rendah karena sengaja `noindex`).

---

## 13. Deploy

### Rekomendasi: Appwrite Sites

1. Appwrite Cloud → buat project → **API Key** (scope di §7).
2. Jalankan `npm run appwrite:setup` dengan env Appwrite (sekali; aman diulang).
3. Appwrite Console → **Sites** → hubungkan repo `rfxvsl-lab/nandara-build`, framework **TanStack Start**:
   - Install: `npm install` · Build: `npm run build` · Output: `./.output`
4. Environment variable: `ADMIN_PASSWORD`, `SESSION_SECRET`, `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, `SITE_URL`, `VITE_SITE_URL` (+ opsional lain di §8).
5. Deploy → uji: kirim form survei, login admin, upload foto, buat proyek berjalan & login `/pantau`.
6. Pasang domain sendiri bila ada; perbarui `SITE_URL`/`VITE_SITE_URL` lalu build ulang.

Catatan: SDK `node-appwrite` v31 menargetkan Appwrite **2.6.x** (Cloud). Self-hosted versi lebih lama mungkin perlu SDK lebih lama.

### Alternatif: VPS / komputer sendiri + Tailscale Funnel

```sh
npm install && npm run build
# isi env (lihat §8), lalu
npm start                      # :3000
tailscale funnel --bg 3000     # URL publik https://<host>.<tailnet>.ts.net
```

Gunakan pengelola proses (systemd/pm2) agar server hidup terus. Jangan pakai mode penyimpanan lokal untuk data sungguhan — gunakan Appwrite.

### Yang TIDAK berhasil (agar tidak diulang)

- **Cloudflare quick tunnel dari container cloud Claude**: diblokir kebijakan jaringan (butuh koneksi ke `*.argotunnel.com:7844` & DNS SRV langsung; hanya HTTPS via proxy yang diizinkan).
- **Tailscale Funnel dari container cloud Claude**: berhasil tersambung (lewat proxy HTTPS), tetapi container sering di-restart/menganggur → semua proses mati → situs down. Hanya cocok untuk demo singkat.

---

## 14. Keputusan penting & alasannya

| Keputusan                                                | Alasan                                                                                                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lepas dari Lovable                                       | Pemilik ingin hosting mandiri (Appwrite)                                                                                                                                             |
| Desain v2 "Block × HDR"                                  | Desain sebelumnya dinilai "AI slop"; versi "Dokumen Proyek" (tanpa foto, gaya dokumen) **ditolak** pemilik dan di-revert. Pemilik memilih referensi No. 1 + 2 dari papan 6 referensi |
| Statistik & testimoni tidak dikarang                     | Section disembunyikan sampai ada data asli (lihat `design.md` §10)                                                                                                                   |
| Harga & termin diatur dari admin                         | Angka bisnis tidak boleh terkunci di kode; default hanya contoh                                                                                                                      |
| Portal klien tanpa OTP                                   | Tidak ada layanan WA/SMTP; kode 8 karakter × 4 digit WA + rate limit cukup untuk ancaman realistis                                                                                   |
| File klien di bucket terpisah                            | Agar tidak pernah bisa dibuka lewat `/media` publik                                                                                                                                  |
| Kompres foto di browser                                  | Tidak perlu library native (sharp) di server/hosting                                                                                                                                 |
| Artikel format teks sederhana, bukan HTML/Markdown penuh | Aman dari XSS tanpa sanitizer                                                                                                                                                        |
| `SESSION_SECRET` wajib                                   | Temuan keamanan (PBKDF2 1 iterasi di h3 v2)                                                                                                                                          |
| Tanpa notifikasi eksternal (Telegram dihapus)            | Keputusan pemilik: lead cukup masuk `/admin`; diganti badge jumlah lead _Baru_ di tab admin                                                                                          |

---

## 15. Jebakan yang sudah ditemukan

- **Import modul server**: kode di `src/server/` (memakai `node:fs`, `node-appwrite`) harus diimpor **dinamis di dalam handler** (`await import(...)`) agar tidak ikut bundle browser. Sudah dicek: `node-appwrite` tidak ada di bundle client.
- **`useSession` dari `@tanstack/react-start/server`** bukan React hook; di-alias `openSession` agar lint tidak protes.
- **`routeTree.gen.ts`** diperbarui saat `vite build`/`dev`. Jalankan build sebelum `tsc` bila menambah route.
- **Route bersarang**: pakai `portofolio.index.tsx` + `portofolio.$slug.tsx` (bukan `portofolio.tsx`, yang akan menjadi layout).
- **`exactOptionalPropertyTypes`** aktif di tsconfig: prop opsional yang bisa `undefined` perlu ditulis `x?: T | undefined`.
- **Cookie `Secure` di http lokal**: browser Chromium menerimanya di `localhost/127.0.0.1`, tetapi `APIRequestContext` Playwright tidak mengirimnya — uji unduhan CSV lewat klik, bukan `page.request`.
- **Test Playwright**: tunggu navigasi selesai sebelum membaca `h1` (halaman lama masih tampil saat loader berjalan).
- **Docker di container cloud** perlu `dockerd --storage-driver=overlay2`; proses latar dapat dimatikan lingkungan saat menganggur.

---

## 16. Pekerjaan tersisa (backlog)

**Butuh dari pemilik (prioritas):**

1. Akun Appwrite Cloud + API key → **go-live** (§13).
2. **Logo vektor resmi** (SVG/PNG besar) → ganti `logo-mark.tsx`, favicon, og-image.
3. Foto proyek asli (sebelum/proses/sesudah) → isi Portofolio lewat admin; ganti foto ilustrasi di `src/content/images.ts` (hero, cara kerja, layanan — saat ini foto stok bawaan Lovable yang terlihat AI).
4. Testimoni asli, artikel, harga per m² final, skema termin final, masa garansi.
5. URL Facebook (`CONTACT.facebook` di `src/content/site.ts`), alamat kantor, jam kerja, daftar kota layanan, NIB.
6. Konfirmasi apakah Nandara melayani pengurusan **PBG** (bisa jadi layanan + halaman).

**Teknis (bisa dikerjakan tanpa pemilik):**

- Tombol **hapus lead** di admin (saat ini hanya bisa diberi status _Batal_).
- Halaman per kota (`/area/:kota`) & per jenis pekerjaan untuk SEO lokal (data dari admin), plus JSON-LD `LocalBusiness` lengkap (alamat, jam) setelah data tersedia.
- Sesi admin yang bisa dicabut (simpan versi sesi di server).
- Rate limit yang persisten/terbagi (mis. di Appwrite/Redis) bila memakai banyak instance.
- OTP WhatsApp untuk portal bila ada WhatsApp Business API.
- Notifikasi email (butuh SMTP).

---

## 17. Riwayat singkat

| Commit                | Isi                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `f51ca91`             | Upload ZIP awal (proyek Lovable)                                                                            |
| `463075f`, `b914342`  | Analisa repo, roadmap, `design.md` v1, rencana redesain                                                     |
| `a1cde52` – `2b0a211` | Tahap A–E: lepas Lovable, token desain, komponen, beranda baru, halaman dalam, performa, analytics, sitemap |
| `a72efbe` → `4d3baa3` | Redesain "Dokumen Proyek" — **ditolak & di-revert**                                                         |
| `1f1af12`, `8d8d42f`  | Redesain v2 "Block × HDR", logo SVG, favicon                                                                |
| `867ce32`             | Form survei tersimpan + dashboard lead                                                                      |
| `f9cc005`             | Admin portofolio & testimoni, `/portofolio`                                                                 |
| `e3cde42`             | Kalkulator v2: harga & termin dari admin, PDF                                                               |
| `94bfe2a`             | Portal klien `/pantau`                                                                                      |
| `0c7daf5`             | Verifikasi Appwrite 2.6.2 sungguhan, `dev/appwrite`                                                         |
| `f1157df`             | Suite e2e Playwright + CI                                                                                   |
| `34a0d6e`             | Perbaikan hasil review keamanan                                                                             |
| `9fccc30`             | Artikel/blog dari admin                                                                                     |
| `d616715`             | og:image, rapikan, AGENTS.md                                                                                |
| `dc63e20`             | `dokumentasi.md` (dokumen serah terima)                                                                     |
| `5331af2`             | Hapus notifikasi Telegram (keputusan pemilik); badge jumlah lead _Baru_ di admin                            |
