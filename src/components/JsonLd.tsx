import { SITE, TOURS, ITINERARY_STOPS } from "@/lib/site";
import { FAQS } from "@/lib/faq";

/**
 * Structured data (schema.org JSON-LD). This is the machine-readable version
 * of the site that Google, Bing and AI answer engines use to understand WHO
 * Summit O'ahu is and WHAT it sells, without guessing from page layout.
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
      "Owner-guided small-group and private circle island tours of O'ahu, Hawai'i, departing from Waikīkī. Guided in English and Turkish by Trey and Nehir.",
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
    areaServed: {
      "@type": "Place",
      name: "O'ahu, Hawai'i",
    },
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

function trip(t: (typeof TOURS)[keyof typeof TOURS], languages: string[]) {
  return {
    "@type": "TouristTrip",
    name: t.name,
    description: t.description,
    touristType: ["Sightseeing", "Solo travelers", "Couples", "Families"],
    availableLanguage: languages,
    provider: { "@id": BUSINESS_ID },
    itinerary: {
      "@type": "ItemList",
      itemListElement: ITINERARY_STOPS.map((name, i) => ({
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
      description: `${t.priceUnit} · ${t.groupSize} · Hawai'i GET added at checkout`,
    },
  };
}

export function toursSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      trip(TOURS.smallGroup, ["en"]),
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
