import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

/**
 * Who may use /admin (Nov 10, 2026).
 *
 * Signing in once now keeps that phone signed in for 30 days: the server hands
 * the browser a signed pass (an HttpOnly cookie — page scripts can't read it).
 * The pass is signed with ADMIN_SECRET plus the admin password, so CHANGING
 * ADMIN_PASSWORD in Netlify signs every phone out at once. The old way (the
 * password sent with each request) still works too.
 */
export const ADMIN_COOKIE = "summit_admin";
export const SESSION_DAYS = 30;

const password = () => process.env.ADMIN_PASSWORD || "summit2024";
const key = () => `${process.env.ADMIN_SECRET || "summit-admin"}|${password()}`;
const sign = (exp: string) => createHmac("sha256", key()).update(`admin:${exp}`).digest("hex");

function same(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(given: string): boolean {
  return same(given || "", password());
}

export function makeSessionToken(): string {
  const exp = String(Date.now() + SESSION_DAYS * 86400 * 1000);
  return `${exp}.${sign(exp)}`;
}

export function sessionValid(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return same(mac, sign(exp));
}

export function isAdmin(req: NextRequest): boolean {
  return (
    passwordMatches(req.headers.get("x-admin-password") || "") ||
    sessionValid(req.cookies.get(ADMIN_COOKIE)?.value)
  );
}
