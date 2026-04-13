import ImplementationsView from "@/components/ImplementationsView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Implementation Map — crypto::compare",
  description:
    "Verified cryptographic library implementations across Rust, Python, TypeScript, Go, .NET, and Java for recommended algorithms.",
};

export default function ImplementationsPage() {
  return (
    <ErrorBoundary>
      <ImplementationsView />
    </ErrorBoundary>
  );
}
