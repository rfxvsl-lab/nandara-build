/** Notifikasi lead baru ke Telegram (opsional, aktif bila TELEGRAM_* diisi). */
import type { Lead } from "@/lib/leads";
import { toIntlPhone } from "@/lib/leads";

import { env } from "./env";

export async function notifyNewLead(lead: Lead): Promise<void> {
  const { botToken, chatId } = env.telegram;
  if (!botToken || !chatId) return;
  const lines = [
    "🏠 Lead baru — Nandara Build",
    `Nama: ${lead.nama}`,
    `WA: https://wa.me/${toIntlPhone(lead.wa)}`,
    `Lokasi: ${lead.kota}`,
    `Pekerjaan: ${lead.jenis}`,
    lead.tanggal ? `Jadwal survei: ${lead.tanggal} ${lead.waktu}` : "",
    lead.catatan ? `Catatan: ${lead.catatan}` : "",
  ].filter(Boolean);
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Gagal kirim notifikasi Telegram", error);
  }
}
