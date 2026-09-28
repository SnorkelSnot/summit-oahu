// Comprehensive list of Waikiki hotels for the booking dropdown
export const waikikiHotels = [
  "Ala Moana Hotel by Mantra",
  "Alohilani Resort Waikiki Beach",
  "Aqua Aloha Surf Waikiki",
  "Aqua Palms Waikiki",
  "Aqua Skyline at Island Colony",
  "Aston Waikiki Beach Tower",
  "Aston Waikiki Circle Hotel",
  "Aston Waikiki Sunset",
  "Aston at the Waikiki Banyan",
  "Bamboo Waikiki Hotel",
  "Coconut Waikiki Hotel",
  "Courtyard by Marriott Waikiki Beach",
  "DoubleTree by Hilton Alana Waikiki Beach",
  "Embassy Suites by Hilton Waikiki Beach Walk",
  "Espacio The Jewel of Waikiki",
  "Ewa Hotel Waikiki",
  "Hale Koa Hotel",
  "Halekulani",
  "Halepuna Waikiki by Halekulani",
  "Hawaiian Monarch",
  "Hilton Garden Inn Waikiki Beach",
  "Hilton Hawaiian Village (all towers — pickup at Grand Islander Bus Depot)",
  "Hilton Waikiki Beach",
  "Holiday Inn Express Waikiki",
  "Hotel La Croix Waikiki",
  "Hotel Renew",
  "Hyatt Centric Waikiki Beach",
  "Hyatt Place Waikiki Beach",
  "Hyatt Regency Waikiki Beach Resort & Spa",
  "Ilikai Hotel & Luxury Suites",
  "Ilima Hotel",
  "Inn on the Park",
  "Ka La'i Waikiki Beach, LXR Hotels & Resorts (formerly Trump International)",
  "Kaimana Beach Hotel",
  "Laylow Waikiki, Autograph Collection",
  "Lotus Honolulu at Diamond Head",
  "Luana Waikiki Hotel & Suites",
  "Moana Surfrider, A Westin Resort & Spa",
  "Outrigger Reef Waikiki Beach Resort",
  "Outrigger Waikiki Beach Resort",
  "Outrigger Waikiki Beachcomber Hotel",
  "Outrigger Waikiki Paradise Hotel",
  "Pacific Monarch Hotel",
  "Park Shore Waikiki",
  "Pearl Hotel Waikiki",
  "Polynesian Hostel Beach Club",
  "Prince Waikiki",
  "Queen Kapiolani Hotel",
  "Ramada Plaza by Wyndham Waikiki",
  "Regency on Beachwalk Waikiki by Outrigger",
  "Romer House Waikiki",
  "Romer Waikiki at the Ambassador",
  "Royal Grove Waikiki",
  "Royal Hawaiian, a Luxury Collection Resort",
  "Royal Kuhio Resort Condos",
  "Sheraton Princess Kaiulani",
  "Sheraton Waikiki",
  "Shoreline Hotel Waikiki",
  "Stay Hotel Waikiki",
  "Surfjack Hotel & Swim Club",
  "The Equus, an Ascend Hotel Collection Member",
  "The Imperial Hawaii Resort at Waikiki",
  "The Modern Honolulu, A Hilton Vacation Club",
  "The Ritz-Carlton Residences, Waikiki Beach",
  "The Twin Fin (formerly Aston Waikiki Beach Hotel)",
  "Vive Hotel Waikiki",
  "Waikiki Beach Marriott Resort & Spa",
  "Waikiki Beachside Hostel",
  "Waikiki Grand Hotel",
  "Waikiki Malia",
  "Waikiki Resort Hotel",
  "Waikiki Sand Villa Hotel",
  "Waikiki Shore by Outrigger",
  "Wayfinder Waikiki",
  "White Sands Hotel",
];

// Ko Olina Hotels (Private tours only)
export const koOlinaHotels = [
  "Aulani, A Disney Resort & Spa",
  "Four Seasons Resort O'ahu at Ko Olina",
  "Marriott's Ko Olina Beach Club",
];

// North Shore (Private tours only)
export const northShoreHotels = [
  "The Ritz-Carlton O'ahu, Turtle Bay (formerly Turtle Bay Resort)",
];

export type TourType = "private" | "small-group";

export function getAvailableHotels(tourType: TourType): string[] {
  if (tourType === "small-group") {
    return waikikiHotels;
  }
  return [...waikikiHotels, ...koOlinaHotels, ...northShoreHotels];
}

// Ko'Olina and North Shore pickups are available for PRIVATE tours only.
export function isPrivateOnlyHotel(hotel: string): boolean {
  return (
    koOlinaHotels.includes(hotel) ||
    northShoreHotels.includes(hotel) ||
    /ko'?\s?olina|aulani|turtle bay/i.test(hotel)
  );
}
