import LabsView from "@/components/LabsView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";
import { LABS_PAGE_DESCRIPTION } from "@/lib/siteStats";

export const metadata: Metadata = {
  title: "Interactive Labs — crypto::compare",
  // Derived from the same lab index the page body renders. Typed literally,
  // this said 123 while the body said 192 in the very same document.
  description: LABS_PAGE_DESCRIPTION,
  alternates: { canonical: "/labs" },
};

export default function LabsPage() {
  return (
    <ErrorBoundary>
      <LabsView />
    </ErrorBoundary>
  );
}
