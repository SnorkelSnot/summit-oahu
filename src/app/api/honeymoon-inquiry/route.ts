import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send to Apps Script which will log to a "Honeymoon" sheet tab
    // and send admin email + SMS
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        action: "honeymoonInquiry",
        inquiry: body,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Apps Script returned ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Honeymoon inquiry failed:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
