import { expect, test } from "@playwright/test";

import { FIXTURES, loginAdmin, unique } from "./helpers";

test("portofolio & testimoni dari admin tampil di situs", async ({ page, browser }) => {
  const title = unique("Renovasi Uji");
  const quote = `RAB-nya jelas dari awal ${Date.now()}`;
  await loginAdmin(page);

  await page.getByRole("tab", { name: "Portofolio" }).click();
  await page.getByRole("button", { name: "Tambah proyek" }).click();
  await page.getByLabel("Judul proyek").fill(title);
  await page.getByLabel("Kota / lokasi").fill("Sidoarjo");
  await page.getByLabel("Ringkasan").fill("Renovasi total fasad.");
  const files = page.locator("input[type=file]");
  await files.nth(0).setInputFiles(FIXTURES + "foto-2.webp");
  await files.nth(1).setInputFiles(FIXTURES + "foto-1.webp");
  await expect(page.locator('img[src^="/media/"]')).toHaveCount(2, { timeout: 20_000 });
  await page.getByLabel("Tampilkan di website").check();
  await page.getByRole("button", { name: "Simpan proyek" }).click();
  await expect(page.getByText(title)).toBeVisible();

  await page.getByRole("tab", { name: "Testimoni" }).click();
  await page.getByRole("button", { name: "Tambah testimoni" }).click();
  await page.getByLabel("Nama klien").fill("Bu Uji");
  await page.getByLabel("Kutipan").fill(quote);
  await page.getByLabel("Tampilkan di website").check();
  await page.getByRole("button", { name: "Simpan testimoni" }).click();
  await expect(page.getByText(quote)).toBeVisible();

  // Publik (konteks baru, tanpa login)
  const pub = await (await browser.newContext()).newPage();
  await pub.goto("/portofolio", { waitUntil: "networkidle" });
  const card = pub.getByRole("link", { name: new RegExp(title) });
  await expect(card).toBeVisible();
  await card.click();
  await expect(pub.locator("h1")).toHaveText(title, { ignoreCase: true });
  await expect(pub.locator('input[type="range"]')).toHaveCount(1); // slider sebelum–sesudah
  await pub.locator('input[type="range"]').scrollIntoViewIfNeeded();
  // Semua foto dari /media termuat (bukan gambar rusak).
  await pub.waitForFunction(() => {
    const imgs = [...document.images].filter((i) => i.src.includes("/media/"));
    return imgs.length >= 2 && imgs.every((i) => i.complete && i.naturalWidth > 0);
  });

  await pub.goto("/", { waitUntil: "networkidle" });
  await expect(pub.locator("#portofolio").getByText(title)).toBeVisible();
  await expect(pub.locator("#testimoni").getByText(quote)).toBeVisible();

  expect((await pub.request.get("/portofolio/slug-yang-tidak-ada")).status()).toBe(404);
});

test("upload ditolak tanpa login admin", async ({ browser }) => {
  const ctx = await browser.newContext();
  const res = await ctx.request.post("/api/admin/upload", {
    headers: { origin: "http://127.0.0.1:3100" },
    multipart: {
      file: { name: "a.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 1, 2]) },
    },
  });
  expect(res.status()).toBe(401);
  await ctx.close();
});
