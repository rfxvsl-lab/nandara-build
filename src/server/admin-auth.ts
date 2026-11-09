/** Sesi admin: cookie terenkripsi (useSession) + cek kata sandi ADMIN_PASSWORD. */
import { createHash, timingSafeEqual } from "node:crypto";

// Bukan React hook — fungsi sesi server h3; di-alias agar tidak dikira hook oleh linter.
import { useSession as openSession } from "@tanstack/react-start/server";

import { env } from "./env";

type AdminSession = { admin?: boolean };

/**
 * Kunci enkripsi cookie sesi. WAJIB SESSION_SECRET acak ≥ 32 karakter.
 * (h3 menyegel cookie dengan PBKDF2 1 iterasi, jadi kunci yang diturunkan dari kata sandi
 * bisa ditebak offline dari cookie mana pun — karena itu tidak ada lagi fallback.)
 */
function secret(): string {
  return env.sessionSecret;
}

export const MIN_ADMIN_PASSWORD = 12;
export const MIN_SESSION_SECRET = 32;

/** Admin & portal hanya aktif bila sandi admin & SESSION_SECRET memadai. */
export function adminEnabled(): boolean {
  return (
    env.adminPassword.length >= MIN_ADMIN_PASSWORD && env.sessionSecret.length >= MIN_SESSION_SECRET
  );
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

/* ───────────── Sesi klien portal ───────────── */
type PortalSession = { projectId?: string };

export function getPortalSession() {
  return openSession<PortalSession>({
    password: secret(),
    name: "nb_portal",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, sameSite: "lax", secure: env.cookieSecure, path: "/" },
  });
}
