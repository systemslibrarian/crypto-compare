import AboutView from "@/components/AboutView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About & Methodology — crypto::compare",
  description:
    "What crypto::compare is, who it's for, its threat model and scope, how the data is sourced and verified, update cadence, and what it is not.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ErrorBoundary>
      <AboutView />
    </ErrorBoundary>
  );
}
