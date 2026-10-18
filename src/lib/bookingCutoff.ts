/**
 * BOOKING CUTOFF POLICY
 * ---------------------
 * Problem this solves: a booking that lands overnight on a day with NO other
 * bookings is the only booking that can actually cost us a guest. Zero booked
 * means no alarm set; if a reservation arrives at 3am for a 6:15am pickup we
 * are asleep and the guest is standing in a lobby.
 *
 * A booking arriving overnight on a day that is ALREADY running is a non-issue
 * (decided by Trey, Aug 2026): we are awake either way, and re-sequencing a
 * Waikīkī pickup route at that hour takes seconds with no traffic. So the rule
 * is conditional on whether the day is already active, not a flat lead time.
 *
 *   Day with ZERO confirmed bookings → closes at EMPTY_DAY_CLOSE_HOUR:MINUTE local
 *   Day already running              → stays open until pickups actually begin
 *
 * This is deliberately stateless: it is derived from the clock on every
 * request, so there is no scheduled job that can silently fail to fire and
 * leave the day open. If the code runs at all, the rule holds.
 *
 * AUG 28, 2026 — THE EMPTY-DAY WINDOW WAS CUT FROM 8 HOURS TO 1.
 * The 8-hour rule only ever protected the website. Viator and GetYourGuide
 * sell on their own cutoffs, and both are now set to one hour, so a 3am OTA
 * booking on an empty day already lands and always did. Holding the website to
 * 22:15 did not prevent that morning — it just meant Summit refused the direct
 * booking (0% commission) while still accepting the OTA one (25–30%).
 *
 * So the wake-up risk this file was written to manage is NOT solved here any
 * more. It has moved to a notification that has to actually wake someone up
 * for an overnight booking on an otherwise empty day. Until that exists,
 * accepting a 5am booking is a deliberate, uncovered risk. If that alarm is
 * ever removed, raise this constant back to 8 in the same change.
 *
 * NOTE: this does not reject the guest, it routes them to the phone. Trey can
 * still take a late booking by hand when he is awake and wants it — which is
 * exactly the standby-fare case worth keeping.
 */

// Hawaiʻi does not observe daylight saving. HST is always UTC-10, year round.
const HST_UTC_OFFSET_HOURS = -10;

/** First hotel pickup, local Honolulu time. Tours depart Waikīkī ~06:45. */
export const FIRST_PICKUP_HOUR = 6;
export const FIRST_PICKUP_MINUTE = 15;

/**
 * When an EMPTY day stops selling — an ABSOLUTE Honolulu clock time, not a lead
 * time off pickup.
 *
 * 04:20 HST as of Sep 2026 (Trey). Previously expressed as a lead time:
 * EMPTY_DAY_LEAD_HOURS 1 (closing 05:15) from Aug 29, and 8 (closing 22:15 the
 * night before) before that.
 *
 * WHY AN ABSOLUTE TIME AND NOT A LEAD OFFSET. The thing this rule protects is a
 * human being awake to see a booking land. That is a wall-clock concern, not a
 * relationship to when the van leaves. Expressed as a lead time, 04:20 is an
 * awkward 1h55m — and worse, if FIRST_PICKUP ever moved to 07:00 the close would
 * silently drift to 05:05, changing the one thing the rule exists to pin down.
 * As an absolute time it stays where it was put.
 */
export const EMPTY_DAY_CLOSE_HOUR = 4;
export const EMPTY_DAY_CLOSE_MINUTE = 20;

/** Hours before first pickup that an ALREADY-RUNNING day stops selling. 0 → open until pickups start (06:15). */
export const ACTIVE_DAY_LEAD_HOURS = 0;

/** Epoch ms of a Honolulu local wall-clock time on a YYYY-MM-DD date. */
export function honoluluUtcMs(dateStr: string, hour: number, minute: number): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  // Hawaiʻi is UTC-10 year round with no DST, so local 04:20 is 14:20 UTC on the
  // same calendar day and the arithmetic never needs a timezone library.
  return Date.UTC(y, m - 1, d, hour - HST_UTC_OFFSET_HOURS, minute, 0, 0);
}

/** Epoch ms of the first pickup on a YYYY-MM-DD date, interpreted in Honolulu time. */
export function firstPickupUtcMs(dateStr: string): number {
  return honoluluUtcMs(dateStr, FIRST_PICKUP_HOUR, FIRST_PICKUP_MINUTE);
}

/** Epoch ms at which this date stops being bookable online. */
export function bookingCutoffUtcMs(dateStr: string, dayHasActiveBooking: boolean): number {
  // A day that is ALREADY RUNNING keeps selling until pickups begin: we are awake
  // either way, and re-sequencing a Waikīkī route at that hour costs seconds.
  if (dayHasActiveBooking) {
    return firstPickupUtcMs(dateStr) - ACTIVE_DAY_LEAD_HOURS * 3600_000;
  }
  // An EMPTY day closes at a fixed local time, because the constraint is being
  // awake, not the distance from pickup.
  return honoluluUtcMs(dateStr, EMPTY_DAY_CLOSE_HOUR, EMPTY_DAY_CLOSE_MINUTE);
}

/**
 * True when online booking has closed for this date.
 * `dayHasActiveBooking` should count CONFIRMED passenger bookings only — a lone
 * unresolved PENDING (a webhook race loser) must not hold the door open all night.
 */
export function isPastBookingCutoff(
  dateStr: string,
  dayHasActiveBooking: boolean,
  nowMs: number = Date.now()
): boolean {
  const cutoff = bookingCutoffUtcMs(dateStr, dayHasActiveBooking);
  if (Number.isNaN(cutoff)) return false;
  return nowMs >= cutoff;
}

/** Guest-facing explanation. Deliberately an invitation to call, not a refusal. */
export const CUTOFF_MESSAGE =
  "Online booking has closed for this date. For last-minute seats, call or text 808.203.4103 — if we can make it work, we will.";
