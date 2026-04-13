import MigrateView from "@/components/MigrateView";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Migration Guide — crypto::compare",
  description:
    "Step-by-step migration paths from MD5, SHA-1, PBKDF2, AES-CBC, RSA-2048, and TLS 1.0 to modern replacements with risk assessment and pitfall warnings.",
};

export default function MigratePage() {
  return (
    <ErrorBoundary>
      <MigrateView />
    </ErrorBoundary>
  );
}
