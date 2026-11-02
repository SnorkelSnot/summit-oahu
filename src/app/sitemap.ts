import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * lastModified is the date a page's CONTENT last changed — not the build time.
 * (Until Nov 2026 every page claimed "changed today" on every deploy; Google
 * and Bing learn to ignore a sitemap that always says that.) When you change a
 * page's words, prices or photos, bump its date here.
 */
const UPDATED = {
  home: "2026-11-01",
  book: "2026-10-28",
  halfDay: "2026-11-01",
  private: "2026-11-01",
  testimonials: "2026-10-28",
  honeymoon: "2026-10-28",
  legal: "2026-10-13",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    updated: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly"
  ) => ({ url: `${SITE.url}${path}`, lastModified: new Date(updated), changeFrequency, priority });

  return [
    page("/", UPDATED.home, 1.0, "weekly"),
    page("/book", UPDATED.book, 0.9, "weekly"),
    page("/half-day-itinerary", UPDATED.halfDay, 0.8, "monthly"),
    page("/private-itinerary", UPDATED.private, 0.8, "monthly"),
    page("/testimonials", UPDATED.testimonials, 0.7, "weekly"),
    page("/honeymoon", UPDATED.honeymoon, 0.7, "monthly"),
    page("/cancellation", UPDATED.legal, 0.4, "yearly"),
    page("/waiver", UPDATED.legal, 0.3, "yearly"),
    page("/terms", UPDATED.legal, 0.2, "yearly"),
    page("/privacy", UPDATED.legal, 0.2, "yearly"),
  ];
}
