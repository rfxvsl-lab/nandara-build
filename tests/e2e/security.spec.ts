import { expect, test } from "@playwright/test";

import { ADMIN_PASSWORD } from "../../playwright.config";

/**
 * Header X-Forwarded-For meniru proxy hosting: "<isian klien>, <IP asli>".
 * IP asli (hop terakhir) yang dipakai pembatas; isian klien (hop pertama) bisa dipalsukan.
 */
const viaProxy = (spoofed: string, real: string) => ({ "X-Forwarded-For": `${spoofed}, ${real}` });

test("spam lead dengan IP palsu tetap dibatasi per IP asli", async ({ page }) => {
  for (let i = 0; i < 6; i++) {
    await page.setExtraHTTPHeaders(viaProxy(`1.2.3.${i}`, "10.9.9.9"));
    await page.goto("/kontak");
    const form = page.locator("main form");
    await form.getByLabel("Nama").fill(`Spam ${i}`);
    await form.getByLabel("No. WhatsApp").fill("081200000000");
    await form.getByLabel("Kota / lokasi proyek").fill("Kota");
    await form.getByRole("button", { name: "Minta Survei Gratis" }).click();
    if (i < 5) await expect(page.getByRole("status")).toBeVisible();
    else await expect(page.getByRole("alert")).toContainText("Terlalu banyak permintaan");
  }
});

test("login admin terkunci setelah 10 kali salah dari IP yang sama", async ({ page }) => {
  await page.setExtraHTTPHeaders(viaProxy("5.5.5.5", "10.8.8.8"));
  await page.goto("/admin");
  for (let i = 0; i < 10; i++) {
    await page.fill("#admin-password", `salah-${i}`);
    await page.click("button[type=submit]");
    await expect(page.getByRole("alert")).toHaveText("Kata sandi salah.");
  }
  // Sandi benar pun ditolak sementara.
  await page.fill("#admin-password", ADMIN_PASSWORD);
  await page.click("button[type=submit]");
  await expect(page.getByRole("alert")).toContainText("Terlalu banyak percobaan");
});
