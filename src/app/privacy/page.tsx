import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description:
    "How Summit O'ahu LLC collects, uses, and protects your personal information.",
};

const sections: LegalSection[] = [
  {
    heading: "The short version",
    paragraphs: [
      "We're a two-person tour company, not a data business. We collect what we need to pick you up and run your tour, we never sell it, and we don't track you around the internet. Details below.",
    ],
  },
  {
    heading: "1. Who we are",
    paragraphs: [
      "Summit O'ahu LLC, a Hawaii limited liability company based in Honolulu, O'ahu (\"Summit O'ahu,\" \"we,\" \"us\"). You can reach us any time at summitoahu@gmail.com or 808.203.4103.",
    ],
  },
  {
    heading: "2. What we collect",
    paragraphs: [
      "When you book a tour, you give us:",
      { bullets: [
        "Your name, email address, and phone number.",
        "Your hotel or pickup location, and the date and type of tour.",
        "The number of guests in your party.",
        "Any comments or special requests you choose to share — including accessibility needs or dietary preferences, if you tell us about them.",
        "A concierge or referral code, if you have one.",
        "A record that you accepted our Liability Waiver, including the date, time, and version accepted.",
      ]},
      "If you submit a guest review, we collect the name you provide and your review text. If you inquire about a honeymoon package, we collect the details you enter on that form.",
      "We do not collect or store your card number. Payments are handled entirely by Stripe, our payment processor; your card details go to Stripe, never to us. We only ever see a confirmation that payment succeeded and the last few digits of the card.",
    ],
  },
  {
    heading: "3. Why we use it",
    paragraphs: [
      { bullets: [
        "To run your tour — to know where to pick you up, how many seats to hold, and how to reach you if plans change.",
        "To send you your booking confirmation and any necessary updates about your tour.",
        "To process your payment and, where applicable, your refund.",
        "To keep a record of the Liability Waiver you accepted, as our agreement with you requires.",
        "To publish guest reviews you have voluntarily submitted for publication.",
        "To meet our legal, accounting, and insurance obligations.",
      ]},
      "We do not send marketing email unless you have asked us to. We will not add you to a mailing list simply because you booked a tour.",
    ],
  },
  {
    heading: "4. Who we share it with",
    paragraphs: [
      "We do not sell your personal information. Ever. We share it only with the service providers we need to run the business:",
      { bullets: [
        "Stripe — to process payments securely.",
        "Google (Sheets and Apps Script) — where our booking records are stored, and which sends our confirmation emails.",
        "Netlify — which hosts this website.",
      ]},
      "We may also disclose information if we are legally required to, or where it is necessary to protect the safety of a guest or our team — for example, giving your name to emergency medical personnel if you are injured on a tour.",
    ],
  },
  {
    heading: "5. Photos and video",
    paragraphs: [
      "We sometimes take photos on tour and share them on our website and social media, as described in our Liability Waiver. That permission is a license, not a condition of participation: tell your guide you'd rather not be photographed and that's the end of it. If a photo of you is already published and you want it taken down, email us and we'll remove it.",
    ],
  },
  {
    heading: "6. Cookies and tracking",
    paragraphs: [
      "This website does not use advertising cookies, and we do not run third-party tracking or ad-retargeting pixels. Stripe may set cookies necessary to process your payment securely and to prevent fraud; that processing is governed by Stripe's own privacy policy.",
    ],
  },
  {
    heading: "7. How long we keep it",
    paragraphs: [
      "We keep booking records — including your waiver acceptance — for as long as necessary for our legal, tax, and insurance purposes, generally several years after your tour. Beyond that, you can ask us to delete your information at any time.",
    ],
  },
  {
    heading: "8. Your choices",
    paragraphs: [
      "Write to summitoahu@gmail.com and you can ask us to: tell you what information we hold about you; correct anything that's wrong; delete your information; or stop contacting you. We'll respond as promptly as we can. Note that we may need to retain certain booking and waiver records where the law requires it.",
      "Depending on where you live — for example, California or the European Union — you may have additional statutory rights over your personal data. We honor those requests regardless of where you live; just ask.",
    ],
  },
  {
    heading: "9. Security",
    paragraphs: [
      "We use reputable providers (Stripe, Google, Netlify) and limit access to booking data to the two of us. No system is perfectly secure, and we can't promise absolute security, but we take the protection of your information seriously and we keep as little of it as we can.",
    ],
  },
  {
    heading: "10. Children",
    paragraphs: [
      "This website is not directed at children, and we do not knowingly collect information from anyone under 13. Minors travel with us as part of a family booking made by a parent or guardian.",
    ],
  },
  {
    heading: "11. Changes",
    paragraphs: [
      "If we change this policy, we'll post the updated version here with a new effective date. Material changes will apply going forward, not retroactively.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="What we collect, why we collect it, and what we do with it."
      effective="July 13, 2026"
      sections={sections}
    />
  );
}
