import { SITE, TOURS, ITINERARY_STOPS, HALF_DAY_STOPS } from "@/lib/site";
import { FAQS } from "@/lib/faq";

/**
 * Structured data (schema.org JSON-LD). This is the machine-readable version
 * of the site that Google, Bing and AI answer engines use to understand WHO
 * Summit Oahu is and WHAT it sells, without guessing from page layout.
 *
 * Deliberately NO aggregateRating or Review markup: Google treats ratings a
 * business publishes about itself as self-serving and ignores them for local
 * businesses, and marking up reviews copied from other platforms breaks its
 * rules outright. The ratings that count live on Google, GetYourGuide and
 * TripAdvisor themselves — sameAs below points machines at them.
 */

const BUSINESS_ID = `${SITE.url}/#business`;

function reviewProfiles(): string[] {
  const { google, tripadvisor } = SITE.reviews;
  return [google, tripadvisor, SITE.profiles.getyourguide].filter(Boolean);
}

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": BUSINESS_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: SITE.alternateNames,
    slogan: SITE.tagline,
    description:
      "Owner-guided full-day, half-day and private tours of Oahu, Hawaii, departing from Waikiki. Guided in English and Turkish by Trey and Nikki.",
    url: SITE.url,
    logo: `${SITE.url}/images/logo-summit.png`,
    image: `${SITE.url}/images/og-image.jpg`,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$149–$2,199",
    currenciesAccepted: "USD",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: [
      { "@type": "Place", name: "Oahu, Hawaii", alternateName: "Oʻahu" },
      { "@type": "Place", name: "Waikiki, Honolulu, Hawaii" },
      { "@type": "Place", name: "North Shore, Oahu" },
      { "@type": "Place", name: "Ko Olina, Oahu" },
    ],
    ...(SITE.reviews.google ? { hasMap: SITE.reviews.google } : {}),
    knowsAbout: [
      "Oahu circle island tours",
      "Byodo-In Temple",
      "North Shore Oahu",
      "Hawaiian history and culture",
      "Turkish-language guided tours in Hawaii",
    ],
    knowsLanguage: ["en", "tr"],
    founder: SITE.founders.map((name) => ({ "@type": "Person", name })),
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "Hawaii Public Utilities Commission certificate",
        value: SITE.pucCertificate,
      },
      {
        "@type": "PropertyValue",
        propertyID: "USDOT number",
        value: SITE.usdot,
      },
    ],
    sameAs: [...SITE.social, ...reviewProfiles()],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "reservations",
      telephone: SITE.phone,
      email: SITE.email,
      availableLanguage: ["English", "Turkish"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Oahu tours",
      itemListElement: ["small-group", "half-day", "private-mercedes", "private-van"].map(
        (slug) => ({ "@type": "Offer", itemOffered: { "@id": `${SITE.url}/#tour-${slug}` } })
      ),
    },
  };
}

/** The website itself, tied to the business — lets search engines connect the two. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    inLanguage: "en-US",
    publisher: { "@id": BUSINESS_ID },
  };
}

/**
 * Details Google and AI tools read for each tour (Nov 2026 pass, from Nikki's
 * checklist): photos, the tour's own page, where pickup is, when it leaves and
 * returns, and a per-person or per-tour price. Times are Hawaii time (-10:00,
 * no daylight saving). schema.org has no "duration" on a trip, so the
 * departure/arrival times (and the description) carry it.
 */
type TripExtra = {
  slug: string;
  page: string;
  images: string[];
  origins: string[];
  departureTime?: string;
  arrivalTime?: string;
  perPerson: boolean;
};

const img = (f: string) => `${SITE.url}/images/${f}`;

const LOCALITY: Record<string, string> = {
  "Waikiki hotels": "Honolulu",
  "Ko Olina": "Kapolei",
  "Turtle Bay": "Kahuku",
};

function place(name: string) {
  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY[name] || "Honolulu",
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
  };
}

function trip(
  t: (typeof TOURS)[keyof typeof TOURS],
  languages: string[],
  x: TripExtra,
  stopList: readonly string[] = ITINERARY_STOPS
) {
  return {
    "@type": "TouristTrip",
    "@id": `${SITE.url}/#tour-${x.slug}`,
    name: t.name,
    description: t.description,
    url: `${SITE.url}${x.page}`,
    image: x.images.map(img),
    touristType: ["Sightseeing", "Solo travelers", "Couples", "Families"],
    availableLanguage: languages,
    provider: { "@id": BUSINESS_ID },
    tripOrigin: x.origins.map(place),
    ...(x.departureTime ? { departureTime: x.departureTime } : {}),
    ...(x.arrivalTime ? { arrivalTime: x.arrivalTime } : {}),
    itinerary: {
      "@type": "ItemList",
      itemListElement: stopList.map((name, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name },
      })),
    },
    offers: {
      "@type": "Offer",
      price: t.price,
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: t.price,
        priceCurrency: "USD",
        unitText: x.perPerson ? "per person" : "per tour",
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/book?tour=${t.id}`,
      description: `${t.priceUnit} · ${t.groupSize} · Hawaii GET added at checkout`,
      seller: { "@id": BUSINESS_ID },
    },
  };
}

const WAIKIKI = "Waikiki hotels";
const PRIVATE_ORIGINS = [WAIKIKI, "Ko Olina", "Turtle Bay"];

export const TRIPS = {
  smallGroup: () =>
    trip(TOURS.smallGroup, ["en"], {
      slug: "small-group",
      page: "/",
      images: ["tour-smallgroup.jpg", "stop-byodoin.jpg", "stop-halona-blowhole.jpg", "stop-northshore.jpg", "stop-diamondhead.jpg"],
      origins: [WAIKIKI],
      departureTime: "06:15:00-10:00",
      perPerson: true,
    }),
  halfDay: () =>
    trip(TOURS.halfDay, ["en"], {
      slug: "half-day",
      page: "/half-day-itinerary",
      images: ["tour-half-v2.jpg", "stop-pali.jpg", "stop-makapuu.jpg", "stop-leonards.jpg", "stop-waimanalo.jpg"],
      origins: [WAIKIKI],
      departureTime: "07:45:00-10:00",
      arrivalTime: "12:30:00-10:00",
      perPerson: true,
    }, HALF_DAY_STOPS),
  privateMercedes: () =>
    trip(TOURS.privateMercedes, ["en", "tr"], {
      slug: "private-mercedes",
      page: "/private-itinerary",
      images: ["tour-private-v2.jpg", "stop-byodoin-couple.jpg", "stop-kualoa.jpg", "stop-haleiwa.jpg"],
      origins: PRIVATE_ORIGINS,
      perPerson: false,
    }),
  privateVan: () =>
    trip(TOURS.privateVan, ["en", "tr"], {
      slug: "private-van",
      page: "/private-itinerary",
      images: ["tour-van.jpg", "stop-byodoin.jpg", "stop-kualoa.jpg", "stop-dole.jpg"],
      origins: PRIVATE_ORIGINS,
      perPerson: false,
    }),
};

export function toursSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [TRIPS.smallGroup(), TRIPS.halfDay(), TRIPS.privateMercedes(), TRIPS.privateVan()],
  };
}

/** One page's own tours (half-day page, private page), plus a breadcrumb. */
export function pageToursSchema(page: { name: string; path: string }, trips: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...trips,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: page.name, item: `${SITE.url}${page.path}` },
        ],
      },
    ],
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string inside the data can ever close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
