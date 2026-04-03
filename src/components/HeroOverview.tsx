import { formatReviewDate } from "@/components/ui";
import type { TrustSnapshot } from "@/lib/trust";

type HeroOverviewProps = {
  selectedCategoryLabel: string;
  globalSearch: boolean;
  datasetSize: number;
  categoryCount: number;
  recommendationCount: number;
  trustSnapshot: TrustSnapshot;
};

export default function HeroOverview({
  selectedCategoryLabel,
  globalSearch,
  datasetSize,
  categoryCount,
  recommendationCount,
  trustSnapshot,
}: HeroOverviewProps) {
  return (
    <section className="heroOverview" aria-label="Product overview" style={{ marginBottom: "16px" }}>
      <div className="heroCopy">
        <div className="heroEyebrow">Cryptographic Decision Support</div>
        <h2 className="heroTitle">
          Choose primitives with explicit tradeoffs, not vague advice.
        </h2>
        <p className="heroBody">
          This reference is built to help you move from algorithm confusion to defensible decisions across messaging, storage, signatures, authentication, and post-quantum transition planning.
        </p>
        <div className="heroPills">
          <span className="heroPill">{globalSearch ? "Cross-category search active" : `${selectedCategoryLabel} in focus`}</span>
          <span className="heroPill">{recommendationCount} recommended options in view</span>
          <span className="heroPill">Latest review: {trustSnapshot.latest ? formatReviewDate(trustSnapshot.latest) : "pending"}</span>
        </div>
      </div>
      <div className="heroStats">
        <div className="heroStatCard">
          <div className="heroStatLabel">Coverage</div>
          <div className="heroStatValue">{datasetSize}</div>
          <div className="heroStatMeta">algorithms with provenance-backed metadata</div>
        </div>
        <div className="heroStatCard">
          <div className="heroStatLabel">Categories</div>
          <div className="heroStatValue">{categoryCount}</div>
          <div className="heroStatMeta">from symmetric encryption to threshold signatures</div>
        </div>
        <div className="heroStatCard">
          <div className="heroStatLabel">Review window</div>
          <div className="heroStatValue">{trustSnapshot.earliest ? `${formatReviewDate(trustSnapshot.earliest)} → ${formatReviewDate(trustSnapshot.latest)}` : "Pending"}</div>
          <div className="heroStatMeta">visible freshness, not hidden maintenance assumptions</div>
        </div>
      </div>
    </section>
  );
}