import type { AlgorithmStatus, RecommendationLevel, SourceKind } from "@/types/crypto";

const REVIEW_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const STATUS_COLORS: Record<AlgorithmStatus, { bg: string; text: string; border: string }> = {
  standard: { bg: "var(--color-badge-green-bg)", text: "var(--color-badge-green-text)", border: "var(--color-badge-green-border)" },
  candidate: { bg: "var(--color-badge-yellow-bg)", text: "var(--color-badge-yellow-text)", border: "var(--color-badge-yellow-border)" },
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
    return <span style={{ color: "var(--color-text-dim)", fontSize: "13px" }}>TBD</span>;
  }

  const brokenByShor = label === "PQ" && bits === 0;
  if (brokenByShor) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {label && (
          <span aria-hidden="true" style={{ fontSize: "14px", color: "var(--color-text-muted)", minWidth: "28px", fontWeight: 700 }}>
            {label}
          </span>
        )}
        <div
          role="meter"
          aria-label="Post-Quantum security: Broken by Shor's algorithm"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{ flex: 1, height: "6px", background: "var(--color-bg-meter)", borderRadius: "999px", overflow: "hidden", minWidth: "50px" }}
        >
          <div style={{ width: "0%", height: "100%", background: "var(--color-badge-red-text)", borderRadius: "2px" }} />
        </div>
        <span
          aria-hidden="true"
          style={{ color: "var(--color-badge-red-text)", fontSize: "13px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", fontWeight: 700, minWidth: "112px", textAlign: "right" }}
        >
          Broken (Shor)
        </span>
      </div>
    );
  }

  const pct = Math.min((bits / max) * 100, 100);
  const c = bits >= 192 ? "var(--color-badge-green-text)" : bits >= 128 ? "var(--color-accent-blue)" : bits >= 112 ? "var(--color-badge-yellow-text)" : "var(--color-badge-red-text)";
  const levelLabel = bits >= 192 ? "high" : bits >= 128 ? "standard" : bits >= 112 ? "moderate" : "low";
  const fullLabel = label === "C" ? "Classical" : label === "PQ" ? "Post-Quantum" : label || "Security";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {label && (
        <span aria-hidden="true" style={{ fontSize: "14px", color: "var(--color-text-muted)", minWidth: "28px", fontWeight: 700 }}>
          {label}
        </span>
      )}
      <div
        role="meter"
        aria-label={`${fullLabel} security: ${bits} bits (${levelLabel})`}
        aria-valuenow={bits}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{ flex: 1, height: "6px", background: "var(--color-bg-meter)", borderRadius: "999px", overflow: "hidden", minWidth: "50px" }}
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
    return { label: "Review pending", color: "var(--color-badge-yellow-text)", bg: "var(--color-badge-yellow-bg)", border: "var(--color-badge-yellow-border)" };
  }

  const reviewedAt = new Date(`${iso}T00:00:00Z`).getTime();
  if (Number.isNaN(reviewedAt)) {
    return { label: "Review date invalid", color: "var(--color-badge-red-text)", bg: "var(--color-badge-red-bg)", border: "var(--color-badge-red-border)" };
  }

  const ageDays = Math.floor((Date.now() - reviewedAt) / (1000 * 60 * 60 * 24));
  if (ageDays <= 45) {
    return { label: "Fresh review", color: "var(--color-badge-green-text)", bg: "var(--color-badge-green-bg)", border: "var(--color-badge-green-border)" };
  }
  if (ageDays <= 120) {
    return { label: "Review aging", color: "var(--color-badge-yellow-text)", bg: "var(--color-badge-yellow-bg)", border: "var(--color-badge-yellow-border)" };
  }
  return { label: "Needs review", color: "var(--color-badge-red-text)", bg: "var(--color-badge-red-bg)", border: "var(--color-badge-red-border)" };
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
  recommended: { icon: "✅", label: "Recommended default", color: "var(--color-badge-green-text)", bg: "var(--color-badge-green-bg)", border: "var(--color-badge-green-border)" },
  acceptable: { icon: "⚠️", label: "Acceptable (constrained)", color: "var(--color-badge-yellow-text)", bg: "var(--color-badge-yellow-bg)", border: "var(--color-badge-yellow-border)" },
  legacy: { icon: "🔄", label: "Legacy / compatibility only", color: "var(--color-badge-orange-text)", bg: "var(--color-badge-orange-bg)", border: "var(--color-badge-orange-border)" },
  research: { icon: "🔬", label: "Research / niche", color: "var(--color-badge-purple-text)", bg: "var(--color-badge-purple-bg)", border: "var(--color-badge-purple-border)" },
  avoid: { icon: "❌", label: "Do not use in new systems", color: "var(--color-badge-red-text)", bg: "var(--color-badge-red-bg)", border: "var(--color-badge-red-border)" },
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
  standard: { icon: "📜", label: "Standard", color: "var(--color-badge-green-text)", bg: "var(--color-badge-green-bg)", border: "var(--color-badge-green-border)" },
  analysis: { icon: "🔍", label: "Analysis", color: "var(--color-badge-blue-text)", bg: "var(--color-badge-blue-bg)", border: "var(--color-badge-blue-border)" },
  deployment: { icon: "🚀", label: "Deployment", color: "var(--color-badge-purple-text)", bg: "var(--color-badge-purple-bg)", border: "var(--color-badge-purple-border)" },
  benchmark: { icon: "⏱️", label: "Benchmark", color: "var(--color-badge-yellow-text)", bg: "var(--color-badge-yellow-bg)", border: "var(--color-badge-yellow-border)" },
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
