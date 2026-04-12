import { useEffect } from "react";
import ComparisonTable from "@/components/ComparisonTable";
import type { Algorithm, ComparisonRow } from "@/types/crypto";

type ComparisonWorkspaceProps = {
  algorithms: Algorithm[];
  comparing: boolean;
  categoryAccent: string;
  rows: ComparisonRow[];
  onStartCompare: () => void;
  onClose: () => void;
  onCopyLink: () => void;
  onClearSelection: () => void;
  onExportCsv: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
};

export default function ComparisonWorkspace({
  algorithms,
  comparing,
  categoryAccent,
  rows,
  onStartCompare,
  onClose,
  onCopyLink,
  onClearSelection,
  onExportCsv,
  onExportMarkdown,
  onExportJson,
}: ComparisonWorkspaceProps) {
  // Lock body scroll when comparison overlay is open
  useEffect(() => {
    if (!comparing) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [comparing]);

  // Close on Escape key
  useEffect(() => {
    if (!comparing) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [comparing, onClose]);

  if (algorithms.length === 1) {
    return <p style={{ textAlign: "center", color: "var(--color-text-body)", fontSize: "15px" }}>Select one more algorithm to compare.</p>;
  }

  if (algorithms.length < 2) {
    return null;
  }

  if (!comparing) {
    return (
      <div
        className="compareBar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          padding: "12px 16px",
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <button
          onClick={onStartCompare}
          className="focusRing"
          aria-label={`Compare ${algorithms.length} selected algorithms`}
          style={{
            background: "#1d4ed8",
            color: "#fff",
            border: "none",
            padding: "12px 28px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          }}
        >
          Compare {algorithms.length}
        </button>
        <button className="focusRing controlBtn" onClick={onCopyLink}>
          Copy comparison link
        </button>
      </div>
    );
  }

  return (
    <div className="comparisonOverlay" role="dialog" aria-modal="true" aria-label="Algorithm comparison">
      <div className="comparisonOverlayHeader">
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: categoryAccent }}>▍</span>Comparison
          <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--color-text-muted)" }}>({algorithms.length} algorithms)</span>
        </h2>
        <div className="comparisonOverlayActions">
          <button className="focusRing controlBtn" onClick={onCopyLink}>
            Copy link
          </button>
          <button className="focusRing controlBtn comparisonOverlayExportBtn" onClick={onExportCsv}>
            CSV
          </button>
          <button className="focusRing controlBtn comparisonOverlayExportBtn" onClick={onExportMarkdown}>
            MD
          </button>
          <button className="focusRing controlBtn comparisonOverlayExportBtn" onClick={onExportJson}>
            JSON
          </button>
          <button onClick={onClearSelection} className="focusRing controlBtn" style={{ color: "#f87171" }}>
            Clear
          </button>
          <button
            onClick={onClose}
            className="focusRing controlBtn"
            aria-label="Close comparison"
            style={{ fontWeight: 700, fontSize: "18px", lineHeight: 1, padding: "8px 12px" }}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="comparisonOverlayBody">
        <ComparisonTable algos={algorithms} rows={rows} />
      </div>
    </div>
  );
}