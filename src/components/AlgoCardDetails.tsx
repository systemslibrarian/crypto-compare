"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CounselButton } from "@/components/CounselButton";
import { recommendationText } from "@/components/ui";
import { ALGORITHM_DEMOS } from "@/data/demoResources";
import { formatAssuranceForExport, type AssuranceProfile } from "@/lib/assurance";
import type { Algorithm } from "@/types/crypto";

const ImplementationList = dynamic(() => import("@/components/ImplementationList"), { ssr: false });

type AlgoCardDetailsProps = {
  algo: Algorithm;
  assurance: AssuranceProfile;
  implementationCount: number;
};

export default function AlgoCardDetails({ algo, assurance, implementationCount }: AlgoCardDetailsProps) {
  const [copied, setCopied] = useState(false);
  const demos = ALGORITHM_DEMOS[algo.id] ?? [];

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

  return (
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
          {algo.wrongChoiceConsequence.map((consequence, index) => (
            <div key={index} className="recordSubItem">
              <strong style={{ color: consequence.severity === "critical" ? "var(--color-badge-red-text)" : consequence.severity === "high" ? "var(--color-badge-orange-text)" : "var(--color-badge-yellow-text)", textTransform: "uppercase", fontSize: "10.5px", letterSpacing: "0.08em", marginRight: "8px" }}>{consequence.severity}</strong>
              <strong style={{ color: "var(--color-text-heading)" }}>{consequence.scenario}</strong>
              <div style={{ color: "var(--color-text-secondary)" }}>{consequence.consequence}</div>
            </div>
          ))}
        </DetailSection>
      )}

      {implementationCount > 0 && <ImplementationList algorithmId={algo.id} />}

      {algo.sources && algo.sources.length > 0 && (
        <DetailSection label="Sources">
          {algo.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="recordLink" style={{ display: "block" }}>
              {source.label} <span className="note">— {source.note}</span>
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
