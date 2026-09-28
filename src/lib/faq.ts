/**
 * Visible FAQ on the homepage AND the FAQPage structured data are both built
 * from this list, so what search engines and AI assistants read is exactly
 * what guests read. Keep answers factual and self-contained — each one may be
 * quoted on its own by an AI answer engine, out of context.
 *
 * Do NOT put discount amounts here: discounts are spoken, never printed.
 */
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What is the Summit O'ahu circle island tour?",
    a: "A full-day guided tour that circles the island of O'ahu, Hawai'i, starting from Waikīkī. The route takes in Diamond Head, Halona Blowhole and Eternity Beach, Makapu'u Lookout, Waimānalo, Leonard's Malasadas, the Byodo-In Temple, the windward coast, lunch at Tanaka Kahuku Shrimp, the North Shore beaches (Sunset Beach, Pipeline and Waimea Bay), a macadamia nut farm, Hale'iwa town and Dole Plantation.",
  },
  {
    q: "How much does the tour cost?",
    a: "The small-group circle island tour is $149 per person. Private tours are $1,299 for up to four guests in a Mercedes GLC 300, or $2,199 for up to 13 guests in a private passenger van. Hawai'i General Excise Tax is added at checkout. Food and drinks are not included.",
  },
  {
    q: "How big are the groups? Can I book as a solo traveler or couple?",
    a: "Yes. The small-group tour takes 1 to 13 guests, so solo travelers, couples and families are all welcome — there is no minimum. Our van seats 14 passengers, but we only ever sell 13 seats so nobody rides wall-to-wall.",
  },
  {
    q: "Where and when is pickup?",
    a: "The small-group tour picks up from Waikīkī hotels starting at 6:15am and returns you to Waikīkī in time for happy hour. Choose your hotel from the list when you book. Private tours set their own departure time and can also pick up from Ko Olina and Turtle Bay.",
  },
  {
    q: "Who are the guides?",
    a: "Summit O'ahu is owned and guided by Trey and Nehir, a husband-and-wife team with over two decades of guiding experience between them and nearly ten years guiding on O'ahu. Right now the two of them guide every tour themselves. Commentary is live and unscripted, not a recording.",
  },
  {
    q: "Do you offer tours in Turkish?",
    a: "Yes. Nehir guides private circle island tours in Turkish (Türkçe), which is rare on O'ahu. Turkish tours are private tours — see our Turkish page, which also covers honeymoon packages.",
  },
  {
    q: "Is Summit O'ahu licensed and insured?",
    a: "Yes. Summit O'ahu is a licensed passenger carrier certificated by the Hawai'i Public Utilities Commission (PUC certificate 01390-C), registered with the U.S. Department of Transportation (USDOT 6998685), and carries commercial auto insurance.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Small-group seats cancelled 48 hours or more before pickup are refunded in full, less card processing fees; 24–48 hours gets a 50% refund; under 24 hours is non-refundable. Private tours need 7 days' notice for a full refund. Rescheduling outside those windows is free. If we cancel for weather or safety, you choose a full refund or a free reschedule. We run rain or shine.",
  },
  {
    q: "Can children come on the tour?",
    a: "Yes, as part of a family booking. Every guest occupying a seat needs their own ticket, lap infants cannot ride, and parents bring any required child car seat.",
  },
  {
    q: "Is lunch included?",
    a: "No. Lunch is at Tanaka Kahuku Shrimp on the North Shore and snacks along the way (malasadas, shave ice, Dole Whip) are paid for separately, so you only buy what you want.",
  },
  {
    q: "How do I book?",
    a: "Book online at summitoahu.com/book, which shows live seat availability, or call or text 808.203.4103. Online booking stays open into the early morning of the tour; for a truly last-minute seat, call or text.",
  },
];
