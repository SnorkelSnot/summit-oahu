/**
 * Summit O'ahu LLC — Release, Waiver of Liability & Assumption of Risk
 *
 * Single source of truth for the waiver. Rendered by:
 *   - /waiver (standalone, printable page)
 *   - <WaiverAgreement /> (scroll-gated box in the booking flow)
 *
 * IMPORTANT: bump WAIVER_VERSION and WAIVER_EFFECTIVE_DATE any time the
 * text changes. The accepted version is recorded with every booking, so
 * you can always prove exactly which text a guest agreed to.
 *
 * Drafted with Hawaii Revised Statutes § 663-1.54 in mind: waivers of an
 * operator's own negligence are unenforceable in Hawaii, but releases for
 * DISCLOSED INHERENT RISKS are valid if the operator (1) fully discloses
 * those risks and (2) takes reasonable steps to ensure each patron is
 * physically able to participate and receives necessary safety
 * instruction. Sections 2, 6, and 8 below track those requirements.
 *
 * THIS IS A DRAFT FOR ATTORNEY REVIEW — have a Hawaii-licensed attorney
 * review before relying on it.
 */

export const WAIVER_VERSION = "1.0";
export const WAIVER_EFFECTIVE_DATE = "July 10, 2026";

export type WaiverSection = {
  heading: string;
  paragraphs: string[];
};

export const WAIVER_TITLE =
  "Release, Waiver of Liability, and Assumption of Risk Agreement";

export const WAIVER_SECTIONS: WaiverSection[] = [
  {
    heading: "1. Parties and Agreement",
    paragraphs: [
      'This Release, Waiver of Liability, and Assumption of Risk Agreement ("Agreement") is entered into between Summit O‘ahu LLC, a Hawaii limited liability company, together with its members, managers, owners, officers, employees, tour guides, drivers, agents, contractors, insurers, successors, and assigns (collectively, "Summit O‘ahu," "we," "us," or "our"), and the person accepting this Agreement ("Guest," "I," "me," or "my"), on behalf of themselves and, where applicable, the members of their booking party as described in Section 11.',
      "In consideration of being permitted to participate in a tour operated by Summit O‘ahu (the “Tour”), and for other good and valuable consideration, the receipt and sufficiency of which are acknowledged, I agree to the terms below. I understand that acceptance of this Agreement is a condition of participation in the Tour.",
    ],
  },
  {
    heading: "2. Description of the Tour",
    paragraphs: [
      "The Tour is a guided sightseeing excursion around the island of O‘ahu conducted in a passenger vehicle (van or SUV). The Tour includes travel on public roads and highways and a series of stops at scenic, cultural, commercial, and natural points of interest. At each stop, guests may exit the vehicle and walk or explore the immediate area for approximately five (5) to forty-five (45) minutes before re-boarding. Walking is generally light and optional, but may involve parking lots, sidewalks, lookouts, uneven ground, grass, sand, gravel, stairs, ramps, and paved or unpaved paths. The Tour may include free time — including an extended stop in Hale‘iwa town — during which guests are unaccompanied and may independently choose their own activities.",
    ],
  },
  {
    heading: "3. Full Disclosure of Inherent Risks",
    paragraphs: [
      "In accordance with Hawaii Revised Statutes § 663-1.54, Summit O‘ahu discloses, and I acknowledge that I have read and understand, the following inherent risks of the Tour — risks that are a natural part of the activity and may exist even when the Tour is conducted with reasonable care:",
      "(a) Vehicle travel. Riding in a motor vehicle on public roads involves risk of collision, sudden stops, and accidents caused by road conditions, weather, mechanical events, or the acts of other drivers, any of which may result in injury or death.",
      "(b) Boarding and exiting. Entering and exiting the vehicle involves steps and elevated door sills and carries a risk of slips, trips, and falls, particularly on wet, sloped, or uneven ground.",
      "(c) Walking and terrain. Walking at Tour stops may involve uneven, wet, slippery, rocky, sandy, muddy, or unstable surfaces; curbs, stairs, and elevation changes; and natural obstacles such as roots, rocks, and holes. Slips, trips, falls, sprains, fractures, and other injuries are possible.",
      "(d) Weather and environment. O‘ahu’s weather changes rapidly. Risks include intense sun and ultraviolet exposure, heat exhaustion, dehydration, sudden heavy rain, high winds, lightning, flash flooding, and falling branches or rocks.",
      "(e) Ocean and shoreline. Some stops are at or near beaches, shorelines, lookouts, and cliff edges. The ocean is powerful and unpredictable: risks include high surf, shorebreak, strong currents, rogue waves that can sweep people from rocks or shoreline areas, slippery rocks, sharp coral, and marine life. These risks exist even for guests who do not intend to enter the water.",
      "(f) Plants, animals, and insects. Exposure to insects (including mosquitoes and centipedes), animals (wild and domestic), and plants may cause bites, stings, allergic reactions, or illness.",
      "(g) Public places and third parties. Tour stops are in public areas shared with crowds, traffic, cyclists, other tour groups, and unaffiliated third parties whose actions we do not control.",
      "(h) Remoteness. Portions of the Tour route are in rural or remote areas of the island where emergency medical response, hospitals, and cellular coverage may be limited or delayed.",
      "(i) Communicable illness. Sharing an enclosed vehicle and visiting public places involves the inherent risk of exposure to communicable illnesses.",
      "I understand this list cannot capture every possible risk, and that other inherent risks not specifically listed may exist. I acknowledge that Summit O‘ahu has given me the opportunity to ask questions about these risks before accepting this Agreement, by phone at 808.203.4103 or by email at summitoahu@gmail.com.",
    ],
  },
  {
    heading: "4. Food and Beverages from Third-Party Vendors",
    paragraphs: [
      "The Tour does not include food or beverages prepared or provided by Summit O‘ahu. Guests will have opportunities during the Tour to purchase food and beverages from independent third-party vendors, restaurants, food trucks, farm stands, and other establishments. These vendors are not owned, operated, supervised, or controlled by Summit O‘ahu. I assume all risks associated with consuming food or beverages obtained during the Tour — including allergic reactions, foodborne illness, and dietary conflicts — and I agree that Summit O‘ahu is not responsible for the acts, omissions, products, or premises of any third-party vendor. I am solely responsible for managing my own food allergies and dietary restrictions.",
    ],
  },
  {
    heading: "5. Free Time and Independent Activities",
    paragraphs: [
      "During free time at Tour stops — including the extended stop in Hale‘iwa town — I may have the opportunity to independently rent equipment or participate in activities offered by unaffiliated third parties, such as snorkeling gear rental, kayak rental, swimming, or other recreational activities. These activities are NOT part of the Tour, are NOT included in the Tour price, and are NOT arranged, supervised, endorsed, or recommended by Summit O‘ahu.",
      "If I choose to participate in any independent activity during free time, I do so entirely at my own risk and as a decision made solely by me. I understand that water activities in particular carry serious risks, including drowning, and that ocean conditions on the North Shore and elsewhere can be dangerous even for strong swimmers. I agree that Summit O‘ahu has no duty to supervise me during free time, and I release Summit O‘ahu from any and all claims arising out of activities I choose to undertake independently during free time, including activities involving third-party equipment or operators. If I choose to enter the ocean, I acknowledge Summit O‘ahu’s recommendation that I do so only at lifeguarded beaches and in accordance with posted warnings and lifeguard instructions.",
    ],
  },
  {
    heading: "6. Physical Condition and Safety Instructions",
    paragraphs: [
      "I represent that I (and each member of my party) am physically able to participate in the Tour, including boarding, riding in, and exiting a passenger vehicle and walking short distances over the terrain described above, and that I do not have a medical condition that would make participation unsafe. I agree to inform Summit O‘ahu in advance of any condition, limitation, or need for accommodation that could affect safe participation, so that we can discuss whether and how the Tour can safely accommodate it.",
      "I agree to follow all safety instructions given by Summit O‘ahu guides and drivers, including: wearing a seatbelt at all times while the vehicle is moving; remaining seated while the vehicle is moving; using handrails and watching my step when boarding and exiting; staying on designated paths and behind railings and barriers; observing all posted warning signs; not approaching cliff edges, blowholes, or wet rocks near the ocean; keeping a safe distance from wildlife; and returning to the vehicle at the times designated by the guide. I understand that these instructions are a material part of this Agreement and that failing to follow them increases the risks described above. Summit O‘ahu reserves the right to refuse or discontinue participation, without refund, for any guest whose conduct endangers themselves or others.",
    ],
  },
  {
    heading: "7. Voluntary Assumption of Inherent Risks",
    paragraphs: [
      "I acknowledge that my participation in the Tour is entirely voluntary. Having read and understood the inherent risks disclosed in Sections 3, 4, and 5, I knowingly and freely assume all such inherent risks, whether or not specifically listed, and I accept full personal responsibility for any injury, illness, death, or property damage resulting from those inherent risks.",
    ],
  },
  {
    heading: "8. Release and Waiver of Liability for Inherent Risks",
    paragraphs: [
      "To the fullest extent permitted by Hawaii law, I hereby release, waive, discharge, and covenant not to sue Summit O‘ahu from and for any and all claims, demands, causes of action, damages, losses, costs, and expenses (including attorneys’ fees) arising out of or resulting from the inherent risks of the Tour disclosed in this Agreement, including injuries resulting from the inherent risks associated with vehicle travel, walking at Tour stops, weather, ocean and shoreline conditions, third-party food and beverages, and independent free-time activities.",
      "Consistent with Hawaii Revised Statutes § 663-1.54, this Agreement does not release Summit O‘ahu from liability for damages resulting from its own negligent acts or omissions, and nothing in this Agreement shall be construed as an attempt to waive such liability. This release applies to inherent risks of the activity as described above.",
    ],
  },
  {
    heading: "9. Medical Treatment Authorization",
    paragraphs: [
      "In the event of an injury or medical emergency during the Tour, I authorize Summit O‘ahu and its guides to secure emergency medical treatment, first aid, ambulance transport, or hospitalization on my behalf (and on behalf of minors in my party) if I am unable to consent at the time. I understand that Summit O‘ahu does not provide medical insurance for guests, and I agree that all costs of medical treatment and transport are my sole responsibility. I release Summit O‘ahu from any claim arising out of good-faith efforts to obtain or provide emergency assistance.",
    ],
  },
  {
    heading: "10. Minors",
    paragraphs: [
      "If my booking party includes any participant under eighteen (18) years of age (a “Minor”), I represent that I am the parent or legal guardian of each such Minor, or that I have been authorized by the Minor’s parent or legal guardian to accept this Agreement on their behalf. To the fullest extent permitted by law, I accept this Agreement on behalf of each Minor, I assume the disclosed inherent risks on each Minor’s behalf, and I agree to supervise each Minor at all times during the Tour, including during free time. I acknowledge that Minors may face heightened risk from the hazards described in Section 3, particularly near roadways, ocean shorelines, and cliff edges.",
    ],
  },
  {
    heading: "11. Booking on Behalf of Others",
    paragraphs: [
      "If I am booking the Tour for a party that includes other adults, I represent that I have their authority to accept this Agreement on their behalf, and I agree to provide each member of my party with a copy of, or access to, this Agreement before the Tour begins (it is available at any time at summitoahu.com/waiver). I understand that Summit O‘ahu may, at its discretion, require each adult participant to individually confirm acceptance of this Agreement before or at the start of the Tour.",
    ],
  },
  {
    heading: "12. Personal Property",
    paragraphs: [
      "I am solely responsible for my personal belongings before, during, and after the Tour, including items left in the vehicle during stops. Summit O‘ahu is not responsible for lost, stolen, or damaged personal property.",
    ],
  },
  {
    heading: "13. Photo and Media Release",
    paragraphs: [
      "I grant Summit O‘ahu permission to photograph or record me during the Tour and to use such images or recordings, without compensation, for promotional purposes including its website and social media. I may revoke this permission at any time by written notice to summitoahu@gmail.com (revocation applies prospectively and to reasonable removal of existing posts upon request). This section is a license, not a condition of participation — I may opt out and still take the Tour.",
    ],
  },
  {
    heading: "14. Electronic Acceptance",
    paragraphs: [
      "I agree that checking the acceptance box and completing my booking constitutes my electronic signature and acceptance of this Agreement, with the same force and effect as a handwritten signature, in accordance with the Hawaii Uniform Electronic Transactions Act (HRS Chapter 489E) and the federal E-SIGN Act. I consent to conducting this transaction electronically. The date, time, waiver version, and identity associated with my acceptance will be recorded with my booking.",
    ],
  },
  {
    heading: "15. General Provisions",
    paragraphs: [
      "Governing law and venue. This Agreement is governed by the laws of the State of Hawaii. Any dispute arising out of this Agreement or the Tour shall be brought exclusively in the state or federal courts located in Honolulu, Hawaii.",
      "Severability. If any provision of this Agreement is held invalid or unenforceable, that provision shall be enforced to the maximum extent permitted, and the remaining provisions shall continue in full force and effect.",
      "Entire agreement. This Agreement, together with the booking confirmation and Summit O‘ahu’s posted cancellation policy, constitutes the entire agreement between the parties regarding its subject matter and supersedes any prior oral or written representations regarding the assumption of risk and release of liability.",
      "No oral modification. No employee, guide, or agent of Summit O‘ahu has authority to orally modify this Agreement.",
    ],
  },
  {
    heading: "16. Acknowledgment",
    paragraphs: [
      "I HAVE READ THIS ENTIRE AGREEMENT, I FULLY UNDERSTAND ITS TERMS, AND I UNDERSTAND THAT I AM GIVING UP SUBSTANTIAL RIGHTS WITH RESPECT TO THE INHERENT RISKS OF THE TOUR. I ACCEPT THIS AGREEMENT FREELY AND VOLUNTARILY, WITHOUT ANY INDUCEMENT, AND I INTEND MY ACCEPTANCE TO BE A COMPLETE AND UNCONDITIONAL RELEASE, TO THE FULLEST EXTENT PERMITTED BY HAWAII LAW, OF ALL LIABILITY ARISING FROM THE INHERENT RISKS DISCLOSED ABOVE.",
    ],
  },
];

/** Plain-text rendering (for records, email, or docx export parity). */
export function waiverAsPlainText(): string {
  const lines: string[] = [
    `SUMMIT O‘AHU LLC`,
    WAIVER_TITLE.toUpperCase(),
    `Version ${WAIVER_VERSION} — Effective ${WAIVER_EFFECTIVE_DATE}`,
    "",
  ];
  for (const s of WAIVER_SECTIONS) {
    lines.push(s.heading.toUpperCase(), "");
    for (const p of s.paragraphs) lines.push(p, "");
  }
  return lines.join("\n");
}
