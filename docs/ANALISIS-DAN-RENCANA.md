# Nandara Build — Analisa Repo & Rencana Pengembangan

_Tanggal analisa: 9 November 2026 · Basis: `nandara-build-source.zip` (commit `f51ca91`)_

---

## 1. Ringkasan Singkat

| Aspek | Status |
| --- | --- |
| Jenis web | Landing page satu halaman untuk **Nandara Build** (jasa arsitek, RAB, kontraktor & renovasi — Jawa Timur) |
| Dibuat dengan | Lovable (AI builder) → TanStack Start + React 19 + Tailwind CSS v4 + shadcn/ui |
| Target deploy | Cloudflare Workers (lewat Nitro, SSR) |
| Build (`vite build`) | ✅ Berhasil (~0,5 detik) |
| Type-check (`tsc --noEmit`) | ✅ Lolos tanpa error |
| Lint (`eslint .`) | ❌ 13 error (format Prettier) + 6 warning |
| Tampilan | ✅ Rapi di desktop & mobile, tidak ada scroll horizontal |
| Bug yang terlihat | ❌ **Logo tidak tampil** di luar editor Lovable (404) |
| Fitur bisnis | Hanya tombol WhatsApp — belum ada portofolio, testimoni, form, kalkulator, blog |

**Kesimpulan:** fondasi teknis dan desain visualnya sudah bagus (brand navy–gold konsisten, copywriting jelas). Kelemahan utamanya bukan di kode, tetapi di **cara repo disimpan (hanya ZIP)**, **beberapa bug kecil yang merusak kesan profesional**, dan **belum adanya konten pembuktian (portofolio/testimoni) serta jalur konversi selain WhatsApp**.

---

## 2. Struktur Repo

Repo saat ini **hanya berisi satu file**: `nandara-build-source.zip` (1,2 MB). Isinya (80 file):

```
src/
├── routes/
│   ├── __root.tsx          # shell HTML, meta SEO global, font, 404 & error page
│   └── index.tsx           # SELURUH landing page (≈550 baris, 7 section)
├── components/
│   ├── site/nandara.tsx    # komponen brand: Section, Eyebrow, Italic, GoldButton, GhostButton + nomor WA
│   └── ui/*.tsx            # 46 komponen shadcn/ui — TIDAK ADA yang dipakai
├── assets/                 # 4 foto JPG (230–346 KB) + logo (pointer JSON ke CDN Lovable)
├── lib/                    # utils, error capture/reporting (khusus Lovable)
├── server.ts, start.ts     # SSR entry + middleware error & CSRF
├── router.tsx, routeTree.gen.ts
└── styles.css              # design token (oklch), brand layer navy/gold
public/ favicon.png, robots.txt
roadmap.md                  # checklist awal Lovable (semua item sudah dikerjakan tapi belum dicentang)
```

### Section halaman (urutan tampil)
1. **Header** — logo, nav anchor, tombol "Konsultasi Gratis" (WA), menu hamburger mobile
2. **Hero** — foto villa, headline "Solusi Konstruksi & Renovasi *Tanpa Repot*", 2 CTA, 3 kartu keunggulan
3. **Layanan** — 3 kartu: Arsitektur & Desain, Perencanaan & RAB, Kontraktor & Renovasi
4. **Mengapa Kami** — 5 alasan (gratis survei, gratis desain, SPK resmi, tepat waktu, RAB jujur)
5. **Visi & Misi**
6. **Promo** — callout gelap "Niat Mau Hemat… Biaya *Malah Membengkak?*"
7. **Footer/Kontak** — WA 0851-9418-9182, Instagram @nandara_build, Facebook

---

## 3. Temuan Detail

### 3.1 Masalah Kritis (perbaiki dulu)

| # | Temuan | Lokasi | Dampak |
| --- | --- | --- | --- |
| K1 | **Source code disimpan sebagai ZIP**, bukan file. Tidak ada riwayat perubahan, tidak bisa di-review, tidak bisa CI/CD, tidak bisa sinkron dua arah dengan Lovable. | root repo | Pengembangan ke depan nyaris mustahil dikelola |
| K2 | **Logo rusak (404)**. `nandara-logo.png.asset.json` menunjuk ke `/__l5e/assets-v1/...` yang hanya ada di hosting Lovable. Di mobile header hanya tampil teks "Logo" (alt text) karena nama brand disembunyikan `< sm`. | `src/assets/nandara-logo.png.asset.json`, `index.tsx` header & footer | Kesan pertama tidak profesional; brand hilang di HP |
| K3 | **Link Facebook menuju `https://facebook.com/`** (beranda Facebook, bukan halaman bisnis). | `index.tsx` footer | Calon klien "nyasar" |
| K4 | **Meta `twitter:site` = `@Lovable`** dan tidak ada `og:image`. Saat link dibagikan di WA/FB/IG, tidak ada gambar preview. | `__root.tsx` | Share link terlihat kosong; atribusi salah |

### 3.2 Masalah Sedang

- **Lint gagal** (13 error Prettier di `index.tsx`) → bisa diperbaiki otomatis dengan `eslint --fix`.
- **Klaim tidak konsisten**: kartu hero menulis "Free Design & Survey — Konsultasi awal tanpa biaya", tapi section *Mengapa Kami* menjelaskan gratis desain **hanya untuk klien yang lanjut konstruksi**. Berisiko komplain.
- **46 komponen shadcn/ui + ±30 dependency tidak terpakai** (recharts, cmdk, embla, react-day-picker, vaul, dll.). Tidak membebani bundle (di-tree-shake) tapi membebani maintenance & update keamanan.
- **Gambar tidak dioptimasi**: JPG 1200–1920 px, 230–346 KB, tanpa WebP/AVIF/`srcset`. Hero tidak di-*preload* → LCP lambat di 4G.
- **Foto terlihat seperti AI/stock** (mis. villa sunset di tepi pantai) — kurang relevan untuk kontraktor rumah tinggal di Jawa Timur dan tidak membuktikan hasil kerja nyata.
- **Aksesibilitas**: tombol hamburger tidak punya `aria-expanded`/`aria-controls`; menu tidak menutup dengan `Esc`; tidak ada *skip link*; tidak ada `prefers-reduced-motion` untuk animasi `animate-rise`.
- **SEO lokal belum ada**: tidak ada `sitemap.xml`, canonical URL, structured data `LocalBusiness`/`GeneralContractor`, alamat fisik, jam operasional, atau Google Maps.
- **Tidak ada analytics/tracking konversi** — tidak bisa tahu berapa klik WA per hari atau dari mana pengunjung datang.
- **Link WA tanpa pesan template** (`https://wa.me/6285194189182`) — pengunjung harus mengetik sendiri; tidak bisa tahu klik dari tombol mana.
- **Copyright tahun ditulis manual** (`© 2026`) — akan basi tahun depan.
- **Konten di-hardcode di komponen** (layanan, alasan, misi) — tiap ubah teks harus ubah kode.
- **Error reporting khusus Lovable** (`lovable-error-reporting.ts`) tidak berfungsi di production di luar editor.
- `README.md` masih template Lovable; `roadmap.md` semua item belum dicentang padahal sudah selesai; nama package `tanstack_start_ts`.

### 3.3 Kekuatan yang Perlu Dipertahankan

- Identitas visual kuat & konsisten: navy `#1E293B`, gold `#D4AF37`, Plus Jakarta Sans + aksen serif italic Cormorant.
- Copywriting bahasa Indonesia yang langsung menyentuh *pain point* (biaya membengkak, borongan tanpa SPK).
- Responsif, tidak ada overflow horizontal di 390 px.
- TypeScript strict mode, SSR, middleware CSRF sudah terpasang — siap dikembangkan ke fitur dinamis (form, CMS).
- Komponen brand (`GoldButton`, `Section`, `Eyebrow`) sudah reusable.

---

## 4. Rencana Ke Depan (Roadmap Spesifik)

Tujuan bisnis utama web ini: **mengubah pengunjung menjadi permintaan survei/konsultasi yang terukur**, dan **membangun kepercayaan** sebelum calon klien menghubungi.

**Target KPI 6 bulan**
- ≥ 60 leads/bulan (klik WA + form) dengan ≥ 30% berasal dari Google organik/Maps
- Lighthouse mobile: Performance ≥ 90, SEO 100, Accessibility ≥ 95
- Halaman 1 Google untuk "kontraktor renovasi rumah [kota]" di 3 kota utama
- Waktu respons lead < 1 jam di jam kerja

---

### Fase 0 — Beres-beres Fondasi (Minggu 1)

| Tugas | Detail | Selesai bila |
| --- | --- | --- |
| Ekstrak ZIP ke repo | Commit isi `nandara-build-source.zip` sebagai file biasa, hapus ZIP, sambungkan repo ini ke Lovable via GitHub sync (atau putuskan lepas dari Lovable) | `git log` menampilkan perubahan per file |
| Perbaiki logo | Simpan `nandara-logo.png` (+ versi SVG) di `src/assets/`, import langsung; tampilkan teks "NANDARA BUILD" juga di mobile | Logo tampil di localhost & production |
| Perbaiki link & meta | URL Facebook asli, hapus `@Lovable`, tambah `og:image` 1200×630 bergambar logo + tagline, `canonical`, `theme-color` | Preview di WhatsApp/Facebook Debugger tampil benar |
| Lint & format | `eslint --fix`, tambah script `typecheck` | `npm run lint` hijau |
| CI | GitHub Actions: install → lint → typecheck → build pada setiap PR | Badge CI hijau |
| Rapikan dependency | Hapus komponen `ui/*` & paket yang tidak dipakai (bisa ditambah lagi via `shadcn add` saat dibutuhkan) | `package.json` ramping |
| Konsistensi klaim | Ubah kartu hero menjadi "Gratis Survei & Konsultasi" atau tambahkan "*syarat berlaku*" | Copy hero = copy *Mengapa Kami* |
| Dokumentasi | README berbahasa Indonesia: cara jalanin, struktur, cara ganti nomor WA/konten | README baru |

### Fase 1 — Konversi & Kepercayaan (Minggu 2–4)

1. **Section Portofolio / Proyek Selesai** — 6–9 proyek nyata (foto *before–after*, lokasi, luas, durasi, jenis pekerjaan). Ganti foto AI/stock dengan foto proyek sendiri. Ini elemen paling penting untuk kontraktor.
2. **Section Testimoni** — 3–5 testimoni klien (nama, kota, foto/rekaman singkat), plus tautan ke ulasan Google Business Profile.
3. **Section Alur Kerja (4–6 langkah)** — Konsultasi → Survei → Desain & RAB → SPK → Pembangunan → Serah terima & garansi. Menjawab "prosesnya bagaimana?".
4. **FAQ** (accordion, sekaligus FAQ schema untuk Google) — biaya survei, area layanan, sistem pembayaran termin, lama garansi, apakah bisa renovasi sebagian, dsb.
5. **Tombol WhatsApp melayang (floating)** di pojok kanan bawah + **pesan template per tombol**, contoh:
   `https://wa.me/6285194189182?text=Halo%20Nandara%20Build,%20saya%20ingin%20konsultasi%20renovasi%20rumah%20di%20...`
6. **Form "Minta Survei Gratis"** (nama, no. WA, kota, jenis pekerjaan, perkiraan budget, luas) memakai `react-hook-form` + `zod` (sudah ada di dependency) dan *server function* TanStack Start → kirim ke email/Telegram/Google Sheets. Memberi jalur bagi orang yang belum mau chat.
7. **Area layanan** — daftar kota (mis. Surabaya, Sidoarjo, Gresik, Malang, dst. — sesuaikan) + peta, alamat kantor/workshop, jam operasional.
8. **Bukti legal** — tampilkan NIB/legalitas badan usaha, contoh SPK & contoh RAB (PDF yang di-*blur* sebagian) sebagai penguat klaim "SPK Resmi & RAB Transparan".

### Fase 2 — SEO Lokal & Performa (Bulan 2)

1. **Pisah menjadi multi-halaman** (TanStack file routes):
   - `/layanan/desain-arsitektur`, `/layanan/rab`, `/layanan/kontraktor-renovasi`
   - `/portofolio` dan `/portofolio/$slug`
   - `/area/$kota` (halaman lokal per kota — konten unik, bukan copy-paste)
   - `/tentang`, `/kontak`
2. **Structured data JSON-LD**: `GeneralContractor`/`HomeAndConstructionBusiness` (nama, telepon, alamat, `areaServed`, `sameAs` ke IG/FB), `FAQPage`, `BreadcrumbList`.
3. **`sitemap.xml`** otomatis + daftarkan ke Google Search Console & Bing Webmaster; optimalkan **Google Business Profile**.
4. **Optimasi gambar**: konversi ke AVIF/WebP, `srcset` responsif, `fetchpriority="high"` + preload untuk hero, `loading="lazy"` untuk sisanya. Target total gambar halaman utama < 400 KB.
5. **Font**: self-host Plus Jakarta Sans & Cormorant (subset latin) agar tidak bergantung ke Google Fonts dan mengurangi CLS.
6. **Aksesibilitas**: `aria-expanded`, tutup menu dengan `Esc`, skip link, `prefers-reduced-motion`, cek kontras teks `navy/60` di latar putih.
7. **Analytics & konversi**: Google Analytics 4 / Plausible + event `click_whatsapp` (dengan parameter lokasi tombol), `submit_form`; Meta Pixel jika akan beriklan di IG/FB.

### Fase 3 — Konten & Fitur Pembeda (Bulan 3–4)

1. **Kalkulator Estimasi Biaya** — pengguna pilih jenis pekerjaan (bangun baru / renovasi / interior), luas m², kualitas (standar/menengah/premium) → estimasi rentang harga + CTA "Dapatkan RAB detail gratis". Fitur ini sangat sesuai dengan positioning "RAB transparan" dan menjadi magnet leads. Data harga per m² disimpan di satu file konfigurasi agar mudah diperbarui.
2. **Blog / Artikel** (MDX atau headless CMS): topik seperti "Biaya bangun rumah per m² di Jawa Timur 2027", "Cara membaca RAB", "Ciri-ciri borongan nakal", "Checklist sebelum tanda tangan SPK". Target 2–4 artikel/bulan untuk SEO.
3. **Pindahkan konten ke CMS** (mis. Sanity, Decap CMS, atau Google Sheets sederhana) agar admin bisa menambah proyek, testimoni, artikel tanpa ubah kode.
4. **Katalog paket** (opsional) — paket desain, paket renovasi kamar mandi/dapur/fasad dengan harga mulai dari.

### Fase 4 — Platform Klien (Bulan 5–6+, opsional sesuai pertumbuhan)

1. **Dashboard admin leads** — daftar permintaan survei, status (baru → disurvei → RAB dikirim → deal/tidak), catatan; database ringan (Cloudflare D1 / Supabase karena target deploy sudah Cloudflare).
2. **Portal klien** — login via nomor WA/OTP (`input-otp` sudah tersedia), klien bisa melihat progres proyek (foto mingguan), jadwal (*time schedule*), termin pembayaran, dokumen SPK & RAB. Ini mewujudkan janji "Proyek terpantau rapi".
3. **Generator RAB/penawaran PDF** dari dashboard admin.
4. **Dua bahasa (ID/EN)** jika menyasar klien ekspatriat/developer.

---

## 5. Prioritas Eksekusi (Urutan yang Disarankan)

| Prioritas | Item | Usaha | Dampak |
| --- | --- | --- | --- |
| 1 | Ekstrak ZIP + CI + lint | Kecil | Tinggi (fondasi) |
| 2 | Perbaiki logo, link FB, meta/OG image | Kecil | Tinggi |
| 3 | Floating WA + pesan template + analytics event | Kecil | Tinggi |
| 4 | Portofolio + testimoni dengan foto asli | Sedang (butuh materi dari tim) | Sangat tinggi |
| 5 | Alur kerja + FAQ + area layanan | Kecil | Sedang–tinggi |
| 6 | Form survei gratis | Sedang | Tinggi |
| 7 | Optimasi gambar & font | Kecil | Sedang |
| 8 | Multi-halaman + JSON-LD + sitemap + Google Business | Sedang | Tinggi (jangka panjang) |
| 9 | Kalkulator estimasi biaya | Sedang | Tinggi (pembeda) |
| 10 | Blog + CMS | Sedang | Tinggi (jangka panjang) |
| 11 | Dashboard leads & portal klien | Besar | Sedang–tinggi |

---

## 6. Yang Dibutuhkan dari Pemilik Bisnis

Agar Fase 1–2 bisa dikerjakan, siapkan:
- File logo resolusi tinggi (PNG transparan / SVG)
- 6–9 proyek: foto sebelum & sesudah, lokasi, luas, durasi, jenis pekerjaan
- 3–5 testimoni klien (dengan izin)
- URL Facebook bisnis yang benar, alamat kantor, jam operasional, daftar kota layanan
- Domain final (mis. `nandarabuild.com`) dan keputusan: tetap pakai Lovable atau kelola penuh lewat GitHub
- Data harga per m² (untuk kalkulator) dan kebijakan garansi (berapa lama, mencakup apa)
