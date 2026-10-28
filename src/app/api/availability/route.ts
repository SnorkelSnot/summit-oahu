import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability, publicDayStatus } from "@/lib/availability";
import { VALID_TOUR_TYPES, type TourType } from "@/lib/tours";

// Force this route to be dynamic — never cache the response
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * PUBLIC availability for the booking calendar.
 *
 * Oct 28, 2026 (Nikki): the calendar must show only whether a day works for
 * THIS guest's tour and group size — never how full it is. Until then this
 * returned the raw seat counts for every day, so the "limited seats" badge
 * and anyone reading the network tab could see exactly how many people were
 * booked. Now the server decides each day and sends one word per day:
 * "available", "unavailable", or "cutoff" (closed online, call us).
 *
 * Seat counts are only served by /api/admin/availability, behind the admin
 * password, which is checked server-side.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || "");
  const month = parseInt(searchParams.get("month") || "");
  const tourParam = searchParams.get("tour") || "small-group";
  const vehicle = searchParams.get("vehicle") === "van" ? "van" : "mercedes";
  const party = parseInt(searchParams.get("party") || "1");

  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }
  if (!VALID_TOUR_TYPES.includes(tourParam as TourType)) {
    return NextResponse.json({ error: "Invalid tour" }, { status: 400 });
  }
  const partySize = Number.isFinite(party) ? Math.min(Math.max(party, 1), 13) : 1;

  try {
    const days = await getMonthAvailability(year, month);
    const publicDays = days.map((d) => ({
      date: d.date,
      status: publicDayStatus(d, tourParam as TourType, partySize, vehicle),
    }));

    return NextResponse.json(
      { days: publicDays },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
