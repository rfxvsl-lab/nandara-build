/**
 * PDF estimasi biaya awal (dibuat di browser dengan jsPDF; dimuat hanya saat diklik).
 */
import { CONTACT, SITE } from "@/content/site";

import type { TerminStep } from "./pricing";
import { formatRupiah } from "./utils";

export type EstimateData = {
  jobLabel: string;
  tierLabel: string;
  area: number;
  pricePerM2: [number, number];
  min: number;
  max: number;
  termin: TerminStep[];
  updated: string;
};

const C = {
  arang: [28, 26, 23] as const,
  emas: [201, 163, 90] as const,
  emasInk: [122, 91, 38] as const,
  abu: [95, 88, 78] as const,
  garis: [217, 207, 190] as const,
  pasir: [236, 228, 214] as const,
};

export async function downloadEstimatePdf(d: EstimateData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 18;
  const now = new Date();
  const docNo = `EST-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Kop
  doc.setFillColor(...C.arang);
  doc.rect(0, 0, W, 34, "F");
  doc.setTextColor(...C.emas);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NANDARA", M, 17, { charSpace: 1.6 });
  doc.setFontSize(8);
  doc.text("BUILD", M, 23, { charSpace: 2.4 });
  doc.setTextColor(246, 242, 234);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(SITE.tagline, W - M, 17, { align: "right" });
  doc.text(SITE.area, W - M, 23, { align: "right" });

  // Judul
  let y = 50;
  doc.setTextColor(...C.arang);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Estimasi Biaya Awal", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.abu);
  doc.text(`No. ${docNo}`, W - M, y - 6, { align: "right" });
  doc.text(dateStr, W - M, y, { align: "right" });

  // Rincian input
  y += 10;
  const rows: [string, string][] = [
    ["Jenis pekerjaan", d.jobLabel],
    ["Luas bangunan", `${d.area} m²`],
    ["Kualitas material", d.tierLabel],
    ["Harga acuan per m²", `${formatRupiah(d.pricePerM2[0])} – ${formatRupiah(d.pricePerM2[1])}`],
  ];
  doc.setFontSize(10);
  for (const [k, v] of rows) {
    doc.setDrawColor(...C.garis);
    doc.line(M, y, W - M, y);
    y += 7;
    doc.setTextColor(...C.abu);
    doc.text(k, M, y);
    doc.setTextColor(...C.arang);
    doc.text(v, W - M, y, { align: "right" });
    y += 3;
  }
  doc.line(M, y, W - M, y);

  // Kotak hasil
  y += 8;
  doc.setFillColor(...C.pasir);
  doc.roundedRect(M, y, W - 2 * M, 26, 3, 3, "F");
  doc.setTextColor(...C.abu);
  doc.setFontSize(9);
  doc.text("Perkiraan biaya", M + 6, y + 8);
  doc.setTextColor(...C.arang);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${formatRupiah(d.min)} – ${formatRupiah(d.max)}`, M + 6, y + 19);
  doc.setFont("helvetica", "normal");
  y += 36;

  // Termin
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Simulasi pembayaran bertahap", M, y);
  doc.setFont("helvetica", "normal");
  y += 4;
  doc.setFontSize(9);
  doc.setTextColor(...C.abu);
  y += 4;
  doc.text("Tahap", M, y);
  doc.text("Porsi", 128, y, { align: "right" });
  doc.text("Kisaran", W - M, y, { align: "right" });
  y += 2;
  doc.setFontSize(10);
  d.termin.forEach((t, i) => {
    doc.setDrawColor(...C.garis);
    doc.line(M, y, W - M, y);
    y += 7;
    doc.setTextColor(...C.arang);
    doc.text(`${i + 1}. ${t.label}`, M, y, { maxWidth: 92 });
    doc.text(`${t.persen}%`, 128, y, { align: "right" });
    doc.text(
      `${formatRupiah((d.min * t.persen) / 100)} – ${formatRupiah((d.max * t.persen) / 100)}`,
      W - M,
      y,
      { align: "right" },
    );
    y += 3;
  });
  doc.line(M, y, W - M, y);

  // Catatan
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.arang);
  doc.text("Catatan", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.abu);
  const notes = [
    `Angka di atas adalah kisaran umum (harga acuan diperbarui ${d.updated}), bukan penawaran harga.`,
    "Biaya pasti ditentukan dari RAB rinci (volume × harga satuan per item pekerjaan) setelah survei lokasi.",
    "Skema termin di atas adalah simulasi. Skema final tertulis di SPK resmi.",
    "Survei lokasi dan konsultasi gratis, tanpa kewajiban melanjutkan.",
  ];
  y += 6;
  for (const n of notes) {
    const lines = doc.splitTextToSize(`• ${n}`, W - 2 * M) as string[];
    doc.text(lines, M, y);
    y += lines.length * 4.6 + 1;
  }

  // Ajakan & kontak
  doc.setFillColor(...C.arang);
  doc.rect(0, 272, W, 25, "F");
  doc.setTextColor(...C.emas);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Langkah berikutnya: jadwalkan survei gratis", M, 282);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(246, 242, 234);
  doc.text(
    `WhatsApp ${CONTACT.whatsappDisplay}   ·   Instagram ${CONTACT.instagram.handle}   ·   wa.me/${CONTACT.whatsappIntl}`,
    M,
    289,
  );

  doc.save(`Estimasi-Nandara-Build-${docNo}.pdf`);
}
