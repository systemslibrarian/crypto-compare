import StacksView from "@/components/StacksView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cryptographic Stacks — crypto::compare",
  description:
    "Complete algorithm stacks for secure messaging, password storage, file encryption, code signing, TLS transport, and post-quantum migration.",
};

export default function StacksPage() {
  return (
    <ErrorBoundary>
      <StacksView />
    </ErrorBoundary>
  );
}
