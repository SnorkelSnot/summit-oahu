import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Seat counts for /admin ONLY (Oct 28, 2026).
 *
 * The admin password used to be checked in the browser — it sat in the page's
 * JavaScript where anyone could read it — and the counts came from the public
 * endpoint. Now the password travels in a header and is checked HERE, on the
 * server. Set ADMIN_PASSWORD in Netlify (secret) to change it; until then the
 * old password still works so nothing breaks on deploy.
 */
function passwordOk(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD || "summit2024";
  return (req.headers.get("x-admin-password") || "") === expected;
}

export async function GET(request: NextRequest) {
  if (!passwordOk(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || "");
  const month = parseInt(searchParams.get("month") || "");
  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }
  try {
    const days = await getMonthAvailability(year, month);
    return NextResponse.json(
      {
        days: days.map((d) => ({
          date: d.date,
          privateBooked: d.privateBooked,
          mercedesBooked: d.mercedesBooked,
          vanSeatsTaken: d.vanSeatsTaken,
          vanSeatsTotal: d.vanSeatsTotal,
          halfDaySeatsTaken: d.halfDaySeatsTaken,
          halfDaySeatsTotal: d.halfDaySeatsTotal,
          blocked: d.blocked,
          blocks: d.blocks || [],
          cutoffPassed: d.cutoffPassed ?? false,
          bookings: d.bookings,
        })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("admin availability failed:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
