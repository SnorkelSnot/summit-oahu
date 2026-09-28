import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-rainbow.jpg"
          alt="Double rainbow over Makapu'u Point, O'ahu"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-palm-950/60 via-palm-950/30 to-palm-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-palm-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-6">
          <span className="label-sm text-gold-400 tracking-[0.3em]">
            O&apos;ahu Circle Island Tours from Waikīkī
          </span>
        </div>

        <h1 className="heading-xl text-sand-50 mb-6">
          Experience O&apos;ahu
          <br />
          <span className="text-gold-400 italic font-medium">
            Like Never Before
          </span>
        </h1>

        <p className="body-lg text-sand-200/90 max-w-2xl mx-auto mb-10">
          Small-group and private tours around the whole island &mdash;
          Diamond Head, the Byodo-In Temple, the windward coast and the North
          Shore &mdash; guided by the owners themselves. Every sense awakened,
          every moment unforgettable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/book" className="btn-gold text-base px-10 py-5">
            Book Your Tour
          </Link>
          <a href="#tours" className="btn-secondary !border-sand-50/30 !text-sand-50 hover:!border-gold-400 hover:!text-gold-400">
            Explore Tours
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sand-300/70 text-sm">
          <Link
            href="/testimonials"
            className="flex items-center gap-2 hover:text-gold-400 transition-colors"
            aria-label="Read our 5-star guest reviews"
          >
            <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="underline decoration-transparent hover:decoration-gold-400/60 underline-offset-4 transition-all">5-Star Rated</span>
          </Link>
          <div className="hidden sm:block w-px h-4 bg-sand-500/30" />
          <div className="hidden sm:flex items-center gap-2">
            <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Back for Happy Hour</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-sand-500/30" />
          <div className="hidden sm:flex items-center gap-2">
            <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Small Groups &amp; Private Tours</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-sand-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
