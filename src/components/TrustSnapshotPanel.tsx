import { formatReviewDate } from "@/components/ui";
import type { RecommendationCounts, TrustSnapshot } from "@/lib/trust";

type TrustSnapshotPanelProps = {
  snapshot: TrustSnapshot;
  datasetSize: number;
  filteredCount: number;
  globalSearch: boolean;
  selectedCategoryLabel: string;
  recommendationCounts: RecommendationCounts;
};

export default function TrustSnapshotPanel({
  snapshot,
  datasetSize,
  filteredCount,
  globalSearch,
  selectedCategoryLabel,
  recommendationCounts,
}: TrustSnapshotPanelProps) {
  return (
    <section className="panel" aria-label="Dataset trust snapshot" style={{ marginBottom: "16px", background: "var(--color-bg-card)" }}>
      <h2 className="panel-heading" style={{ marginBottom: "10px" }}>Trust Snapshot</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "10px" }}>
        <div className="trustCard">
          <div className="trustLabel">Review window</div>
          <div className="trustValue">{snapshot.earliest ? `${formatReviewDate(snapshot.earliest)} → ${formatReviewDate(snapshot.latest)}` : "Pending"}</div>
          <div className="trustMeta">{snapshot.coverage}/{datasetSize} algorithms have review dates</div>
        </div>
        <div className="trustCard">
          <div className="trustLabel">Source backbone</div>
          <div className="trustValue">{snapshot.totalSources} cited sources</div>
          <div className="trustMeta">standards, analysis, deployment, and benchmark references</div>
        </div>
        <div className="trustCard">
          <div className="trustLabel">Current view</div>
          <div className="trustValue">{filteredCount} algorithms</div>
          <div className="trustMeta">{globalSearch ? "cross-category search view" : `${selectedCategoryLabel} category focus`}</div>
        </div>
        <div className="trustCard">
          <div className="trustLabel">Recommendation mix</div>
          <div className="trustValue">{recommendationCounts.recommended ?? 0} recommended</div>
          <div className="trustMeta">{recommendationCounts.acceptable ?? 0} acceptable · {recommendationCounts.research ?? 0} research</div>
        </div>
      </div>
      <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
        This tool is strongest when recommendation labels, cited sources, and review freshness all agree. Treat older review windows and research-grade entries as signals to verify more aggressively against your own threat model.
      </p>
    </section>
  );
}