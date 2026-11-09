import { expect, test } from "@playwright/test";

import { FIXTURES, loginAdmin, unique } from "./helpers";

const ISI = `## Rincian biaya

Biaya renovasi kamar mandi dipengaruhi **luas** dan *material*.

- Bongkar keramik
- Pasang waterproofing

1. Survei
2. RAB

> Harga dikunci di SPK.

Coba serangan: <script>window.__xss = 1</script> dan [klik](javascript:window.__xss=2) serta [aman](https://wa.me/6285194189182).`;

test("artikel: tulis di admin, tampil aman di situs, terjadwal tersembunyi", async ({
  page,
  browser,
}) => {
  const judul = unique("Biaya Renovasi Kamar Mandi");
  const terjadwal = unique("Artikel Terjadwal");
  await loginAdmin(page);
  await page.getByRole("tab", { name: "Artikel" }).click();

  await page.getByRole("button", { name: "Tulis artikel" }).click();
  await page.getByLabel("Judul", { exact: true }).fill(judul);
  await page.getByLabel("Ringkasan").fill("Rincian biaya renovasi kamar mandi per item pekerjaan.");
  await page.getByLabel("Isi artikel").fill(ISI);
  await page.locator("input[type=file]").setInputFiles(FIXTURES + "foto-1.webp");
  await expect(page.locator('img[src^="/media/"]')).toHaveCount(1, { timeout: 20_000 });
  await page.getByRole("tab", { name: "Pratinjau" }).click();
  await expect(page.getByRole("heading", { name: "Rincian biaya" })).toBeVisible();
  await page.getByLabel("Terbitkan di website").check();
  await page.getByRole("button", { name: "Simpan artikel" }).click();
  await expect(page.getByText(judul)).toBeVisible();

  await page.getByRole("button", { name: "Tulis artikel" }).click();
  await page.getByLabel("Judul", { exact: true }).fill(terjadwal);
  await page.getByLabel("Ringkasan").fill("Artikel ini dijadwalkan terbit bulan depan saja.");
  await page
    .getByLabel("Isi artikel")
    .fill("Isi artikel terjadwal yang belum boleh tampil di situs publik.");
  await page.getByLabel("Tanggal terbit").fill("2099-01-01");
  await page.getByLabel("Terbitkan di website").check();
  await page.getByRole("button", { name: "Simpan artikel" }).click();
  await expect(page.getByText(terjadwal)).toBeVisible();
  await expect(page.locator("li").filter({ hasText: terjadwal })).toContainText("terjadwal");

  // Publik
  const pub = await (await browser.newContext()).newPage();
  await pub.goto("/artikel", { waitUntil: "networkidle" });
  await expect(pub.getByText(judul)).toBeVisible();
  await expect(pub.getByText(terjadwal)).toHaveCount(0);

  await pub.getByRole("link", { name: new RegExp(judul) }).click();
  await expect(pub.locator("h1")).toHaveText(judul);
  await expect(pub.locator("article h2", { hasText: "Rincian biaya" })).toBeVisible();
  await expect(pub.locator("article ul.list-disc li")).toHaveCount(2);
  await expect(pub.locator("article ol.list-decimal li")).toHaveCount(2);
  await expect(pub.locator("article blockquote")).toContainText("Harga dikunci");
  // Keamanan: <script> tampil sebagai teks, tautan javascript: tidak dibuat
  await expect(pub.getByText("<script>window.__xss = 1</script>")).toBeVisible();
  expect(await pub.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
  await expect(pub.locator('a[href^="javascript"]')).toHaveCount(0);
  await expect(pub.locator('article a[href="https://wa.me/6285194189182"]')).toHaveAttribute(
    "rel",
    /noopener/,
  );
  const ld = await pub.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((t) => t.includes('"@type":"Article"'))).toBe(true);

  await pub.goto("/", { waitUntil: "networkidle" });
  await expect(pub.locator("#artikel").getByText(judul)).toBeVisible();

  const sitemap = await (await pub.request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/artikel/");
  expect((await pub.request.get("/artikel/tidak-ada")).status()).toBe(404);
});
