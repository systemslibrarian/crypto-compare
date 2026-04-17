"use client";

import Link from "next/link";
import { useState } from "react";
import { MIGRATION_PATHS, type MigrationPath } from "@/data/migrations";

const PRIORITY_STYLES: Record<MigrationPath["priority"], { bg: string; text: string; border: string; label: string }> = {
  critical: {
    bg: "var(--color-badge-red-bg, #3a1010)",
    text: "var(--color-badge-red-text, #ff6b6b)",
    border: "var(--color-badge-red-border, #6b2020)",
    label: "CRITICAL",
  },
  high: {
    bg: "var(--color-badge-orange-bg, #3a2a10)",
    text: "var(--color-badge-orange-text, #ffaa44)",
    border: "var(--color-badge-orange-border, #6b4020)",
    label: "HIGH",
  },
  medium: {
    bg: "var(--color-badge-yellow-bg, var(--color-bg-warning))",
    text: "var(--color-badge-yellow-text)",
    border: "var(--color-badge-yellow-border)",
    label: "MEDIUM",
  },
};

function MigrationCard({ path }: { path: MigrationPath }) {
  const [expanded, setExpanded] = useState(false);
  const style = PRIORITY_STYLES[path.priority];

  return (
    <div
      id={path.id}
      style={{
        background: "var(--color-bg-card)",
        border: "1.5px solid var(--color-border)",
        borderLeft: `3px solid ${style.text}`,
        borderRadius: "10px",
        padding: "22px 24px",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            background: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {style.label}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            color: "var(--color-text-heading)",
          }}
        >
          {path.from} → {path.to}
        </h3>
      </div>

      <div style={{ fontSize: "15px", color: "var(--color-text-body)", lineHeight: 1.7, marginBottom: "14px" }}>
        <strong style={{ color: "var(--color-text-accent-bright)" }}>Why migrate: </strong>
        {path.whyMigrate}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        <Link
          href={`/?sel=${path.toAlgorithmId}&from=migrate`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "var(--color-badge-green-bg)",
            color: "var(--color-badge-green-text)",
            border: "1px solid var(--color-badge-green-border)",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            textDecoration: "none",
          }}
        >
          View {path.to} →
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="focusRing"
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-link)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 700,
          padding: "4px 0",
          marginBottom: expanded ? "12px" : "0",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: "12px",
            display: "inline-block",
            transition: "transform 0.15s",
            transform: expanded ? "rotate(90deg)" : "none",
            marginRight: "6px",
          }}
        >
          ▶
        </span>
        {expanded ? "Hide details" : "Risk, steps & pitfalls"}
      </button>

      {expanded && (
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid var(--color-border)",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: style.text,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              Risk of staying
            </div>
            <div style={{ color: "var(--color-text-body)" }}>{path.riskOfStaying}</div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-text-accent-bright)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "8px",
              }}
            >
              Safe upgrade path
            </div>
            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {path.safeUpgradePath.map((step, i) => (
                <li key={i} style={{ color: "var(--color-text-body)" }}>{step}</li>
              ))}
            </ol>
          </div>

          <div
            style={{
              padding: "12px 14px",
              background: "var(--color-bg-warning)",
              border: "1px solid var(--color-badge-yellow-border)",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-badge-yellow-text)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              ⚠ Migration pitfall
            </div>
            <div style={{ color: "var(--color-text-warning, var(--color-text-body))", fontSize: "13px" }}>
              {path.migrationPitfall}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MigrateView() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
      <Link
        href="/"
        style={{ fontSize: "14px", color: "var(--color-text-link)", textDecoration: "none", marginBottom: "24px", display: "inline-block" }}
      >
        ← Back to main
      </Link>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          color: "var(--color-text-heading)",
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}
      >
        Migration Guide
      </h1>
      <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "32px" }}>
        Step-by-step migration paths from legacy or broken algorithms to modern replacements. Ordered by priority — critical migrations first.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {MIGRATION_PATHS.map((path) => (
          <MigrationCard key={path.id} path={path} />
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px 24px",
          background: "var(--color-bg-card)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "15px", color: "var(--color-text-body)", margin: "0 0 12px" }}>
          See how these algorithms fit into complete stacks.
        </p>
        <Link
          href="/stacks"
          className="focusRing"
          style={{
            display: "inline-block",
            background: "var(--color-button-primary)",
            color: "var(--color-button-primary-text)",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            textDecoration: "none",
          }}
        >
          View Stacks →
        </Link>
      </div>
    </div>
  );
}
