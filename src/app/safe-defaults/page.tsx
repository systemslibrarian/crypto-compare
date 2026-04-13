import SafeDefaultsView from "@/components/SafeDefaultsView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe Defaults — crypto::compare",
  description:
    "Conservative cryptographic defaults for passwords, encryption, signatures, hashing, and transport. Send this page to any engineer.",
};

export default function SafeDefaultsPage() {
  return (
    <ErrorBoundary>
      <SafeDefaultsView />
    </ErrorBoundary>
  );
}
