import VisualsView from "@/components/VisualsView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Guide — crypto::compare",
  description:
    "Infographics and diagrams explaining encryption performance, hashing vs encryption vs encoding, TLS data flow, and the evolution of cryptography.",
};

export default function VisualsPage() {
  return (
    <ErrorBoundary>
      <VisualsView />
    </ErrorBoundary>
  );
}
