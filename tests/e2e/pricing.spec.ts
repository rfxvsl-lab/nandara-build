import { expect, test } from "@playwright/test";

import { chooseOption, loginAdmin } from "./helpers";

test("harga & termin dari admin dipakai kalkulator", async ({ page }) => {
  const job = `Renovasi dapur ${Date.now().toString(36)}`;
  await loginAdmin(page);
  await page.getByRole("tab", { name: "Harga & termin" }).click();
  await page.getByRole("button", { name: "Tambah jenis pekerjaan" }).click();
  const row = page.locator("div.rounded-lg.border").last();
  await row.getByLabel("Jenis pekerjaan").fill(job);
  const nums = row.locator("input[inputmode=decimal]");
  for (const [i, v] of ["3", "4", "4", "5,5", "5,5", "8"].entries()) await nums.nth(i).fill(v);

  // Total termin ≠ 100% ditolak
  const pct = page.locator('input[type="number"]');
  await pct.nth(0).fill("40");
  await page.getByRole("button", { name: "Simpan harga & termin" }).click();
  await expect(page.getByRole("alert")).toHaveText("Total termin harus 100%");
  await pct.nth(0).fill("30");
  await page.getByRole("button", { name: "Simpan harga & termin" }).click();
  await expect(page.getByRole("status")).toContainText("Tersimpan");

  await page.goto("/estimasi-biaya", { waitUntil: "networkidle" });
  await chooseOption(page, job);
  await chooseOption(page, /^Standar/);
  // 3–4 jt/m² × 72 m² (luas bawaan)
  await expect(page.getByText("Rp 216.000.000 – Rp 288.000.000")).toBeVisible();
});
