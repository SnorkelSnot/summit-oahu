"use client";

import { useState } from "react";
import ReviewPlatforms from "./ReviewPlatforms";
import GoogleReviews from "./GoogleReviews";

const reviews = [
  {
    quote:
      "Trey was one of the best tour guides we've had — and we've taken our fair share of tours. This is the first time I didn't fall asleep. Trey talked the entire time and we loved it! Very informative and we learned a lot!",
    name: "Diana M.",
    location: "TripAdvisor",
    guide: "Trey",
    stars: 5,
  },
  {
    quote:
      "Nehir was our tour guide and she was wonderful. Friendly, warm, and extremely knowledgeable about Hawaii. She spoke of aloha and how it's not just a saying or greeting — she truly embodies it.",
    name: "Jacqueline R.",
    location: "Half Moon Bay, CA",
    guide: "Nikki",
    stars: 5,
  },
  {
    quote:
      "Trey was very knowledgeable and a fun guide with a very interesting life story. The tour was run very smoothly — a great way to see quite a bit of O'ahu in one excursion. We saw a monk seal and sea turtles!",
    name: "Brian K.",
    location: "Aurora, CO",
    guide: "Trey",
    stars: 5,
  },
  {
    quote:
      "Nikki arrived early, was entertaining, and the whole day seemed to fly by. Lunch at a shrimp truck was delightful — the whole experience was remarkable. A terrific circle island tour!",
    name: "MB Petrucelli",
    location: "Burt Lake, MI",
    guide: "Nikki",
    stars: 5,
  },
  {
    quote:
      "We HIGHLY recommend Trey! He was so warm, welcoming, and knowledgeable — a pure delight the entire day. And he has the most amazing singing voice. A true gem! Aloha!",
    name: "Charharra H.",
    location: "Viator",
    guide: "Trey",
    stars: 5,
  },
  {
    quote:
      "Fantastic tour! Stopped at many great scenic sights. Our guide Nehir was really engaged and knowledgeable and made the day very enjoyable. Would definitely recommend!",
    name: "B&H Paradis",
    location: "Ottawa, Canada",
    guide: "Nikki",
    stars: 5,
  },
  {
    quote:
      "Our tour guide Trey was outstanding and very knowledgeable! He made the experience memorable! Absolutely loved it!!",
    name: "Elizabeth R.",
    location: "TripAdvisor",
    guide: "Trey",
    stars: 5,
  },
  {
    quote:
      "Trey was great! We learned and saw so much. This trip was definitely the highlight of our first ever visit. Go early in your trip so you can remember where you'd like to spend more time!",
    name: "Melissa G.",
    location: "Viator",
    guide: "Trey",
    stars: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () =>
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () =>
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="section-padding bg-palm-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-gold-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-palm-700/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="label-sm text-gold-400">What Our Guests Say</span>
          <h2 className="heading-lg text-sand-50 mt-3 mb-5">
            5-Star Guides.
            <br />
            <span className="text-gold-400 italic">Unforgettable Experiences.</span>
          </h2>
          <p className="body-lg text-sand-300/80 max-w-2xl mx-auto">
            Trey and Nehir have earned hundreds of 5-star reviews across
            TripAdvisor and Viator. Here&apos;s what guests have to say about
            touring O&apos;ahu with them.
          </p>
        </div>

        {/* Review Card */}
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-palm-800/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-palm-700/50">
            {/* Stars */}
            <div className="flex gap-1 mb-6 justify-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-gold-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-sand-100 text-lg md:text-xl leading-relaxed text-center font-light italic mb-8">
              &ldquo;{reviews[activeIndex].quote}&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="text-center">
              <div className="font-display font-semibold text-sand-50 text-base">
                {reviews[activeIndex].name}
              </div>
              <div className="text-sand-400 text-sm mt-1">
                {reviews[activeIndex].location}
                <span className="mx-2 text-palm-600">·</span>
                <span className="text-gold-400">
                  Guide: {reviews[activeIndex].guide}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full border border-palm-600 text-sand-300 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 transition-colors"
              aria-label="Previous review"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex
                      ? "bg-gold-400 w-6"
                      : "bg-palm-600 hover:bg-palm-500"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full border border-palm-600 text-sand-300 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 transition-colors"
              aria-label="Next review"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Review source logos text */}
          <div className="text-center mt-6 text-sand-500 text-xs tracking-wider uppercase">
            Reviews from TripAdvisor &amp; Viator
          </div>

          {/* Provenance caveat */}
          <p className="text-center mt-4 text-xs text-sand-500/70 italic max-w-2xl mx-auto">
            These reviews were written about Trey and Nehir while they guided
            for other tour companies prior to founding Summit O&apos;ahu.
            They&apos;re shared here because the guide &mdash; not the company
            &mdash; is who guests are raving about.
          </p>

          <GoogleReviews dark />
          <ReviewPlatforms dark />
        </div>
      </div>
    </section>
  );
}
