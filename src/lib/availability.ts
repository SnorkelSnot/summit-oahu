import { isPastBookingCutoff, CUTOFF_MESSAGE } from "./bookingCutoff";
import {
  HALF_DAY_MAX_SEATS,
  SMALL_GROUP_MAX_SEATS,
  type TourType,
} from "./tours";
import {
  appendBooking,
  getBookingsForDate,
  getBookingsForMonth,
  type SheetBooking,
} from "./sheets";

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  privateBooked: boolean;
  mercedesBooked: boolean;
  vanSeatsTotal: number;
  vanSeatsTaken: number;
  /** Half-day seats in the Mercedes. Taken = total when the Mercedes is
   *  privately booked or blocked, mirroring how a private van fills the van. */
  halfDaySeatsTotal: number;
  halfDaySeatsTaken: number;
  blocked: boolean; // manually blocked entirely
  /** Which MANUAL_BLOCK rows exist for the day ("ALL", "van", "mercedes") — for /admin. */
  blocks?: ("ALL" | "van" | "mercedes")[];
  cutoffPassed?: boolean; // online booking window has closed for this date (see bookingCutoff.ts)
  bookings: BookingRecord[];
  sheetsError?: boolean; // Sheets unreachable — day is failed CLOSED, show an honest "try again" message
};

export type BookingRecord = {
  id: string;
  tourType: TourType;
  vehicleType: "mercedes" | "van";
  partySize: number;
  name: string;
  email: string;
  phone: string;
  hotel: string;
  comments?: string;
  conciergeRef?: string;
  stripeSessionId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  total?: number;
};

const MAX_VAN_SEATS = SMALL_GROUP_MAX_SEATS;

/**
 * Computes availability for a date from raw sheet rows.
 * Rules:
 *  - MANUAL_BLOCK + Vehicle=ALL  → day fully blocked
 *  - MANUAL_BLOCK + Vehicle=van  → van unavailable (small-group & private-van)
 *  - MANUAL_BLOCK + Vehicle=mercedes → mercedes (private-suv) unavailable
 *  - private + van  → van fully occupied (13 seats taken)
 *  - small-group + van  → seats taken = sum of partySize
 *  - private + mercedes → mercedes occupied, van unaffected
 *  - half-day (Mercedes) → half-day seats taken = sum of partySize; ANY
 *    half-day seat taken also marks the Mercedes unavailable for a private
 *    tour, and a private Mercedes / Mercedes block fills every half-day seat
 */
export function computeDayFromRows(
  date: string,
  rows: SheetBooking[]
): DayAvailability & { mercedesBooked: boolean } {
  let blocked = false;
  let vanBlocked = false;
  let mercedesBlocked = false;
  let privateBooked = false;
  let mercedesBooked = false;
  let vanSeatsTaken = 0;
  let halfDaySeatsTaken = 0;
  let privateMercedes = false;
  let confirmedBookings = 0;
  const bookings: BookingRecord[] = [];
  const blocks: ("ALL" | "van" | "mercedes")[] = [];

  for (const r of rows) {
    if (r.status === "MANUAL_BLOCK") {
      if (!blocks.includes(r.vehicle)) blocks.push(r.vehicle);
      if (r.vehicle === "ALL") blocked = true;
      if (r.vehicle === "van") vanBlocked = true;
      if (r.vehicle === "mercedes") mercedesBlocked = true;
      continue;
    }
    if (r.status !== "CONFIRMED" && r.status !== "PENDING") continue;

    if (r.status === "CONFIRMED") confirmedBookings++;

    if (r.tourType === "private") {
      privateBooked = true;
      if (r.vehicle === "van") {
        vanSeatsTaken = MAX_VAN_SEATS;
      } else if (r.vehicle === "mercedes") {
        mercedesBooked = true;
        privateMercedes = true;
      }
    } else if (r.tourType === "small-group") {
      vanSeatsTaken += r.partySize;
    } else if (r.tourType === "half-day") {
      halfDaySeatsTaken += r.partySize;
    }

    bookings.push({
      id: r.bookingId,
      tourType: r.tourType as TourType,
      vehicleType: (r.vehicle === "mercedes" ? "mercedes" : "van") as
        | "mercedes"
        | "van",
      partySize: r.partySize,
      name: r.name,
      email: r.email,
      phone: r.phone,
      hotel: r.hotel,
      comments: r.comments,
      conciergeRef: r.concierge,
      stripeSessionId: r.stripeSessionId,
      status: r.status === "PENDING" ? "pending" : "confirmed",
      createdAt: r.createdAt,
      total: r.total,
    });
  }

  if (vanBlocked) vanSeatsTaken = MAX_VAN_SEATS;
  if (mercedesBlocked) mercedesBooked = true;
  // The half-day runs in the Mercedes: it and a private Mercedes tour exclude
  // each other for the whole date.
  if (halfDaySeatsTaken > 0) mercedesBooked = true;
  if (privateMercedes || mercedesBlocked || blocked)
    halfDaySeatsTaken = HALF_DAY_MAX_SEATS;

  // BOOKING CUTOFF — a day with no confirmed bookings closes earlier than one
  // already running, because only the empty day risks us sleeping through a
  // pickup. See src/lib/bookingCutoff.ts for the reasoning.
  const cutoffPassed = isPastBookingCutoff(date, confirmedBookings > 0);

  // cutoffPassed is a PURE FLAG. Deliberately does NOT fake seat counts or
  // booked flags: those must keep reporting real occupancy so /admin stays
  // truthful and so the Stripe webhook can distinguish "seats gone" (a real
  // conflict) from "clock rolled past the cutoff mid-payment" (not the
  // guest's fault). Consumers apply the policy; the data stays honest.
  return {
    date,
    privateBooked: privateBooked || blocked,
    mercedesBooked: mercedesBooked || blocked,
    vanSeatsTotal: MAX_VAN_SEATS,
    vanSeatsTaken: Math.min(vanSeatsTaken, MAX_VAN_SEATS),
    halfDaySeatsTotal: HALF_DAY_MAX_SEATS,
    halfDaySeatsTaken: Math.min(halfDaySeatsTaken, HALF_DAY_MAX_SEATS),
    blocked,
    blocks,
    cutoffPassed,
    bookings,
  };
}

export async function getDayAvailability(
  date: string
): Promise<DayAvailability> {
  try {
    const rows = await getBookingsForDate(date);
    return computeDayFromRows(date, rows);
  } catch (err) {
    // FAIL CLOSED: if the sheet can't be read we can't prove the day is
    // open, so we must not sell it. (Previously this returned a fully open
    // day, which could overbook during a Sheets outage.)
    console.error("Sheets unavailable — failing closed for", date, err);
    return {
      date,
      privateBooked: true,
      mercedesBooked: true,
      vanSeatsTotal: MAX_VAN_SEATS,
      vanSeatsTaken: MAX_VAN_SEATS,
      halfDaySeatsTotal: HALF_DAY_MAX_SEATS,
      halfDaySeatsTaken: HALF_DAY_MAX_SEATS,
      blocked: true,
      bookings: [],
      sheetsError: true,
    };
  }
}

export async function getMonthAvailability(
  year: number,
  month: number
): Promise<DayAvailability[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let monthRows: SheetBooking[] = [];
  let monthError = false;
  try {
    monthRows = await getBookingsForMonth(year, month);
  } catch (err) {
    // FAIL CLOSED (see getDayAvailability) — an unreadable sheet must not
    // render as a wide-open month on the calendar.
    console.error("Sheets unavailable for month — failing closed:", err);
    monthError = true;
  }

  const results: DayAvailability[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    if (monthError) {
      results.push({
        date: dateStr,
        privateBooked: true,
        mercedesBooked: true,
        vanSeatsTotal: MAX_VAN_SEATS,
        vanSeatsTaken: MAX_VAN_SEATS,
        halfDaySeatsTotal: HALF_DAY_MAX_SEATS,
        halfDaySeatsTaken: HALF_DAY_MAX_SEATS,
        blocked: true,
        bookings: [],
        sheetsError: true,
      });
      continue;
    }
    const rowsForDate = monthRows.filter((r) => r.date === dateStr);
    results.push(computeDayFromRows(dateStr, rowsForDate));
  }
  return results;
}

export async function checkAvailability(
  date: string,
  tourType: TourType,
  partySize: number,
  vehicleType?: "mercedes" | "van",
  opts?: {
    /**
     * Skip the booking-cutoff window. Used ONLY by the Stripe webhook: the
     * guest passed the cutoff when checkout was created, and payment taking
     * a few minutes must not retroactively invalidate their booking.
     */
    ignoreCutoff?: boolean;
  }
): Promise<{
  available: boolean;
  reason?: string;
  vanConflict?: boolean;
  sheetsError?: boolean;
  cutoffPassed?: boolean;
}> {
  const day = (await getDayAvailability(date)) as DayAvailability & {
    mercedesBooked?: boolean;
  };
  return judgeDay(day, tourType, partySize, vehicleType, opts);
}

/**
 * The one place that decides whether a day can take this booking. Used by the
 * checkout (checkAvailability above) and by the public calendar
 * (publicDayStatus below), so the two can never disagree.
 *
 * NO NUMBERS IN GUEST-FACING REASONS (Oct 28, 2026 — Nikki): the site must not
 * tell the world how full a day is. "Only 3 seats remaining" became "doesn't
 * have room for your group". Seat counts stay internal (admin + this file).
 */
export function judgeDay(
  day: DayAvailability,
  tourType: TourType,
  partySize: number,
  vehicleType?: "mercedes" | "van",
  opts?: { ignoreCutoff?: boolean }
): {
  available: boolean;
  reason?: string;
  vanConflict?: boolean;
  sheetsError?: boolean;
  cutoffPassed?: boolean;
} {
  const NO_ROOM =
    "This date doesn't have room for your group. Please pick another date, or call/text 808.203.4103 and we'll see what we can do.";

  if (day.sheetsError) {
    // Distinguish "we couldn't check" from "it's booked" — honest message,
    // and callers (the Stripe webhook) can retry rather than flag a conflict.
    return {
      available: false,
      sheetsError: true,
      reason:
        "We couldn't confirm live availability just now. Please try again in a minute, or call/text 808.203.4103 and we'll book you directly.",
    };
  }

  // Cutoff is checked before `blocked` so the guest gets the useful message
  // (call us) rather than a flat "not available".
  if (day.cutoffPassed && !day.blocked && !opts?.ignoreCutoff) {
    return { available: false, cutoffPassed: true, reason: CUTOFF_MESSAGE };
  }

  if (day.blocked) {
    return { available: false, reason: "This date is not available." };
  }

  if (tourType === "half-day") {
    const left = day.halfDaySeatsTotal - day.halfDaySeatsTaken;
    if (partySize > left) return { available: false, reason: NO_ROOM };
    return { available: true };
  }

  if (tourType === "private") {
    if (vehicleType === "mercedes") {
      if (day.mercedesBooked) {
        return { available: false, reason: "This date is not available for a private tour in the Mercedes." };
      }
      return { available: true };
    }
    // Private van
    if (day.vanSeatsTaken > 0) {
      return {
        available: false,
        vanConflict: true,
        reason:
          "The van is already reserved on this date. Please call us to discuss alternatives.",
      };
    }
    return { available: true };
  }

  // Small group
  const seatsRemaining = day.vanSeatsTotal - day.vanSeatsTaken;
  if (partySize > seatsRemaining) return { available: false, reason: NO_ROOM };
  return { available: true };
}

/**
 * What the PUBLIC calendar is allowed to know about a day: available,
 * unavailable, or "cutoff" (closed online, but call us). Nothing else.
 */
export type PublicDayStatus = "available" | "unavailable" | "cutoff";

export function publicDayStatus(
  day: DayAvailability,
  tourType: TourType,
  partySize: number,
  vehicleType?: "mercedes" | "van"
): PublicDayStatus {
  const r = judgeDay(day, tourType, partySize, vehicleType);
  if (r.available) return "available";
  return r.cutoffPassed ? "cutoff" : "unavailable";
}

export async function addBooking(
  date: string,
  booking: BookingRecord,
  sheetStatus: "CONFIRMED" | "PENDING" = "CONFIRMED"
): Promise<void> {
  await appendBooking({
    bookingId: booking.id,
    date,
    status: sheetStatus,
    tourType: booking.tourType,
    vehicle: booking.vehicleType,
    partySize: booking.partySize,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    hotel: booking.hotel,
    comments: booking.comments || "",
    concierge: booking.conciergeRef || "",
    stripeSessionId: booking.stripeSessionId,
    total: booking.total || 0,
    createdAt: booking.createdAt,
  });
}

export function getVanSeatsRemaining(day: DayAvailability): number {
  return day.vanSeatsTotal - day.vanSeatsTaken;
}
