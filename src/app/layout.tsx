import type { Metadata } from "next";
import "./globals.css";
import JsonLd, { businessSchema } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

const DESCRIPTION =
  "Owner-guided circle island tours of O'ahu from Waikīkī. Small-group tour $149 per person (1–13 guests) or private tours from $1,299 — Diamond Head, Byodo-In Temple, the windward coast and the North Shore. Guided in English and Turkish.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "O'ahu Circle Island Tour from Waikīkī | Summit O'ahu",
    template: "%s | Summit O'ahu",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "Oahu circle island tour",
    "Oahu small group tour",
    "Oahu private tour",
    "Waikiki tours",
    "North Shore tour",
    "Byodo-In Temple tour",
    "Oahu island tour from Waikiki",
    "Turkish tour guide Hawaii",
  ],
  openGraph: {
    title: "O'ahu Circle Island Tour from Waikīkī | Summit O'ahu",
    description: DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/og-image.jpg", alt: "Summit O'ahu circle island tour" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "O'ahu Circle Island Tour from Waikīkī | Summit O'ahu",
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
      </body>
    </html>
  );
}
