"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tap a guest's phone number on /admin -> Text / WhatsApp / Call / Copy
 * (Oct 29, 2026 — Trey). Numbers in the sheet come in several shapes:
 * "+1 8085551234" (website), "8082034103" (older US rows), "447722599665"
 * (GetYourGuide: country code, no plus), "'+15145318787". All are turned into
 * one international number; a bare 10-digit number is taken to be US/Canada.
 */
export function toInternational(raw: string): string {
  const s = String(raw || "").trim().replace(/^'/, "");
  const digits = s.replace(/\D/g, "");
  if (!digits) return "";
  if (s.startsWith("+")) return digits;
  if (digits.length === 10) return "1" + digits;
  return digits;
}

export default function PhoneActions({ phone, name }: { phone: string; name?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const intl = toInternational(phone);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!intl) return <span>{phone || "—"}</span>;

  const plus = "+" + intl;
  const first = (name || "").split(" ")[0];
  const hello = encodeURIComponent(`Aloha${first ? " " + first : ""}! This is Summit Oahu about your tour. `);

  async function copy() {
    try {
      await navigator.clipboard.writeText(plus);
    } catch {
      // Older browsers: fall back to a hidden text box.
      const t = document.createElement("textarea");
      t.value = plus;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1200);
  }

  const item =
    "flex items-center gap-2 w-full px-3 py-2 text-sm text-palm-800 hover:bg-sand-100 text-left";

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-palm-700 font-semibold underline decoration-dotted underline-offset-2 hover:text-palm-900"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {plus}
      </button>
      {open && (
        <span
          role="menu"
          className="absolute z-20 left-0 mt-1 w-48 rounded-lg bg-white shadow-xl ring-1 ring-sand-200 py-1 block"
        >
          <a role="menuitem" className={item} href={`sms:${plus}`}>💬 Text (SMS)</a>
          <a role="menuitem" className={item} href={`https://wa.me/${intl}?text=${hello}`} target="_blank" rel="noopener noreferrer">
            🟢 WhatsApp
          </a>
          <a role="menuitem" className={item} href={`tel:${plus}`}>📞 Call</a>
          <button role="menuitem" type="button" className={item} onClick={copy}>
            {copied ? "✓ Copied" : "📋 Copy number"}
          </button>
        </span>
      )}
    </span>
  );
}
