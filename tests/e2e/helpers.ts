import { expect, type Page } from "@playwright/test";

import { ADMIN_PASSWORD } from "../../playwright.config";

export const FIXTURES = new URL("../fixtures/", import.meta.url).pathname;

export async function loginAdmin(page: Page) {
  await page.goto("/admin");
  await page.fill("#admin-password", ADMIN_PASSWORD);
  await page.click("button[type=submit]");
  await expect(page.getByRole("heading", { name: "Calon klien" })).toBeVisible();
}

/** PDF minimal yang valid (diawali tanda tangan %PDF-). */
export const TINY_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n",
);

export const unique = (prefix: string) => `${prefix} ${Date.now().toString(36)}`;

/** Klik pilihan di kalkulator (radio tersembunyi di dalam label). */
export async function chooseOption(page: Page, name: string | RegExp) {
  await page
    .locator("label")
    .filter({ has: page.getByRole("radio", { name }) })
    .click();
}
