/**
 * Tour types, prices and capacities — ONE place.
 *
 * Every price here must match the FILED TARIFF. Under the filed-rate doctrine
 * the published tariff rate is the only rate Summit may charge, so a price
 * change here is a tariff amendment first and a code change second.
 *
 * HALF-DAY (added Oct 2026, v46): a "super small group" of at most 3 guests,
 * run in the Mercedes GLC. Seats are sold individually like the full-day small
 * group, but the vehicle is the Mercedes, so:
 *   - any half-day booking on a date takes the Mercedes → no private Mercedes
 *     tour that date;
 *   - a private Mercedes booking (or a Mercedes MANUAL_BLOCK) → no half-day
 *     that date.
 * The van and the full-day small group are unaffected — one of Trey/Nehir
 * takes each vehicle.
 * Deliberately NOT described as private anywhere guest-facing (Trey, Oct 2026),
 * even though most bookings will end up being one party.
 */
export type TourType = "private" | "small-group" | "half-day";

export const SMALL_GROUP_PRICE = 149; // per person
export const SMALL_GROUP_MAX_SEATS = 13;

// $179 is Trey's working figure (Oct 13, 2026) — NOT YET IN THE TARIFF.
export const HALF_DAY_PRICE = 179; // per person
export const HALF_DAY_MAX_SEATS = 3;
export const HALF_DAY_NAME = "Half-Day Island Tour";
export const HALF_DAY_PICKUP = "7:45am";
export const HALF_DAY_RETURN = "12:00–12:30pm";

export const PRIVATE_MERCEDES_PRICE = 1299;
export const PRIVATE_VAN_PRICE = 2199;

/** Tours sold by the seat (Waikiki pickups only, no Ko Olina / North Shore). */
export function isSeatTour(t: string): t is "small-group" | "half-day" {
  return t === "small-group" || t === "half-day";
}

export const VALID_TOUR_TYPES: TourType[] = ["small-group", "half-day", "private"];
