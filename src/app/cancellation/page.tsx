import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  alternates: { canonical: "/cancellation" },
  description:
    "Summit O'ahu cancellation and refund policy for small group and private circle island tours.",
};

const sections: LegalSection[] = [
  {
    heading: "The short version",
    paragraphs: [
      "Cancel a small group seat at least 48 hours before pickup — or a private tour at least 7 days out — and you get your money back. If we ever cancel on you, you choose: a full refund or a free reschedule, your call.",
      "One thing worth knowing before you cancel: if you reschedule instead, you keep 100% of what you paid. Card processing fees are only deducted when money actually goes back to your card. If there's any chance you'll still be on the island, move your date rather than cancelling — it costs you nothing.",
    ],
  },
  {
    heading: "Small Group Circle Island Tour (per-seat bookings)",
    paragraphs: [
      { bullets: [
        "48 hours or more before your scheduled pickup time: full refund, less non-refundable card processing fees (see below).",
        "Between 24 and 48 hours before pickup: 50% refund.",
        "Less than 24 hours before pickup: no refund.",
      ]},
    ],
  },
  {
    heading: "Private Tours (Mercedes and Van)",
    paragraphs: [
      "A private booking takes an entire vehicle and an entire day off our calendar, and we turn away other bookings to hold it for you. The window is therefore longer:",
      { bullets: [
        "7 days or more before your scheduled pickup time: full refund, less non-refundable card processing fees.",
        "Between 72 hours and 7 days before pickup: 50% refund.",
        "Less than 72 hours before pickup: no refund.",
      ]},
    ],
  },
  {
    heading: "Card processing fees",
    paragraphs: [
      "When you pay, our card processor takes a fee of roughly 3% of the booking. When we refund you, they keep that fee — it is not returned to us. So a refunded booking doesn't just earn us nothing; it costs us money.",
      "Refunds are therefore issued less those non-refundable processing fees. We're a two-person company, and that's the honest reason.",
      "You can avoid the fee entirely by rescheduling rather than cancelling — no money goes back to your card, so no fee is lost, and you keep every dollar you paid. And if we're the ones who cancel, none of this applies: you receive 100% of what you paid, fees included.",
    ],
  },
  {
    heading: "If we cancel",
    paragraphs: [
      "If Summit O'ahu cancels your tour for any reason — severe weather, a mechanical problem, guide illness, or anything else — you choose: a full refund of everything you paid, including all fees, or a free reschedule to any available date. No deductions, no fine print.",
    ],
  },
  {
    heading: "Weather: we run rain or shine",
    paragraphs: [
      "We are a rain-or-shine operation, and we mean it. O'ahu is a tropical island: winter here is genuinely rainy, the windward side can be pouring while the North Shore sits in full sun, and a passing shower is simply part of the day. Some of the most beautiful moments on this tour — waterfalls running full, rainbows stacked over the Ko'olau, empty lookouts — happen in exactly the weather other people hide from.",
      "So rain is not a cancellation. A rainy forecast is not a cancellation. Neither entitles you to a refund, and if you cancel because you don't like the forecast, the standard windows above apply.",
      "We cancel only for serious events — hurricanes, tropical storms, flash flooding, dangerous winds, road closures, or any conditions we judge unsafe for our guests. That call is ours, and we make it conservatively: if we don't think we can run the day safely, we won't. When we do cancel, you get a full refund or a free reschedule, your choice.",
    ],
  },
  {
    heading: "Rescheduling — almost always the better option",
    paragraphs: [
      "Need to move your date? Ask us. Date changes requested outside the refund windows above are free and subject only to availability, and — unlike a refund — you keep every dollar you paid, because no processing fees are lost.",
      "Inside those windows, a change is treated as a cancellation and rebooking, and the refund tiers above apply. But talk to us anyway: if we can fill your seat, or if you're moving to a date that works for us, we'll do our best to make it right. We're two people, not a call center.",
    ],
  },
  {
    heading: "Late arrivals and no-shows",
    paragraphs: [
      "Our small group tour departs Waikīkī at 6:15am and runs a full circle of the island on a tight schedule with other guests aboard. We will wait 10 minutes past your scheduled pickup time. After that we have to go, and the booking is treated as a no-show: no refund.",
      "Please be in your hotel lobby, ready to go, a few minutes early. If you're running late or can't find us, call 808.203.4103 immediately — if we know you're coming, we'll do what we can.",
    ],
  },
  {
    heading: "Refusal of service",
    paragraphs: [
      "As set out in our Liability Waiver and Terms of Service, we may refuse or discontinue participation, without refund, for any guest whose conduct endangers themselves, other guests, or our team.",
    ],
  },
  {
    heading: "How to cancel",
    paragraphs: [
      "Email summitoahu@gmail.com or call 808.203.4103 with your name and tour date. Your cancellation takes effect when we receive it, so the sooner you reach us, the better the outcome for you. Refunds are returned to the original payment method and typically appear within 5–10 business days, depending on your bank.",
    ],
  },
];

export default function CancellationPage() {
  return (
    <LegalPage
      title="Cancellation Policy"
      subtitle="Plans change. Here's exactly what happens when they do."
      effective="July 13, 2026"
      sections={sections}
    />
  );
}
