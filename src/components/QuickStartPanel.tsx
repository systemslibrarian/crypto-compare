import { useEffect, useState } from "react";
import Link from "next/link";

const DISMISSED_KEY = "crypto-compare-quickstart-dismissed";

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
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
  }, []);

  function handleDismiss() {
    setDismissed(true);
    setExpanded(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  function handleRestore() {
    setDismissed(false);
    localStorage.removeItem(DISMISSED_KEY);
  }

  if (dismissed) {
    return (
      <div className="quickStartBar" style={{ marginBottom: "10px", textAlign: "right" }}>
        <button type="button" className="focusRing controlBtn" onClick={handleRestore} style={{ fontSize: "12px", padding: "6px 12px" }}>
          Show quick start guide
        </button>
      </div>
    );
  }

  return (
    <div className="quickStartBar" style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          padding: "8px 14px",
          border: "1px solid #1e293b",
          borderRadius: expanded ? "10px 10px 0 0" : "10px",
          background: "linear-gradient(135deg, #0a1220 0%, #101b31 100%)",
        }}
      >
        <button
          type="button"
          className="focusRing"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-text-accent-bright)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "14px",
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            padding: "4px 0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "12px" }}>{expanded ? "▾" : "▸"}</span>
          Quick Start
        </button>
        <span style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>—</span>
        <span style={{ color: "var(--color-text-muted)", fontSize: "13px", flex: "1 1 auto" }}>
          Scope → Narrow → Verify
        </span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button className="focusRing controlBtn" onClick={onShowDefaults} style={{ fontSize: "12px", padding: "5px 10px" }}>
            Safe defaults
          </button>
          <button className="focusRing controlBtn" onClick={onToggleMethodology} style={{ fontSize: "12px", padding: "5px 10px" }}>
            {showMethodology ? "Hide trust model" : "Trust model"}
          </button>
          <Link href="/advisor" className="focusRing controlBtn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", fontSize: "12px", padding: "5px 10px" }}>
            Advisor
          </Link>
          <button type="button" className="focusRing controlBtn" onClick={handleDismiss} aria-label="Dismiss quick start" style={{ fontSize: "12px", padding: "5px 8px" }}>
            ✕
          </button>
        </div>
      </div>
      {expanded && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "10px",
            padding: "12px 14px",
            border: "1px solid #1e293b",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            background: "linear-gradient(135deg, #0a1220 0%, #101b31 100%)",
          }}
        >
          <button type="button" className="focusRing quickStartCard" onClick={onShowDefaults}>
            <div className="quickStartEyebrow">1. Safe defaults</div>
            <div className="quickStartTitle">Start with recommended algorithms</div>
            <div className="quickStartBody">Filter to recommended defaults before comparing niche or research-grade options.</div>
          </button>
          <button type="button" className="focusRing quickStartCard" onClick={onSearchAll}>
            <div className="quickStartEyebrow">2. Narrow the field</div>
            <div className="quickStartTitle">Search all algorithms</div>
            <div className="quickStartBody">Search across categories when you know the property you need but not the family.</div>
          </button>
          <button type="button" className="focusRing quickStartCard" onClick={onShowSafeUsage}>
            <div className="quickStartEyebrow">3. Avoid failure modes</div>
            <div className="quickStartTitle">Read the safe-usage rules</div>
            <div className="quickStartBody">Nonce reuse, bad key separation, and skipped verification destroy sound choices.</div>
          </button>
        </div>
      )}
    </div>
  );
}