"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type Ref } from "react";
import type { AlgorithmCategory, CategoryDefinition } from "@/types/crypto";

type NavLink = { href: string; label: string; icon: string };

/** Single source of truth for the site's page navigation. */
const NAV_LINKS: NavLink[] = [
  { href: "/safe-defaults", label: "Safe Defaults", icon: "🛡️" },
  { href: "/advisor", label: "Advisor", icon: "🧭" },
  { href: "/stacks", label: "Stacks", icon: "🧱" },
  { href: "/migrate", label: "Migrate", icon: "🔄" },
  { href: "/implementations", label: "Implementations", icon: "🔧" },
  { href: "/checklist", label: "Checklist", icon: "✅" },
  { href: "/visuals", label: "Visual Guide", icon: "📊" },
  { href: "/labs", label: "Labs", icon: "🧪" },
  { href: "/about", label: "About", icon: "ℹ️" },
];

type AppHeaderNavProps = {
  categories: CategoryDefinition[];
  categoryAccent: Record<AlgorithmCategory, string>;
  selectedCategory: AlgorithmCategory;
  mobileNavOpen: boolean;
  mobileNavRef: Ref<HTMLElement>;
  onReset: () => void;
  onToggleMobileNav: () => void;
  onCloseMobileNav: () => void;
  onSelectCategory: (category: AlgorithmCategory) => void;
  onShowDefaults?: () => void;
  onShowSafeUsage?: () => void;
  onToggleMethodology?: () => void;
};

export default function AppHeaderNav({
  categories,
  categoryAccent,
  selectedCategory,
  mobileNavOpen,
  mobileNavRef,
  onReset,
  onToggleMobileNav,
  onCloseMobileNav,
  onSelectCategory,
  onShowDefaults,
  onShowSafeUsage,
  onToggleMethodology,
}: AppHeaderNavProps) {
  const selected = categories.find((category) => category.id === selectedCategory);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the desktop menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="headerShell" style={{ borderBottom: "1px solid var(--color-border-subtle)", padding: "22px 0" }}>
        <div className="headerRow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div className="headerBrandBlock">
            <h1 className="headerTitle" style={{ margin: 0, fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={onReset}
                className="focusRing headerBrandButton"
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
                <span><span style={{ color: "var(--color-accent-blue)" }}>crypto</span>::compare</span>
              </button>
            </h1>
            <p className="headerSubtitle" style={{ margin: "6px 0 0", fontSize: "16px", color: "var(--color-text-secondary)" }}>International cryptographic algorithm reference across 17 categories.</p>
          </div>
          <div className="headerActions" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="headerLegend" style={{ fontSize: "14px", color: "var(--color-text-secondary)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>C = Classical, PQ = Post-Quantum</span>
            <div className="headerMenu desktopOnly" ref={menuRef} style={{ position: "relative" }}>
              <button
                type="button"
                className="focusRing headerBtn"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                style={{
                  background: menuOpen ? "var(--color-button-primary)" : "var(--color-bg-control)",
                  color: menuOpen ? "var(--color-button-primary-text)" : "var(--color-text-body)",
                  border: `1px solid ${menuOpen ? "var(--color-button-primary-hover)" : "var(--color-border-muted)"}`,
                  borderRadius: "6px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  cursor: "pointer",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Menu <span aria-hidden="true" style={{ fontSize: "11px" }}>{menuOpen ? "▲" : "▼"}</span>
              </button>
              {menuOpen && (
                <div role="menu" className="headerMenuPanel">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="focusRing headerMenuItem"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span aria-hidden="true">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button
              className="focusRing mobileMenuBtn"
              onClick={onToggleMobileNav}
              aria-label="Toggle category menu"
              aria-expanded={mobileNavOpen}
              style={{
                background: mobileNavOpen ? "var(--color-button-primary)" : "var(--color-bg-control)",
                color: mobileNavOpen ? "var(--color-button-primary-text)" : "var(--color-text-body)",
                border: `1px solid ${mobileNavOpen ? "var(--color-button-primary-hover)" : "var(--color-border-muted)"}`,                borderRadius: "6px",
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
      <nav ref={mobileNavRef} aria-label="Cryptography categories" role="tablist" className={`categoryNav ${mobileNavOpen ? "mobileNavOpen" : ""}`} style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--color-border-subtle)", position: "sticky", top: 0, zIndex: 10, background: "var(--color-bg)" }}>
        <div className="mobileNavActions" aria-hidden={!mobileNavOpen} hidden={!mobileNavOpen}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focusRing mobileNavActionBtn"
              onClick={onCloseMobileNav}
              style={{ textDecoration: "none" }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {onShowDefaults && (
            <button
              onClick={() => { onShowDefaults(); onCloseMobileNav(); }}
              className="focusRing mobileNavActionBtn"
            >
              ✅ Safe defaults
            </button>
          )}
          {onToggleMethodology && (
            <button
              onClick={() => { onToggleMethodology(); onCloseMobileNav(); }}
              className="focusRing mobileNavActionBtn"
            >
              📊 Trust model
            </button>
          )}
          {onShowSafeUsage && (
            <button
              onClick={() => { onShowSafeUsage(); onCloseMobileNav(); }}
              className="focusRing mobileNavActionBtn"
            >
              ⚠️ Safe usage
            </button>
          )}
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
                color: selectedCategory === category.id ? "var(--color-text-heading)" : "var(--color-text-secondary)",
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
