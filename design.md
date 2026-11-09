# design.md — Sistem Desain Nandara Build

> Dokumen ini adalah **acuan wajib** untuk semua pekerjaan UI Nandara Build.
> Kalau ada keputusan desain yang tidak tercantum di sini, tambahkan dulu ke dokumen ini, baru diterapkan di kode.

_Versi 1.1 · 9 November 2026 — palet "Material Tropis"_

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
| **roadmap.md** awal (navy `#1E293B`, gold `#D4AF37`, Plus Jakarta Sans + serif italic) | Emas & Plus Jakarta Sans dipertahankan; navy diganti arang/beton di v1.1 atas permintaan pemilik |

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
| [Andra Matin — Tropicality (Wallpaper*)](https://wallpaper.com/architecture/andra-matin-new-book-tropicality), [Dezeen — Indonesian houses](https://www.dezeen.com/tag/indonesian-houses/) | Palet material jujur: **beton, kayu, bata, kapur**; tropis modern (atap lebar, teritis, bayangan). → **Sumber langsung palet v1.1** (arang, beton, kapur, pasir, batu, bata), foto dengan cahaya alami & bayangan nyata. |
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

## 2. Warna — Palet "Material Tropis"

_Versi 1.1 (November 2026): navy diganti **arang/beton**. Palet sekarang diambil langsung dari material arsitektur tropis Indonesia (beton ekspos, kapur, bata) yang dipadukan dengan **emas logo** sebagai aksen. Hasilnya lebih hangat, membumi, dan lebih khas dibanding kombinasi navy–emas yang umum dipakai kontraktor._

### 2.1 Token
| Token | Hex | Material | Peran |
| --- | --- | --- | --- |
| `arang` | `#1C1A17` | Arang / beton gelap | Teks utama, latar section gelap (hero, proses, footer) |
| `beton` | `#3D3A35` | Beton ekspos | Teks sekunder, isi tabel |
| `abu` | `#5F584E` | Semen | Keterangan, label, metadata |
| `kapur` | `#F6F2EA` | Dinding kapur | Latar halaman utama |
| `pasir` | `#ECE4D6` | Pasir / plester | Latar section selang-seling |
| `batu` | `#D9CFBE` | Batu alam | Garis, border, garis grid |
| `emas` | `#C9A35A` | Emas logo | Tombol utama, aksen, teks **di latar arang** |
| `emas-muda` | `#E8D6A6` | Emas logo (terang) | Hover tombol, label di latar gelap |
| `emas-ink` | `#7A5B26` | Kuningan tua | Emas untuk **teks/ikon di latar terang** |
| `bata` | `#A9472B` | Bata merah | Aksen kedua, **hemat**: stempel SPK, badge "contoh", penanda penting |
| `success` | `#2F7D4F` | — | Centang / status selesai |
| `danger` | `#B3261E` | — | Error form |
| `whatsapp` | `#25D366` | — | Hanya ikon WhatsApp |

### 2.2 Aturan kontras (sudah diuji, WCAG 2.2)
| Kombinasi | Rasio | Boleh untuk |
| --- | --- | --- |
| `arang` di `kapur` | 15,6 : 1 | Semua teks |
| `beton` di `kapur` | 10,1 : 1 | Semua teks |
| `abu` di `kapur` / `pasir` | 6,3 / 5,6 : 1 | Keterangan kecil |
| `emas-ink` di `kapur` / `pasir` / putih | 5,6 / 5,0 / 6,3 : 1 | Teks, ikon, link |
| `emas` di `arang` | 7,3 : 1 | Teks & ikon di section gelap |
| `arang` di `emas` | 7,3 : 1 | Label tombol utama |
| `bata` di `kapur` | 5,2 : 1 | Teks badge kecil |
| ❌ `emas` di `kapur`/putih | ± 2,2 : 1 | **Dilarang** untuk teks. Hanya garis dekoratif |

### 2.3 Proporsi
- **65%** netral terang (`kapur`, `pasir`, putih)
- **25%** gelap (`arang`, `beton`)
- **8%** emas, hanya untuk hal penting: CTA, angka kunci, garis aksen
- **2%** bata, hanya untuk penanda kecil
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
- **Garis grid tipis** `1px` emas/arang transparan di latar hero dan section tertentu (opacity rendah), seperti kertas gambar kerja.
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
| `--shadow-card` | `0 1px 2px rgb(28 26 23 / .06), 0 10px 28px -14px rgb(28 26 23 / .22)` |
| Border default | `1px solid var(--color-batu)` |

> Catatan: versi lama memakai radius 24–32 px (sangat membulat). Versi baru memakai sudut lebih tegas agar terasa **arsitektural**.

### 5.2 Tombol
| Varian | Tampilan | Pemakaian |
| --- | --- | --- |
| **Primary** | Latar `emas`, teks `arang` 600, tinggi **48 px**, radius `md` | CTA utama: "Konsultasi via WhatsApp" |
| **Secondary** | Garis `arang` 1.5 px, teks `arang` | "Lihat Portofolio", "Hitung Estimasi" |
| **Ghost (gelap)** | Garis `emas/50`, teks `kapur` | CTA sekunder di section arang |
| **Text link** | Teks `emas-ink`, garis bawah saat hover, ikon panah → | Tautan dalam paragraf |

- Area sentuh minimum **48 × 48 px**.
- Fokus keyboard: `outline 2px var(--emas-ink)`, offset 2 px. **Tidak boleh dihilangkan.**
- Label tombol berupa kata kerja + hasil: "Minta Survei Gratis", bukan "Klik di sini".

### 5.3 WhatsApp
- **Floating button** di kanan bawah (HP & desktop), ukuran 56 px, latar `arang`, ikon WhatsApp `#25D366` + label "Chat" di desktop.
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
- Tinggi input 48 px, `radius-sm`, border `batu`, fokus `emas-ink`.
- Field minimum: **Nama, No. WhatsApp, Kota, Jenis pekerjaan**. Field lain opsional.
- Pesan error spesifik dalam bahasa Indonesia: "Nomor WhatsApp minimal 10 digit".
- Setelah kirim: halaman/status terima kasih + "Tim kami membalas maks. 1 jam pada jam kerja".

### 5.7 Navigasi
- Header tinggi 64 px, latar `kapur/90` + blur, logo kiri, menu tengah/kanan, **satu** tombol primary.
- Di HP: logo + teks "NANDARA BUILD" tetap tampil, tombol menu 48 px, menu layar penuh (`arang` + grid blueprint) dengan tautan besar, nomor WA, dan tombol tutup. Wajib ada `aria-expanded` dan bisa ditutup dengan `Esc`.
- Footer `arang`: logo, ringkasan, navigasi, area layanan, kontak, legalitas (NIB), sosial media, `© {tahun berjalan}`.

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
- **Lucide** dengan stroke 1.5 px, ukuran 20/24 px, warna `emas-ink` (terang) atau `emas` (gelap).
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

- ❌ Teks `emas` di latar putih/kapur (pakai `emas-ink`).
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
  --font-sans: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Instrument Serif", ui-serif, Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-arang: #1c1a17;
  --color-beton: #3d3a35;
  --color-abu: #5f584e;
  --color-kapur: #f6f2ea;
  --color-pasir: #ece4d6;
  --color-batu: #d9cfbe;
  --color-emas: #c9a35a;
  --color-emas-muda: #e8d6a6;
  --color-emas-ink: #7a5b26;
  --color-bata: #a9472b;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

Variabel semantik shadcn (`--primary`, `--background`, dll.) dipetakan ke token ini: `--background: kapur`, `--foreground: arang`, `--primary: arang`, `--accent: emas`, `--ring: emas-ink`.

Utility tambahan: `bg-blueprint` (grid tipis di latar gelap), `bg-blueprint-light` (grid di latar terang), `label-mono`, `tabular`.
