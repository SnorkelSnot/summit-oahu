import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TourTypes from "@/components/TourTypes";
import TourStops from "@/components/TourStops";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import JsonLd, { toursSchema, faqSchema } from "@/components/JsonLd";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main>
      <JsonLd data={toursSchema()} />
      <JsonLd data={faqSchema()} />
      <Navbar />
      <Hero />
      <TourTypes />
      <TourStops />
      <Experience />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Footer />
    </main>
  );
}
