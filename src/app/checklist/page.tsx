import ArchitectureChecklist from "@/components/ArchitectureChecklist";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture Checklist — crypto::compare",
  description:
    "Pre-deployment cryptographic architecture review checklist covering key management, algorithm selection, protocol design, implementation safety, operational security, and compliance.",
};

export default function ChecklistPage() {
  return (
    <ErrorBoundary>
      <ArchitectureChecklist />
    </ErrorBoundary>
  );
}
