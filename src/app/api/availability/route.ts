import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/availability";

// Force this route to be dynamic — never cache the response
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || "");
  const month = parseInt(searchParams.get("month") || "");

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json(
      { error: "Invalid year or month" },
      { status: 400 }
    );
  }

  try {
    const days = await getMonthAvailability(year, month);

    // Return simplified data for the calendar (no booking details for public)
    const publicDays = days.map((d) => ({
      date: d.date,
      privateBooked: d.privateBooked,
      mercedesBooked: d.mercedesBooked,
      vanSeatsTaken: d.vanSeatsTaken,
      vanSeatsTotal: d.vanSeatsTotal,
      blocked: d.blocked,
      cutoffPassed: d.cutoffPassed ?? false,
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
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
