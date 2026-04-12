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
          <p style={{ color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 12px" }}>
            Hybrid constructions combine classical and post-quantum algorithms so that security holds if either assumption remains valid.
          </p>
          {HYBRID_PATTERNS.map((pattern) => (
            <div key={pattern.id} style={{ borderTop: "1px solid var(--color-border)", padding: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <strong style={{ color: "var(--color-text)", fontSize: "14px" }}>{pattern.name}</strong>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    background:
                      pattern.recommendation === "recommended"
                        ? "var(--color-badge-green-bg)"
                        : pattern.recommendation === "acceptable"
                          ? "var(--color-badge-yellow-bg)"
                          : "var(--color-badge-purple-bg)",
                    color:
                      pattern.recommendation === "recommended"
                        ? "var(--color-badge-green-text)"
                        : pattern.recommendation === "acceptable"
                          ? "var(--color-badge-yellow-text)"
                          : "var(--color-badge-purple-text)",
                    border: `1px solid ${
                      pattern.recommendation === "recommended"
                        ? "var(--color-badge-green-border)"
                        : pattern.recommendation === "acceptable"
                          ? "var(--color-badge-yellow-border)"
                          : "var(--color-badge-purple-border)"
                    }`,
                  }}
                >
                  {pattern.recommendation}
                </span>
                <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>({pattern.category})</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                <div><span style={{ color: "var(--color-text-muted)" }}>Classical:</span> {pattern.classical}</div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Post-Quantum:</span> {pattern.postQuantum}</div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Method:</span> {pattern.combinationMethod}</div>
                <pre
                  style={{
                    background: "var(--color-bg-code)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    margin: "6px 0",
                    fontSize: "11px",
                    lineHeight: 1.5,
                    color: "var(--color-text-link)",
                    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    overflowX: "auto",
                    whiteSpace: "pre",
                  }}
                >
                  {pattern.diagram}
                </pre>
                <div><span style={{ color: "var(--color-text-muted)" }}>Deployed in:</span> {pattern.deployedIn.join(", ")}</div>
                <div style={{ marginTop: "4px" }}><span style={{ color: "var(--color-text-muted)" }}>Rationale:</span> {pattern.rationale}</div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Limitations:</span> {pattern.limitations}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}