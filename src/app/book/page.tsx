import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata = {
  title: "Book an O'ahu Circle Island Tour",
  description:
    "Book the Summit O'ahu circle island tour online with live availability: small group $149 per person (1–13 guests), private Mercedes $1,299, private van $2,199. Waikīkī hotel pickup.",
  alternates: { canonical: "/book" },
};

export default function BookPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const isTurkish = searchParams?.lang === "tr";
  return (
    <main className="min-h-screen bg-sand-100">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-72 md:h-80 flex items-end overflow-hidden">
        <Image
          src="/images/booking-hero.jpg"
          alt="Lush Hawaiian landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-palm-950/90 via-palm-950/40 to-palm-950/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-8 w-full">
          <span className="label-sm text-gold-400">
            {isTurkish ? "Maceranız Başlasın" : "Start Your Adventure"}
          </span>
          <h1 className="heading-lg text-sand-50 mt-2">
            {isTurkish ? "Tur Rezervasyonu" : "Book Your Tour"}
          </h1>
          {isTurkish && (
            <p className="text-sand-200/80 text-sm mt-2">Book Your Tour</p>
          )}
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-3xl mx-auto px-6 -mt-4 pb-20 relative z-10">
        <Suspense
          fallback={
            <div className="text-center py-20 text-lava-400">
              Loading booking form...
            </div>
          }
        >
          <BookingForm />
        </Suspense>
      </div>

      <Footer hideCta />
    </main>
  );
}
