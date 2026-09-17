import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasComparing = useRef(false);

  useEffect(() => {
    if (!comparing) {
      if (wasComparing.current) {
        requestAnimationFrame(() => {
          document.querySelector<HTMLButtonElement>("[data-comparison-trigger='true']")?.focus();
        });
      }
      wasComparing.current = false;
      return;
    }

    wasComparing.current = true;
    const appRoot = document.querySelector<HTMLElement>(".cryptoCompareRoot");
    const previousAriaHidden = appRoot?.getAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    appRoot?.setAttribute("inert", "");
    appRoot?.setAttribute("aria-hidden", "true");
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      appRoot?.removeAttribute("inert");
      if (previousAriaHidden == null) appRoot?.removeAttribute("aria-hidden");
      else appRoot?.setAttribute("aria-hidden", previousAriaHidden);
    };
  }, [comparing]);

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
      "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
    ));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

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
          background: "var(--color-bg-overlay)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid var(--color-border-bar)",
          boxShadow: "0 -4px 20px var(--color-shadow-overlay)",
        }}
      >
        <button
          onClick={onStartCompare}
          data-comparison-trigger="true"
          className="focusRing"
          aria-label={`Compare ${algorithms.length} selected algorithms`}
          style={{
            background: "var(--color-button-primary)",
            color: "var(--color-button-primary-text)",
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

  const dialog = (
    <div
      ref={dialogRef}
      className="comparisonOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-dialog-title"
      onKeyDown={handleDialogKeyDown}
    >
      <div className="comparisonOverlayHeader">
        <h2 id="comparison-dialog-title" style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "8px" }}>
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
          <button onClick={onClearSelection} className="focusRing controlBtn" style={{ color: "var(--color-badge-red-text)" }}>
            Clear
          </button>
          <button
            ref={closeButtonRef}
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

  return createPortal(dialog, document.body);
}
