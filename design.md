# design.md — Sistem Desain Nandara Build

> Dokumen ini adalah **acuan wajib** untuk semua pekerjaan UI Nandara Build.
> Kalau ada keputusan desain yang tidak tercantum di sini, tambahkan dulu ke dokumen ini, baru diterapkan di kode.

_Versi 1.0 · 9 November 2026_

---

## 0. Dari Mana Acuan Ini Diambil?

Acuan desain **tidak** diambil dari selera atau tren semata. Ada tiga sumber, dengan urutan prioritas:

### 0.1 Identitas Nandara sendiri (prioritas tertinggi)
| Sumber | Yang diambil |
| --- | --- |
| **Logo** (atap + garis gedung, huruf serif kapital "NANDARA", "BUILD" berjarak lebar, warna emas metalik) | Warna emas `#C9A35A` (diambil dari piksel logo: `#BEA065`–`#EAD8A0`), karakter **klasik-kokoh**, garis vertikal gedung → motif garis/grid |
| **Tagline** "We Design. We Build. You Enjoy." | Struktur 3 tahap → alur visual Desain → Bangun → Nikmati |
| **Janji bisnis**: RAB 100% transparan, SPK resmi, tepat waktu, gratis survei | Desain harus **memperlihatkan bukti**: tabel RAB, dokumen SPK, jadwal, angka |
| **Pasar**: rumah tinggal di Jawa Timur, calon klien membuka web dari **HP** lalu chat **WhatsApp** | Mobile-first, WhatsApp sebagai CTA utama, ringan untuk 4G |
| **roadmap.md** awal (navy `#1E293B`, gold `#D4AF37`, Plus Jakarta Sans + serif italic) | Dipertahankan sebagai fondasi agar brand tidak berubah total |

### 0.2 Riset kompetitor & pola web kontraktor
| Referensi | Pelajaran yang dipakai |
| --- | --- |
| [Mitrarenov](https://www.mitrarenov.com/) (kontraktor nasional) | Pola yang terbukti di pasar Indonesia: angka statistik proyek, alur 6 langkah (order → survei → RAB → bangun → pantau → garansi), testimoni + rating Google, area layanan, galeri progres. **Kelemahannya**: terlalu banyak banner & section (±20) → Nandara harus lebih **ringkas dan tenang** agar terasa premium. |
| [Mitrabangun.id buka cabang Surabaya (JPNN)](https://www.jpnn.com/news/mitrabangunid-kini-buka-cabang-di-surabaya) | Kompetitor langsung sudah masuk Jawa Timur → pembeda Nandara: **transparansi yang bisa dilihat**, bukan sekadar diklaim. |
| [Freshy Sites — 50 Best Contractor Websites 2026](https://freshysites.com/web-design-development/top-contractor-websites/) | Dalam beberapa detik pengunjung harus tahu: *apa yang dikerjakan, apakah melayani daerah saya, apakah bisa dipercaya*. |
| [CyberOptik — Remodeling Website Design](https://www.cyberoptik.net/blog/remodelling-company-website-design/), [ProWeb365](https://proweb365.com/remodeling-marketing/website-design/) | Portofolio **before–after** per jenis pekerjaan + deskripsi singkat; slider before/after untuk proyek unggulan; halaman biaya & durasi. |
| [Calconic — Renovation Cost Calculator](https://www.calconic.com/calculator-widgets/home-renovation-cost-calculator) | Kalkulator biaya membuat pengunjung bertahan; harus memberi **rentang**, bukan angka pasti, dan berujung ke konsultasi. |
| [Archify — Cara menghitung RAB](https://www.archify.com/id/archifynow/sebelum-membuat-rumah-impian-yuk-perhatikan-cara-menghitung-rab-bangunan), [Mega Syariah — Estimasi biaya bangun rumah 2026](https://www.megasyariah.co.id/id/artikel/edukasi-tips/simpanan/estimasi-biaya-bangun-rumah-2026) | Metode luas × harga/m² yang sudah dipahami orang awam → dasar UI kalkulator. |
| [PXL Peak — Contractor Website UX Checklist](https://pxlpeak.com/blog/web-design/best-contractor-website-designs-2026) | Konten harga/tanggal yang basi merusak kepercayaan → semua angka harus punya label "diperbarui [bulan tahun]". |

### 0.3 Bahasa visual arsitektur (Indonesia & editorial)
| Referensi | Pelajaran yang dipakai |
| --- | --- |
| [Andra Matin — Tropicality (Wallpaper*)](https://wallpaper.com/architecture/andra-matin-new-book-tropicality), [Dezeen — Indonesian houses](https://www.dezeen.com/tag/indonesian-houses/) | Palet material jujur: **beton, kayu, bata, kapur**; tropis modern (atap lebar, teritis, bayangan). → Warna netral hangat, foto dengan cahaya alami & bayangan nyata. |
| [Docomomo — Tropical Architecture in Indonesian Modernism](https://docomomojournal.com/index.php/journal/article/view/33) | Identitas arsitektur lokal, bukan villa Eropa/pantai → foto harus rumah yang relevan dengan Jawa Timur. |
| [TheeDigital — Web Design Trends 2026](https://www.theedigital.com/?p=34345), [PaperStreet — 2026 trends](https://www.paperstreet.com/blog/2026-law-firm-website-design-trends/) | Tipografi editorial (judul besar + keterangan kecil), grid tegas, margin lega, hierarki jelas. Animasi teks **secukupnya** demi aksesibilitas. |
| Gambar kerja arsitek (denah, potongan, notasi ukuran) | Motif **"blueprint"**: garis grid tipis, nomor bagian `01 / 02`, label teknis kecil, garis ukur. Menjadi ciri khas Nandara: *"arsitektural, tapi mudah dipahami"*. |

---

## 1. Konsep Besar: **"Dari Gambar Kerja ke Kunci Rumah"**

Seluruh web dibaca seperti **satu set dokumen proyek** yang rapi: gambar kerja → RAB → SPK → jadwal → serah terima.
Pengunjung harus merasa: *"Kontraktor ini teliti, dan semuanya bisa saya periksa."*

### Prinsip Desain (urut prioritas)
1. **Bukti, bukan klaim.** Setiap klaim ("RAB transparan", "tepat waktu") wajib didampingi bukti visual: contoh tabel RAB, cuplikan SPK, foto progres, jadwal, testimoni nyata.
2. **Angka yang bisa diperiksa.** Angka tampil dengan angka tabular, satuan jelas (m², hari, Rp), dan tanggal pembaruan.
3. **Arsitektural, tapi mudah.** Gunakan bahasa visual gambar kerja (grid, garis ukur, label), tetapi teks tetap bahasa sehari-hari, tanpa istilah teknis yang tidak dijelaskan.
4. **WhatsApp-first, mobile-first.** Desain dimulai dari layar 360–390 px. CTA WhatsApp selalu dalam jangkauan jempol.
5. **Tenang & premium, bukan ramai.** Sedikit warna, banyak ruang kosong, satu pesan per section. Lawan dari web kontraktor yang penuh banner.
6. **Ringan.** Target halaman utama < 1 MB total, LCP < 2,5 detik di 4G.

### Kepribadian brand
| Kami adalah… | Kami bukan… |
| --- | --- |
| Teliti, jujur, rapi | Kaku, birokratis |
| Hangat, membumi (Jawa Timur) | Mewah berlebihan, sok eksklusif |
| Percaya diri dengan bukti | Penuh janji tanpa data |
| Arsitektural | Template "tukang borongan" |

---

## 2. Warna

Palet dibangun dari **emas logo** + **navy** (warna brand sebelumnya) + **netral material** (kapur, batu, beton).

### 2.1 Token
| Token | Hex | Peran |
| --- | --- | --- |
| `--ink` | `#14213D` | Teks utama, latar section gelap paling pekat |
| `--navy` | `#1E293B` | Latar gelap (hero, footer, callout), teks judul |
| `--navy-700` | `#334155` | Teks sekunder di latar terang |
| `--gold` | `#C9A35A` | Aksen brand: tombol utama, garis, ikon **di latar gelap** |
| `--gold-300` | `#EAD8A0` | Highlight lembut, latar badge di section gelap |
| `--gold-ink` | `#8A6A2B` | Emas untuk **teks/ikon di latar terang** (kontras ≥ 4,5:1) |
| `--paper` | `#FAF7F0` | Latar halaman utama (kapur hangat, bukan putih dingin) |
| `--white` | `#FFFFFF` | Kartu, tabel, form |
| `--sand` | `#F2EBDD` | Latar section selang-seling |
| `--stone` | `#E9E4D8` | Garis/border, garis grid blueprint |
| `--concrete` | `#6B6A65` | Teks keterangan, label, metadata |
| `--success` | `#2F7D4F` | Status selesai, centang |
| `--danger` | `#B3261E` | Error form |
| `--whatsapp` | `#25D366` | **Hanya** untuk ikon WhatsApp kecil, bukan tombol penuh |

### 2.2 Aturan kontras (sudah diuji, WCAG 2.2)
| Kombinasi | Rasio | Boleh untuk |
| --- | --- | --- |
| `ink` di `paper` | 14,9 : 1 | Semua teks |
| `navy` di `paper` | 13,7 : 1 | Semua teks |
| `gold-ink` di `paper` | 4,7 : 1 | Teks ≥ 14 px, ikon, link |
| `concrete` di `paper` | 5,1 : 1 | Keterangan kecil |
| `gold` di `navy` | 6,2 : 1 | Teks & ikon di section gelap |
| `navy` di `gold` | 6,2 : 1 | Label tombol utama |
| ❌ `gold` di `paper`/putih | 2,2 : 1 | **Dilarang** untuk teks. Hanya untuk garis dekoratif |

### 2.3 Proporsi
- **70%** netral terang (`paper`, `white`, `sand`)
- **20%** navy/ink
- **10%** emas, dan hanya untuk hal yang penting: CTA, angka kunci, garis aksen
- Satu layar HP **maksimal satu tombol emas**.

---

## 3. Tipografi

| Peran | Font | Alasan |
| --- | --- | --- |
| **Sans (utama)** | **Plus Jakarta Sans** (400, 500, 600, 700, 800) | Dibuat oleh studio Indonesia (Tokotype) untuk identitas kota Jakarta. Lokal, modern, sangat terbaca. Dipertahankan dari versi sebelumnya. |
| **Serif (aksen judul)** | **Instrument Serif** (regular & italic) | Menggemakan huruf serif kapital di logo. Lebih tebal & tajam dari Cormorant sehingga tetap terbaca di HP. Dipakai **hanya** untuk 1–3 kata penekanan per judul. |
| **Mono (label teknis)** | **JetBrains Mono** (500), huruf kapital | Untuk label gaya gambar kerja: `01 — LAYANAN`, `LUAS 120 M²`, `DURASI 98 HARI`. |

Semua font di-**self-host** (subset Latin, `font-display: swap`). Tidak memakai Google Fonts CDN.

### 3.1 Skala (mobile → desktop, pakai `clamp()`)
| Token | Ukuran | Line-height | Pemakaian |
| --- | --- | --- | --- |
| `display` | 40 → 72 px | 1.02 | Judul hero (1× per halaman) |
| `h1` | 32 → 52 px | 1.08 | Judul halaman dalam |
| `h2` | 28 → 40 px | 1.12 | Judul section |
| `h3` | 20 → 24 px | 1.25 | Judul kartu |
| `body-lg` | 17 → 19 px | 1.6 | Paragraf pembuka |
| `body` | 16 px | 1.65 | Paragraf umum (**minimum 16 px** di HP) |
| `small` | 14 px | 1.5 | Keterangan |
| `label` | 12 px mono, `letter-spacing: 0.12em`, kapital | 1.3 | Label teknis, eyebrow |

### 3.2 Aturan
- Angka harga, luas, durasi: `font-variant-numeric: tabular-nums`.
- Format angka Indonesia: `Rp 4.500.000`, `120 m²`, `98 hari`. Tidak memakai "4.5jt" di UI formal.
- Maksimal lebar paragraf **65 karakter**.
- Italic serif hanya di judul, bukan di paragraf.
- Judul pakai `text-wrap: balance`.

---

## 4. Layout & Grid

- **Grid 12 kolom** di desktop (≥ 1024 px), **6 kolom** tablet, **4 kolom** HP.
- Lebar konten maksimum **1200 px**. Gutter 24 px (desktop) / **16 px** (HP).
- Skala spasi (kelipatan 4): `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.
- Jarak antar section: **96–128 px** desktop, **64–80 px** HP.
- Breakpoint: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

### 4.1 Motif "Blueprint" (ciri khas)
- **Garis grid tipis** `1px var(--stone)` di latar hero dan section tertentu (opacity rendah), seperti kertas gambar kerja.
- **Penomoran section**: label mono `01 — LAYANAN`, `02 — PROSES`, … di atas setiap judul section.
- **Garis ukur**: garis horizontal dengan ujung bertanda `|——|` dan label angka (mis. `98 HARI`), dipakai di kartu proyek dan timeline.
- **Sudut tegas**: radius kecil (lihat 5.1). Lebih arsitektural dibanding kartu yang sangat membulat.
- Motif dipakai **hemat**: maksimal 1 elemen blueprint per layar agar tidak jadi gimmick.

---

## 5. Komponen

### 5.1 Token bentuk & bayangan
| Token | Nilai |
| --- | --- |
| `--radius-sm` | 4 px (input, badge) |
| `--radius-md` | 8 px (tombol, kartu) |
| `--radius-lg` | 16 px (gambar besar, callout) |
| `--shadow-card` | `0 1px 2px rgb(20 33 61 / .06), 0 8px 24px -12px rgb(20 33 61 / .18)` |
| Border default | `1px solid var(--stone)` |

> Catatan: versi lama memakai radius 24–32 px (sangat membulat). Versi baru memakai sudut lebih tegas agar terasa **arsitektural**.

### 5.2 Tombol
| Varian | Tampilan | Pemakaian |
| --- | --- | --- |
| **Primary** | Latar `gold`, teks `navy` 600, tinggi **48 px**, radius `md` | CTA utama: "Konsultasi via WhatsApp" |
| **Secondary** | Garis `navy` 1.5 px, teks `navy` | "Lihat Portofolio", "Hitung Estimasi" |
| **Ghost (gelap)** | Garis `gold/50`, teks `paper` | CTA sekunder di section navy |
| **Text link** | Teks `gold-ink`, garis bawah saat hover, ikon panah → | Tautan dalam paragraf |

- Area sentuh minimum **48 × 48 px**.
- Fokus keyboard: `outline 2px var(--gold-ink)`, offset 2 px. **Tidak boleh dihilangkan.**
- Label tombol berupa kata kerja + hasil: "Minta Survei Gratis", bukan "Klik di sini".

### 5.3 WhatsApp
- **Floating button** di kanan bawah (HP & desktop), ukuran 56 px, latar `navy`, ikon WhatsApp `#25D366` + label "Chat" di desktop.
- Muncul setelah pengunjung scroll melewati hero, dan tidak menutupi tombol lain.
- Setiap tombol WA memakai **pesan template** sesuai konteks, contoh:
  `Halo Nandara Build, saya tertarik [Renovasi Rumah]. Lokasi saya di [kota].`
- Setiap tombol WA mengirim event analytics `click_whatsapp` dengan parameter `lokasi_tombol`.

### 5.4 Kartu
- **Kartu Layanan**: foto 4:3 → label mono (`LAYANAN 01`) → judul h3 → 1 kalimat → "Mulai dari Rp …/m²" → text link.
- **Kartu Proyek**: foto 4:3 (before/after toggle) → label mono `SIDOARJO · 120 M² · 98 HARI` → judul → jenis pekerjaan (badge).
- **Kartu Testimoni**: kutipan (maks. 3 kalimat) → nama, kota, jenis proyek → bintang (jika dari Google) → foto klien/proyek.

### 5.5 Komponen khas Nandara
| Komponen | Fungsi |
| --- | --- |
| **Before/After Slider** | Geser untuk membandingkan sebelum–sesudah. Bisa dipakai dengan keyboard (panah kiri/kanan) dan punya label "Sebelum" / "Sesudah". |
| **Contoh RAB (RAB Preview)** | Tabel mini 5–7 baris: Uraian · Volume · Satuan · Harga Satuan · Jumlah, dengan total di bawah. Tombol "Lihat contoh RAB lengkap (PDF)". Ini **bukti utama** klaim transparansi. |
| **Dokumen SPK** | Kartu bergaya kertas dokumen (cuplikan pasal, cap/tanda tangan di-blur) + daftar poin yang dijamin SPK. |
| **Timeline Proses** | 6 langkah bernomor dengan garis ukur penghubung. Vertikal di HP, horizontal di desktop. Setiap langkah: nama, durasi tipikal, dokumen yang diterima klien. |
| **Kalkulator Estimasi** | Pilih jenis pekerjaan → luas (slider + input) → kualitas (Standar / Menengah / Premium) → hasil **rentang** Rp + label "Estimasi kasar, diperbarui [bulan tahun]" → CTA "Dapatkan RAB detail gratis via WhatsApp" (hasil estimasi ikut terkirim di pesan). |
| **Statistik** | 3–4 angka besar (tabular) + label mono: `PROYEK SELESAI`, `KOTA DILAYANI`, `TAHUN PENGALAMAN`, `RATING GOOGLE`. **Hanya angka nyata.** |
| **Badge Area Layanan** | Daftar kota dalam chip + peta sederhana Jawa Timur (SVG) dengan titik kota. |

### 5.6 Form
- Label selalu tampil di atas input (bukan placeholder saja).
- Tinggi input 48 px, `radius-sm`, border `stone`, fokus `gold-ink`.
- Field minimum: **Nama, No. WhatsApp, Kota, Jenis pekerjaan**. Field lain opsional.
- Pesan error spesifik dalam bahasa Indonesia: "Nomor WhatsApp minimal 10 digit".
- Setelah kirim: halaman/status terima kasih + "Tim kami membalas maks. 1 jam pada jam kerja".

### 5.7 Navigasi
- Header tinggi 64 px, latar `paper/90` + blur, logo kiri, menu tengah/kanan, **satu** tombol primary.
- Di HP: logo + teks "NANDARA BUILD" tetap tampil, tombol menu 48 px, menu layar penuh (`navy`) dengan tautan besar, nomor WA, dan tombol tutup. Wajib ada `aria-expanded` dan bisa ditutup dengan `Esc`.
- Footer `ink`: logo, ringkasan, navigasi, area layanan, kontak, legalitas (NIB), sosial media, `© {tahun berjalan}`.

---

## 6. Fotografi & Ilustrasi

### 6.1 Aturan foto
1. **Foto proyek asli Nandara** selalu didahulukan dibanding stok/AI.
2. Rumah dan konteks harus **relevan dengan Jawa Timur**: rumah tapak 1–2 lantai, perumahan, ruko. **Bukan** villa tepi pantai atau rumah Eropa.
3. Cahaya alami, bayangan nyata, lurus (tidak miring), garis vertikal tegak.
4. Setiap proyek idealnya punya 3 foto: **sebelum, proses, sesudah**.
5. Foto proses (tukang bekerja rapi, APD, lokasi bersih) dipakai untuk mendukung klaim "rapi & profesional".
6. Tone warna: hangat-netral, sedikit desaturasi, tanpa filter berlebihan.

### 6.2 Teknis
- Format **AVIF + WebP** dengan fallback JPG, `srcset` 480/768/1200/1920.
- Rasio: hero 16:9 (desktop) / 4:5 (HP), kartu 4:3, potret testimoni 1:1.
- Hero: `fetchpriority="high"` + preload. Gambar lain: `loading="lazy"`.
- Semua foto punya `alt` deskriptif: "Fasad rumah dua lantai setelah renovasi di Sidoarjo".

### 6.3 Ikon
- **Lucide** dengan stroke 1.5 px, ukuran 20/24 px, warna `gold-ink` (terang) atau `gold` (gelap).
- Tidak memakai emoji di UI.

---

## 7. Gerak (Motion)

- Durasi: 150 ms (hover), 250 ms (UI), 600 ms (reveal section).
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Reveal saat scroll: fade + naik 12 px, **sekali saja**, tidak berulang.
- Garis blueprint boleh "tergambar" (stroke animasi) sekali di hero.
- **Wajib** menghormati `prefers-reduced-motion: reduce`: semua animasi dimatikan.
- Tidak ada carousel otomatis, parallax berat, atau video autoplay dengan suara.

---

## 8. Suara & Gaya Bahasa

- Bahasa Indonesia baku-santai, menyapa dengan **"Anda"**.
- Kalimat pendek. Satu ide per kalimat.
- Hindari jargon tanpa penjelasan. Contoh: "RAB (Rencana Anggaran Biaya)" saat pertama kali muncul.
- Bahasa Inggris hanya untuk tagline "We Design. We Build. You Enjoy."
- Klaim harus spesifik dan jujur. ❌ "Termurah se-Jawa Timur" → ✅ "Harga dikunci di SPK, tidak berubah selama pekerjaan sesuai gambar."
- Promo/syarat ditulis jelas, tanpa tanda bintang tersembunyi: "Gratis desain untuk klien yang melanjutkan pembangunan bersama kami."

---

## 9. Aksesibilitas (wajib)

- Target **WCAG 2.2 AA**.
- Struktur heading berurutan (satu `h1` per halaman).
- Skip link "Langsung ke konten".
- Semua elemen interaktif bisa dipakai dengan keyboard dan punya fokus terlihat.
- `lang="id"` di `<html>`.
- Teks minimum 16 px untuk paragraf di HP.
- Slider & kalkulator punya label yang dibaca screen reader (`aria-valuetext="120 meter persegi"`).

---

## 10. Larangan (Anti-pattern)

- ❌ Teks emas di latar putih/kapur.
- ❌ Lebih dari satu tombol emas dalam satu layar HP.
- ❌ Foto stok/AI yang tidak relevan (villa pantai, rumah luar negeri).
- ❌ Angka statistik atau testimoni karangan.
- ❌ Pop-up yang muncul sebelum pengunjung sempat membaca.
- ❌ Carousel otomatis.
- ❌ Radius sangat besar (> 16 px) di kartu. Sudut tegas lebih arsitektural.
- ❌ Lebih dari 3 jenis font.
- ❌ Komponen shadcn/ui dengan style default tanpa disesuaikan ke token di atas.

---

## 11. Implementasi Token (Tailwind v4)

Token di atas ditulis di `src/styles.css` sebagai berikut (ringkas):

```css
@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Instrument Serif", ui-serif, Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-ink: #14213d;
  --color-navy: #1e293b;
  --color-navy-700: #334155;
  --color-gold: #c9a35a;
  --color-gold-300: #ead8a0;
  --color-gold-ink: #8a6a2b;
  --color-paper: #faf7f0;
  --color-sand: #f2ebdd;
  --color-stone: #e9e4d8;
  --color-concrete: #6b6a65;
  --color-success: #2f7d4f;
  --color-danger: #b3261e;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

Variabel semantik shadcn (`--primary`, `--background`, dll.) dipetakan ke token ini: `--background: paper`, `--foreground: ink`, `--primary: navy`, `--accent: gold`, `--ring: gold-ink`.
