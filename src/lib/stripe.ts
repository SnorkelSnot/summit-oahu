import Stripe from "stripe";
import {
  HALF_DAY_NAME,
  HALF_DAY_PRICE,
  PRIVATE_MERCEDES_PRICE,
  PRIVATE_VAN_PRICE,
  SMALL_GROUP_PRICE,
  type TourType,
} from "./tours";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export type BookingDetails = {
  tourType: TourType;
  vehicleType: "mercedes" | "van";
  partySize: number;
  date: string;
  name: string;
  email: string;
  phone: string;
  hotel: string;
  comments?: string;
  conciergeRef?: string;
};

export function calculatePrice(booking: BookingDetails): number {
  switch (booking.tourType) {
    case "private":
      if (booking.vehicleType === "van") return PRIVATE_VAN_PRICE * 100;
      return PRIVATE_MERCEDES_PRICE * 100;

    case "small-group":
      return SMALL_GROUP_PRICE * 100 * booking.partySize;

    case "half-day":
      return HALF_DAY_PRICE * 100 * booking.partySize;

    default:
      return 0;
  }
}

export function getPriceDescription(booking: BookingDetails): string {
  switch (booking.tourType) {
    case "private":
      if (booking.vehicleType === "van")
        return "$2,199 flat rate (Private Van Tour, up to 13 guests)";
      return `$1,299 flat rate (Private Mercedes Tour, up to 4 guests)`;

    case "small-group":
      return `$${SMALL_GROUP_PRICE} x ${booking.partySize} guest${booking.partySize > 1 ? "s" : ""} = $${SMALL_GROUP_PRICE * booking.partySize} (Small Group Circle Island Tour)`;

    case "half-day":
      return `$${HALF_DAY_PRICE} x ${booking.partySize} guest${booking.partySize > 1 ? "s" : ""} = $${HALF_DAY_PRICE * booking.partySize} (${HALF_DAY_NAME})`;

    default:
      return "";
  }
}
