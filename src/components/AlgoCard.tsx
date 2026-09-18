import { useState } from "react";
import dynamic from "next/dynamic";
import { RecommendationBadge, formatReviewDate, recommendationText } from "@/components/ui";
import { CounselButton } from "@/components/CounselButton";
import { CATEGORY_ACCENT } from "@/data/categories";
import { ALGORITHM_DEMOS } from "@/data/demoResources";
import { IMPLEMENTATION_COUNTS } from "@/data/implementationCounts";
import { formatAssuranceForExport, getAssuranceProfile, type AssuranceProfile } from "@/lib/assurance";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

const ImplementationList = dynamic(() => import("@/components/ImplementationList"), { ssr: false });

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
  const demos = ALGORITHM_DEMOS[algo.id] ?? [];
  const implementationCount = IMPLEMENTATION_COUNTS[algo.id] ?? 0;
  const [detailOpen, setDetailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const assurance = getAssuranceProfile(algo);
  const operationContext = algo.operationProfiles?.find((profile) => profile.category === browsingCategory);

  function copyRecommendation() {
    const text = [
      `## ${algo.name}`,
      `Recommendation: ${recommendationText(algo.recommendation)}`,
      `Rationale: ${algo.recommendationRationale}`,
      `Assurance: ${formatAssuranceForExport(algo)}`,
      `Use cases: ${algo.useCases}`,
      algo.whyNotThis ? `Caution: ${algo.whyNotThis}` : "",
      algo.notes ? `Notes: ${algo.notes}` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }, () => {
      // Clipboard API unavailable (e.g. HTTP context or denied permission)
    });
  }

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

      {detailOpen && (
        <div className="recordDetails">
          <div className="recordDetailGrid">
            <DetailField label="Best known attack" value={algo.bestAttack} />
            <DetailField label="Performance" value={algo.performance} />
            <DetailField label="Reduction quality" value={algo.reductionQuality} />
            <DetailField label="Assumptions" value={algo.assumptions} />
          </div>
          <div className="recordDetailGrid">
            <DetailField label="Recommendation" value={`${recommendationText(algo.recommendation)} — ${algo.recommendationRationale}`} />
            <DetailField label="Changes when" value={algo.recommendationChangesWhen} />
            {algo.whyNotThis && <DetailField label="Why not this" value={algo.whyNotThis} />}
          </div>
          <div className="recordDetailGrid">
            <DetailField label="Assurance model" value={assurance.headline} />
            <DetailField label="Assurance caveat" value={assurance.caveat} />
            <DetailField label="Classical estimate" value={`${algo.estimationMethodology.classicalBasis}: ${algo.estimationMethodology.classicalNote}`} />
            <DetailField label="Quantum estimate" value={`${algo.estimationMethodology.quantumBasis}: ${algo.estimationMethodology.quantumNote}`} />
            <DetailField label="Origin" value={algo.originDetail} />
          </div>
          {algo.notes && (
            <div style={{ marginBottom: "12px" }}>
              <DetailField label="Notes" value={algo.notes} />
            </div>
          )}

          {algo.wrongChoiceConsequence && algo.wrongChoiceConsequence.length > 0 && (
            <DetailSection label="Wrong-choice consequences">
              {algo.wrongChoiceConsequence.map((c, i) => (
                <div key={i} className="recordSubItem">
                  <strong style={{ color: c.severity === "critical" ? "var(--color-badge-red-text)" : c.severity === "high" ? "var(--color-badge-orange-text)" : "var(--color-badge-yellow-text)", textTransform: "uppercase", fontSize: "10.5px", letterSpacing: "0.08em", marginRight: "8px" }}>{c.severity}</strong>
                  <strong style={{ color: "var(--color-text-heading)" }}>{c.scenario}</strong>
                  <div style={{ color: "var(--color-text-secondary)" }}>{c.consequence}</div>
                </div>
              ))}
            </DetailSection>
          )}

          {implementationCount > 0 && <ImplementationList algorithmId={algo.id} />}

          {algo.sources && algo.sources.length > 0 && (
            <DetailSection label="Sources">
              {algo.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="recordLink" style={{ display: "block" }}>
                  {s.label} <span className="note">— {s.note}</span>
                </a>
              ))}
            </DetailSection>
          )}

          {demos.length > 0 && (
            <DetailSection label="Demos">
              {demos.map((demo) => (
                <a key={demo.url} href={demo.url} target="_blank" rel="noopener noreferrer" className="recordLink" style={{ display: "block" }}>
                  {demo.title} <span className="note">— {demo.note}</span>
                </a>
              ))}
            </DetailSection>
          )}

          <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={copyRecommendation}
              className="focusRing controlBtn"
              style={{ fontSize: "12px", padding: "6px 12px", minHeight: "34px" }}
              aria-label={`Copy ${algo.name} recommendation summary to clipboard`}
            >
              {copied ? "Copied" : "Copy recommendation"}
            </button>
            <CounselButton
              variant="inline"
              question={`Tell me about ${algo.name}`}
              ariaLabel={`Ask Counsel about ${algo.name}`}
            />
          </div>
        </div>
      )}
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

function DetailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div className="recordDetailLabel">{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{children}</div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="recordDetailLabel">{label}</div>
      <div className="recordDetailValue">{value}</div>
    </div>
  );
}
