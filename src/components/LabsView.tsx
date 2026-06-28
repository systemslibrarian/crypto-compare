"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildLabIndex, categoryLabel } from "@/lib/labs";
import { CATEGORY_ACCENT } from "@/data/categories";
import type { AlgorithmCategory } from "@/types/crypto";

const LABS = buildLabIndex();
const CATALOG_URL = "https://crypto-lab.systemslibrarian.dev/";

// Categories that actually have at least one linked lab, in display order.
const LAB_CATEGORIES = Array.from(
  new Set(LABS.flatMap((lab) => lab.categories)),
).sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)));

export default function LabsView() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory | "all">("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return LABS.filter((lab) => {
      if (activeCategory !== "all" && !lab.categories.includes(activeCategory)) return false;
      if (!needle) return true;
      const haystack = [
        lab.title,
        lab.note,
        lab.slug,
        ...lab.algorithms.map((algorithm) => algorithm.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, activeCategory]);

  return (
    <div
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        minHeight: "100vh",
        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', -apple-system, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, #3b82f6 0%, #06b6d4 12%, #8b5cf6 24%, #f59e0b 36%, #10b981 48%, #ec4899 60%, #ef4444 72%, #6366f1 84%, #3b82f6 100%)",
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <header style={{ borderBottom: "1px solid var(--color-border)", padding: "20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  letterSpacing: "-0.5px",
                  color: "var(--color-text)",
                }}
              >
                <span style={{ color: "var(--color-accent-blue)" }}>◈ crypto</span>::compare
              </span>
            </Link>
            <Link
              href="/"
              style={{
                background: "var(--color-bg-control)",
                color: "var(--color-text-body)",
                border: "1px solid var(--color-border-muted)",
                borderRadius: "7px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              ← Algorithm Reference
            </Link>
          </div>
          <div style={{ marginTop: "14px" }}>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "26px",
                fontWeight: 700,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                letterSpacing: "-0.5px",
                color: "var(--color-text-heading)",
              }}
            >
              Interactive Labs
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              {LABS.length} hands-on crypto-lab demos linked from the algorithm reference — run them in the browser to
              see encryption, signatures, attacks, and post-quantum schemes in action.{" "}
              <a href={CATALOG_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-accent-bright)" }}>
                Full catalog ↗
              </a>
            </p>
          </div>
        </header>

        <main style={{ padding: "28px 0 64px" }}>
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="lab-search" className="srOnly" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Search labs
            </label>
            <input
              id="lab-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search labs by name, concept, or algorithm…"
              className="focusRing"
              style={{
                width: "100%",
                background: "var(--color-bg-control)",
                color: "var(--color-text-body)",
                border: "1px solid var(--color-border-muted)",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "15px",
                minHeight: "44px",
              }}
            />
          </div>

          <div role="group" aria-label="Filter labs by category" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            <CategoryChip label="All" active={activeCategory === "all"} accent="var(--color-accent-blue)" onClick={() => setActiveCategory("all")} />
            {LAB_CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={categoryLabel(category)}
                active={activeCategory === category}
                accent={CATEGORY_ACCENT[category]}
                onClick={() => setActiveCategory((current) => (current === category ? "all" : category))}
              />
            ))}
          </div>

          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--color-text-dim)" }} aria-live="polite">
            Showing {filtered.length} of {LABS.length} labs
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {filtered.map((lab) => {
              const accent = CATEGORY_ACCENT[lab.categories[0]] ?? "var(--color-accent-blue)";
              return (
                <a
                  key={lab.slug}
                  href={lab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focusRing"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border-subtle)",
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: "10px",
                    padding: "16px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "var(--color-text-heading)",
                    }}
                  >
                    {lab.title} <span aria-hidden="true" style={{ color: "var(--color-text-dim)" }}>↗</span>
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{lab.note}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "2px" }}>
                    {lab.categories.map((category) => (
                      <span
                        key={category}
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: CATEGORY_ACCENT[category],
                          border: `1px solid ${CATEGORY_ACCENT[category]}55`,
                          borderRadius: "999px",
                          padding: "2px 8px",
                        }}
                      >
                        {categoryLabel(category)}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--color-text-dim)", marginTop: "2px" }}>
                    Linked from {lab.algorithms.map((algorithm) => algorithm.name).join(", ")}
                  </span>
                </a>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p style={{ marginTop: "24px", color: "var(--color-text-muted)" }}>
              No labs match “{query}”. Try a broader term or clear the category filter.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="focusRing"
      style={{
        background: active ? `${accent}22` : "var(--color-bg-control)",
        color: active ? accent : "var(--color-text-secondary)",
        border: `1px solid ${active ? accent : "var(--color-border-muted)"}`,
        borderRadius: "999px",
        padding: "7px 14px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        minHeight: "36px",
      }}
    >
      {label}
    </button>
  );
}
