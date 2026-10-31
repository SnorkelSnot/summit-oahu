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

/** Hotel name only: "Moana Surfrider, A Westin…, 2365 Kalakaua Ave" -> "Moana Surfrider". */
function shortHotel(h?: string): string {
  return String(h || "").split(",")[0].trim();
}

/**
 * Trey's night-before message (Oct 31, 2026), used for BOTH Text and WhatsApp.
 * [time] is filled from the "Pickup time" box in the menu; left blank, the
 * placeholder stays in so it can be typed in the chat.
 */
export type Guide = "Trey" | "Nikki";

function nightBeforeMessage(guide: Guide, first: string, hotel: string, time: string): string {
  const h = hotel || "[hotel name]";
  const t = time.trim() || "[time]";
  const hi = `Aloha, ${first || "there"}!\n\n`;
  if (guide === "Nikki") {
    // TEMPORARY wording (Oct 31, 2026) — Nikki will adjust her own message.
    return (
      hi +
      `This is Nikki with Summit O'ahu. I'll be your guide on your journey around this beautiful island tomorrow. ` +
      `I will be at your hotel, ${h}, at ${t} tomorrow morning.\n\n` +
      `Cash is preferred for lunch (~$20/person), but they will accept a credit/debit card with a photo ID. ` +
      `Let me know if you have any other questions, otherwise I will see you in the morning!\n\n` +
      `Mahalo!`
    );
  }
  return (
    hi +
    `This is Trey with Summit O'ahu. I'll be your guide on your journey around this beautiful island tomorrow. ` +
    `I will be at your hotel, ${h}, at ${t} tomorrow morning.\n\n` +
    `Cash is preferred for lunch (~$20/person), but they will accept a credit/debit card with a photo ID. ` +
    `Let me know if you have any other questions, otherwise I will see you in the morning!\n\n` +
    `Mahalo!`
  );
}

// The last guide picked is remembered on this phone/computer, so Nikki's
// phone defaults to Nikki. Storage can be unavailable (private mode) — then
// it simply starts on Trey.
function savedGuide(): Guide {
  try { return localStorage.getItem("summit-admin-guide") === "Nikki" ? "Nikki" : "Trey"; } catch { return "Trey"; }
}

export default function PhoneActions({ phone, name, hotel }: { phone: string; name?: string; hotel?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");
  const [guide, setGuideState] = useState<Guide>("Trey");
  useEffect(() => { setGuideState(savedGuide()); }, []);
  function setGuide(g: Guide) {
    setGuideState(g);
    try { localStorage.setItem("summit-admin-guide", g); } catch {}
  }
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
  const msg = encodeURIComponent(nightBeforeMessage(guide, first, shortHotel(hotel), time));

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
          className="absolute z-20 left-0 mt-1 w-56 rounded-lg bg-white shadow-xl ring-1 ring-sand-200 py-1 block"
        >
          <span className="block px-3 pt-2 pb-1">
            <span className="block text-[11px] font-semibold text-lava-500 uppercase tracking-wide">
              Guide
            </span>
            <span className="mt-1 flex rounded-md ring-1 ring-sand-300 overflow-hidden">
              {(["Trey", "Nikki"] as Guide[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGuide(g)}
                  aria-pressed={guide === g}
                  className={`flex-1 py-1 text-sm font-semibold ${
                    guide === g ? "bg-palm-700 text-white" : "bg-white text-palm-800 hover:bg-sand-100"
                  }`}
                >
                  {g}
                </button>
              ))}
            </span>
          </span>
          <span className="block px-3 pt-1 pb-1">
            <label className="block text-[11px] font-semibold text-lava-500 uppercase tracking-wide">
              Pickup time
            </label>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 6:15 AM"
              className="mt-1 w-full rounded-md border border-sand-300 px-2 py-1 text-sm focus:border-palm-500 outline-none"
            />
          </span>
          {/* "?&body=" works on both iPhone and Android Messages. */}
          <a role="menuitem" className={item} href={`sms:${plus}?&body=${msg}`}>💬 Text (SMS)</a>
          <a role="menuitem" className={item} href={`https://wa.me/${intl}?text=${msg}`} target="_blank" rel="noopener noreferrer">
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
