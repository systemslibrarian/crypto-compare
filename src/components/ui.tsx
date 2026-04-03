import type { AlgorithmStatus, RecommendationLevel, SourceKind } from "@/types/crypto";

const REVIEW_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

export function formatReviewDate(iso: string | undefined): string {
  if (!iso) return "Review pending";
  const [year, month] = iso.split("-");
  const monthIndex = Number.parseInt(month ?? "0", 10) - 1;
  if (monthIndex < 0 || monthIndex >= REVIEW_MONTHS.length) return iso;
  return `${REVIEW_MONTHS[monthIndex]} ${year}`;
}

function getReviewFreshness(iso: string | undefined): { label: string; color: string; bg: string; border: string } {
  if (!iso) {
    return { label: "Review pending", color: "#fbbf24", bg: "#312e2a", border: "#78350f" };
  }

  const reviewedAt = new Date(`${iso}T00:00:00Z`).getTime();
  if (Number.isNaN(reviewedAt)) {
    return { label: "Review date invalid", color: "#f87171", bg: "#2d1215", border: "#7f1d1d" };
  }

  const ageDays = Math.floor((Date.now() - reviewedAt) / (1000 * 60 * 60 * 24));
  if (ageDays <= 45) {
    return { label: "Fresh review", color: "#34d399", bg: "#0d3320", border: "#065f46" };
  }
  if (ageDays <= 120) {
    return { label: "Review aging", color: "#fbbf24", bg: "#312e2a", border: "#78350f" };
  }
  return { label: "Needs review", color: "#f87171", bg: "#2d1215", border: "#7f1d1d" };
}

export function ReviewBadge({ iso }: { iso: string | undefined }) {
  const freshness = getReviewFreshness(iso);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: freshness.bg,
        color: freshness.color,
        border: `1px solid ${freshness.border}`,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
      title={iso ? `${freshness.label} · ${formatReviewDate(iso)}` : freshness.label}
    >
      {iso ? formatReviewDate(iso) : freshness.label}
    </span>
  );
}

const RECOMMENDATION_CONFIG: Record<RecommendationLevel, { icon: string; label: string; color: string; bg: string; border: string }> = {
  recommended: { icon: "✅", label: "Recommended default", color: "#34d399", bg: "#0d3320", border: "#065f46" },
  acceptable: { icon: "⚠️", label: "Acceptable (constrained)", color: "#fbbf24", bg: "#312e2a", border: "#78350f" },
  legacy: { icon: "🔄", label: "Legacy / compatibility only", color: "#f97316", bg: "#2d1f0e", border: "#7c3a0a" },
  research: { icon: "🔬", label: "Research / niche", color: "#a78bfa", bg: "#1e1633", border: "#4c1d95" },
  avoid: { icon: "❌", label: "Do not use in new systems", color: "#f87171", bg: "#2d1215", border: "#7f1d1d" },
};

export function RecommendationBadge({ level }: { level: RecommendationLevel }) {
  const cfg = RECOMMENDATION_CONFIG[level];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        padding: "3px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
      title={cfg.label}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}

export function recommendationText(level: RecommendationLevel): string {
  return RECOMMENDATION_CONFIG[level].label;
}

const SOURCE_KIND_CONFIG: Record<SourceKind, { icon: string; label: string; color: string; bg: string; border: string }> = {
  standard: { icon: "📜", label: "Standard", color: "#34d399", bg: "#0d3320", border: "#065f46" },
  analysis: { icon: "🔍", label: "Analysis", color: "#38bdf8", bg: "#0c2d4a", border: "#0e4f82" },
  deployment: { icon: "🚀", label: "Deployment", color: "#a78bfa", bg: "#1e1633", border: "#4c1d95" },
  benchmark: { icon: "⏱️", label: "Benchmark", color: "#fbbf24", bg: "#312e2a", border: "#78350f" },
};

export function SourceKindBadge({ kind }: { kind: SourceKind }) {
  const cfg = SOURCE_KIND_CONFIG[kind];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
      title={cfg.label}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

export function sourceKindLabel(kind: SourceKind): string {
  return SOURCE_KIND_CONFIG[kind].label;
}
