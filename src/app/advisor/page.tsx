import AdvisorView from "@/components/AdvisorView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What should I use? — crypto::compare",
  description:
    "Interactive algorithm advisor: answer a few questions and get a specific cryptographic algorithm recommendation with full sourcing and a downloadable justification report.",
};

export default function AdvisorPage() {
  return (
    <ErrorBoundary>
      <AdvisorView />
    </ErrorBoundary>
  );
}
