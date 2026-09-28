import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Shared shell for the policy pages (Privacy, Terms, Cancellation).
 * Keeps them visually consistent with /waiver.
 */

export type LegalSection = {
  heading: string;
  paragraphs: (string | { bullets: string[] })[];
};

export default function LegalPage({
  title,
  subtitle,
  effective,
  sections,
}: {
  title: string;
  subtitle?: string;
  effective: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-sand-50 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-24">
        <p className="text-xs uppercase tracking-wider text-lava-400 mb-2">
          Summit O&lsquo;ahu LLC
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-palm-900 mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lava-600 leading-relaxed mb-3">{subtitle}</p>
        )}
        <p className="text-sm text-lava-500 mb-10">Effective {effective}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-palm-900 mb-3">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, i) =>
                typeof p === "string" ? (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-lava-600 mb-3"
                  >
                    {p}
                  </p>
                ) : (
                  <ul key={i} className="mb-3 space-y-2">
                    {p.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="text-sm leading-relaxed text-lava-600 flex gap-3"
                      >
                        <span className="text-gold-600 shrink-0">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-sand-300 text-xs text-lava-400">
          <p className="mb-3">
            Questions? Contact us at{" "}
            <a
              href="mailto:summitoahu@gmail.com"
              className="text-palm-700 underline"
            >
              summitoahu@gmail.com
            </a>{" "}
            or{" "}
            <a href="tel:+18082034103" className="text-palm-700 underline">
              808.203.4103
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/waiver" className="text-palm-700 underline">
              Liability Waiver
            </Link>
            <Link href="/privacy" className="text-palm-700 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-palm-700 underline">
              Terms of Service
            </Link>
            <Link href="/cancellation" className="text-palm-700 underline">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
