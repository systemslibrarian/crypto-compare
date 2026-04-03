import ComparisonTable from "@/components/ComparisonTable";
import type { Algorithm, ComparisonRow } from "@/types/crypto";

type ComparisonWorkspaceProps = {
  algorithms: Algorithm[];
  comparing: boolean;
  categoryAccent: string;
  rows: ComparisonRow[];
  onStartCompare: () => void;
  onCopyLink: () => void;
  onClearSelection: () => void;
  onExportCsv: () => void;
  onExportMarkdown: () => void;
};

export default function ComparisonWorkspace({
  algorithms,
  comparing,
  categoryAccent,
  rows,
  onStartCompare,
  onCopyLink,
  onClearSelection,
  onExportCsv,
  onExportMarkdown,
}: ComparisonWorkspaceProps) {
  if (algorithms.length === 1) {
    return <p style={{ textAlign: "center", color: "#d4deea", fontSize: "15px" }}>Select one more algorithm to compare.</p>;
  }

  if (algorithms.length < 2) {
    return null;
  }

  if (!comparing) {
    return (
      <div style={{ textAlign: "center", margin: "10px 0", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
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
    <section aria-label="Comparison table" style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", gap: "10px", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: categoryAccent }}>▍</span>Comparison
        </h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={onClearSelection} className="focusRing controlBtn">
            Clear selection
          </button>
          <button className="focusRing controlBtn" onClick={onCopyLink}>
            Copy link
          </button>
          <button className="focusRing controlBtn" onClick={onExportCsv}>
            Export CSV
          </button>
          <button className="focusRing controlBtn" onClick={onExportMarkdown}>
            Export Markdown
          </button>
        </div>
      </div>
      <ComparisonTable algos={algorithms} rows={rows} />
    </section>
  );
}