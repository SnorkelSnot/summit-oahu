"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SummitLogo from "./SummitLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-palm-950/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="Summit O'ahu home">
          <SummitLogo className="h-14 w-auto text-sand-50 group-hover:text-gold-400 transition-colors" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#tours"
            className="text-sand-200 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors"
          >
            Tours
          </a>
          <a
            href="/#journey"
            className="text-sand-200 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors"
          >
            The Journey
          </a>
          <a
            href="/#gallery"
            className="text-sand-200 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors"
          >
            Gallery
          </a>
          <a
            href="/#experience"
            className="text-sand-200 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors"
          >
            The Experience
          </a>
          <Link
            href="/testimonials"
            className="text-sand-200 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="/book"
            className="btn-gold !py-3 !px-6 !text-xs"
          >
            Book Your Tour
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-sand-50 p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-palm-950/98 backdrop-blur-lg border-t border-palm-800/50 mt-2">
          <div className="px-6 py-6 flex flex-col gap-4">
            <a
              href="/#tours"
              onClick={() => setMenuOpen(false)}
              className="text-sand-200 hover:text-gold-400 text-lg font-medium py-2 transition-colors"
            >
              Tours
            </a>
            <a
              href="/#journey"
              onClick={() => setMenuOpen(false)}
              className="text-sand-200 hover:text-gold-400 text-lg font-medium py-2 transition-colors"
            >
              The Journey
            </a>
            <a
              href="/#gallery"
              onClick={() => setMenuOpen(false)}
              className="text-sand-200 hover:text-gold-400 text-lg font-medium py-2 transition-colors"
            >
              Gallery
            </a>
            <a
              href="/#experience"
              onClick={() => setMenuOpen(false)}
              className="text-sand-200 hover:text-gold-400 text-lg font-medium py-2 transition-colors"
            >
              The Experience
            </a>
            <Link
              href="/testimonials"
              onClick={() => setMenuOpen(false)}
              className="text-sand-200 hover:text-gold-400 text-lg font-medium py-2 transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/book"
              onClick={() => setMenuOpen(false)}
              className="btn-gold mt-2"
            >
              Book Your Tour
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
