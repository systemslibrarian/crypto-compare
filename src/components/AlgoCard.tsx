import { useState } from "react";
import dynamic from "next/dynamic";
import { RecommendationBadge, formatReviewDate } from "@/components/ui";
import { CATEGORY_ACCENT } from "@/data/categories";
import { IMPLEMENTATION_COUNTS } from "@/data/implementationCounts";
import { getAssuranceProfile, type AssuranceProfile } from "@/lib/assurance";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

const AlgoCardDetails = dynamic(() => import("@/components/AlgoCardDetails"), { ssr: false });

type AlgoCardProps = {
  algo: Algorithm;
  browsingCategory?: AlgorithmCategory;
  selected: boolean;
  onToggle: () => void;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  advisorPick?: boolean;
};

/**
 * A scannable algorithm record. Primary scan path (always visible):
 * name → recommendation → family/origin/standardization/maturity → use case →
 * classical/PQ security → provenance summary. Everything heavier (sources,
 * implementations, wrong-choice consequences, demos, rationale) lives behind
 * the Details disclosure.
 */
export default function AlgoCard({ algo, browsingCategory, selected, onToggle, favorited, onToggleFavorite, advisorPick }: AlgoCardProps) {
  const accent = CATEGORY_ACCENT[algo.category];
  const implementationCount = IMPLEMENTATION_COUNTS[algo.id] ?? 0;
  const [detailOpen, setDetailOpen] = useState(false);
  const assurance = getAssuranceProfile(algo);
  const operationContext = algo.operationProfiles?.find((profile) => profile.category === browsingCategory);

  const metaBits: string[] = [algo.origin, algo.statusLabel];
  if (algo.maturity) metaBits.push(algo.maturity);
  if (algo.pqRelevance) metaBits.push(algo.pqRelevance.replace("pq-", "PQ-"));

  return (
    <article
      id={`algo-${algo.id}`}
      aria-labelledby={`algo-${algo.id}-name`}
      data-selected={selected}
      className={`algoCard${advisorPick ? " algoCardAdvisor" : ""}`}
      style={{ borderLeft: `3px solid ${advisorPick ? "var(--color-badge-green-text)" : selected ? accent : `${accent}55`}` }}
    >
      <div className="recordTop">
        <div className="recordTitleWrap">
          <h3 id={`algo-${algo.id}-name`} className="recordName">{algo.name}</h3>
          <RecommendationBadge level={algo.recommendation} compact />
          {advisorPick && <span className="badge badge--green">Advisor pick</span>}
          {operationContext && <span className="badge badge--blue">{operationContext.label}</span>}
        </div>
        <div className="recordActions">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            aria-label={selected ? `Comparing — remove ${algo.name} from comparison` : `Compare — add ${algo.name} to comparison`}
            className={`focusRing recordCompareBtn${selected ? " isActive" : ""}`}
          >
            {selected ? <><span aria-hidden="true">✓ </span>Comparing</> : "Compare"}
          </button>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-label={favorited ? `Remove ${algo.name} from favorites` : `Add ${algo.name} to favorites`}
              className={`focusRing recordIconBtn${favorited ? " isActive" : ""}`}
            >
              {favorited ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>

      <div className="recordMeta">
        <span className="recordFamily" style={{ color: accent }}>{algo.family}</span>
        {metaBits.map((bit) => (
          <span key={bit} className="recordMetaBit">
            <span className="sep" aria-hidden="true">·</span> {bit}
          </span>
        ))}
      </div>

      <p className="recordSummary">{algo.useCases}</p>

      {(algo.recommendation === "legacy" || algo.recommendation === "avoid") && (
        <div className={`recordWarn${algo.recommendation === "avoid" ? " recordWarnCritical" : ""}`}>
          <strong>{algo.recommendation === "legacy" ? "Migrate" : "Do not use"}</strong>
          <span>{algo.whyNotThis}</span>
        </div>
      )}

      <div className="recordFacts">
        <AssuranceSummary profile={assurance} />
      </div>

      <div className="recordFoot">
        {algo.sources && algo.sources.length > 0 && (
          <span>{algo.sources.length} source{algo.sources.length !== 1 ? "s" : ""}</span>
        )}
        {implementationCount > 0 && <span>{implementationCount} implementation{implementationCount !== 1 ? "s" : ""}</span>}
        <span>{formatReviewDate(algo.lastReviewed)}</span>
        <span style={{ flex: "1 1 auto" }} />
        <button
          type="button"
          onClick={() => setDetailOpen((v) => !v)}
          aria-label={detailOpen ? `Hide ${algo.name} details` : `Show ${algo.name} details`}
          aria-expanded={detailOpen}
          className="focusRing recordFootBtn"
        >
          {detailOpen ? "Hide details" : "Details"}
        </button>
      </div>

      {detailOpen && <AlgoCardDetails algo={algo} assurance={assurance} implementationCount={implementationCount} />}
    </article>
  );
}

function AssuranceSummary({ profile }: { profile: AssuranceProfile }) {
  return (
    <div className="assuranceSummary">
      <div className="assuranceHeadline">{profile.headline}</div>
      <dl className="assuranceMetrics">
        {profile.metrics.slice(0, 3).map((metric) => (
          <div key={metric.label} className="assuranceMetric">
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
