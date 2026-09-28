import Navbar from "@/components/Navbar";
import TourStops from "@/components/TourStops";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Private O'ahu Tour Itinerary",
  alternates: { canonical: "/private-itinerary" },
  description:
    "The classic Summit O'ahu circle island route — your private tour's starting point. Fully customizable to your group.",
};

export default function PrivateItineraryPage() {
  return (
    <main className="bg-palm-950">
      <Navbar />
      <div className="pt-20">
        <TourStops variant="private" />
      </div>

      {/* CTA */}
      <div className="section-padding !pt-0 bg-palm-950">
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/book?tour=private" className="btn-gold text-base px-12 py-5">
            Book Your Private Tour
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
