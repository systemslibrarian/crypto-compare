import { HYBRID_PATTERNS } from "@/data/hybridPatterns";

type HybridPatternsSectionProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function HybridPatternsSection({ isOpen, onToggle }: HybridPatternsSectionProps) {
  return (
    <>
      <button className="focusRing controlBtn" onClick={onToggle} aria-expanded={isOpen} aria-label={`${isOpen ? "Hide" : "Show"} hybrid cryptography patterns`} style={{ marginBottom: isOpen ? "0" : "12px" }}>
        {isOpen ? "▾" : "▸"} Hybrid Cryptography Patterns
      </button>
      {isOpen && (
        <section className="panel" aria-label="Hybrid cryptography patterns" style={{ marginBottom: "18px" }}>
          <h2 className="panel-heading">Hybrid Cryptography Patterns</h2>
          <p style={{ color: "#93a4bb", fontSize: "13px", lineHeight: 1.6, margin: "0 0 12px" }}>
            Hybrid constructions combine classical and post-quantum algorithms so that security holds if either assumption remains valid.
          </p>
          {HYBRID_PATTERNS.map((pattern) => (
            <div key={pattern.id} style={{ borderTop: "1px solid #1e293b", padding: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <strong style={{ color: "#e2e8f0", fontSize: "14px" }}>{pattern.name}</strong>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    background:
                      pattern.recommendation === "recommended"
                        ? "#0d3320"
                        : pattern.recommendation === "acceptable"
                          ? "#312e2a"
                          : "#1e1633",
                    color:
                      pattern.recommendation === "recommended"
                        ? "#34d399"
                        : pattern.recommendation === "acceptable"
                          ? "#fbbf24"
                          : "#a78bfa",
                    border: `1px solid ${
                      pattern.recommendation === "recommended"
                        ? "#065f46"
                        : pattern.recommendation === "acceptable"
                          ? "#78350f"
                          : "#4c1d95"
                    }`,
                  }}
                >
                  {pattern.recommendation}
                </span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>({pattern.category})</span>
              </div>
              <div style={{ fontSize: "13px", color: "#c4d1e3", lineHeight: 1.7 }}>
                <div><span style={{ color: "#64748b" }}>Classical:</span> {pattern.classical}</div>
                <div><span style={{ color: "#64748b" }}>Post-Quantum:</span> {pattern.postQuantum}</div>
                <div><span style={{ color: "#64748b" }}>Method:</span> {pattern.combinationMethod}</div>
                <pre
                  style={{
                    background: "#0a0e17",
                    border: "1px solid #1e293b",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    margin: "6px 0",
                    fontSize: "11px",
                    lineHeight: 1.5,
                    color: "#93c5fd",
                    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    overflowX: "auto",
                    whiteSpace: "pre",
                  }}
                >
                  {pattern.diagram}
                </pre>
                <div><span style={{ color: "#64748b" }}>Deployed in:</span> {pattern.deployedIn.join(", ")}</div>
                <div style={{ marginTop: "4px" }}><span style={{ color: "#64748b" }}>Rationale:</span> {pattern.rationale}</div>
                <div><span style={{ color: "#64748b" }}>Limitations:</span> {pattern.limitations}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}