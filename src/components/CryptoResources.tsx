"use client";

import { RESOURCES, RESOURCE_CATEGORIES } from "@/data/resources";
import type { ResourceCategory } from "@/data/resources";
import { useState } from "react";

export default function CryptoResources() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");

  const filtered = activeCategory === "all" ? RESOURCES : RESOURCES.filter((r) => r.category === activeCategory);

  return (
    <div>
      {/* Category filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveCategory("all")}
          className="focusRing"
          style={{
            padding: "5px 12px",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            border: "1.5px solid",
            borderColor: activeCategory === "all" ? "var(--color-accent-blue)" : "var(--color-border)",
            borderRadius: "6px",
            background: activeCategory === "all" ? "var(--color-accent-blue)" : "transparent",
            color: activeCategory === "all" ? "#fff" : "var(--color-text-secondary)",
            cursor: "pointer",
          }}
        >
          All ({RESOURCES.length})
        </button>
        {RESOURCE_CATEGORIES.map((cat) => {
          const count = RESOURCES.filter((r) => r.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="focusRing"
              style={{
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                border: "1.5px solid",
                borderColor: activeCategory === cat.id ? "var(--color-accent-blue)" : "var(--color-border)",
                borderRadius: "6px",
                background: activeCategory === cat.id ? "var(--color-accent-blue)" : "transparent",
                color: activeCategory === cat.id ? "#fff" : "var(--color-text-secondary)",
                cursor: "pointer",
              }}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Resource cards grouped by category */}
      {RESOURCE_CATEGORIES.filter((cat) => activeCategory === "all" || activeCategory === cat.id).map((cat) => {
        const items = filtered.filter((r) => r.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id} style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--color-text-heading)",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                margin: "0 0 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span aria-hidden="true">{cat.icon}</span>
              {cat.label}
            </h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {items.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "14px 16px",
                    background: "var(--color-bg-card)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "8px",
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent-blue)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--color-text-link)",
                        fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                      }}
                    >
                      {resource.title}
                    </span>
                    {resource.tag && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: resource.tag === "Essential" ? "var(--color-badge-green-bg)" : "var(--color-bg-advisor)",
                          color: resource.tag === "Essential" ? "var(--color-badge-green-text)" : "var(--color-text-dim)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {resource.tag}
                      </span>
                    )}
                    <span style={{ fontSize: "11px", color: "var(--color-text-dim)", marginLeft: "auto" }}>↗</span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {resource.description}
                  </p>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-dim)",
                      marginTop: "6px",
                      fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    }}
                  >
                    {new URL(resource.url).hostname}
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
