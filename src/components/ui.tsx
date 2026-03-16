import type { AlgorithmStatus } from "@/types/crypto";

const STATUS_COLORS: Record<AlgorithmStatus, { bg: string; text: string; border: string }> = {
  standard: { bg: "#0d3320", text: "#34d399", border: "#065f46" },
  candidate: { bg: "#312e2a", text: "#fbbf24", border: "#78350f" },
};

export function Badge({ status, label }: { status: AlgorithmStatus; label: string }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.standard;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        padding: "3px 10px",
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.4px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export function SecurityMeter({ bits, max = 256, label }: { bits: number | null | undefined; max?: number; label?: string }) {
  if (bits == null) {
    return <span style={{ color: "#7f8ea3", fontSize: "13px" }}>TBD</span>;
  }

  const pct = Math.min((bits / max) * 100, 100);
  const c = bits >= 192 ? "#34d399" : bits >= 128 ? "#38bdf8" : bits >= 112 ? "#fbbf24" : "#f87171";
  const levelLabel = bits >= 192 ? "high" : bits >= 128 ? "standard" : bits >= 112 ? "moderate" : "low";
  const fullLabel = label === "C" ? "Classical" : label === "PQ" ? "Post-Quantum" : label || "Security";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {label && (
        <span aria-hidden="true" style={{ fontSize: "14px", color: "#93a4bb", minWidth: "28px", fontWeight: 700 }}>
          {label}
        </span>
      )}
      <div
        role="meter"
        aria-label={`${fullLabel} security: ${bits} bits (${levelLabel})`}
        aria-valuenow={bits}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{ flex: 1, height: "6px", background: "#141a26", borderRadius: "999px", overflow: "hidden", minWidth: "50px" }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: "2px", transition: "width 0.4s" }} />
      </div>
      <span
        aria-hidden="true"
        style={{ color: c, fontSize: "15px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", fontWeight: 700, minWidth: "38px" }}
      >
        {bits}
      </span>
    </div>
  );
}

export function formatBytes(b: number | null | undefined): string {
  if (b == null) {
    return "TBD";
  }
  if (b >= 1024) {
    return `${(b / 1024).toFixed(1)} KB`;
  }
  return `${b} B`;
}
