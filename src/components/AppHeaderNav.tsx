"use client";

import Link from "next/link";
import type { Ref } from "react";
import type { AlgorithmCategory, CategoryDefinition } from "@/types/crypto";

type NavLink = { href: string; label: string; icon: string };

/** Site page links, shown in the slide-out menu (mirrors crypto-lab's nav). */
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
}: AppHeaderNavProps) {
  const selected = categories.find((category) => category.id === selectedCategory);

  return (
    <>
      <header className="siteHeader">
        <button type="button" className="focusRing siteBrand" onClick={onReset} aria-label="Back to main menu">
          <span className="brandMark" aria-hidden="true">◈</span>
          <span className="siteBrandText"><span className="siteBrandAccent">crypto</span>::compare</span>
        </button>

        <div className="siteHeaderActions">
          <a
            className="siteHeaderLink focusRing"
            href="https://github.com/systemslibrarian/crypto-compare"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <button
            type="button"
            className="focusRing menuBtn"
            onClick={onToggleMobileNav}
            aria-controls="site-menu"
            aria-expanded={mobileNavOpen}
          >
            <span aria-hidden="true">{mobileNavOpen ? "✕" : "☰"}</span>
            <span>Menu</span>
          </button>
        </div>
      </header>

      {mobileNavOpen && <div className="navMenuBackdrop" onClick={onCloseMobileNav} aria-hidden="true" />}

      <aside
        id="site-menu"
        ref={mobileNavRef}
        className={`navMenu ${mobileNavOpen ? "navMenuOpen" : ""}`}
        aria-label="Site navigation"
      >
        <div className="navMenuHead">
          <span className="navMenuTitle">Navigate</span>
          <button type="button" className="focusRing navMenuClose" onClick={onCloseMobileNav} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="navMenuSection">
          <span className="navMenuLabel">Categories</span>
          <div role="tablist" aria-label="Cryptography categories" className="navCategoryList">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className="focusRing navCategory"
                  onClick={() => onSelectCategory(category.id)}
                  style={isSelected ? { borderColor: categoryAccent[category.id], color: "var(--color-text-heading)" } : undefined}
                >
                  <span aria-hidden="true" className="navCategoryIcon">{category.icon}</span>
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="navMenuSection">
          <span className="navMenuLabel">Guides</span>
          <div className="navLinkList">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="focusRing navLink" onClick={onCloseMobileNav}>
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {selected ? (
        <p className="currentCategoryBar" aria-hidden="true">
          <span aria-hidden="true">{selected.icon}</span> {selected.label}
        </p>
      ) : null}
    </>
  );
}
