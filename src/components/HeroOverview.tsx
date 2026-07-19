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

/**
 * Catalog status row: current scope, result count, recommended count, source
 * count, and review recency in one quiet line under the toolbar.
 */
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
    <div className="statusRow" aria-label="Catalog status">
      <span className="statusScope">{globalSearch ? "All categories" : selectedCategoryLabel}</span>
      <span className="statusItem"><strong>{filteredCount}</strong> shown / {datasetSize} total</span>
      <span className="statusItem"><strong>{recommendationCounts.recommended ?? 0}</strong> recommended</span>
      <span className="statusItem"><strong>{totalSources}</strong> sources cited</span>
      {trustSnapshot.latest && (
        <span className="statusItem">Reviewed {formatReviewDate(trustSnapshot.latest)}</span>
      )}
    </div>
  );
}
