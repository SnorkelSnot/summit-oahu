"use client";

import Image from "next/image";
import Link from "next/link";


const tours = [
  {
    id: "small-group",
    title: "Circle Island Tour",
    subtitle: "Small Group \u00b7 Passenger Van",
    price: "$149",
    priceNote: "per person \u00b7 1\u201313 guests",
    image: "/images/tour-smallgroup.jpg",
    features: [
      "Small group experience (1\u201313 guests)",
      "Clean, comfortable, air-conditioned van",
      "6:15am pickup \u2014 back in time for happy hour!",
      "Full circle island itinerary",
      "Pickup from Waikiki hotels",
      "Expert, unscripted commentary",
      "Curated music",
    ],
    cta: "Book Your Seat",
    highlight: true,
    itineraryHref: "/#journey",
  },
  {
    id: "private",
    title: "Private Tour",
    subtitle: "Your Group \u00b7 Your Schedule",
    price: "From $1,299",
    priceNote: "",
    image: "/images/tour-private.jpg",
    features: [
      "Exclusive tour for your group only",
      "Flexible departure \u2014 you choose the time",
      "Mercedes GLC 300 (1\u20134 guests) \u2014 $1,299",
      "Passenger Van (up to 13 guests) \u2014 $2,199",
      "Pickup from Waikiki, Ko\u2018Olina, or Turtle Bay",
      "Default circle island route included",
      "Special requests welcome via phone or email",
    ],
    cta: "Book Private Tour",
    highlight: false,
    itineraryHref: "/private-itinerary",
  },
];

export default function TourTypes() {
  return (
    <section id="tours" className="section-padding bg-sand-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="label-sm">Choose Your Adventure</span>
          <h2 className="heading-lg text-palm-900 mt-3 mb-5">
            Two Ways to Experience O&apos;ahu
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Whether you seek the energy of a shared adventure or the intimacy of
            a private journey, every tour is guided with the same passion and
            expertise.
          </p>
        </div>

        {/* Tour Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                tour.highlight ? "ring-2 ring-gold-400" : ""
              }`}
            >
              {tour.highlight && (
                <div className="absolute top-4 right-4 z-10 bg-gold-500 text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Image — links to the itinerary */}
              <Link
                href={tour.itineraryHref}
                className="relative h-64 overflow-hidden block"
                aria-label={`View the ${tour.title} itinerary`}
              >
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-palm-950/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h3 className="font-display text-2xl font-bold text-sand-50">
                    {tour.title}
                  </h3>
                  <p className="text-sand-200/80 text-sm mt-1">
                    {tour.subtitle}
                  </p>
                </div>
                <span className="absolute bottom-4 right-5 inline-flex items-center gap-1 text-gold-300 text-xs font-semibold tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                  View Itinerary
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Content */}
              <div className="p-7">
                {/* Price */}
                <div className="mb-6 pb-6 border-b border-sand-200">
                  <span className="font-display text-3xl font-bold text-palm-800">
                    {tour.price}
                  </span>
                  {tour.priceNote && (
                    <span className="text-lava-500 text-sm ml-2">
                      {tour.priceNote}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tour.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-lava-700"
                    >
                      <svg
                        className="w-4 h-4 text-palm-500 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/book?tour=${tour.id}`}
                  className={`w-full ${tour.highlight ? "btn-gold" : "btn-primary"}`}
                >
                  {tour.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Türkçe — a quiet bubble. The /honeymoon page carries the full
            Turkish story: guided tours and the honeymoon package. */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/honeymoon"
            className="group inline-flex items-center gap-3.5 rounded-full bg-gold-500 px-8 py-4 shadow-md hover:bg-gold-400 hover:shadow-lg transition-all"
          >
            <span className="text-base font-medium text-palm-950">
              T&uuml;rk&ccedil;e rehberli turlar ve balayı paketleri
            </span>
            <svg
              className="w-5 h-5 text-palm-950 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
