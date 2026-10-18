import Link from "next/link";
import GoogleReviews from "./GoogleReviews";
import { SITE } from "@/lib/site";

/**
 * Homepage reviews — SUMMIT'S OWN Google reviews only (Oct 2026).
 *
 * The old carousel of reviews Trey and Nehir earned while guiding for other
 * companies moved off the homepage; those all live on /testimonials, which says
 * where they came from. Here we show the live Google feed (GoogleReviews: rating,
 * count and up to five reviews, straight from Google's Places API, which needs
 * no reviewer permission). Until the API key is set in Netlify the feed renders
 * nothing and this section still stands on its own with the two buttons.
 * GetYourGuide reviews may NOT appear here: their supplier terms (s.5.7) forbid it.
 */
export default function Testimonials() {
  return (
    <section
      id="reviews"
      className="section-padding bg-palm-900 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-gold-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-palm-700/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-4">
          <span className="label-sm text-gold-400">What Our Guests Say</span>
          <h2 className="heading-lg text-sand-50 mt-3 mb-5">
            Fresh From the Road.
            <br />
            <span className="text-gold-400 italic">Reviewed on Google.</span>
          </h2>
          <p className="body-lg text-sand-300/80 max-w-2xl mx-auto">
            Reviews from guests who rode with Summit O&apos;ahu, straight from
            our Google listing.
          </p>
        </div>

        <GoogleReviews dark />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {SITE.reviews.google && (
            <a
              href={SITE.reviews.google}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Read All Our Reviews on Google
            </a>
          )}
          <a
            href="/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-sand-50/30 px-6 py-3 text-sm font-semibold text-sand-50 hover:border-gold-400 hover:text-gold-400 transition-colors"
          >
            Rode With Us? Leave a Review
          </a>
        </div>

        <p className="text-center mt-8 text-sm text-sand-400/80">
          Before Summit O&apos;ahu, Trey and Nehir earned hundreds of five-star
          reviews guiding for other tour companies.{" "}
          <Link
            href="/testimonials"
            className="text-gold-400 underline decoration-gold-400/40 underline-offset-4 hover:decoration-gold-400"
          >
            Read those reviews
          </Link>
        </p>
      </div>
    </section>
  );
}
