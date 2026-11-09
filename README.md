# Nandara Build — Website

Website resmi **Nandara Build**: jasa arsitektur, perencanaan RAB, dan kontraktor bangun/renovasi rumah di Jawa Timur.

Dibangun dengan TanStack Start (React 19, SSR), Tailwind CSS v4, dan TypeScript.

## Menjalankan di komputer sendiri

Butuh **Node.js 22+** (atau [Bun](https://bun.sh)).

```sh
npm install          # atau: bun install
npm run dev          # mode pengembangan → http://localhost:8080
```

Build & jalankan versi production:

```sh
npm run build        # hasil di ./.output
npm start            # server Node → http://localhost:3000 (atur dengan env PORT)
```

Cek kualitas sebelum commit:

```sh
npm run check        # lint + typecheck + build
```

## Struktur

| Lokasi                 | Isi                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `design.md`            | **Sistem desain** (warna, font, komponen, aturan). Wajib dibaca sebelum mengubah UI. |
| `src/content/site.ts`  | Semua teks & data: nomor WhatsApp, layanan, alasan, visi-misi. Ubah konten di sini.  |
| `src/routes/`          | Halaman (file-based routing). `index.tsx` = beranda.                                 |
| `src/components/site/` | Komponen brand Nandara (tombol, section, label).                                     |
| `src/components/ui/`   | Komponen dasar (shadcn/ui) yang sudah disesuaikan token.                             |
| `src/styles.css`       | Token desain Tailwind.                                                               |
| `src/assets/`          | Logo & foto.                                                                         |
| `docs/`                | Analisa, roadmap, dan rencana redesain.                                              |

### Mengganti nomor WhatsApp

Ubah `CONTACT.whatsappDisplay` dan `CONTACT.whatsappIntl` di `src/content/site.ts`.

## Halaman

| URL                           | Isi                                         |
| ----------------------------- | ------------------------------------------- |
| `/`                           | Beranda                                     |
| `/layanan`                    | Detail 3 layanan                            |
| `/proses`                     | 6 langkah kerja, contoh RAB & SPK, FAQ      |
| `/estimasi-biaya`             | Kalkulator + tabel harga acuan per m²       |
| `/tentang`                    | Visi, misi, nilai                           |
| `/kontak`                     | Form survei gratis (dikirim lewat WhatsApp) |
| `/sitemap.xml`, `/robots.txt` | Dibuat otomatis                             |

## Data yang perlu diisi (`src/content/site.ts`)

- **Proyek & testimoni** — diisi lewat `/admin` (tidak perlu ubah kode).
- `RAB_SAMPLE` — ganti dengan cuplikan RAB asli (boleh disamarkan).
- `CONTACT.facebook` — URL halaman Facebook.
- Foto ilustrasi di `src/assets/` + `src/content/images.ts` (hero, cara kerja, layanan) — ganti dengan foto proyek asli.

## Form survei & dashboard admin

- Form di `/kontak` menyimpan lead ke **Appwrite** (bila `APPWRITE_*` diisi) atau ke file lokal `.data/leads.json` (uji coba).
- Setelah kirim, klien bisa lanjut chat WhatsApp dengan pesan yang sudah terisi.
- **Dashboard**: buka `/admin`, masuk dengan `ADMIN_PASSWORD`. Fitur: filter status (Baru → Sudah dihubungi → Sudah disurvei → RAB dikirim → Deal / Batal), cari, catatan internal, tombol WhatsApp ke klien, **Export CSV**.
- Notifikasi lead baru ke Telegram bila `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID` diisi.
- Anti-spam: honeypot + batas 5 kiriman / 10 menit per IP.

### Portofolio & testimoni (dari admin)

- Tab **Portofolio**: tambah/ubah/hapus proyek, unggah foto _sebelum_, _sesudah_, dan _galeri_ (dikompres otomatis di browser ke WebP maks. 2000 px), keterangan foto, urutan, dan tombol _Tampilkan di website_.
- Tab **Testimoni**: tambah/ubah/hapus kutipan klien.
- Beranda otomatis menampilkan **Proyek pilihan** (3 teratas) dan **Kata klien kami** bila ada yang ditampilkan. Proyek juga masuk `sitemap.xml`.
- Foto disimpan di Appwrite Storage (bucket `media`) atau `.data/media/` saat uji coba, dan disajikan lewat `/media/:id`.

### Harga & termin (dari admin)

- Tab **Harga & termin**: ubah harga acuan per m² (dalam juta, mis. `4,5`) untuk tiap jenis pekerjaan & kualitas, tambah jenis pekerjaan baru, atur skema termin (total harus 100%) dan tanggal pembaruan.
- Kalkulator di beranda & `/estimasi-biaya` langsung memakai angka terbaru, termasuk **simulasi termin** dan **unduh PDF estimasi** berkop Nandara Build.

### Menyiapkan Appwrite (sekali)

1. Appwrite Console → buat project → **API Keys** → buat key dengan scope `databases`, `tables`, `columns`, `indexes`, `rows`, `buckets`, `files` (read & write).
2. Jalankan:
   ```sh
   APPWRITE_ENDPOINT=... APPWRITE_PROJECT_ID=... APPWRITE_API_KEY=... npm run appwrite:setup
   ```
3. Isi env yang sama di Appwrite Sites, lalu deploy ulang.

Semua environment variable ada di `.env.example`.

## Analytics

Isi `VITE_GA_ID` (Google Analytics 4, format `G-XXXX`) atau `VITE_PLAUSIBLE_DOMAIN`, lalu build ulang. Event `click_whatsapp`, `submit_form`, dan `use_calculator` terkirim otomatis. Lihat `src/lib/analytics.ts`.

## Deploy ke Appwrite Sites

1. Appwrite Console → **Sites** → **Create site** → hubungkan repo GitHub ini.
2. Framework: **TanStack Start**.
3. Pengaturan build:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `./.output`
4. Environment variable (Settings → Environment variables):
   - `SITE_URL` = domain final, mis. `https://nandarabuild.com` (dipakai di `sitemap.xml` & `robots.txt`)
5. Deploy. SSR aktif otomatis.

Referensi: [Appwrite — TanStack Start quick start](https://appwrite.io/docs/products/sites/quick-start/tanstack-start).
