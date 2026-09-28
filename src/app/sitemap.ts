import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly"
  ) => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency, priority });

  return [
    page("/", 1.0, "weekly"),
    page("/book", 0.9, "weekly"),
    page("/private-itinerary", 0.8, "monthly"),
    page("/testimonials", 0.7, "weekly"),
    page("/honeymoon", 0.7, "monthly"),
    page("/cancellation", 0.4, "yearly"),
    page("/waiver", 0.3, "yearly"),
    page("/terms", 0.2, "yearly"),
    page("/privacy", 0.2, "yearly"),
  ];
}
