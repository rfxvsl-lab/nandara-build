/** Sesi admin: cookie terenkripsi (useSession) + cek kata sandi ADMIN_PASSWORD. */
import { createHash, timingSafeEqual } from "node:crypto";

// Bukan React hook — fungsi sesi server h3; di-alias agar tidak dikira hook oleh linter.
import { useSession as openSession } from "@tanstack/react-start/server";

import { env } from "./env";

type AdminSession = { admin?: boolean };

function secret(): string {
  if (env.sessionSecret.length >= 32) return env.sessionSecret;
  // Turunkan dari ADMIN_PASSWORD bila SESSION_SECRET tidak diisi (minimal 32 karakter).
  return createHash("sha256").update(`nandara-admin:${env.adminPassword}`).digest("hex");
}

export function adminEnabled(): boolean {
  return env.adminPassword.length >= 8;
}

export function getAdminSession() {
  return openSession<AdminSession>({
    password: secret(),
    name: "nb_admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, sameSite: "lax", secure: env.cookieSecure, path: "/" },
  });
}

export function passwordMatches(input: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(env.adminPassword).digest();
  return adminEnabled() && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminEnabled()) return false;
  const session = await getAdminSession();
  return session.data.admin === true;
}
