/**
 * BUTTON TYPE MATTERS HERE — every <button> in this file MUST carry
 * type="button".
 *
 * This calendar is rendered inside BookingForm's <form>. An HTML button with no
 * type attribute defaults to type="submit", so from Sep 2026 back to whenever
 * this was written, clicking a month arrow or a date cell SUBMITTED THE BOOKING
 * FORM. What Trey noticed was the mild version: the browser refused the submit,
 * ran HTML5 validation, and scrolled focus to the first empty required field
 * (first name), which read as the page jumping around.
 *
 * The severe version is the one that was never seen. handleSubmit has no guard
 * and posts straight to /api/create-checkout, so once a guest had filled the
 * form in, validation would PASS — and changing the month, or clicking a
 * different date to compare, would have sent them to Stripe checkout.
 *
 * BookingForm itself gets this right on all seven of its own buttons. This file
 * was the only one that did not.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TourType } from "@/lib/tours";

/**
 * AVAILABLE / UNAVAILABLE ONLY (Oct 28, 2026 — Nikki didn't want the calendar
 * showing the world how full each day is). The guest picks the tour and the
 * group size first; the server then answers, per day, whether THAT group fits.
 * No seat counts reach the browser at all (see /api/availability), so there is
 * no "limited seats" state and no seats-left badge any more.
 *   past        -> grey
 *   available   -> green (a shade darker than before)
 *   unavailable -> soft red/pink (full, blocked, or not enough room)
 *   cutoff      -> also pink; closed online, and the "call us" note shows
 */
type DayInfo = {
  date: string;
  status: "available" | "unavailable" | "cutoff";
};

type Props = {
  tourType: TourType;
  vehicleType?: "mercedes" | "van";
  partySize: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

/**
 * Today's date in Honolulu as YYYY-MM-DD.
 *
 * Summit operates on Hawaiʻi dates, so every date decision in this component is
 * anchored here rather than to the guest's browser timezone. Hawaiʻi never
 * observes DST (always UTC-10), but that only helps if something actually
 * applies the offset — hence Intl rather than hand arithmetic.
 */
function honoluluTodayStr(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Pacific/Honolulu",
  }).format(new Date());
}

export default function AvailabilityCalendar({
  tourType,
  vehicleType = "mercedes",
  partySize,
  selectedDate,
  onSelectDate,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Open on Summit's current month, not the visitor's. A guest booking from
    // Berlin at 10am is already on "tomorrow" in browser-local terms.
    const [y, m] = honoluluTodayStr().split("-").map(Number);
    return { year: y, month: m - 1 };
  });
  const [availability, setAvailability] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  // FAIL CLOSED: if the availability fetch errors, disable booking rather
  // than rendering an empty (= all-available) calendar. Auto-refresh retries.
  const [loadError, setLoadError] = useState(false);
  // Track which month the current availability data belongs to
  const [loadedMonth, setLoadedMonth] = useState<string>("");
  // Abort controller to cancel stale fetches
  const abortRef = useRef<AbortController | null>(null);

  const monthKey = `${currentMonth.year}-${currentMonth.month}`;
  // Data belongs to a month AND a tour/vehicle/group size: change any of them
  // and the calendar greys out until the matching answer arrives.
  const queryKey = `${monthKey}|${tourType}|${vehicleType}|${partySize}`;

  const fetchAvailability = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/availability?year=${currentMonth.year}&month=${currentMonth.month}` +
          `&tour=${tourType}&vehicle=${vehicleType}&party=${partySize}&_t=${Date.now()}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error(`availability HTTP ${res.status}`);
      const data = await res.json();
      if (data.error || !Array.isArray(data.days)) {
        throw new Error(data.error || "availability: malformed response");
      }
      // Only apply if this request wasn't aborted (i.e. month didn't change mid-fetch)
      if (!controller.signal.aborted) {
        setAvailability(data.days);
        setLoadedMonth(queryKey);
        setLoadError(false);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setAvailability([]);
        setLoadedMonth(queryKey);
        setLoadError(true);
      }
    }
    if (!controller.signal.aborted) {
      setLoading(false);
    }
  }, [currentMonth, tourType, vehicleType, partySize]);

  useEffect(() => {
    fetchAvailability();

    // Auto-refresh every 30 seconds so the calendar stays current
    const interval = setInterval(fetchAvailability, 30000);
    return () => {
      clearInterval(interval);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchAvailability]);

  // Honolulu date string — the single anchor for every date comparison here.
  //
  // THERE IS DELIBERATELY NO MINIMUM LEAD TIME IN THIS FILE. How late a future
  // date stays sellable is decided by the booking cutoff, computed server-side
  // and delivered as `cutoffPassed` (see src/lib/bookingCutoff.ts): an empty day
  // closes 8h before the 06:15 pickup, a day already running stays open until
  // pickups begin. A lead-time rule here runs BEFORE that check in
  // getDayStatus() and silently overrides it.
  //
  // A hardcoded `minDate = today + 2 days` lived here until Aug 2026. It made
  // tomorrow permanently unbookable, and because every date the cutoff governs
  // falls inside that window, the entire cutoff feature was unreachable in the
  // UI from the day it shipped. Do not reintroduce one.
  const todayStr = honoluluTodayStr();
  const [todayYear, todayMonth1] = todayStr.split("-").map(Number);

  const daysInMonth = new Date(
    currentMonth.year,
    currentMonth.month + 1,
    0
  ).getDate();
  const firstDayOfWeek = new Date(
    currentMonth.year,
    currentMonth.month,
    1
  ).getDay();

  const monthName = new Date(
    currentMonth.year,
    currentMonth.month
  ).toLocaleString("default", { month: "long", year: "numeric" });

  function prevMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 0)
        return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  }

  function nextMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 11)
        return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  }

  // Data is stale if it was fetched for another month, tour or group size
  const dataIsStale = loadedMonth !== queryKey;
  // Calendar is not ready if we're loading, data is from a different month,
  // or the last fetch failed (fail closed until the auto-refresh recovers)
  const notReady = loading || dataIsStale || loadError;

  function getDayStatus(day: number) {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    // Past days only. YYYY-MM-DD strings compare correctly lexicographically,
    // which keeps this free of Date-arithmetic timezone bugs entirely.
    if (dateStr < todayStr) return { status: "past" as const, dateStr };

    // If data isn't loaded for this month yet, treat everything as loading (disabled)
    if (notReady) return { status: "loading" as const, dateStr };

    const dayInfo = availability.find((d) => d.date === dateStr);
    if (!dayInfo) return { status: "unavailable" as const, dateStr };
    return { status: dayInfo.status, dateStr };
  }

  // If the guest changes the tour or group size after picking a date, and that
  // date no longer works for the new choice, clear it rather than carry it on.
  useEffect(() => {
    if (!selectedDate || notReady) return;
    if (!selectedDate.startsWith(`${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}`)) return;
    const d = availability.find((x) => x.date === selectedDate);
    if (d && d.status !== "available") onSelectDate("");
  }, [availability, notReady, selectedDate, currentMonth, onSelectDate]);

  // Don't allow navigating to past months
  const canGoPrev =
    currentMonth.year > todayYear ||
    (currentMonth.year === todayYear && currentMonth.month > todayMonth1 - 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-sand-200/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-sand-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 text-lava-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-display text-lg font-semibold text-palm-900">
          {monthName}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-sand-100 transition-colors"
        >
          <svg className="w-5 h-5 text-lava-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-lava-400 uppercase tracking-wider py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-1 transition-opacity duration-200 ${notReady ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const { status, dateStr } = getDayStatus(day);
          const isSelected = selectedDate === dateStr;
          const isClickable = !notReady && status === "available";

          return (
            <button
              key={day}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectDate(dateStr)}
              aria-label={`${dateStr}: ${status === "available" ? "available" : status === "past" ? "past" : status === "loading" ? "loading" : "unavailable"}`}
              className={`relative h-12 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-palm-700 text-white shadow-lg shadow-palm-700/30 ring-2 ring-palm-500"
                  : status === "available"
                    ? "bg-palm-100 text-palm-800 ring-1 ring-inset ring-palm-200 hover:bg-palm-200 hover:shadow-md cursor-pointer"
                    : status === "unavailable" || status === "cutoff"
                      ? "bg-rose-100 text-rose-400 cursor-not-allowed"
                      : status === "past"
                        ? "bg-lava-50 text-lava-300 cursor-not-allowed"
                        : "text-lava-300 cursor-not-allowed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Booking cutoff notice — only when a date on screen has closed online
          but is not actually sold out. We want that phone call. */}
      {!notReady &&
        availability.some((d) => d.status === "cutoff" && d.date >= todayStr) && (
          <div className="mt-4 rounded-lg bg-gold-50 border border-gold-200 px-4 py-3 text-sm text-gold-800">
            <strong className="font-semibold">Looking for a last-minute seat?</strong>{" "}
            Online booking closes early on the morning of the tour. Call or text{" "}
            <a href="tel:+18082034103" className="underline font-semibold whitespace-nowrap">
              808.203.4103
            </a>{" "}
            — if we can make it work, we will.
          </div>
        )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-sand-200 flex flex-wrap gap-4 text-xs text-lava-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-palm-100 ring-1 ring-inset ring-palm-200" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-100" />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-lava-50 border border-lava-100" />
          <span>Past</span>
        </div>
      </div>

      {notReady && (
        <div className="mt-4 text-center text-sm text-lava-400 flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {loadError
            ? "Having trouble loading live availability — retrying automatically. You can also call/text 808.203.4103 to book."
            : "Loading availability..."}
        </div>
      )}
    </div>
  );
}
