import { expect, test } from "@playwright/test";

import { FIXTURES, TINY_PDF, loginAdmin, unique } from "./helpers";

test("portal klien: akses, isi, file privat, cabut akses", async ({ page, browser }) => {
  page.on("dialog", (d) => d.accept());
  const judul = unique("Rumah Uji");
  await loginAdmin(page);
  await page.getByRole("tab", { name: "Proyek berjalan" }).click();
  await page.getByRole("button", { name: "Proyek berjalan baru" }).click();
  await page.getByLabel("Judul proyek").fill(judul);
  await page.getByLabel("Nama klien").fill("Bu Rina");
  await page.getByLabel("No. WhatsApp klien").fill("0812-3456-7890");
  await page.getByLabel("Nilai kontrak (Rp)").fill("450000000");
  await page.getByLabel(/Progres keseluruhan/).fill("40");
  await page.getByRole("button", { name: "Isi tahapan standar" }).click();
  await page.getByRole("button", { name: "Hitung dari skema termin" }).click();
  await page.getByLabel("Status termin 1").selectOption("lunas");
  await page.getByRole("button", { name: "Tambah laporan" }).click();
  await page.getByLabel("Judul laporan 1").fill("Minggu 1: pembongkaran");
  await page
    .locator('input[type=file][accept^="image"]')
    .first()
    .setInputFiles(FIXTURES + "foto-1.webp");
  await expect(page.locator('img[src^="/api/portal/file/"]')).toHaveCount(1, { timeout: 20_000 });
  await page
    .locator('input[type=file][accept^="application/pdf"]')
    .setInputFiles({ name: "RAB Rumah.pdf", mimeType: "application/pdf", buffer: TINY_PDF });
  await expect(page.getByLabel("Nama dokumen 1")).toHaveValue("RAB Rumah");
  await page.getByRole("button", { name: "Simpan proyek" }).click();
  const item = page.locator("main li").filter({ hasText: judul });
  await expect(item).toBeVisible();
  const kode = (await item.locator("span.font-mono.tracking-wider").innerText()).trim();
  expect(kode).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);

  // Klien
  const clientCtx = await browser.newContext();
  const client = await clientCtx.newPage();
  await client.goto("/pantau");
  await client.fill("#kode", kode);
  await client.fill("#wa4", "0000");
  await client.click("button[type=submit]");
  await expect(client.getByRole("alert")).toContainText("tidak cocok");
  await client.fill("#wa4", "7890");
  await client.click("button[type=submit]");
  await expect(client.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  await expect(client.getByText("1 dari 4 termin lunas")).toBeVisible();
  await expect(client.locator('img[alt^="Foto laporan"]')).toHaveCount(1);

  const docHref = await client
    .getByRole("link", { name: "RAB Rumah", exact: true })
    .getAttribute("href");
  const fetchStatus = (p: typeof client, url: string) =>
    p.evaluate(async (u) => (await fetch(u, { cache: "no-store" })).status, url);
  expect(await fetchStatus(client, docHref!)).toBe(200);

  const anon = await (await browser.newContext()).newPage();
  await anon.goto("/");
  expect(await fetchStatus(anon, docHref!)).toBe(403);
  const fileId = docHref!.split("/").pop()!.split("?")[0]!;
  expect(await fetchStatus(anon, `/media/${fileId}`)).toBe(404);

  // Cabut akses
  await item.getByRole("button", { name: "Ubah" }).click();
  await page.getByLabel("Akses portal klien aktif").uncheck();
  await page.getByRole("button", { name: "Simpan proyek" }).click();
  await expect(page.locator("main li").filter({ hasText: judul })).toContainText(
    "akses dinonaktifkan",
  );
  expect(await fetchStatus(client, docHref!)).toBe(403);
  await client.reload();
  await expect(client.locator("#kode")).toBeVisible();
  await clientCtx.close();
});
