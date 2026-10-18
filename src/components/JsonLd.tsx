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
      "Owner-guided full-day, half-day and private tours of Oahu, Hawaii, departing from Waikiki. Guided in English and Turkish by Trey and Nehir.",
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
  };
}

function trip(
  t: (typeof TOURS)[keyof typeof TOURS],
  languages: string[],
  stopList: readonly string[] = ITINERARY_STOPS
) {
  return {
    "@type": "TouristTrip",
    name: t.name,
    description: t.description,
    touristType: ["Sightseeing", "Solo travelers", "Couples", "Families"],
    availableLanguage: languages,
    provider: { "@id": BUSINESS_ID },
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
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/book?tour=${t.id}`,
      description: `${t.priceUnit} · ${t.groupSize} · Hawaii GET added at checkout`,
    },
  };
}

export function toursSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      trip(TOURS.smallGroup, ["en"]),
      trip(TOURS.halfDay, ["en"], HALF_DAY_STOPS),
      trip(TOURS.privateMercedes, ["en", "tr"]),
      trip(TOURS.privateVan, ["en", "tr"]),
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
