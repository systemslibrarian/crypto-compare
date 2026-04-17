"use client";

import Link from "next/link";
import { useState } from "react";
import { CRYPTO_STACKS, type CryptoStack } from "@/data/stacks";

function StackCard({ stack }: { stack: CryptoStack }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      id={stack.id}
      style={{
        background: "var(--color-bg-card)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "10px",
        padding: "22px 24px",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span style={{ fontSize: "24px" }} aria-hidden="true">{stack.icon}</span>
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            color: "var(--color-text-heading)",
          }}
        >
          {stack.name}
        </h3>
      </div>

      <p style={{ fontSize: "15px", color: "var(--color-text-body)", lineHeight: 1.7, margin: "0 0 16px" }}>
        {stack.description}
      </p>

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
          Primitives
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {stack.primitives.map((p) => (
            <div
              key={p.algorithmId}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              <Link
                href={`/?sel=${p.algorithmId}&from=stacks`}
                style={{
                  color: "var(--color-text-link)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  flexShrink: 0,
                }}
              >
                {p.name}
              </Link>
              <span style={{ color: "var(--color-text-muted)" }}>—</span>
              <span style={{ color: "var(--color-text-body)" }}>
                <strong style={{ color: "var(--color-text-secondary)" }}>{p.role}.</strong>{" "}
                {p.protectsAgainst}
              </span>
            </div>
          ))}
        </div>
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
        {expanded ? "Hide tradeoffs" : "Tradeoffs & alternatives"}
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
                color: "var(--color-badge-orange-text)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              Tradeoffs
            </div>
            <div style={{ color: "var(--color-text-body)" }}>{stack.tradeoffs}</div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-text-accent-bright)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              Consider alternatives when
            </div>
            <div style={{ color: "var(--color-text-body)" }}>{stack.alternativeWhen}</div>
          </div>

          {stack.hybridPatternIds && stack.hybridPatternIds.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--color-text-accent-bright)",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  marginBottom: "6px",
                }}
              >
                Related hybrid patterns
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {stack.hybridPatternIds.map((pid) => (
                  <span
                    key={pid}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                      background: "var(--color-badge-purple-bg, var(--color-bg-control))",
                      color: "var(--color-badge-purple-text, var(--color-text-body))",
                      border: "1px solid var(--color-badge-purple-border, var(--color-border-muted))",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {pid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StacksView() {
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
        Cryptographic Stacks
      </h1>
      <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "32px" }}>
        Complete algorithm stacks for real-world use cases. Each stack shows which primitives work together, what they protect against, and when to choose alternatives.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {CRYPTO_STACKS.map((stack) => (
          <StackCard key={stack.id} stack={stack} />
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
          Need to migrate from a legacy algorithm?
        </p>
        <Link
          href="/migrate"
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
          Migration Guide →
        </Link>
      </div>
    </div>
  );
}
