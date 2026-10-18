/**
 * One place for the facts every search engine and AI assistant reads about
 * Summit O'ahu. The JSON-LD, sitemap, robots, llms.txt and the review-platform
 * links all pull from here, so a change is made once.
 *
 * REVIEW LINKS: paste the real URLs below. An empty string hides that button,
 * so nothing half-finished ever shows on the live site.
 *   google     — the "Read reviews" link from your Google Business Profile
 *                (Google Maps → your listing → Share → copy link)
 *   googleWrite — the "Ask for reviews" short link from the Business Profile
 *                (g.page/r/...), used by the review funnel
 *
 * GETYOURGUIDE IS DELIBERATELY NOT A BUTTON. Summit wants every website visitor
 * to book direct, and GetYourGuide's supplier terms (s.5.7) forbid using its
 * reviews off-platform without GYG's approval. The listing lives in `profiles`
 * instead: machine-readable only (schema.org sameAs), never a visible link.
 *   tripadvisor — once a TripAdvisor listing exists
 */
export const SITE = {
  url: "https://summitoahu.com",
  // MACHINE-FACING SPELLING RULE (Trey, Oct 13, 2026): titles, meta
  // descriptions, structured data, the FAQ and llms.txt use plain "Oahu",
  // "Waikiki", "Hawaii" — the way people type them into Google or an AI.
  // The ʻokina spellings are listed as alternate names so a search for either
  // finds Summit. Brand copy guests read on the page keeps its own spelling.
  name: "Summit Oahu",
  legalName: "Summit Oahu LLC",
  alternateNames: ["Summit Oʻahu", "Summit O'ahu"],
  tagline: "Where the island finds you",
  phone: "+1-808-203-4103",
  phoneDisplay: "808.203.4103",
  email: "summitoahu@gmail.com",
  city: "Honolulu",
  region: "HI",
  country: "US",
  pucCertificate: "01390-C",
  usdot: "6998685",
  founders: ["Trey Houchin", "Nehir Houchin"],
  social: [
    "https://instagram.com/summitoahu",
    "https://facebook.com/summitoahu",
    "https://tiktok.com/@summitoahu",
  ],
  /**
   * Cloudflare Web Analytics site token (from the Web Analytics snippet's
   * data-cf-beacon "token"). Public by design, not a secret. Empty = the
   * beacon is not loaded at all and the privacy policy says so.
   */
  cloudflareBeaconToken: "a92d630307d44e0ca1781d1d8141eba8" as string,
  reviews: {
    // Profile page (reviews visible). Same ID as the review link, minus /review.
    google: "https://g.page/r/CUWNj1mOJo0SEAE" as string,
    // Opens Google's write-a-review box. Served at summitoahu.com/review
    // (next.config.js) so printed QRs never carry Google's URL directly.
    googleWrite: "https://g.page/r/CUWNj1mOJo0SEAE/review" as string,
    tripadvisor: "" as string,
  },
  /** Declared to search engines / AI as the same business (sameAs). Not shown. */
  profiles: {
    // Public listing, activity 1438090 (supplier product S794999).
    getyourguide:
      "https://www.getyourguide.com/wahiawa-l147739/oahu-circle-island-tour-with-byodo-in-temple-pickup-t1438090/",
  },
} as const;

export const TOURS = {
  smallGroup: {
    id: "small-group",
    name: "Oahu Circle Island Tour — Small Group",
    price: 149,
    priceUnit: "per person",
    groupSize: "1–13 guests",
    description:
      "A full-day, small-group circle island tour of Oahu from Waikiki: Diamond Head (through the tunnel into the crater), Halona Blowhole and Eternity Beach, Makapuu Lookout, Byodo-In Temple, the windward coast, lunch at a Kahuku shrimp farm, the North Shore beaches, Haleiwa town and Dole Plantation. Hotel pickup in Waikiki from 6:15am; back in time for happy hour. Solo travelers and couples welcome — 1 to 13 guests.",
  },
  halfDay: {
    id: "half-day",
    name: "Half-Day Oahu Tour — Southeast Coast, Windward Side & Pali Lookout",
    price: 179,
    priceUnit: "per person",
    groupSize: "up to 3 guests",
    description:
      "A morning tour from Waikiki for no more than 3 guests in a Mercedes-Benz GLC: Diamond Head, Leonard's Malasadas, Halona Blowhole and Eternity Beach, Makapuu Lookout, Waimanalo, a macadamia nut farm at Kualoa and the Nuuanu Pali Lookout. Hotel pickup at 7:45am; back in Waikiki between 12:00 and 12:30pm.",
  },
  privateMercedes: {
    id: "private",
    name: "Private Oahu Circle Island Tour — Mercedes GLC",
    price: 1299,
    priceUnit: "per tour",
    groupSize: "1–4 guests",
    description:
      "A private circle island tour of Oahu for up to four guests in a Mercedes-Benz GLC 300, on your schedule. Pickup in Waikiki, Ko Olina or Turtle Bay. Available in English or Turkish.",
  },
  privateVan: {
    id: "private",
    name: "Private Oahu Circle Island Tour — Passenger Van",
    price: 2199,
    priceUnit: "per tour",
    groupSize: "up to 13 guests",
    description:
      "A private circle island tour of Oahu for families and groups of up to 13 in a 14-passenger van, on your schedule. Pickup in Waikiki, Ko Olina or Turtle Bay. Available in English or Turkish.",
  },
} as const;

export const HALF_DAY_STOPS = [
  "Diamond Head Lookout",
  "Leonard's Malasadamobile (Hawaii Kai)",
  "Halona Blowhole & Eternity Beach",
  "Makapuu Lookout",
  "Waimanalo",
  "Windward coast drive",
  "Macadamia nut farm at Kualoa",
  "Nuuanu Pali Lookout",
] as const;

export const ITINERARY_STOPS = [
  "Diamond Head Crater & Lookout",
  "Halona Blowhole & Eternity Beach",
  "Makapuu Lookout",
  "Waimanalo",
  "Leonard's Malasadas",
  "Byodo-In Temple",
  "Windward coast drive",
  "Tanaka Kahuku Shrimp (lunch)",
  "North Shore beaches — Sunset Beach, Pipeline, Waimea Bay",
  "Macadamia nut farm",
  "Haleiwa Town",
  "Dole Plantation",
] as const;
