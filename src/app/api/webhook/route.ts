import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  addBooking,
  checkAvailability,
  type BookingRecord,
} from "@/lib/availability";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata;

    if (meta) {
      const totalCents = session.amount_total || 0;
      const booking: BookingRecord = {
        id: session.id,
        tourType: meta.tourType as "private" | "small-group",
        vehicleType: (meta.vehicleType as "mercedes" | "van") || "mercedes",
        partySize: parseInt(meta.partySize) || 1,
        name: meta.name || "",
        email: meta.email || session.customer_details?.email || "",
        phone: meta.phone || "",
        hotel: meta.hotel || "",
        comments: meta.comments || "",
        conciergeRef: meta.conciergeRef || "",
        stripeSessionId: session.id,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        total: totalCents / 100,
      };

      try {
        // RACE-WINDOW GUARD: availability was checked when the Checkout
        // Session was created, but payment can complete minutes later. If
        // two parties grabbed the last seats at the same time, both paid.
        // Re-check now; if the seats are gone, still record the booking
        // (the guest HAS paid) but as PENDING with a loud flag so Trey
        // resolves it — call the guest, refund, upgrade, or run it anyway.
        // PENDING rows still count toward seats, so no further bookings
        // can pile on. If Sheets is unreachable, fall through to
        // addBooking, which will fail → 500 → Stripe retries the webhook.
        // ignoreCutoff: this guest cleared the booking window when checkout
        // was created. If the cutoff rolled past while their payment
        // processed, that is not a conflict and must NOT be flagged as an
        // overbook — doing so would bury a real, paid booking in a PENDING
        // row on an otherwise-empty day, which is the exact scenario the
        // cutoff exists to prevent.
        const recheck = await checkAvailability(
          meta.date,
          meta.tourType as "private" | "small-group",
          parseInt(meta.partySize) || 1,
          (meta.vehicleType as "mercedes" | "van") || "mercedes",
          { ignoreCutoff: true }
        );

        const raceConflict = !recheck.available && !recheck.sheetsError;
        if (raceConflict) {
          booking.status = "pending";
          booking.comments = `[!! OVERBOOK — paid after seats filled (${
            recheck.reason || "conflict"
          }) — contact guest to resolve] ${booking.comments || ""}`.trim();
          console.error(
            `OVERBOOK detected for ${meta.date}: ${booking.name} (${session.id})`
          );
        }

        // addBooking writes to Google Sheet via Apps Script,
        // which also sends admin email, admin SMS, and customer email
        await addBooking(meta.date, booking, raceConflict ? "PENDING" : "CONFIRMED");
        console.log(
          `Booking ${raceConflict ? "FLAGGED (overbook)" : "confirmed"} for ${meta.date}:`,
          booking.name
        );
      } catch (error) {
        console.error("Failed to save booking to sheet:", error);
        // Return 500 so Stripe retries the webhook — otherwise a paid
        // booking could silently never reach the sheet/notifications.
        return NextResponse.json(
          { error: "Failed to record booking" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
