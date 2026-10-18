"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import ReviewPlatforms from "@/components/ReviewPlatforms";
import GoogleReviews from "@/components/GoogleReviews";
import { seedReviews, type SeedReview } from "@/data/reviews";

type DisplayReview = SeedReview & { rating?: number; location?: string };
type Filter = "All" | "Trey" | "Nehir";

function Stars({ n = 5, size = "w-4 h-4" }: { n?: number; size?: string }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size} ${i < n ? "text-gold-500" : "text-sand-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [visible, setVisible] = useState(18);
  const [userReviews, setUserReviews] = useState<DisplayReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    email: "",
    guide: "",
    rating: 5,
    text: "",
    website: "", // honeypot
  });

  // Guest-submitted (approved) reviews merge in front of the archive
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d) =>
        setUserReviews(
          (d.reviews || []).map((r: any) => ({
            quote: r.quote,
            name: r.name,
            source: r.location || "Guest review",
            guide: r.guide === "Nehir" ? "Nehir" : r.guide === "Trey" ? "Trey" : ("" as any),
            rating: r.rating,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const all: DisplayReview[] = [...userReviews, ...seedReviews];
  const filtered = all.filter((r) => filter === "All" || r.guide === filter);
  const shown = filtered.slice(0, visible);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Something went wrong");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 md:h-80 flex items-end overflow-hidden">
        <Image
          src="/images/booking-hero.jpg"
          alt="Lush Hawaiian coastline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-palm-950/90 via-palm-950/40 to-palm-950/60" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-8 w-full">
          <span className="label-sm text-gold-400">In Our Guests&apos; Words</span>
          <h1 className="heading-lg text-sand-50 mt-2">Guest Reviews</h1>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-6 pt-14 text-center">
        <div className="flex items-center justify-center mb-4">
          <Stars size="w-6 h-6" />
        </div>
        <p className="body-lg text-lava-600">
          Our guides Trey and Nehir have earned five-star review after
          five-star review on TripAdvisor and Viator. Here&apos;s what guests
          say about a day around O&apos;ahu with them.
        </p>
        <p className="text-xs text-lava-400 mt-4 italic">
          Many of these reviews were written about Trey and Nehir while they
          guided for other tour companies prior to founding Summit O&apos;ahu.
          They&apos;re shared here because the guide — not the company — is who
          guests are raving about.
        </p>
        <GoogleReviews />
        <ReviewPlatforms />
      </div>

      {/* Filter + Leave a review */}
      <div className="max-w-6xl mx-auto px-6 pt-10 flex flex-wrap items-center justify-center gap-3">
        {(["All", "Trey", "Nehir"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setVisible(18);
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f
                ? "bg-palm-700 text-white shadow-md"
                : "bg-white border border-sand-300 text-lava-600 hover:border-palm-400"
            }`}
          >
            {f === "All" ? `All (${all.length})` : `Guide: ${f}`}
          </button>
        ))}
        <span className="hidden sm:block w-px h-6 bg-sand-300 mx-1" />
        <button
          onClick={() => {
            setShowForm(true);
            setSent(false);
            setError(null);
          }}
          className="btn-gold !py-2.5 !px-6 !text-xs"
        >
          Leave a Review
        </button>
      </div>

      {/* Reviews grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {shown.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="break-inside-avoid mb-6 bg-white rounded-2xl border border-sand-200/70 shadow-sm p-6"
            >
              <div className="mb-3">
                <Stars n={r.rating ?? 5} />
              </div>
              <p className="text-lava-700 text-[15px] leading-relaxed mb-4">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-sand-200">
                <div>
                  <div className="font-display text-sm text-palm-900">{r.name}</div>
                  <div className="text-xs text-lava-400">{r.source}</div>
                </div>
                {r.guide && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      r.guide === "Trey"
                        ? "bg-palm-100 text-palm-700"
                        : "bg-gold-100 text-gold-700"
                    }`}
                  >
                    Guide: {r.guide}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length > visible && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVisible((v) => v + 18)}
              className="btn-secondary !py-3 !px-8 !text-xs"
            >
              Show more ({filtered.length - visible} more)
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-palm-950">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="heading-md text-sand-50 mb-4">
            Ready to Make Your Own Memories?
          </h2>
          <p className="text-sand-300/70 mb-8">
            Come see why guests can&apos;t stop talking about their day around
            the island.
          </p>
          <Link href="/book" className="btn-gold text-base px-12 py-5">
            Book Your Tour
          </Link>
        </div>
      </div>

      <Footer hideCta />

      {/* Leave a Review modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] bg-palm-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🌺</div>
                <h3 className="font-display text-xl font-semibold text-palm-900 mb-3">
                  Mahalo nui loa!
                </h3>
                <p className="text-lava-600 mb-6">
                  Your review has been received. Once it&apos;s approved,
                  it&apos;ll appear right here on the page.
                </p>
                <button className="btn-gold" onClick={() => setShowForm(false)}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-palm-900">
                    Leave a Review
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-lava-400 hover:text-lava-600 p-1"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* rating stars */}
                <div>
                  <label className="block text-sm font-semibold text-palm-800 mb-1.5">
                    Your rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, rating: n }))}
                        className="p-0.5"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <svg
                          className={`w-8 h-8 transition-colors ${
                            n <= form.rating ? "text-gold-500" : "text-sand-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-palm-800 mb-1.5">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none text-sm"
                      placeholder="First name is fine"
                    />
                    <p className="text-[11px] text-lava-400 mt-1">
                      Shown as first name + last initial.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-palm-800 mb-1.5">
                      Where are you from?
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none text-sm"
                      placeholder="Denver, CO"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-palm-800 mb-1.5">
                      Your guide
                    </label>
                    <select
                      value={form.guide}
                      onChange={(e) => setForm((p) => ({ ...p, guide: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none text-sm bg-white"
                    >
                      <option value="">Not sure / skip</option>
                      <option value="Trey">Trey</option>
                      <option value="Nehir">Nehir</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-palm-800 mb-1.5">
                      Email{" "}
                      <span className="font-normal text-lava-400">(private, optional)</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none text-sm"
                      placeholder="Never shown publicly"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-palm-800 mb-1.5">
                    Your review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none text-sm resize-none"
                    placeholder="Tell future guests about your day around the island…"
                  />
                </div>

                {/* honeypot — hidden from humans */}
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-gold w-full !py-4 disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Submit Review"}
                </button>
                <p className="text-center text-[11px] text-lava-400">
                  Reviews are read and approved by a real human before they
                  appear — mahalo for your patience!
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
