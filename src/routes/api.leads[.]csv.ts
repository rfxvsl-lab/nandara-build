import { createFileRoute } from "@tanstack/react-router";

import { STATUS_LABEL } from "@/lib/leads";

function csvCell(v: string): string {
  // Cegah formula injection di Excel/Sheets
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export const Route = createFileRoute("/api/leads.csv")({
  server: {
    handlers: {
      GET: async () => {
        const { isAdmin } = await import("@/server/admin-auth");
        if (!(await isAdmin())) return new Response("Tidak diizinkan", { status: 401 });
        const { getLeadStore } = await import("@/server/leads-store");
        const leads = await getLeadStore().list();
        const header = [
          "Masuk",
          "Nama",
          "WhatsApp",
          "Lokasi",
          "Pekerjaan",
          "Tanggal survei",
          "Waktu survei",
          "Catatan klien",
          "Status",
          "Catatan internal",
          "Halaman",
        ];
        const rows = leads.map((l) =>
          [
            l.createdAt,
            l.nama,
            l.wa,
            l.kota,
            l.jenis,
            l.tanggal,
            l.waktu,
            l.catatan,
            STATUS_LABEL[l.status],
            l.adminNote,
            l.halaman,
          ]
            .map(csvCell)
            .join(","),
        );
        const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");
        const date = new Date().toISOString().slice(0, 10);
        return new Response(csv, {
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": `attachment; filename="leads-nandara-${date}.csv"`,
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
