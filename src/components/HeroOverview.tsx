import { formatReviewDate } from "@/components/ui";
import type { RecommendationCounts, TrustSnapshot } from "@/lib/trust";

type HeroOverviewProps = {
  selectedCategoryLabel: string;
  globalSearch: boolean;
  datasetSize: number;
  filteredCount: number;
  recommendationCounts: RecommendationCounts;
  trustSnapshot: TrustSnapshot;
  totalSources: number;
};

export default function HeroOverview({
  selectedCategoryLabel,
  globalSearch,
  datasetSize,
  filteredCount,
  recommendationCounts,
  trustSnapshot,
  totalSources,
}: HeroOverviewProps) {
  return (
    <section className="contextBar" aria-label="Dataset context">
      <div className="contextBarPills">
        <span className="contextPill contextPillAccent">
          {globalSearch ? "All categories" : selectedCategoryLabel}
        </span>
        <span className="contextPill">{filteredCount} shown / {datasetSize} total</span>
        <span className="contextPill">{recommendationCounts.recommended ?? 0} recommended</span>
        <span className="contextPill">{totalSources} sources cited</span>
        {trustSnapshot.latest && (
          <span className="contextPill">Reviewed {formatReviewDate(trustSnapshot.latest)}</span>
        )}
      </div>
    </section>
  );
}