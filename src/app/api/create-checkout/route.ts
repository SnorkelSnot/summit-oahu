import { NextRequest, NextResponse } from "next/server";
import { stripe, calculatePrice, type BookingDetails } from "@/lib/stripe";
import { checkAvailability } from "@/lib/availability";
import { isPrivateOnlyHotel } from "@/lib/hotels";

// Hawaiʻi GET — Oʻahu maximum pass-on rate (4.712%). Tariff No. 1, Rule 2:
// fares do not include the general excise tax; it is added to the fare and
// separately stated. Stripe applies the rate AFTER any promo discount, so
// tax is always computed on what the guest actually pays for the fare.
// The tax-rate object is created in Stripe once and reused (found by
// metadata), so no Dashboard setup or env var is needed.
const GET_METADATA_KEY = "summit_get_oahu";
let cachedGetTaxRateId: string | null = null;

async function getOahuGetTaxRateId(): Promise<string> {
  if (cachedGetTaxRateId) return cachedGetTaxRateId;
  const existing = await stripe.taxRates.list({ active: true, limit: 100 });
  const found = existing.data.find(
    (r) => r.metadata?.[GET_METADATA_KEY] === "yes"
  );
  if (found) {
    cachedGetTaxRateId = found.id;
    return found.id;
  }
  const created = await stripe.taxRates.create({
    display_name: "Hawaiʻi GET",
    percentage: 4.712,
    inclusive: false,
    country: "US",
    state: "HI",
    description:
      "Hawaiʻi General Excise Tax, Oʻahu rate — separately stated per Tariff No. 1",
    metadata: { [GET_METADATA_KEY]: "yes" },
  });
  cachedGetTaxRateId = created.id;
  return created.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tourType,
      vehicleType,
      partySize,
      date,
      name,
      email,
      phone,
      hotel,
      comments,
      conciergeRef,
      turkishTour,
      promoCode,
      waiverAccepted,
      waiverAcceptedAt,
      waiverVersion,
    } = body;

    // The liability waiver must be accepted before checkout — enforced
    // server-side so it can't be bypassed by skipping the UI.
    if (waiverAccepted !== true) {
      return NextResponse.json(
        {
          error:
            "Please read and accept the Liability Waiver before booking.",
        },
        { status: 400 }
      );
    }
    const waiverStamp = `WAIVER v${waiverVersion || "?"} accepted ${
      waiverAcceptedAt || new Date().toISOString()
    } by ${name}`;

    const isTurkishTour = turkishTour === true || turkishTour === "true";

    // The Turkish-guided tour is only offered as a private tour
    if (isTurkishTour && tourType !== "private") {
      return NextResponse.json(
        {
          error:
            "Türkçe rehberli turlar yalnızca özel tur olarak sunulmaktadır. — Turkish-guided tours are offered as private tours only.",
        },
        { status: 400 }
      );
    }

    // Promo code lookup — codes live in Stripe (Product Catalog > Coupons,
    // then Promotion codes), so Trey can create/disable/expire them from the
    // Stripe Dashboard with no code change or deploy. We look the code up
    // server-side (never trust a client-computed discount) and attach it to
    // the Checkout Session below.
    let discounts: { promotion_code: string }[] | undefined;
    let promoCodeApplied = "";

    if (typeof promoCode === "string" && promoCode.trim()) {
      const normalizedCode = promoCode.trim().toUpperCase();
      const found = await stripe.promotionCodes.list({
        code: normalizedCode,
        active: true,
        limit: 1,
      });
      const promo = found.data[0];
      if (!promo) {
        return NextResponse.json(
          { error: "That promo code isn't valid or has expired." },
          { status: 400 }
        );
      }
      discounts = [{ promotion_code: promo.id }];
      promoCodeApplied = normalizedCode;
    }

    // Tag Turkish tour requests / promo codes in the comments so both flow
    // through the webhook to the booking sheet, admin email, and SMS.
    const taggedComments = `${isTurkishTour ? "[TÜRKÇE TUR] " : ""}${
      promoCodeApplied ? `[PROMO: ${promoCodeApplied}] ` : ""
    }${comments || ""}`.trim();

    // Validate required fields
    if (!tourType || !date || !name || !email || !phone || !hotel) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Validate tour type
    if (!["private", "small-group"].includes(tourType)) {
      return NextResponse.json(
        { error: "Invalid tour type." },
        { status: 400 }
      );
    }

    // Ko'Olina / North Shore pickups are private-tour only
    if (tourType === "small-group" && isPrivateOnlyHotel(hotel)) {
      return NextResponse.json(
        {
          error:
            "Ko'Olina and North Shore pickups are available for private tours only. Please choose a Waikiki pickup or book a private tour.",
        },
        { status: 400 }
      );
    }

    // Normalize & validate party size before any checks
    const partySizeNum = parseInt(partySize, 10);
    if (!Number.isFinite(partySizeNum) || partySizeNum < 1 || partySizeNum > 13) {
      return NextResponse.json(
        { error: "Invalid party size." },
        { status: 400 }
      );
    }

    // Check availability
    const avail = await checkAvailability(date, tourType, partySizeNum, vehicleType);
    if (!avail.available) {
      return NextResponse.json(
        { error: avail.reason || "Date not available." },
        { status: 400 }
      );
    }

    // Calculate price
    const booking: BookingDetails = {
      tourType,
      vehicleType: vehicleType || "mercedes",
      partySize: partySizeNum,
      date,
      name,
      email,
      phone,
      hotel,
      comments,
      conciergeRef,
    };

    const priceInCents = calculatePrice(booking);

    // Build description
    const tourLabel =
      (tourType === "private"
        ? `Private ${vehicleType === "van" ? "Van" : "Mercedes"} Tour`
        : "Small Group Circle Island Tour") +
      (isTurkishTour ? " (Türkçe Tur)" : "");

    const formattedDate = new Date(date + "T12:00:00").toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    // GET is added on top of the fare and separately stated (Tariff Rule 2)
    const getTaxRateId = await getOahuGetTaxRateId();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Summit O'ahu \u2014 ${tourLabel}`,
              description: `${formattedDate} | ${partySize} guest${partySize > 1 ? "s" : ""} | Pickup: ${hotel}`,
              images: [
                `${process.env.NEXT_PUBLIC_SITE_URL || "https://summitoahu.com"}/images/og-image.jpg`,
              ],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
          tax_rates: [getTaxRateId],
        },
      ],
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      metadata: {
        tourType,
        vehicleType: vehicleType || "mercedes",
        partySize: String(partySize),
        date,
        name,
        email,
        phone,
        hotel,
        comments: [taggedComments, `[${waiverStamp}]`]
          .filter(Boolean)
          .join(" ")
          .slice(0, 500),
        conciergeRef: conciergeRef || "",
        turkishTour: isTurkishTour ? "yes" : "no",
        promoCode: promoCodeApplied || "",
        waiverAccepted: "yes",
        waiverVersion: String(waiverVersion || ""),
        waiverAcceptedAt: String(waiverAcceptedAt || ""),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/thank-you?session_id={CHECKOUT_SESSION_ID}${isTurkishTour ? "&lang=tr" : ""}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/book?tour=${tourType}${isTurkishTour ? "&lang=tr" : ""}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
