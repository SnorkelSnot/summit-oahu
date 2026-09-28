import { NextResponse } from "next/server";

/**
 * Live Google reviews for the site, straight from the Places API (New).
 *
 * SWITCHED OFF until both env vars exist in Netlify:
 *   GOOGLE_PLACES_API_KEY  — Google Cloud key, restricted to "Places API (New)"
 *   GOOGLE_PLACE_ID        — Summit's Place ID (Google's "Place ID Finder")
 * Without them this returns 204 and the reviews block simply doesn't render.
 *
 * NOT CACHED, on purpose: Google's terms don't allow storing review content,
 * so every fetch is live. Cost control lives in Google Cloud instead — set a
 * daily quota on Place Details (~30/day keeps it inside the monthly free
 * allowance). When the quota is hit Google returns an error, this returns 204,
 * and the site quietly falls back to the "Read our reviews on Google" button.
 * The key never reaches the browser.
 */
export const dynamic = "force-dynamic";

type GReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return new NextResponse(null, { status: 204 });

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return new NextResponse(null, { status: 204 });
    const p = await res.json();

    const reviews = ((p.reviews || []) as GReview[])
      .filter((r) => (r.text?.text || r.originalText?.text) && r.authorAttribution?.displayName)
      .map((r) => ({
        rating: r.rating ?? 0,
        text: (r.text?.text || r.originalText?.text || "").trim(),
        when: r.relativePublishTimeDescription || "",
        url: r.googleMapsUri || p.googleMapsUri || "",
        author: r.authorAttribution?.displayName || "",
        authorUrl: r.authorAttribution?.uri || "",
        photo: r.authorAttribution?.photoUri || "",
      }));

    return NextResponse.json(
      {
        rating: p.rating ?? null,
        count: p.userRatingCount ?? 0,
        mapsUrl: p.googleMapsUri || "",
        reviews,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
