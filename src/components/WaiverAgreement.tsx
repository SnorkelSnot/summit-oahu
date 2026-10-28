"use client";

import { useEffect, useRef, useState } from "react";
import {
  WAIVER_TITLE,
  WAIVER_SECTIONS,
  WAIVER_VERSION,
  WAIVER_EFFECTIVE_DATE,
} from "@/lib/waiver";

type Props = {
  agreed: boolean;
  onChange: (agreed: boolean, acceptedAt: string | null) => void;
  /** Bilingual label helper from BookingForm (Turkish flow). */
  L?: (tr: string, en: string) => string;
};

/**
 * Scroll-gated waiver acceptance.
 *
 * The full waiver renders inside a scrollable box. The acceptance
 * checkbox stays locked until the guest scrolls to the bottom, so no
 * one can claim they never saw the terms. If the box happens to be
 * tall enough to show everything (no scrollbar), it unlocks
 * immediately.
 */
export default function WaiverAgreement({ agreed, onChange, L }: Props) {
  const l = L || ((_tr: string, en: string) => en);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  function evaluate(el: HTMLDivElement) {
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    const scrollable = el.scrollHeight - el.clientHeight;
    setProgress(
      scrollable <= 0 ? 100 : Math.min(100, Math.round((el.scrollTop / scrollable) * 100))
    );
    if (remaining <= 24) setReachedEnd(true);
  }

  // Handle the no-scrollbar case (very tall viewports) and resizes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    evaluate(el);
    const ro = new ResizeObserver(() => evaluate(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-palm-800 mb-2">
        {l("Sorumluluk Feragatnamesi", "Liability Waiver")} *
      </label>

      <div className="rounded-xl border-2 border-sand-300 overflow-hidden">
        {/* Waiver text */}
        <div
          ref={scrollRef}
          onScroll={(e) => evaluate(e.currentTarget)}
          className="h-64 overflow-y-auto p-4 bg-white text-xs leading-relaxed text-lava-600"
          tabIndex={0}
          aria-label="Liability waiver text — scroll to the bottom to enable the acceptance checkbox"
        >
          <p className="text-[10px] uppercase tracking-wider text-lava-400 mb-1">
            Summit O&lsquo;ahu LLC
          </p>
          <h4 className="font-display text-sm font-bold text-palm-900 mb-1">
            {WAIVER_TITLE}
          </h4>
          <p className="text-[10px] text-lava-400 mb-4">
            Version {WAIVER_VERSION} &middot; Effective {WAIVER_EFFECTIVE_DATE}
          </p>
          {L && (
            <p className="text-[10px] text-lava-400 mb-4 italic">
              Bu feragatname İngilizce olarak geçerlidir. Sorularınız varsa
              lütfen bize ulaşın. — This waiver is legally effective in
              English. Please contact us with any questions.
            </p>
          )}
          {WAIVER_SECTIONS.map((section) => (
            <div key={section.heading} className="mb-4">
              <h5 className="font-semibold text-palm-900 mb-1">
                {section.heading}
              </h5>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mb-2">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="text-[10px] text-lava-400 pt-2 border-t border-sand-200">
            {l(
              "Feragatnamenin sonuna ulaştınız.",
              "You have reached the end of the waiver."
            )}{" "}
            <a
              href="/waiver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-palm-700 underline"
            >
              {l(
                "Yazdırılabilir sürümü açın",
                "Open a printable version"
              )}
            </a>
          </p>
        </div>

        {/* Progress / status bar */}
        <div className="border-t border-sand-200 bg-sand-50">
          <div className="h-1 bg-sand-200">
            <div
              className={`h-1 transition-all duration-200 ${reachedEnd ? "bg-palm-600" : "bg-gold-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <label
            className={`flex items-start gap-3 p-4 ${
              reachedEnd ? "cursor-pointer" : "cursor-not-allowed opacity-70"
            }`}
          >
            <input
              type="checkbox"
              checked={agreed}
              disabled={!reachedEnd}
              onChange={(e) =>
                onChange(
                  e.target.checked,
                  e.target.checked ? new Date().toISOString() : null
                )
              }
              className="mt-0.5 w-5 h-5 rounded border-sand-400 text-palm-700 focus:ring-palm-500/30 disabled:cursor-not-allowed shrink-0 accent-palm-700"
            />
            <span className="text-sm text-palm-800">
              {reachedEnd ? (
                <span className="font-medium">
                  {l(
                    "Sorumluluk Feragatnamesini okudum, anladım ve kendim ve grubum adına kabul ediyorum.",
                    "I have read and understood the Liability Waiver, and I accept it on behalf of myself and my party."
                  )}
                </span>
              ) : (
                <span className="text-lava-500">
                  {l(
                    "Onay kutusunu etkinleştirmek için lütfen feragatnamenin sonuna kadar kaydırın.",
                    "Please scroll to the bottom of the waiver above to enable this checkbox."
                  )}{" "}
                  <span aria-hidden="true">&#8595;</span>
                </span>
              )}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
