import Link from "next/link";
import SummitLogo from "./SummitLogo";

/**
 * Set `hideCta` on pages that already have their own call to action — or
 * where the guest is plainly already booking — so we don't stack two
 * "Book Your Tour" banners on top of each other.
 */
export default function Footer({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <footer className="bg-palm-950 border-t border-palm-800/30">
      {/* CTA Banner */}
      {!hideCta && (
        <div className="section-padding !py-16 bg-gradient-to-r from-palm-900 to-palm-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-md text-sand-50 mb-4">
              Ready for the Experience of a Lifetime?
            </h2>
            <p className="body-lg text-sand-300/70 mb-8 max-w-xl mx-auto">
              Book your circle island tour today and discover why O&apos;ahu is
              so much more than Waikiki.
            </p>
            <Link href="/book" className="btn-gold text-base px-12 py-5">
              Book Your Tour Now
            </Link>
          </div>
        </div>
      )}

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <SummitLogo className="h-20 w-auto text-sand-50" />
            </div>
            <p className="text-sand-400/70 text-sm leading-relaxed max-w-sm mb-6">
              Premium circle island tours that immerse you in the spirit of
              Hawai&apos;i. Expert guides, luxury vehicles, and moments
              you&apos;ll never forget.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/summitoahu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-palm-800/50 flex items-center justify-center text-sand-400 hover:bg-gold-500 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/summitoahu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-palm-800/50 flex items-center justify-center text-sand-400 hover:bg-gold-500 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@summitoahu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-palm-800/50 flex items-center justify-center text-sand-400 hover:bg-gold-500 hover:text-white transition-all"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-sand-200 uppercase tracking-wider mb-4">
              Tours
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/book?tour=private" className="text-sand-400/70 hover:text-gold-400 text-sm transition-colors">
                  Private Tour
                </Link>
              </li>
              <li>
                <Link href="/book?tour=small-group" className="text-sand-400/70 hover:text-gold-400 text-sm transition-colors">
                  Small Group Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-sand-200 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:summitoahu@gmail.com" className="text-sand-400/70 hover:text-gold-400 text-sm transition-colors">
                  summitoahu@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+18082034103" className="text-sand-400/70 hover:text-gold-400 text-sm transition-colors">
                  808.203.4103
                </a>
              </li>
              <li className="text-sand-400/70 text-sm">
                Honolulu, O&apos;ahu, HI
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-palm-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sand-500/50 text-xs">
            &copy; {new Date().getFullYear()} Summit O&apos;ahu. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/waiver" className="text-sand-500/50 hover:text-sand-300 text-xs transition-colors">
              Liability Waiver
            </Link>
            <Link href="/privacy" className="text-sand-500/50 hover:text-sand-300 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sand-500/50 hover:text-sand-300 text-xs transition-colors">
              Terms of Service
            </Link>
            <Link href="/cancellation" className="text-sand-500/50 hover:text-sand-300 text-xs transition-colors">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
