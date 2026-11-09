import { expect, test } from "@playwright/test";

import { loginAdmin, unique } from "./helpers";

test("form survei: validasi, simpan, kelola di admin, export CSV", async ({ page, browser }) => {
  const nama = unique("Budi Uji");
  await page.goto("/kontak", { waitUntil: "networkidle" });
  const form = page.locator("main form");
  await form.getByRole("button", { name: "Minta Survei Gratis" }).click();
  await expect(form.getByText("Mohon isi nama Anda.")).toBeVisible();
  await expect(form.getByText("Nomor WhatsApp minimal 10 digit.")).toBeVisible();

  await form.getByLabel("Nama").fill(nama);
  await form.getByLabel("No. WhatsApp").fill("0812-3456-7890");
  await form.getByLabel("Kota / lokasi proyek").fill("Sidoarjo");
  await form.getByLabel("Catatan").fill("Rumah 2 lantai");
  await form.getByRole("button", { name: "Minta Survei Gratis" }).click();
  await expect(page.getByRole("status")).toContainText(`Terima kasih, ${nama.split(" ")[0]}`);

  // Admin
  await loginAdmin(page);
  const row = page.locator("main ul > li").filter({ hasText: nama });
  await expect(row).toBeVisible();
  // Badge jumlah lead "baru" di tab, turun saat status diubah
  const badge = page.getByLabel(/lead baru$/);
  const before = Number(await badge.innerText());
  expect(before).toBeGreaterThanOrEqual(1);
  await row.locator("select").selectOption("disurvei");
  if (before > 1) await expect(badge).toHaveText(String(before - 1));
  else await expect(badge).toHaveCount(0);
  await row.locator("textarea").fill("Survei Kamis");
  await row.getByRole("button", { name: "Simpan catatan" }).click();
  await expect(row.getByRole("button", { name: "Simpan catatan" })).toHaveCount(0);
  await page.reload();
  const row2 = page.locator("main ul > li").filter({ hasText: nama });
  await expect(row2.locator("select")).toHaveValue("disurvei");
  await expect(row2.locator("textarea")).toHaveValue("Survei Kamis");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Export CSV" }).click(),
  ]);
  const chunks: Buffer[] = [];
  for await (const c of await download.createReadStream()) chunks.push(c as Buffer);
  const csv = Buffer.concat(chunks).toString("utf8");
  expect(csv).toContain(nama);
  expect(csv).toContain("Sudah disurvei");

  // Tanpa login
  const anon = await browser.newContext();
  expect((await anon.request.get("/api/leads.csv")).status()).toBe(401);
  await anon.close();
});

test("admin menolak sandi salah", async ({ page }) => {
  await page.goto("/admin");
  await page.fill("#admin-password", "salah-sandi");
  await page.click("button[type=submit]");
  await expect(page.getByRole("alert")).toHaveText("Kata sandi salah.");
});
