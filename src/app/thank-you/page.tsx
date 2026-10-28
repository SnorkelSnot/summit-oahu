import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Big Mahalo!",
  robots: { index: false, follow: false },
  description: "Your tour is booked! Here's what to expect.",
};

// Real stops from the circle island route — every one of these is a place
// the guest will actually stand on their tour. No teasing them with sights
// that aren't on the itinerary.
const previewImages = [
  { src: "/images/stop-halona-blowhole.jpg", alt: "Halona Blowhole erupting" },
  { src: "/images/stop-eternity-beach.jpg", alt: "Eternity Beach (Halona Cove)" },
  { src: "/images/stop-makapuu.jpg", alt: "Makapu'u Lookout and Rabbit Island" },
  { src: "/images/stop-byodoin.jpg", alt: "Byodo-In Temple beneath the Ko'olau pali" },
  { src: "/images/stop-leonards01.jpg", alt: "Hot malasadas from Leonard's" },
  { src: "/images/stop-haleiwa.jpg", alt: "Historic Hale'iwa town on the North Shore" },
];

export default function ThankYouPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const isTurkish = searchParams?.lang === "tr";
  return (
    <main className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/stop-windward.jpg"
          alt="The windward coast of O'ahu beneath the Ko'olau range"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-palm-950/80 via-palm-950/40 to-palm-950/60" />
        <div className="relative z-10 text-center px-6">
          <div className="text-6xl mb-4">🤙</div>
          <h1 className="heading-xl text-sand-50">
            Big <span className="text-gold-400 italic">Mahalo!</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Confirmation Message */}
        <div className="bg-white rounded-2xl shadow-lg border border-sand-200/50 p-8 md:p-10 mb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-palm-100 text-palm-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="heading-md text-palm-900 mb-4">
            {isTurkish ? "Turunuz Ayırtıldı!" : "Your Tour is Booked!"}
          </h2>

          {isTurkish && (
            <p className="body-lg text-lava-600 max-w-xl mx-auto mb-3">
              O&apos;ahu&apos;nun g&uuml;zelliklerini size g&ouml;stermek i&ccedil;in
              sabırsızlanıyoruz. T&uuml;rk&ccedil;e rehberli turunuz i&ccedil;in
              sizinle en kısa s&uuml;rede iletişime ge&ccedil;eceğiz.
            </p>
          )}
          <p className={`body-lg text-lava-600 max-w-xl mx-auto mb-8 ${isTurkish ? "text-sm opacity-80" : ""}`}>
            We can&apos;t wait to show you the beauty of O&apos;ahu. Here&apos;s
            what happens next:
          </p>

          {/* Next Steps */}
          <div className="space-y-6 text-left max-w-lg mx-auto">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-palm-900">
                  Confirmation Email
                </h3>
                <p className="text-lava-500 text-sm mt-1">
                  You should receive a confirmation email shortly with your
                  booking details and receipt. Check your spam folder if you
                  don&apos;t see it within a few minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-palm-900">
                  Night-Before Text
                </h3>
                <p className="text-lava-500 text-sm mt-1">
                  We&apos;ll text you the night before your tour with a reminder
                  of your pickup time and details. Keep your phone handy!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-palm-900">
                  Tour Day
                </h3>
                <p className="text-lava-500 text-sm mt-1">
                  Your pickup time is in your confirmation email — please be in
                  your hotel lobby a few minutes early, as we can only wait 10
                  minutes before we have to keep the day moving.
                </p>
                <p className="text-lava-500 text-sm mt-2">
                  <strong className="text-palm-800">Plan your breakfast.</strong>{" "}
                  Our small group tour picks up early — usually before hotel
                  breakfast service opens. Grab something the night before, or
                  come hungry and hold out for Leonard&apos;s: hot malasadas
                  straight from the fryer beat a hotel buffet every time.
                  There&apos;s food and coffee at stops along the route, and
                  water is on board.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Images */}
        <div className="mb-12">
          <h2 className="heading-md text-palm-900 text-center mb-3">
            A Taste of What&apos;s Coming
          </h2>
          <p className="body-lg text-center mb-8 max-w-xl mx-auto">
            Every one of these is an actual stop on your route — not a
            postcard from somewhere else on the island.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previewImages.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-palm-50 rounded-2xl p-8 mb-12">
          <h3 className="font-display text-xl font-semibold text-palm-900 mb-4 text-center">
            Tips for Your Tour
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-palm-700">
            <div className="flex gap-3">
              <span className="text-xl">🧴</span>
              <span>Bring reef-safe sunscreen — the Hawaiian sun is no joke!</span>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">📸</span>
              <span>Charge your camera/phone — you&apos;ll want every shot.</span>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">👟</span>
              <span>
                Wear comfortable shoes — slippahs are fine too, brah. Just
                something you can take a short walk in.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">🧥</span>
              <span>Bring a light layer — the windward side can be breezy.</span>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">💵</span>
              <span>Bring cash for lunch and any souvenirs along the way.</span>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">😎</span>
              <span>Most importantly — relax and enjoy every moment!</span>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="btn-primary">
            Back to Summit O&apos;ahu
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
