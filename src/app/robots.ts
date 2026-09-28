import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Open to every search engine AND every AI crawler, by design — being read
 * by ChatGPT, Claude, Perplexity, Gemini and Copilot is the point. The AI
 * bots are named explicitly so the welcome is unambiguous, not left to "*".
 * Only the private/transactional routes are closed.
 */
const PRIVATE = ["/admin", "/api/", "/thank-you"];

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
