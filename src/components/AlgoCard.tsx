import { useState } from "react";
import { Badge, RecommendationBadge, ReviewBadge, SecurityMeter } from "@/components/ui";
import { CATEGORY_ACCENT } from "@/data/categories";
import type { Algorithm } from "@/types/crypto";

type AlgoCardProps = {
  algo: Algorithm;
  selected: boolean;
  onToggle: () => void;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  advisorPick?: boolean;
};

export default function AlgoCard({ algo, selected, onToggle, favorited, onToggleFavorite, advisorPick }: AlgoCardProps) {
  const accent = CATEGORY_ACCENT[algo.category];
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div
      id={`algo-${algo.id}`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${selected ? "Deselect" : "Select"} ${algo.name} for comparison`}
      className="focusRing algoCard"
      style={{
        background: advisorPick ? "#0c1a2e" : selected ? "#0e1628" : "#0b0f17",
        border: `1.5px solid ${advisorPick ? "#34d399" : selected ? accent : "#1e293b"}`,
        borderLeft: `3px solid ${advisorPick ? "#34d399" : selected ? accent : `${accent}55`}`,
        borderRadius: "10px",
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        boxShadow: selected ? `0 0 16px ${accent}18` : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = `${accent}88`;
          e.currentTarget.style.boxShadow = `0 0 12px ${accent}12`;
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "#1e293b";
          e.currentTarget.style.borderLeftColor = `${accent}55`;
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      <div style={{ position: "absolute", top: "8px", right: "10px", display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setDetailOpen((v) => !v); }}
          aria-label={detailOpen ? `Hide ${algo.name} details` : `Show ${algo.name} details`}
          aria-expanded={detailOpen}
          style={{
            background: detailOpen ? "#1e293b" : "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            padding: "8px",
            minWidth: "44px",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: detailOpen ? "#7dd3fc" : "#475569",
            transition: "color 0.15s",
            borderRadius: "6px",
          }}
        >
          ℹ
        </button>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            aria-label={favorited ? `Remove ${algo.name} from favorites` : `Add ${algo.name} to favorites`}
            className="favBtn"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              padding: "8px",
              minWidth: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: favorited ? "#fbbf24" : "#475569",
              transition: "color 0.15s",
            }}
          >
            {favorited ? "★" : "☆"}
          </button>
        )}
        {selected && (
          <div
            aria-hidden="true"
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap", paddingRight: "48px" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", overflowWrap: "break-word", wordBreak: "break-word" }}>{algo.name}</span>
        <Badge status={algo.status} label={algo.statusLabel} />
        <RecommendationBadge level={algo.recommendation} />
        {advisorPick && (
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", background: "#06271c", border: "1px solid #065f46", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.4px", textTransform: "uppercase" }}>Advisor pick</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            color: accent,
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {algo.family}
        </span>
        <span style={{ fontSize: "14px", color: "#93a4bb" }}>·</span>
        <span style={{ fontSize: "14px", color: "#c4d1e3" }}>{algo.origin}</span>
        <ReviewBadge iso={algo.lastReviewed} />
      </div>
      <p style={{ fontSize: "15px", color: "#d4deea", lineHeight: "1.7", margin: "0 0 12px" }}>{algo.useCases}</p>
      <SecurityMeter bits={algo.securityBits} label="C" />
      <div style={{ height: "6px" }} />
      <SecurityMeter bits={algo.pqSecurityBits} label="PQ" />
      {algo.sources && algo.sources.length > 0 && (
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#7d8a9e", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ color: "#7dd3fc", fontWeight: 600 }}>{algo.sources.length} source{algo.sources.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>{algo.status === "standard" ? "Standards-backed" : "Candidate / emerging"}</span>
        </div>
      )}
      {(algo.recommendation === "legacy" || algo.recommendation === "avoid") && (
        <div style={{
          marginTop: "10px",
          padding: "10px 12px",
          borderRadius: "6px",
          background: "#1a1207",
          border: "1px solid #78350f",
          fontSize: "13px",
          lineHeight: 1.6,
        }}>
          <strong style={{ color: "#fbbf24", display: "block", marginBottom: "4px" }}>
            ⚠ {algo.recommendation === "legacy" ? "Migration recommended" : "Do not use"}
          </strong>
          <span style={{ color: "#e2c97e" }}>{algo.whyNotThis}</span>
        </div>
      )}
      {detailOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #1e293b", fontSize: "13px", color: "#d4deea", lineHeight: 1.7 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "12px" }}>
            <DetailField label="Best known attack" value={algo.bestAttack} />
            <DetailField label="Performance" value={algo.performance} />
            <DetailField label="Reduction quality" value={algo.reductionQuality} />
            <DetailField label="Assumptions" value={algo.assumptions} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "12px" }}>
            <DetailField label="Recommendation" value={`${algo.recommendation} — ${algo.recommendationRationale}`} />
            <DetailField label="Changes when" value={algo.recommendationChangesWhen} />
            {algo.whyNotThis && <DetailField label="Why not this" value={algo.whyNotThis} />}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "12px" }}>
            <DetailField label="Classical estimate" value={`${algo.estimationMethodology.classicalBasis}: ${algo.estimationMethodology.classicalNote}`} />
            <DetailField label="Quantum estimate" value={`${algo.estimationMethodology.quantumBasis}: ${algo.estimationMethodology.quantumNote}`} />
            <DetailField label="Origin" value={algo.originDetail} />
          </div>
          {algo.notes && (
            <div style={{ marginBottom: "12px" }}>
              <DetailField label="Notes" value={algo.notes} />
            </div>
          )}
          {algo.sources && algo.sources.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Sources</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {algo.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "#93c5fd", fontSize: "12px", textDecoration: "none", lineHeight: 1.5 }}>
                    {s.label} <span style={{ color: "#475569" }}>— {s.note}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "13px", color: "#d4deea", lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}
