"use client";

import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  { src: "/images/gallery-01.jpg", alt: "Double rainbow over Makapu'u coastline", span: "col-span-2 row-span-2" },
  { src: "/images/gallery-02.jpg", alt: "Lush green Ko'olau mountains in morning mist", span: "" },
  { src: "/images/gallery-03.jpg", alt: "Golden sunset on North Shore beach", span: "" },
  { src: "/images/gallery-04.jpg", alt: "Kualoa Ranch and the dramatic Ko'olau ridgeline", span: "col-span-2" },
  { src: "/images/gallery-05.jpg", alt: "Tropical palm tree with mountain backdrop", span: "" },
  { src: "/images/gallery-06.jpg", alt: "Hanauma Bay from Koko Head lookout", span: "col-span-2" },
  { src: "/images/gallery-07.jpg", alt: "Sailboat passing Diamond Head", span: "" },
  { src: "/images/gallery-08.jpg", alt: "Lush Hawaiian jungle and waterfall", span: "" },
  { src: "/images/gallery-09.jpg", alt: "Sun rays breaking through clouds over the Wai'anae mountains", span: "" },
  { src: "/images/gallery-10.jpg", alt: "Saffron finches on volcanic rock by the ocean", span: "" },
  { src: "/images/gallery-11.jpg", alt: "Peaceful sunset silhouette over calm waters", span: "col-span-2" },
  { src: "/images/gallery-12.jpg", alt: "Diamond Head crater view from the ridgeline", span: "" },
  { src: "/images/gallery-13.jpg", alt: "Lei-draped Buddha statue before the Byodo-In Temple", span: "" },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-padding bg-palm-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="label-sm text-gold-400">Through Our Lens</span>
          <h2 className="heading-lg text-sand-50 mt-3 mb-5">
            Moments from the Tour
          </h2>
          <p className="body-lg text-sand-300/80 max-w-2xl mx-auto">
            Every tour brings something new. These are real moments captured on
            real tours around O&apos;ahu.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className={`${img.span} relative overflow-hidden rounded-lg cursor-pointer group`}
              onClick={() => setLightbox(index)}
            >
              <div className="relative aspect-square">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-palm-950/0 group-hover:bg-palm-950/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox > 0 ? lightbox - 1 : galleryImages.length - 1);
            }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full aspect-video">
            <Image
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].alt}
              fill
              className="object-contain"
              quality={95}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox < galleryImages.length - 1 ? lightbox + 1 : 0);
            }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <p className="absolute bottom-6 text-center text-sand-300/70 text-sm">
            {galleryImages[lightbox].alt}
          </p>
        </div>
      )}
    </section>
  );
}
