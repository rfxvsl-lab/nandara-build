import { defineConfig, devices } from "@playwright/test";

/**
 * Uji end-to-end. Menjalankan production build (`npm run build` dulu) di port 3100
 * dengan penyimpanan lokal di .data-test (dihapus tiap kali uji dimulai).
 * Set APPWRITE_* di environment untuk menguji terhadap Appwrite sungguhan.
 */
const PORT = 3100;
export const ADMIN_PASSWORD = "uji-e2e-nandara-2026";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
    locale: "id-ID",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "rm -rf .data-test && node .output/server/index.mjs",
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      PORT: String(PORT),
      HOST: "127.0.0.1",
      ADMIN_PASSWORD,
      DATA_DIR: ".data-test",
      SITE_URL: "https://nandarabuild.test",
    },
  },
});
