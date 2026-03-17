import { Badge, RecommendationBadge, SecurityMeter } from "@/components/ui";
import { CATEGORY_ACCENT } from "@/data/categories";
import type { Algorithm } from "@/types/crypto";

type AlgoCardProps = {
  algo: Algorithm;
  advanced: boolean;
  selected: boolean;
  onToggle: () => void;
};

export default function AlgoCard({ algo, advanced, selected, onToggle }: AlgoCardProps) {
  const accent = CATEGORY_ACCENT[algo.category];

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
        background: selected ? "#0e1628" : "#0b0f17",
        border: `1.5px solid ${selected ? accent : "#1e293b"}`,
        borderLeft: `3px solid ${selected ? accent : `${accent}55`}`,
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
      {selected && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "8px",
            right: "10px",
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
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>{algo.name}</span>
        <Badge status={algo.status} label={algo.statusLabel} />
        <RecommendationBadge level={algo.recommendation} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
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
      </div>
      <p style={{ fontSize: "15px", color: "#d4deea", lineHeight: "1.7", margin: "0 0 12px" }}>{algo.useCases}</p>
      <SecurityMeter bits={algo.securityBits} label="C" />
      <div style={{ height: "6px" }} />
      <SecurityMeter bits={algo.pqSecurityBits} label="PQ" />
      {algo.sources && algo.sources.length > 0 && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#7d8a9e", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>{algo.sources.length} source{algo.sources.length !== 1 ? "s" : ""}</span>
          {algo.lastReviewed && <span>· Reviewed {algo.lastReviewed}</span>}
        </div>
      )}
      {advanced && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1e293b", fontSize: "14px", color: "#d4deea", lineHeight: "1.7" }}>
          <div>
            <span style={{ color: "#93a4bb", fontWeight: 700 }}>Attack:</span> {algo.bestAttack}
          </div>
          <div style={{ marginTop: "6px" }}>
            <span style={{ color: "#93a4bb", fontWeight: 700 }}>Perf:</span> {algo.performance}
          </div>
        </div>
      )}
    </div>
  );
}
