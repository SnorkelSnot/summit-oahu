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
  if (!res.ok) {
    console.warn(`[google-reviews] Place Details ${id} failed: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    return null;
  }
  return res.json();
}

// Summit's Google Maps CID, decoded from the review link g.page/r/CUWNj1mOJo0SEAE
// (Oct 17, 2026). Every listing's googleMapsUri ends "?cid=<this number>", so it
// identifies OUR listing exactly, whatever the name or search ranking.
const SUMMIT_CID = "1336767057228696901";

// Must be OUR listing: the CID above, website summitoahu.com, or named
// "Summit O'ahu" in any spelling. "Summit" alone is not enough — a test with a
// fake "Summit Steakhouse" result proved that (Oct 2026).
const isSummit = (p: any) =>
  new RegExp(`cid=${SUMMIT_CID}\\b`).test(p?.googleMapsUri || "") ||
  /summitoahu\.com/i.test(p?.websiteUri || "") ||
  /\bsummit\s+o\s*[ʻ'‘’`]?\s*ahu\b/i.test(p?.displayName?.text || "");

// Text Search with name/website/maps-link fields (Text Search Pro SKU, inside
// Google's monthly free allowance). Several phrasings, stopping at the first
// hit, because the first try ("Summit Oahu tours Honolulu") ranked other
// companies above Summit (Oct 17, 2026). Only runs until GOOGLE_PLACE_ID is set.
const QUERIES = ["Summit Oʻahu", "Summit O'ahu", "Summit Oahu", "Summit Oahu tours"];

/** Find Summit's listing by name, then fetch its details once. */
async function findSummit(key: string) {
  for (const textQuery of QUERIES) {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.websiteUri,places.googleMapsUri",
      },
      body: JSON.stringify({
        textQuery,
        locationBias: {
          circle: { center: { latitude: 21.3, longitude: -157.82 }, radius: 30000 },
        },
        pageSize: 10,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[google-reviews] Text Search "${textQuery}" failed: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
      continue;
    }
    const places: any[] = (await res.json()).places || [];
    console.log(`[google-reviews] "${textQuery}" -> ${places.map((x) => `${x.displayName?.text} [${x.googleMapsUri || "?"}]`).join(" | ") || "no places"}`);
    const hit = places.find(isSummit);
    if (hit?.id) {
      console.log(`[google-reviews] Found Summit's Place ID: ${hit.id} — set GOOGLE_PLACE_ID to this to skip the search.`);
      foundPlaceId = hit.id;
      return details(key, hit.id);
    }
  }
  console.warn("[google-reviews] No search returned Summit's listing.");
  return null;
}

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    console.warn("[google-reviews] GOOGLE_PLACES_API_KEY is not set in this deploy.");
    return new NextResponse(null, { status: 204 });
  }
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
  } catch (e: any) {
    console.warn(`[google-reviews] Error: ${e?.message || e}`);
    return new NextResponse(null, { status: 204 });
  }
}
