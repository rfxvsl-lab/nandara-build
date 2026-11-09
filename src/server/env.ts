/** Konfigurasi server dari environment variable. Hanya diimpor di kode server. */
export const env = {
  appwrite: {
    endpoint: process.env["APPWRITE_ENDPOINT"] ?? "",
    projectId: process.env["APPWRITE_PROJECT_ID"] ?? "",
    apiKey: process.env["APPWRITE_API_KEY"] ?? "",
    databaseId: process.env["APPWRITE_DATABASE_ID"] ?? "nandara",
    leadsTableId: process.env["APPWRITE_LEADS_TABLE_ID"] ?? "leads",
  },
  adminPassword: process.env["ADMIN_PASSWORD"] ?? "",
  sessionSecret: process.env["SESSION_SECRET"] ?? "",
  cookieSecure: process.env["COOKIE_SECURE"] !== "false",
  dataDir: process.env["DATA_DIR"] ?? ".data",
};

export function appwriteConfigured(): boolean {
  const a = env.appwrite;
  return Boolean(a.endpoint && a.projectId && a.apiKey);
}

export const contentTables = {
  projects: process.env["APPWRITE_PROJECTS_TABLE_ID"] ?? "projects",
  testimonials: process.env["APPWRITE_TESTIMONIALS_TABLE_ID"] ?? "testimonials",
  bucket: process.env["APPWRITE_MEDIA_BUCKET_ID"] ?? "media",
  settings: process.env["APPWRITE_SETTINGS_TABLE_ID"] ?? "settings",
  articles: process.env["APPWRITE_ARTICLES_TABLE_ID"] ?? "articles",
  clientProjects: process.env["APPWRITE_CLIENT_PROJECTS_TABLE_ID"] ?? "client_projects",
  privateBucket: process.env["APPWRITE_PORTAL_BUCKET_ID"] ?? "portal",
};
