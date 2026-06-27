import LabsView from "@/components/LabsView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Labs — crypto::compare",
  description:
    "123 hands-on crypto-lab demos linked from the algorithm reference — encryption, signatures, attacks, and post-quantum schemes you can run in the browser.",
  alternates: { canonical: "/labs" },
};

export default function LabsPage() {
  return (
    <ErrorBoundary>
      <LabsView />
    </ErrorBoundary>
  );
}
