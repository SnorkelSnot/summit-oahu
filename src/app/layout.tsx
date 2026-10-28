import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import JsonLd, { businessSchema } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

const DESCRIPTION =
  "Owner-guided circle island tours of Oahu from Waikiki. Full-day small-group tour $149 per person (1–13 guests), half-day tour $179 per person (up to 3 guests), or private tours from $1,299 — Diamond Head, Byodo-In Temple, the windward coast and the North Shore. Guided in English and Turkish.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Oahu Circle Island Tour from Waikiki | Summit Oahu",
    template: "%s | Summit Oahu",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "Oahu circle island tour",
    "Oahu small group tour",
    "Oahu private tour",
    "Oahu half day tour",
    "Pali Lookout tour",
    "Waikiki tours",
    "North Shore tour",
    "Byodo-In Temple tour",
    "Oahu island tour from Waikiki",
    "Turkish tour guide Hawaii",
  ],
  openGraph: {
    title: "Oahu Circle Island Tour from Waikiki | Summit Oahu",
    description: DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/og-image.jpg", alt: "Summit Oahu circle island tour" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oahu Circle Island Tour from Waikiki | Summit Oahu",
    description: DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <JsonLd data={businessSchema()} />
        {children}
        {/* Cookie-free visit counting (Cloudflare Web Analytics). Invisible to
            visitors; loads after the page so it never slows it down. */}
        {SITE.cloudflareBeaconToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: SITE.cloudflareBeaconToken })}
          />
        )}
      </body>
    </html>
  );
}
