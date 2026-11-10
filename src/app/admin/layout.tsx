import type { Metadata, Viewport } from "next";

/**
 * /admin as a home-screen app (Nov 10, 2026 — Trey & Nikki). Added to the
 * iPhone home screen from Safari, it opens full-screen with its own name and
 * icon ("Summit Admin", gold mountain on green) instead of as a Safari bookmark.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "Summit Admin", statusBarStyle: "black-translucent" },
  icons: { apple: "/images/admin-apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1a3a1a",
  viewportFit: "cover",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
