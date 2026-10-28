import { NextRequest, NextResponse } from "next/server";
import { setBlock } from "@/lib/sheets";

export const dynamic = "force-dynamic";

/**
 * Block / unblock a date from /admin (Oct 28, 2026). Same server-side password
 * check as /api/admin/availability.
 *   POST { date: "YYYY-MM-DD", vehicle: "ALL" | "van" | "mercedes", block: boolean }
 * Unblocking with vehicle "ALL" clears only whole-day blocks; each vehicle
 * block is cleared on its own, so nothing is lifted by accident.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD || "summit2024";
  if ((request.headers.get("x-admin-password") || "") !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const date = String(body?.date || "");
  const vehicle = ["ALL", "van", "mercedes"].includes(body?.vehicle) ? body.vehicle : null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !vehicle || typeof body?.block !== "boolean") {
    return NextResponse.json({ error: "Need date, vehicle and block" }, { status: 400 });
  }
  try {
    const r = await setBlock(date, vehicle, body.block);
    return NextResponse.json({ ok: true, ...r });
  } catch (e: any) {
    console.error("admin block failed:", e);
    return NextResponse.json(
      { error: "Couldn't update the sheet — try again, or add the MANUAL_BLOCK row by hand." },
      { status: 502 }
    );
  }
}
