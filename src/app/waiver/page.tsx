import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import {
  WAIVER_TITLE,
  WAIVER_SECTIONS,
  WAIVER_VERSION,
  WAIVER_EFFECTIVE_DATE,
} from "@/lib/waiver";

export const metadata: Metadata = {
  title: "Liability Waiver",
  alternates: { canonical: "/waiver" },
  description:
    "Summit O'ahu LLC Release, Waiver of Liability, and Assumption of Risk Agreement.",
};

export default function WaiverPage() {
  return (
    <LegalPage
      title={WAIVER_TITLE}
      effective={`${WAIVER_EFFECTIVE_DATE} · Version ${WAIVER_VERSION}`}
      sections={WAIVER_SECTIONS}
    />
  );
}
