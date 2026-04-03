import Link from "next/link";
import type { Ref } from "react";
import type { AlgorithmCategory, CategoryDefinition } from "@/types/crypto";

type AppHeaderNavProps = {
  categories: CategoryDefinition[];
  categoryAccent: Record<AlgorithmCategory, string>;
  selectedCategory: AlgorithmCategory;
  advanced: boolean;
  mobileNavOpen: boolean;
  mobileNavRef: Ref<HTMLElement>;
  onReset: () => void;
  onToggleAdvanced: () => void;
  onToggleMobileNav: () => void;
  onCloseMobileNav: () => void;
  onSelectCategory: (category: AlgorithmCategory) => void;
};

export default function AppHeaderNav({
  categories,
  categoryAccent,
  selectedCategory,
  advanced,
  mobileNavOpen,
  mobileNavRef,
  onReset,
  onToggleAdvanced,
  onToggleMobileNav,
  onCloseMobileNav,
  onSelectCategory,
}: AppHeaderNavProps) {
  const selected = categories.find((category) => category.id === selectedCategory);

  return (
    <>
      <header style={{ borderBottom: "1px solid #111827", padding: "22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={onReset}
                className="focusRing"
                aria-label="Back to main menu"
                style={{
                  margin: 0,
                  padding: 0,
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  font: "inherit",
                  letterSpacing: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <span className="brandMark" aria-hidden="true">◈</span>
                <span><span style={{ color: "#3b82f6" }}>crypto</span>::compare</span>
              </button>
            </h1>
            <p className="headerSubtitle" style={{ margin: "6px 0 0", fontSize: "16px", color: "#c4d1e3" }}>International cryptographic algorithm reference across 16 categories.</p>
          </div>
          <div className="headerActions" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="headerLegend" style={{ fontSize: "14px", color: "#c4d1e3", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>C = Classical, PQ = Post-Quantum</span>
            <Link
              href="/visuals"
              className="headerBtn desktopOnly focusRing"
              style={{
                background: "#0e1420",
                color: "#d4deea",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                textDecoration: "none",
              }}
            >
              Visual Guide
            </Link>
            <button
              onClick={onToggleAdvanced}
              aria-pressed={advanced}
              className="focusRing headerBtn desktopOnly"
              style={{
                background: advanced ? "#11203a" : "#0e1420",
                color: advanced ? "#7dd3fc" : "#d4deea",
                border: `1px solid ${advanced ? "#163052" : "#334155"}`,
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              {advanced ? "Advanced" : "Beginner"}
            </button>
            <button
              className="focusRing mobileMenuBtn"
              onClick={onToggleMobileNav}
              aria-label="Toggle category menu"
              aria-expanded={mobileNavOpen}
              style={{
                display: "none",
                background: mobileNavOpen ? "#1d4ed8" : "#0e1420",
                color: mobileNavOpen ? "#fff" : "#d4deea",
                border: `1px solid ${mobileNavOpen ? "#2563eb" : "#334155"}`,
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "15px",
                cursor: "pointer",
                minWidth: "44px",
                minHeight: "44px",
                gap: "6px",
                fontWeight: 700,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              <span aria-hidden="true">{mobileNavOpen ? "✕" : "☰"}</span>
              <span className="mobileMenuLabel">{selected?.icon} {selected?.label}</span>
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div
          className="mobileNavBackdrop"
          onClick={onCloseMobileNav}
          aria-hidden="true"
        />
      )}
      <nav ref={mobileNavRef} aria-label="Cryptography categories" role="tablist" className={`categoryNav ${mobileNavOpen ? "mobileNavOpen" : ""}`} style={{ display: "flex", gap: 0, borderBottom: "1px solid #111827", overflowX: "auto", WebkitOverflowScrolling: "touch", position: "sticky", top: 0, zIndex: 10, background: "#070b12" }}>
        <div className="mobileNavActions">
          <Link
            href="/visuals"
            className="focusRing mobileNavActionBtn"
            onClick={onCloseMobileNav}
            style={{ textDecoration: "none" }}
          >
            📊 Visual Guide
          </Link>
          <button
            onClick={() => {
              onToggleAdvanced();
              onCloseMobileNav();
            }}
            className="focusRing mobileNavActionBtn"
            aria-pressed={advanced}
            style={{
              background: advanced ? "#1e3a5f" : undefined,
              color: advanced ? "#7dd3fc" : undefined,
            }}
          >
            {advanced ? "⚙️ Advanced mode" : "📖 Beginner mode"}
          </button>
        </div>
        {categories.map((category) => {
          const accent = categoryAccent[category.id];
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              role="tab"
              aria-selected={selectedCategory === category.id}
              className="focusRing categoryTab"
              style={{
                background: "transparent",
                color: selectedCategory === category.id ? "#f8fafc" : "#c4d1e3",
                border: "none",
                borderBottom: selectedCategory === category.id ? `2px solid ${accent}` : "2px solid transparent",
                padding: "14px 18px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: selectedCategory === category.id ? 700 : 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              <span aria-hidden="true" style={{ marginRight: "4px" }}>
                {category.icon}
              </span>
              {category.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}