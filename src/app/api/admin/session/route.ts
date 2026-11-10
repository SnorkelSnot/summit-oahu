import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_DAYS, isAdmin, makeSessionToken, passwordMatches } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/**
 * Stay signed in on /admin (Nov 10, 2026).
 *   GET    -> { signedIn: true|false }   (is this phone's pass still good?)
 *   POST   { password } -> sets a 30-day pass, or 401
 *   DELETE -> Sign Out (removes the pass)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ signedIn: isAdmin(request) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (!passwordMatches(String(body?.password || ""))) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ signedIn: true });
  res.cookies.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ signedIn: false });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
