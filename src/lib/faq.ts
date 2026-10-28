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
    q: "What is the Summit Oahu circle island tour?",
    a: "A full-day guided tour that circles the island of Oahu, Hawaii, starting from Waikiki. The route takes in Diamond Head (we drive through the tunnel into the crater), Halona Blowhole and Eternity Beach, Makapuu Lookout, Waimanalo, Leonard's Malasadas, the Byodo-In Temple, the windward coast, lunch at Tanaka Kahuku Shrimp, the North Shore beaches (Sunset Beach, Pipeline and Waimea Bay), a macadamia nut farm, Haleiwa town and Dole Plantation.",
  },
  {
    q: "Do you offer a half-day tour of Oahu?",
    a: "Yes. The Half-Day Island Tour covers Oahu's southeast coast and windward side in one morning: Diamond Head, Leonard's Malasadas, Halona Blowhole and Eternity Beach, Makapuu Lookout, Waimanalo, a macadamia nut farm at Kualoa and the Nuuanu Pali Lookout. Pickup is at Waikiki hotels at 7:45am and you're back between 12:00 and 12:30pm. It's $179 per person with never more than 3 guests, in a Mercedes-Benz GLC.",
  },
  {
    q: "What's the best way to see all of Oahu in one day without renting a car?",
    a: "A guided circle island tour. Summit Oahu picks you up at your Waikiki hotel and drives the whole loop of the island in one day — the southeast coast, the windward side, the North Shore and back through the central plantation lands — so there's no rental car, no parking and no navigating. A local guide does the driving and the storytelling.",
  },
  {
    q: "Does the tour stop at the Byodo-In Temple?",
    a: "Yes, on the full-day tour. Every full-day small-group tour stops at the Byodo-In Temple in the Valley of the Temples on the windward side, a replica of a 950-year-old Buddhist temple in Uji, Japan, set beneath the Koolau cliffs. You can ring the temple bell and walk the koi ponds and gardens. The half-day tour does not stop at the temple.",
  },
  {
    q: "Is there hiking or snorkeling on the tour?",
    a: "No. This is a sightseeing tour: you ride in an air-conditioned van and get out at each stop for short, easy walks to lookouts, beaches and town. There is no hiking and no snorkeling time, which makes it a good fit for most ages and fitness levels. If you want a hike or a snorkel, plan it for another day.",
  },
  {
    q: "How is Summit Oahu different from the big bus tours?",
    a: "Size and who's guiding. The van never carries more than 13 guests, and the owners, Trey and Nikki, currently guide every tour themselves with live, unscripted commentary — no recorded narration, no 50-seat coach. And as far as we know, it's the only circle island tour on Oahu that can be guided in Turkish.",
  },
  {
    q: "How much does the tour cost?",
    a: "The full-day small-group circle island tour is $149 per person, and the Half-Day Island Tour is $179 per person. Private tours are $1,299 for up to four guests in a Mercedes GLC 300, or $2,199 for up to 13 guests in a private passenger van. Hawaii General Excise Tax is added at checkout. Food and drinks are not included.",
  },
  {
    q: "How big are the groups? Can I book as a solo traveler or couple?",
    a: "Yes. The full-day small-group tour takes 1 to 13 guests, so solo travelers, couples and families are all welcome — there is no minimum. Our van seats 14 passengers, but we only ever sell 13 seats so nobody rides wall-to-wall. The half-day tour is even smaller: never more than 3 guests.",
  },
  {
    q: "Where and when is pickup?",
    a: "The full-day small-group tour picks up from Waikiki hotels starting at 6:15am and returns you to Waikiki in time for happy hour. The half-day tour picks up at 7:45am and returns between 12:00 and 12:30pm. Choose your hotel from the list when you book. Private tours set their own departure time and can also pick up from Ko Olina and Turtle Bay.",
  },
  {
    q: "Who are the guides?",
    a: "Summit Oahu is owned and guided by Trey and Nikki, a husband-and-wife team with over two decades of guiding experience between them and nearly ten years guiding on Oahu. Right now the two of them guide every tour themselves. Commentary is live and unscripted, not a recording.",
  },
  {
    q: "Do you offer tours in Turkish?",
    a: "Yes. Nikki guides private circle island tours in Turkish (Türkçe), which is rare on Oahu. Turkish tours are private tours — see our Turkish page, which also covers honeymoon packages.",
  },
  {
    q: "Is Summit Oahu licensed and insured?",
    a: "Yes. Summit Oahu is a licensed passenger carrier certificated by the Hawaii Public Utilities Commission (PUC certificate 01390-C), registered with the U.S. Department of Transportation (USDOT 6998685), and carries commercial auto insurance.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Small-group and half-day seats cancelled 48 hours or more before pickup are refunded in full, less card processing fees; 24–48 hours gets a 50% refund; under 24 hours is non-refundable. Private tours need 7 days' notice for a full refund. Rescheduling outside those windows is free. If we cancel for weather or safety, you choose a full refund or a free reschedule. We run rain or shine.",
  },
  {
    q: "Can children come on the tour?",
    a: "Yes, as part of a family booking. Every guest occupying a seat needs their own ticket, and parents bring any required child car seat.",
  },
  {
    q: "Is lunch included?",
    a: "No. On the full-day tour, lunch is at Tanaka Kahuku Shrimp on the North Shore, and snacks along the way (malasadas, shave ice, Dole Whip) are paid for separately, so you only buy what you want. The half-day tour is back in Waikiki by lunchtime.",
  },
  {
    q: "Is it spelled Oahu or Oʻahu?",
    a: "Both are right. Oʻahu is the Hawaiian spelling: the mark before the 'a' is an ʻokina, a glottal stop, so the name is said \"oh-AH-hoo\". Oahu is the everyday English spelling you'll see on maps and signs. Summit Oahu and Summit Oʻahu are the same company.",
  },
  {
    q: "How do I book?",
    a: "Book online at summitoahu.com/book, which shows live seat availability, or call or text 808.203.4103. Online booking stays open into the early morning of the tour; for a truly last-minute seat, call or text.",
  },
];
