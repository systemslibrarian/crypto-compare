import type { AlgorithmStatus, RecommendationLevel, SourceKind } from "@/types/crypto";

const REVIEW_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type BadgeTone = "green" | "yellow" | "red" | "purple" | "neutral";

function toneClass(tone: BadgeTone): string {
  return `badge badge--${tone}`;
}

const STATUS_TONES: Record<AlgorithmStatus, BadgeTone> = {
  standard: "green",
  candidate: "yellow",
};

export function Badge({ status, label }: { status: AlgorithmStatus; label: string }) {
  return <span className={toneClass(STATUS_TONES[status] ?? "neutral")}>{label}</span>;
}

export function SecurityMeter({ bits, max = 256, label }: { bits: number | null | undefined; max?: number; label?: string }) {
  if (bits == null) {
    return <span style={{ color: "var(--color-text-dim)", fontSize: "13px" }}>TBD</span>;
  }

  const fullLabel = label === "C" ? "Classical" : label === "PQ" ? "Post-Quantum" : label || "Security";

  const brokenByShor = label === "PQ" && bits === 0;
  if (brokenByShor) {
    return (
      <div className="meter">
        {label && <span aria-hidden="true" className="meterLabel">{label}</span>}
        <div
          role="meter"
          aria-label="Post-Quantum security: Broken by Shor's algorithm"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={max}
          className="meterTrack"
        >
          <div className="meterFill" style={{ width: "0%" }} />
        </div>
        <span aria-hidden="true" className="meterValue" style={{ color: "var(--color-badge-red-text)", minWidth: "100px" }}>
          Broken (Shor)
        </span>
      </div>
    );
  }

  const pct = Math.min((bits / max) * 100, 100);
  // Restrained scale: teal for standard-or-better, amber for moderate, crimson for weak.
  const c = bits >= 128 ? "var(--color-text-accent-bright)" : bits >= 112 ? "var(--color-badge-yellow-text)" : "var(--color-badge-red-text)";
  const levelLabel = bits >= 192 ? "high" : bits >= 128 ? "standard" : bits >= 112 ? "moderate" : "low";

  return (
    <div className="meter">
      {label && <span aria-hidden="true" className="meterLabel">{label}</span>}
      <div
        role="meter"
        aria-label={`${fullLabel} security: ${bits} bits (${levelLabel})`}
        aria-valuenow={bits}
        aria-valuemin={0}
        aria-valuemax={max}
        className="meterTrack"
      >
        <div className="meterFill" style={{ width: `${pct}%`, background: c }} />
      </div>
      <span aria-hidden="true" className="meterValue" style={{ color: c }}>
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

function getReviewFreshness(iso: string | undefined): { label: string; tone: BadgeTone } {
  if (!iso) {
    return { label: "Review pending", tone: "yellow" };
  }

  const reviewedAt = new Date(`${iso}T00:00:00Z`).getTime();
  if (Number.isNaN(reviewedAt)) {
    return { label: "Review date invalid", tone: "red" };
  }

  const ageDays = Math.floor((Date.now() - reviewedAt) / (1000 * 60 * 60 * 24));
  if (ageDays <= 45) {
    return { label: "Fresh review", tone: "green" };
  }
  if (ageDays <= 120) {
    return { label: "Review aging", tone: "yellow" };
  }
  return { label: "Needs review", tone: "red" };
}

export function ReviewBadge({ iso }: { iso: string | undefined }) {
  const freshness = getReviewFreshness(iso);
  return (
    <span
      className={toneClass(freshness.tone)}
      title={iso ? `${freshness.label} · ${formatReviewDate(iso)}` : freshness.label}
    >
      {iso ? formatReviewDate(iso) : freshness.label}
    </span>
  );
}

const RECOMMENDATION_CONFIG: Record<RecommendationLevel, { short: string; label: string; tone: BadgeTone }> = {
  recommended: { short: "Recommended", label: "Recommended default", tone: "green" },
  acceptable: { short: "Acceptable", label: "Acceptable (constrained)", tone: "yellow" },
  legacy: { short: "Legacy", label: "Legacy / compatibility only", tone: "yellow" },
  research: { short: "Research", label: "Research / niche", tone: "purple" },
  avoid: { short: "Avoid", label: "Do not use in new systems", tone: "red" },
};

export function RecommendationBadge({ level, compact }: { level: RecommendationLevel; compact?: boolean }) {
  const cfg = RECOMMENDATION_CONFIG[level];
  return (
    <span className={toneClass(cfg.tone)} title={cfg.label}>
      {compact ? cfg.short : cfg.label}
    </span>
  );
}

export function recommendationText(level: RecommendationLevel): string {
  return RECOMMENDATION_CONFIG[level].label;
}

const SOURCE_KIND_CONFIG: Record<SourceKind, { label: string; tone: BadgeTone }> = {
  standard: { label: "Standard", tone: "green" },
  analysis: { label: "Analysis", tone: "neutral" },
  deployment: { label: "Deployment", tone: "purple" },
  benchmark: { label: "Benchmark", tone: "yellow" },
};

export function SourceKindBadge({ kind }: { kind: SourceKind }) {
  const cfg = SOURCE_KIND_CONFIG[kind];
  return (
    <span className={toneClass(cfg.tone)} title={cfg.label}>
      {cfg.label}
    </span>
  );
}

export function sourceKindLabel(kind: SourceKind): string {
  return SOURCE_KIND_CONFIG[kind].label;
}
