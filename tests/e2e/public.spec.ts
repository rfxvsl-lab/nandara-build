import { expect, test } from "@playwright/test";

import { chooseOption } from "./helpers";

const PAGES = ["/", "/layanan", "/portofolio", "/proses", "/estimasi-biaya", "/tentang", "/kontak"];

test.describe("halaman publik", () => {
  for (const path of PAGES) {
    test(`${path} tampil tanpa error`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(path, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(errors).toEqual([]);
    });

    test(`${path} tidak scroll ke samping di HP`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(path, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("404 untuk halaman yang tidak ada", async ({ page }) => {
    const res = await page.goto("/tidak-ada-halaman");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Halaman tidak ditemukan")).toBeVisible();
  });

  test("sitemap & robots", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://nandarabuild.test/layanan");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Disallow: /pantau");
  });

  test("gambar preview share link (og:image)", async ({ page, request }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toMatch(/\/og-image\.png$/);
    const res = await request.get("/og-image.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });

  test("menu HP terbuka & tertutup dengan Esc", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.click('button[aria-controls="menu-mobile"]');
    await expect(page.locator("#menu-mobile")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-mobile")).toHaveCount(0);
  });
});

test.describe("kalkulator estimasi", () => {
  test("menghitung rentang, termin, dan mengunduh PDF", async ({ page }) => {
    await page.goto("/estimasi-biaya", { waitUntil: "networkidle" });
    const jspdfLoaded = () =>
      page.evaluate(() =>
        performance.getEntriesByType("resource").some((r) => r.name.includes("jspdf")),
      );
    expect(await jspdfLoaded()).toBe(false);

    await chooseOption(page, "Renovasi total");
    await chooseOption(page, /^Premium/);
    const area = page.getByLabel("Luas dalam meter persegi");
    await area.fill("120");
    await area.blur();
    // Renovasi premium bawaan: 5–7,5 jt/m² × 120 m²
    await expect(page.getByText("Rp 600.000.000 – Rp 900.000.000")).toBeVisible();
    await expect(page.locator("ol li").filter({ hasText: "%" })).toHaveCount(4);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Unduh estimasi/ }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^Estimasi-Nandara-Build-EST-\d{8}-\d{4}\.pdf$/);
    const stream = await download.createReadStream();
    const head = await new Promise<string>((resolve) =>
      stream.once("data", (c) => resolve(String(c).slice(0, 5))),
    );
    expect(head).toBe("%PDF-");
  });

  test("tombol WhatsApp membawa hasil estimasi", async ({ page }) => {
    await page.goto("/estimasi-biaya", { waitUntil: "networkidle" });
    const href = await page.locator('a[data-track="kalkulator"]').getAttribute("href");
    const text = decodeURIComponent(href!.split("text=")[1]!);
    expect(text).toContain("Pekerjaan: Bangun rumah baru");
    expect(text).toContain("Luas: 72 m²");
  });
});
