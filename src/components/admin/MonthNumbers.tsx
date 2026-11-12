"use client";

import Tick from "./Tick";

/**
 * NUMBERS — Nehir's month sheet, done for her (Nov 12, 2026).
 *
 * Mirrors the hand-written "SUMMIT OAHU - RESERVATIONS" page she fills in
 * every day: each tour date with its guests per channel ("2 GYG / 3 Direct"),
 * that day's take-home, and the running month totals for guests and dollars
 * down the side. Counted by TOUR date, confirmed bookings only (a pending row
 * is a checkout that hasn't been paid).
 *
 * TAKE-HOME, for now (Trey, Nov 12): every OTA guest = $110, whichever OTA and
 * whichever tour. Direct (website) bookings = what the guest actually paid.
 * Change OTA_PER_GUEST below when the real rates are in; per-OTA or per-tour
 * rates can go in RATE_OVERRIDES.
 */

export const OTA_PER_GUEST = 110;
// e.g. { GetYourGuide: 117, Viator: 111 } — empty = $110 for every OTA
const RATE_OVERRIDES: Partial<Record<Channel, number>> = {};

type Channel = "GetYourGuide" | "Viator" | "Headout" | "Direct";
const CHANNELS: Channel[] = ["Direct", "GetYourGuide", "Viator", "Headout"];
const SHORT: Record<Channel, string> = { Direct: "Direct", GetYourGuide: "GYG", Viator: "Viator", Headout: "Headout" };
const DOT: Record<Channel, string> = {
  Direct: "bg-palm-600",
  GetYourGuide: "bg-orange-500",
  Viator: "bg-teal-600",
  Headout: "bg-violet-500",
};

type Booking = {
  partySize?: number;
  conciergeRef?: string;
  total?: number;
  status?: string;
  tourType?: string;
};
type Day = { date: string; bookings: Booking[] };

export function channelOf(b: Booking): Channel {
  const c = String(b.conciergeRef || "").toLowerCase();
  if (/getyourguide|\bgyg\b/.test(c)) return "GetYourGuide";
  if (/viator/.test(c)) return "Viator";
  if (/headout/.test(c)) return "Headout";
  return "Direct";
}

export function takeHome(b: Booking): number {
  const ch = channelOf(b), pax = Number(b.partySize) || 0;
  if (ch === "Direct") return Number(b.total) || 0;
  return pax * (RATE_OVERRIDES[ch] ?? OTA_PER_GUEST);
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export default function MonthNumbers({
  days,
  monthName,
  onPrev,
  onNext,
  loading,
}: {
  days: Day[];
  monthName: string;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}) {
  const totals = Object.fromEntries(CHANNELS.map((c) => [c, { guests: 0, money: 0, bookings: 0 }])) as Record<
    Channel,
    { guests: number; money: number; bookings: number }
  >;
  let runGuests = 0, runMoney = 0;
  const directMissing: string[] = [];

  const rows = [...days]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => {
      const live = (d.bookings || []).filter((b) => (b.status || "confirmed") === "confirmed");
      if (!live.length) return null;
      const per: Partial<Record<Channel, number>> = {};
      let guests = 0, take = 0;
      for (const b of live) {
        const ch = channelOf(b), pax = Number(b.partySize) || 0, t = takeHome(b);
        per[ch] = (per[ch] || 0) + pax;
        guests += pax;
        take += t;
        totals[ch].guests += pax;
        totals[ch].money += t;
        totals[ch].bookings += 1;
        if (ch === "Direct" && !t) directMissing.push(d.date);
      }
      runGuests += guests;
      runMoney += take;
      return { date: d.date, per, guests, take, runGuests, runMoney };
    })
    .filter(Boolean) as {
    date: string;
    per: Partial<Record<Channel, number>>;
    guests: number;
    take: number;
    runGuests: number;
    runMoney: number;
  }[];

  const allGuests = CHANNELS.reduce((s, c) => s + totals[c].guests, 0);
  const allMoney = CHANNELS.reduce((s, c) => s + totals[c].money, 0);
  const dayLabel = (iso: string) =>
    new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <Tick><button onClick={onPrev} aria-label="Previous month" className="p-2 hover:bg-sand-100 rounded-lg">←</button></Tick>
          <h2 className="font-display text-xl font-semibold text-palm-900">{monthName}</h2>
          <Tick><button onClick={onNext} aria-label="Next month" className="p-2 hover:bg-sand-100 rounded-lg">→</button></Tick>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-palm-950 text-sand-50 p-4">
            <div className="text-xs uppercase tracking-wider text-sand-300">Guests</div>
            <div className="text-3xl font-bold tabular-nums">{allGuests}</div>
          </div>
          <div className="rounded-xl bg-gold-400 text-palm-950 p-4">
            <div className="text-xs uppercase tracking-wider">Take-home</div>
            <div className="text-3xl font-bold tabular-nums">{money(allMoney)}</div>
          </div>
        </div>

        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-lava-400">
              <th className="py-1 font-semibold">Channel</th>
              <th className="py-1 font-semibold text-right">Tours</th>
              <th className="py-1 font-semibold text-right">Guests</th>
              <th className="py-1 font-semibold text-right">$</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map((c) => (
              <tr key={c} className="border-t border-sand-200">
                <td className="py-2 text-palm-900 font-medium">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle ${DOT[c]}`} />
                  <span className="sm:hidden">{SHORT[c]}</span>
                  <span className="hidden sm:inline">{c}</span>
                </td>
                <td className="py-2 text-right text-lava-500">{totals[c].bookings}</td>
                <td className="py-2 text-right text-palm-900">{totals[c].guests}</td>
                <td className="py-2 text-right text-palm-900 font-semibold">{money(totals[c].money)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-lava-400 leading-relaxed">
          By tour date, confirmed bookings only. OTA guests counted at {money(OTA_PER_GUEST)} each (estimate);
          Direct is what the guest paid on the website.
          {directMissing.length > 0 && (
            <> {directMissing.length} direct booking{directMissing.length > 1 ? "s have" : " has"} no amount in the sheet and count as $0.</>
          )}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-6">
        <h3 className="font-display text-lg font-semibold text-palm-900 px-3 sm:px-0 pt-3 sm:pt-0 mb-3">Day by day</h3>
        {loading && !rows.length ? (
          <p className="text-sm text-lava-400 px-3 pb-4">Loading…</p>
        ) : !rows.length ? (
          <p className="text-sm text-lava-400 px-3 pb-4">No confirmed tours this month yet.</p>
        ) : (
          <ul className="divide-y divide-sand-200">
            {rows.map((r) => (
              <li key={r.date} className="flex items-start justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <div className="text-palm-900 font-semibold whitespace-nowrap">{dayLabel(r.date)}</div>
                  <div className="text-sm text-palm-800 mt-0.5">
                    {CHANNELS.filter((c) => r.per[c]).map((c, i) => (
                      <span key={c} className="whitespace-nowrap">
                        {i > 0 && <span className="text-lava-300"> / </span>}
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 align-middle ${DOT[c]}`} />
                        {r.per[c]} {SHORT[c]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right tabular-nums shrink-0">
                  <div className="text-palm-900 font-semibold whitespace-nowrap">
                    {r.guests} · {money(r.take)}
                  </div>
                  <div className="text-xs text-lava-400 mt-0.5 whitespace-nowrap">
                    month {r.runGuests} · {money(r.runMoney)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
