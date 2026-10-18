import Navbar from "@/components/Navbar";
import TourStops from "@/components/TourStops";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  HALF_DAY_MAX_SEATS,
  HALF_DAY_PICKUP,
  HALF_DAY_PRICE,
  HALF_DAY_RETURN,
} from "@/lib/tours";

export const metadata = {
  title: "Half-Day Oahu Tour from Waikiki — Diamond Head, Windward Coast & Pali Lookout",
  alternates: { canonical: "/half-day-itinerary" },
  description: `A morning tour of Oahu's southeast coast and windward side from Waikiki: Diamond Head, Leonard's Malasadas, Halona Blowhole, Makapuu, Waimanalo, a Kualoa macadamia nut farm and the Pali Lookout. $${HALF_DAY_PRICE} per person, up to ${HALF_DAY_MAX_SEATS} guests, ${HALF_DAY_PICKUP} pickup, back by 12:30pm.`,
};

export default function HalfDayItineraryPage() {
  return (
    <main className="bg-palm-950">
      <Navbar />
      <div className="pt-20">
        <TourStops variant="half-day" />
      </div>

      {/* Key facts + CTA */}
      <div className="section-padding !pt-0 bg-palm-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 text-left">
            {[
              ["Price", `$${HALF_DAY_PRICE} per person`],
              ["Group size", `Up to ${HALF_DAY_MAX_SEATS} guests`],
              ["Pickup", `${HALF_DAY_PICKUP}, Waikīkī hotels`],
              ["Back in Waikīkī", HALF_DAY_RETURN],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-palm-800/60 bg-palm-900/40 p-4">
                <div className="text-[11px] uppercase tracking-wider text-gold-400/80">{k}</div>
                <div className="text-sand-50 text-sm font-semibold mt-1">{v}</div>
              </div>
            ))}
          </div>
          <Link href="/book?tour=half-day" className="btn-gold text-base px-12 py-5">
            Book the Half-Day Tour
          </Link>
          <p className="text-sand-400/60 text-xs mt-4">
            Hawai&#699;i GET added at checkout. Food and drinks not included.
          </p>
        </div>
      </div>

      <Footer hideCta />
    </main>
  );
}
