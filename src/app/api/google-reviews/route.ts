import { NextResponse } from "next/server";

/**
 * Live Google reviews for the site, straight from the Places API (New).
 *
 * SWITCHED OFF until GOOGLE_PLACES_API_KEY exists in Netlify (Google Cloud key,
 * restricted to "Places API (New)", marked secret). Without it this returns 204
 * and the reviews block simply doesn't render.
 *
 * GOOGLE_PLACE_ID is OPTIONAL. Summit is a service-area business (no public
 * street address), and those don't show up in Google's Place ID Finder (Oct
 * 2026). If it isn't set, the route finds the listing itself with Text Search
 * (New) asking for place IDs only — a free SKU — then fetches the details and
 * only accepts a result whose website is summitoahu.com or whose name is
 * "Summit O'ahu" (any spelling). The found ID is kept in memory (Google allows storing place
 * IDs indefinitely) and logged, so it can be copied into GOOGLE_PLACE_ID.
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

const DETAIL_FIELDS =
  "displayName,websiteUri,rating,userRatingCount,googleMapsUri,reviews";
let foundPlaceId: string | null = null; // remembered between requests on a warm server

async function details(key: string, id: string) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`,
    { headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": DETAIL_FIELDS }, cache: "no-store" }
  );
  return res.ok ? res.json() : null;
}

// Must be OUR listing: website summitoahu.com, or named "Summit O'ahu" in any
// spelling (Oahu / O'ahu / Oʻahu / O‘ahu). "Summit" alone is not enough — a
// test with a fake "Summit Steakhouse" result proved that (Oct 2026).
const isSummit = (p: any) =>
  /summitoahu\.com/i.test(p?.websiteUri || "") ||
  /\bsummit\s+o\s*[ʻ'‘’`]?\s*ahu\b/i.test(p?.displayName?.text || "");

/** Find Summit's listing by name. IDs-only Text Search is a free SKU. */
async function findSummit(key: string) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({
      textQuery: "Summit Oahu tours Honolulu",
      locationBias: {
        circle: { center: { latitude: 21.3, longitude: -157.82 }, radius: 30000 },
      },
      pageSize: 3,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const ids: string[] = ((await res.json()).places || []).map((x: any) => x.id).filter(Boolean);
  // At most two detail lookups, so a bad search can't eat the daily quota.
  for (const id of ids.slice(0, 2)) {
    const p = await details(key, id);
    if (p && isSummit(p)) {
      console.log(`[google-reviews] Found Summit's Place ID: ${id} — set GOOGLE_PLACE_ID to this to skip the search.`);
      foundPlaceId = id;
      return p;
    }
  }
  console.warn("[google-reviews] Text Search did not return Summit's listing.");
  return null;
}

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return new NextResponse(null, { status: 204 });
  const placeId = process.env.GOOGLE_PLACE_ID || foundPlaceId;

  try {
    const p = placeId ? await details(key, placeId) : await findSummit(key);
    if (!p || !isSummit(p)) return new NextResponse(null, { status: 204 });

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
