import { Badge, SecurityMeter } from "@/components/ui";
import type { Algorithm } from "@/types/crypto";

type AlgoCardProps = {
  algo: Algorithm;
  advanced: boolean;
  selected: boolean;
  onToggle: () => void;
};

export default function AlgoCard({ algo, advanced, selected, onToggle }: AlgoCardProps) {
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
        border: `1.5px solid ${selected ? "#3b82f6" : "#1e293b"}`,
        borderRadius: "10px",
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.15s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "#1e2b40";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "#141c2b";
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
            background: "#1d4ed8",
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
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", fontFamily: "'JetBrains Mono',monospace" }}>{algo.name}</span>
        <Badge status={algo.status} label={algo.statusLabel} />
      </div>
      <div style={{ fontSize: "15px", color: "#c4d1e3", marginBottom: "10px" }}>{algo.origin}</div>
      <p style={{ fontSize: "15px", color: "#d4deea", lineHeight: "1.7", margin: "0 0 12px" }}>{algo.useCases}</p>
      <SecurityMeter bits={algo.securityBits} label="C" />
      <div style={{ height: "6px" }} />
      <SecurityMeter bits={algo.pqSecurityBits} label="PQ" />
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
