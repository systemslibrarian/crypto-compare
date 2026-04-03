import Link from "next/link";

type QuickStartPanelProps = {
  showMethodology: boolean;
  onToggleMethodology: () => void;
  onShowDefaults: () => void;
  onSearchAll: () => void;
  onShowSafeUsage: () => void;
};

export default function QuickStartPanel({
  showMethodology,
  onToggleMethodology,
  onShowDefaults,
  onSearchAll,
  onShowSafeUsage,
}: QuickStartPanelProps) {
  return (
    <section className="panel" aria-label="Quick start actions" style={{ marginBottom: "16px", background: "linear-gradient(135deg, #0a1220 0%, #101b31 100%)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
        <div>
          <h2 className="panel-heading" style={{ marginBottom: "6px" }}>Start Here</h2>
          <p style={{ margin: 0, color: "#93a4bb", fontSize: "14px", lineHeight: 1.7 }}>
            Use the app in the order that tends to produce the safest decisions: scope the problem, narrow the field, then verify the trust signals.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button className="focusRing controlBtn" onClick={onToggleMethodology}>
            {showMethodology ? "Hide trust model" : "Read trust model"}
          </button>
          <Link href="/advisor" className="focusRing controlBtn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Open advisor
          </Link>
        </div>
      </div>
      <div className="quickStartGrid">
        <button type="button" className="focusRing quickStartCard" onClick={onShowDefaults}>
          <div className="quickStartEyebrow">1. Safe defaults</div>
          <div className="quickStartTitle">Start with recommended algorithms</div>
          <div className="quickStartBody">Filter the current view to recommended defaults before comparing anything niche, legacy, or research-grade.</div>
        </button>
        <button type="button" className="focusRing quickStartCard" onClick={onSearchAll}>
          <div className="quickStartEyebrow">2. Narrow the field</div>
          <div className="quickStartTitle">Search all algorithms intentionally</div>
          <div className="quickStartBody">Search across categories when you know the property you need but not yet the family that should implement it.</div>
        </button>
        <button type="button" className="focusRing quickStartCard" onClick={onShowSafeUsage}>
          <div className="quickStartEyebrow">3. Avoid failure modes</div>
          <div className="quickStartTitle">Read the safe-usage rules</div>
          <div className="quickStartBody">Nonce reuse, bad key separation, and skipped verification destroy otherwise sound algorithm choices.</div>
        </button>
      </div>
    </section>
  );
}