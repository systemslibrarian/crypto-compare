import type { ReactNode } from "react";
import { CATEGORY_ACCENT, CATEGORY_INFO } from "@/data/categories";
import type { AlgorithmCategory } from "@/types/crypto";

/**
 * Recognized phrases that refer to another category.
 * Sorted longest-first so the regex prefers the most-specific match.
 */
const CROSS_LINK_TERMS: [string, AlgorithmCategory][] = [
  ["Key derivation functions", "kdf"],
  ["threshold-signature systems", "threshold_sig"],
  ["key encapsulation (KEM)", "kem"],
  ["Shamir's secret sharing", "sharing"],
  ["Digital signatures", "signature"],
  ["Password hashing", "password"],
  ["AEAD ciphers", "symmetric"],
  ["MPC protocols", "mpc"],
  ["key exchange", "kem"],
  ["Key exchange", "kem"],
  ["zk-SNARK", "zkp"],
  ["zk systems", "zkp"],
  ["Signatures", "signature"],
  ["signatures", "signature"],
  ["KEM", "kem"],
  ["ZKP", "zkp"],
  ["MPC", "mpc"],
  ["HMAC", "mac"],
];

const TERM_MAP = new Map(CROSS_LINK_TERMS);
const CROSS_LINK_RE = new RegExp(
  "(" +
    CROSS_LINK_TERMS.map(([t]) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
    ")",
  "g",
);

function linkifyCategories(
  text: string,
  currentCategory: AlgorithmCategory,
  onNavigate: (cat: AlgorithmCategory) => void,
): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  CROSS_LINK_RE.lastIndex = 0;

  while ((match = CROSS_LINK_RE.exec(text)) !== null) {
    const targetCat = TERM_MAP.get(match[1]);
    if (!targetCat || targetCat === currentCategory) continue;

    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    const accent = CATEGORY_ACCENT[targetCat];
    parts.push(
      <button
        key={match.index}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(targetCat);
        }}
        style={{
          color: accent,
          background: "none",
          border: "none",
          borderBottom: `1px dashed ${accent}`,
          padding: 0,
          font: "inherit",
          cursor: "pointer",
          fontWeight: 700,
        }}
        aria-label={`Go to ${targetCat} category`}
      >
        {match[1]}
      </button>,
    );

    lastIndex = CROSS_LINK_RE.lastIndex;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

type CategoryExplainerProps = {
  category: AlgorithmCategory;
  expanded: boolean;
  onToggle: () => void;
  onNavigateCategory?: (cat: AlgorithmCategory) => void;
};

export default function CategoryExplainer({ category, expanded, onToggle, onNavigateCategory }: CategoryExplainerProps) {
  const info = CATEGORY_INFO[category];
  if (!info) {
    return null;
  }

  const renderText = (text: string) =>
    onNavigateCategory ? linkifyCategories(text, category, onNavigateCategory) : text;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--color-bg-panel-gradient-from) 0%, var(--color-bg-panel-gradient-to) 100%)",
        border: "1px solid var(--color-bg-panel-border)",
        borderRadius: "10px",
        padding: expanded ? "24px 28px" : "18px 22px",
        marginBottom: "16px",
        transition: "all 0.2s",
        cursor: expanded ? "default" : "pointer",
      }}
      onClick={() => {
        if (!expanded) {
          onToggle();
        }
      }}
      onKeyDown={(e) => {
        if (!expanded && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle();
        }
      }}
      role={expanded ? undefined : "button"}
      tabIndex={expanded ? undefined : 0}
      aria-label={expanded ? undefined : `Expand ${info.title} details`}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-heading)", marginBottom: "6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
            {info.title}
          </div>
          <div style={{ fontSize: "16px", color: "var(--color-text-caption)", lineHeight: "1.7", fontStyle: "italic" }}>{info.oneLiner}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="focusRing"
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${info.title} details` : `Expand ${info.title} details`}
          style={{
            background: expanded ? "var(--color-border-header)" : "var(--color-bg-surface)",
            color: expanded ? "var(--color-text-accent-bright)" : "var(--color-text-muted)",
            border: `1px solid ${expanded ? "var(--color-border-accent)" : "var(--color-border-header)"}`,
            padding: "12px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.15s",
            minHeight: "44px",
          }}
        >
          {expanded ? "v Less" : "> Learn more"}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--color-accent-blue-label)",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              What it does
            </div>
            <div style={{ fontSize: "16px", color: "var(--color-text)", lineHeight: "1.85" }}>{renderText(info.explanation)}</div>
          </div>

          <div style={{ background: "var(--color-bg-card)", borderRadius: "8px", padding: "16px 18px", borderLeft: "3px solid var(--color-accent-blue)" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--color-text-accent-bright)",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Where you see it in the real world
            </div>
            <div style={{ fontSize: "16px", color: "var(--color-text-caption)", lineHeight: "1.85" }}>{renderText(info.realWorld)}</div>
          </div>

          <div
            style={{
              background: "linear-gradient(90deg, var(--color-accent-blue-tint) 0%, transparent 100%)",
              borderRadius: "8px",
              padding: "14px 18px",
              borderLeft: "3px solid var(--color-badge-yellow-text)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--color-accent-yellow-label)",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Why it matters
            </div>
            <div style={{ fontSize: "16px", color: "var(--color-accent-yellow-body)", lineHeight: "1.85", fontWeight: 600 }}>{renderText(info.whyItMatters)}</div>
          </div>

          <div
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "8px",
              padding: "16px 18px",
              borderLeft: info.projects.length > 0 ? "3px solid var(--color-badge-green-text)" : "3px solid var(--color-badge-red-text)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: info.projects.length > 0 ? "var(--color-accent-green-label)" : "var(--color-accent-red-label)",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {info.projects.length > 0 ? "Your projects using this" : "Not yet in your portfolio"}
            </div>

            {info.projects.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {info.projects.map((project) => (
                  <div
                    key={`${project.name}-${project.tech}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "8px 10px",
                      background: "var(--color-bg-inset)",
                      borderRadius: "6px",
                      border: "1px solid var(--color-border-interactive)",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: "4px",
                        background: project.public ? "var(--color-dot-public)" : "var(--color-dot-private)",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-text-accent-bright)", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", textDecoration: "none" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.textDecoration = "none";
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {project.name}
                          </a>
                        ) : (
                          <span style={{ color: "var(--color-text-muted)", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                            {project.name}
                          </span>
                        )}
                        <span
                          style={{
                            background: project.public ? "var(--color-badge-green-bg)" : "var(--color-badge-yellow-bg)",
                            color: project.public ? "var(--color-badge-green-text)" : "var(--color-badge-yellow-text)",
                            border: `1px solid ${project.public ? "var(--color-badge-green-border)" : "var(--color-badge-yellow-border)"}`,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          {project.public ? "PUBLIC" : "PRIVATE"}
                        </span>
                        {project.app && (
                          <a
                            href={project.app.startsWith("http") ? project.app : `https://${project.app}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "var(--color-badge-purple-text)",
                              fontSize: "12px",
                              fontWeight: 700,
                              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                              textDecoration: "none",
                              background: "var(--color-badge-purple-bg)",
                              border: "1px solid var(--color-border-app)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.textDecoration = "none";
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            ↗ {project.app}
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: "14px", color: "var(--color-text-label)", marginTop: "4px" }}>{project.tech}</div>
                      {project.note && <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px", fontStyle: "italic" }}>{project.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {info.projectIdea && (
                  <div style={{ padding: "10px 12px", background: "var(--color-bg-inset)", borderRadius: "6px", border: "1px dashed var(--color-border-dashed)" }}>
                    <div style={{ fontSize: "13px", color: "var(--color-accent-red-label)", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                      Project idea
                    </div>
                    <div style={{ fontSize: "15px", color: "var(--color-accent-red-body)", lineHeight: "1.75" }}>{info.projectIdea}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
