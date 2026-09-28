import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export type BookingDetails = {
  tourType: "private" | "small-group";
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
      if (booking.vehicleType === "van") return 219900; // $2,199
      return 129900; // $1,299

    case "small-group":
      return 14900 * booking.partySize; // $149/person

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
      return `$149 x ${booking.partySize} guest${booking.partySize > 1 ? "s" : ""} = $${((14900 * booking.partySize) / 100).toFixed(0)} (Small Group Circle Island Tour)`;

    default:
      return "";
  }
}
