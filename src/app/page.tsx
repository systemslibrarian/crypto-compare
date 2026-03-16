import CryptoCompare from "@/components/CryptoCompare";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <CryptoCompare />
    </ErrorBoundary>
  );
}
