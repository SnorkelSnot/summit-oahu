"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Summit's own Google reviews, shown ON the site so nobody has to leave it.
 * Loads only when scrolled into view (every load is a billed Places call).
 * Renders nothing at all until the API is switched on AND at least
 * MIN_REVIEWS reviews exist — a "1 review" badge hurts more than it helps.
 *
 * Google's display rules, all met here: "Google Maps" attribution, reviewer
 * name + photo linked to their profile, each review linked to its source,
 * relative date, and a note on how they're selected.
 */
const MIN_REVIEWS = 3;

type Data = {
  rating: number | null;
  count: number;
  mapsUrl: string;
  reviews: {
    rating: number;
    text: string;
    when: string;
    url: string;
    author: string;
    authorUrl: string;
    photo: string;
  }[];
};

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(n) ? "text-gold-400" : "text-sand-500/40"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function GoogleReviews({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (done || !entries.some((e) => e.isIntersecting)) return;
        done = true;
        obs.disconnect();
        fetch("/api/google-reviews")
          .then((r) => (r.status === 200 ? r.json() : null))
          .then((d: Data | null) => setData(d))
          .catch(() => {});
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const show = data && data.count >= MIN_REVIEWS && data.reviews.length > 0;
  const muted = dark ? "text-sand-300/80" : "text-lava-500";
  const card = dark
    ? "bg-palm-800/50 border-palm-700/50 text-sand-100"
    : "bg-white border-sand-200 text-lava-700";

  return (
    <div ref={ref} className={show ? "mt-14" : ""}>
      {show && data && (
        <>
          <div className="text-center mb-8">
            <h3 className={`font-display text-2xl font-semibold ${dark ? "text-sand-50" : "text-palm-900"}`}>
              Summit O&apos;ahu on Google
            </h3>
            <a
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 inline-flex items-center gap-2 text-sm ${muted} hover:text-gold-400`}
            >
              {data.rating !== null && (
                <>
                  <span className="font-semibold">{data.rating.toFixed(1)}</span>
                  <Stars n={data.rating} />
                </>
              )}
              <span>
                {data.count} review{data.count === 1 ? "" : "s"}
              </span>
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.reviews.map((r, i) => (
              <figure key={i} className={`rounded-xl border p-6 ${card}`}>
                <div className="flex items-center gap-3 mb-3">
                  {r.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photo} alt="" width={36} height={36} className="rounded-full" referrerPolicy="no-referrer" />
                  )}
                  <div className="min-w-0">
                    <a href={r.authorUrl || r.url} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold hover:text-gold-400">
                      {r.author}
                    </a>
                    <div className={`flex items-center gap-2 text-xs ${muted}`}>
                      <Stars n={r.rating} />
                      {r.when && <span>{r.when}</span>}
                    </div>
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed line-clamp-6">{r.text}</blockquote>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-xs ${muted} hover:text-gold-400`}>
                    Read on Google Maps
                  </a>
                )}
              </figure>
            ))}
          </div>

          <p className={`mt-5 text-center text-xs ${muted}`}>
            Up to five reviews, as selected and ordered by Google Maps. Reviews
            are shown as written. Source: Google Maps.
          </p>
        </>
      )}
    </div>
  );
}
