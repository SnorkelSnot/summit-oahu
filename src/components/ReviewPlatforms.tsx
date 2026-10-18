import { SITE } from "@/lib/site";

/**
 * Links out to Summit's own review profiles. Reviews stay on the platform that
 * collected them — copying them onto this site breaks Google's and the OTAs'
 * rules — so we send guests (and search engines) to the source.
 * Any platform whose URL in lib/site.ts is empty is simply not shown; if all
 * are empty the whole block renders nothing.
 */
const PLATFORMS: { key: keyof typeof SITE.reviews; label: string }[] = [
  { key: "google", label: "Google" },
  { key: "tripadvisor", label: "TripAdvisor" },
];

export default function ReviewPlatforms({ dark = false }: { dark?: boolean }) {
  const live = PLATFORMS.filter((p) => SITE.reviews[p.key]);
  if (live.length === 0) return null;

  return (
    <div className="mt-12 text-center">
      <p
        className={`text-sm mb-4 ${
          dark ? "text-sand-300/80" : "text-lava-500"
        }`}
      >
        Summit O&apos;ahu reviews from guests on our own tours:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {live.map((p) => (
          <a
            key={p.key}
            href={SITE.reviews[p.key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              dark
                ? "border-sand-50/30 text-sand-50 hover:border-gold-400 hover:text-gold-400"
                : "border-palm-300 text-palm-800 hover:border-gold-500 hover:text-gold-600"
            }`}
          >
            <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Read our reviews on {p.label}
          </a>
        ))}
      </div>
    </div>
  );
}
