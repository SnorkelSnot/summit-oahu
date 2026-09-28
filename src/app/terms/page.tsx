import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
  description:
    "The terms that govern booking and taking a tour with Summit O'ahu LLC.",
};

const sections: LegalSection[] = [
  {
    heading: "1. These terms",
    paragraphs: [
      "These Terms of Service govern your use of summitoahu.com and any tour you book with Summit O'ahu LLC, a Hawaii limited liability company (\"Summit O'ahu,\" \"we,\" \"us\"). By booking a tour you agree to these Terms, to our Cancellation Policy, and to our Liability Waiver, which together form the agreement between us.",
    ],
  },
  {
    heading: "2. Booking and payment",
    paragraphs: [
      "Tours are booked through this website and paid in full at the time of booking. Payment is processed by Stripe; we never see or store your card number. A booking is not confirmed until payment has been completed and you have received a confirmation email from us.",
      "Prices are in U.S. dollars and are the prices shown at the time of booking. Small group tours are priced per guest; private tours are a flat rate for the vehicle. Food, drinks, souvenirs, and any optional activities you choose during free time are not included in the tour price unless we say otherwise.",
    ],
  },
  {
    heading: "3. The Liability Waiver is required",
    paragraphs: [
      "Every guest must accept our Liability Waiver before a booking can be completed. If you are booking for other people, you confirm that you have their authority to accept it on their behalf, and you agree to make it available to them before the tour. We may ask any adult guest to confirm acceptance individually before departure.",
    ],
  },
  {
    heading: "4. Pickup, timing, and the itinerary",
    paragraphs: [
      "We pick up from participating hotels and locations as arranged in your booking. Please be ready in your lobby a few minutes before your scheduled time. Our late arrival and no-show terms are set out in the Cancellation Policy.",
      "The itinerary published on this site is our intended route, not a contractual guarantee. Stop order, timing, and the stops themselves may change with weather, road conditions, traffic, closures, safety, or the flow of the day. We reserve the right to modify or omit any stop at our discretion. That flexibility is part of how we run a good tour, and it does not entitle you to a refund.",
    ],
  },
  {
    heading: "5. Your responsibilities as a guest",
    paragraphs: [
      { bullets: [
        "Follow the safety instructions given by your guide, including wearing a seatbelt whenever the vehicle is moving.",
        "Return to the vehicle at the times your guide sets. We cannot hold the whole group indefinitely.",
        "Look after your own belongings. We are not responsible for lost, stolen, or damaged personal property.",
        "Tell us in advance about any medical condition, mobility limitation, or accommodation need that could affect safe participation, so we can talk through whether and how the tour can accommodate it.",
        "Supervise any minors in your party at all times, including during free time.",
      ]},
    ],
  },
  {
    heading: "6. Conduct, alcohol, and refusal of service",
    paragraphs: [
      "We may refuse or discontinue participation, without refund, for any guest who is intoxicated, who is behaving in a way that endangers themselves or others, or who is harassing other guests or our team. Illegal drugs are not permitted in our vehicles. Smoking and vaping are not permitted in our vehicles.",
    ],
  },
  {
    heading: "7. Free time and third parties",
    paragraphs: [
      "Our tours include stops where you are free to explore, eat, shop, and — if you choose — rent equipment or take part in activities offered by independent businesses. Those businesses are not owned or controlled by us, we do not supervise those activities, and anything you choose to do during free time you do at your own risk. This is set out more fully in the Liability Waiver.",
    ],
  },
  {
    heading: "8. Liability",
    paragraphs: [
      "Your participation is governed by our Liability Waiver, which you accept at booking. Consistent with Hawaii Revised Statutes § 663-1.54, nothing in these Terms or in that Waiver purports to release Summit O'ahu from liability for damages resulting from our own negligent acts or omissions. The Waiver applies to the inherent risks of the activity, which are fully disclosed to you before you book.",
      "To the fullest extent permitted by law, we are not liable for indirect or consequential losses — such as missed flights, missed connections, or other travel costs — arising out of a delay, an itinerary change, or a cancelled tour. We strongly recommend travel insurance.",
    ],
  },
  {
    heading: "9. Cancellations and refunds",
    paragraphs: [
      "Cancellations, refunds, rescheduling, and no-shows are governed by our Cancellation Policy, which forms part of these Terms.",
    ],
  },
  {
    heading: "10. Guest reviews",
    paragraphs: [
      "If you submit a review, you grant us permission to publish it on this website, and you confirm it is your own honest experience. We may decline to publish, or may remove, reviews that are abusive, fraudulent, or that contain other people's private information. We do not edit the substance of a review to change its meaning.",
    ],
  },
  {
    heading: "11. Our content",
    paragraphs: [
      "The text, photographs, maps, and design on this website are ours or are used with permission, and may not be copied or reused commercially without our written consent.",
    ],
  },
  {
    heading: "12. Governing law",
    paragraphs: [
      "These Terms are governed by the laws of the State of Hawaii. Any dispute arising out of these Terms or a tour shall be brought exclusively in the state or federal courts located in Honolulu, Hawaii.",
      "If any provision of these Terms is held invalid or unenforceable, the remaining provisions continue in full force.",
    ],
  },
  {
    heading: "13. Changes to these terms",
    paragraphs: [
      "We may update these Terms from time to time. The version in effect when you book is the version that governs your booking.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The agreement between you and Summit O'ahu when you book a tour."
      effective="July 13, 2026"
      sections={sections}
    />
  );
}
