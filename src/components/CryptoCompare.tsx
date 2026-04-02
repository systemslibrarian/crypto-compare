"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AlgoCard from "@/components/AlgoCard";
import CategoryExplainer from "@/components/CategoryExplainer";
import ComparisonTable from "@/components/ComparisonTable";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES, CATEGORY_ACCENT } from "@/data/categories";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
import { HYBRID_PATTERNS } from "@/data/hybridPatterns";
import { buildRows, exportToCSV, exportToMarkdown } from "@/lib/comparison";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { validateAlgorithms } from "@/lib/validation";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";
import { SourceKindBadge } from "@/components/ui";

const SORT_OPTIONS = [
  { id: "name", label: "Name" },
  { id: "security", label: "Classical Security" },
  { id: "pq", label: "PQ Security" },
  { id: "publicKey", label: "Public Key Size" },
  { id: "signature", label: "Signature Size" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["id"];

const COUNTRY_OPTIONS = ["all", "Korea", "USA", "Europe", "Japan", "China", "Russia", "Ukraine"] as const;
type CountryFilter = (typeof COUNTRY_OPTIONS)[number];

function getSizeMetric(algo: Algorithm, key: "publicKey" | "signature"): number {
  if (key === "publicKey" && "publicKeySize" in algo && typeof algo.publicKeySize === "number") {
    return algo.publicKeySize;
  }
  if (key === "signature" && "signatureSize" in algo && typeof algo.signatureSize === "number") {
    return algo.signatureSize;
  }
  return Number.MAX_SAFE_INTEGER;
}

function deriveCountryTag(origin: string): CountryFilter {
  const text = origin.toLowerCase();
  if (text.includes("korea")) return "Korea";
  if (text.includes("united states") || text.includes("us/")) return "USA";
  if (text.includes("japan")) return "Japan";
  if (text.includes("china")) return "China";
  if (text.includes("russia")) return "Russia";
  if (text.includes("ukraine")) return "Ukraine";
  if (text.includes("europe") || text.includes("france") || text.includes("belgium") || text.includes("switzerland")) return "Europe";
  return "all";
}

function withProvenance(algorithms: Algorithm[]): Algorithm[] {
  return algorithms.map((algo) => {
    const traced = ALGORITHM_PROVENANCE[algo.id];
    return {
      ...algo,
      sources: traced?.sources,
      lastReviewed: traced?.lastReviewed,
      standardized: algo.status === "standard",
      nistStandardized: algo.statusLabel.includes("NIST") || algo.statusLabel.includes("FIPS"),
      widelyDeployed: /deployed|widely|ubiquitous|default/i.test(`${algo.statusLabel} ${algo.notes}`),
      countryTag: deriveCountryTag(algo.origin),
    };
  });
}

export default function CryptoCompare() {
  const dataset = useMemo(() => withProvenance(ALGORITHMS), []);
  const searchRef = useRef<HTMLInputElement>(null);

  const [cat, setCat] = useState<AlgorithmCategory>("symmetric");
  const [adv, setAdv] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [cmp, setCmp] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [pqOnly, setPqOnly] = useState(false);
  const [standardOnly, setStandardOnly] = useState(false);
  const [nistOnly, setNistOnly] = useState(false);
  const [deployedOnly, setDeployedOnly] = useState(false);
  const [country, setCountry] = useState<CountryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [showMethodology, setShowMethodology] = useState(false);
  const [showHybrid, setShowHybrid] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favOnly, setFavOnly] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const validationErrors = validateAlgorithms(dataset);
    if (validationErrors.length > 0) {
      console.warn("Algorithm validation issues", validationErrors);
    }
  }, [dataset]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("crypto-compare-favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);



  // Persist favorites
  useEffect(() => {
    try { localStorage.setItem("crypto-compare-favorites", JSON.stringify(favorites)); } catch { /* ignore */ }
  }, [favorites]);



  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("cat") as AlgorithmCategory | null;
    const selectedParam = params.get("sel");
    const countryParam = params.get("country") as CountryFilter | null;
    const sortParam = params.get("sort") as SortOption | null;

    if (catParam && CATEGORIES.some((c) => c.id === catParam)) setCat(catParam);
    if (selectedParam) setSel(selectedParam.split(",").filter(Boolean));
    if (params.get("adv") === "1") setAdv(true);
    if (params.get("cmp") === "1") setCmp(true);
    if (params.get("q")) setSearch(params.get("q") || "");
    if (params.get("pq") === "1") setPqOnly(true);
    if (params.get("std") === "1") setStandardOnly(true);
    if (params.get("nist") === "1") setNistOnly(true);
    if (params.get("dep") === "1") setDeployedOnly(true);
    if (countryParam && COUNTRY_OPTIONS.includes(countryParam)) setCountry(countryParam);
    if (sortParam && SORT_OPTIONS.some((opt) => opt.id === sortParam)) setSortBy(sortParam);
    if (params.get("defaults") === "1") setShowDefaults(true);
    if (params.get("fav") === "1") setFavOnly(true);

    // Algorithm permalink — auto-navigate to correct category and select
    const algoParam = params.get("algo");
    if (algoParam) {
      const algo = ALGORITHMS.find((a) => a.id === algoParam);
      if (algo) {
        setCat(algo.category);
        setSel([algo.id]);
        setTimeout(() => {
          const el = document.getElementById(`algo-${algo.id}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("cat", cat);
    if (adv) params.set("adv", "1");
    if (cmp && sel.length >= 2) params.set("cmp", "1");
    if (sel.length > 0) params.set("sel", sel.join(","));
    if (search) params.set("q", search);
    if (pqOnly) params.set("pq", "1");
    if (standardOnly) params.set("std", "1");
    if (nistOnly) params.set("nist", "1");
    if (deployedOnly) params.set("dep", "1");
    if (country !== "all") params.set("country", country);
    if (sortBy !== "name") params.set("sort", sortBy);
    if (showDefaults) params.set("defaults", "1");
    if (favOnly) params.set("fav", "1");
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [cat, adv, cmp, sel, search, pqOnly, standardOnly, nistOnly, deployedOnly, country, sortBy, showDefaults, favOnly]);

  const filtered = useMemo(() => {
    let items = globalSearch ? [...dataset] : dataset.filter((a) => a.category === cat);

    if (showDefaults) {
      const recommended = new Set(["xchacha20poly", "aes256gcm", "mlkem768", "mldsa65", "argon2id", "hmac_sha256", "kmac256"]);
      items = items.filter((a) => recommended.has(a.id));
    }

    if (favOnly && favorites.length > 0) {
      items = items.filter((a) => favorites.includes(a.id));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((a) => `${a.name} ${a.family} ${a.useCases} ${a.origin} ${a.statusLabel} ${a.category}`.toLowerCase().includes(q));
    }

    if (pqOnly) items = items.filter((a) => a.pqSecurityBits >= 128);
    if (standardOnly) items = items.filter((a) => a.standardized);
    if (nistOnly) items = items.filter((a) => a.nistStandardized);
    if (deployedOnly) items = items.filter((a) => a.widelyDeployed);
    if (country !== "all") items = items.filter((a) => a.countryTag === country);

    const sorted = [...items];
    sorted.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "security") return b.securityBits - a.securityBits;
      if (sortBy === "pq") return b.pqSecurityBits - a.pqSecurityBits;
      if (sortBy === "publicKey") return getSizeMetric(a, "publicKey") - getSizeMetric(b, "publicKey");
      return getSizeMetric(a, "signature") - getSizeMetric(b, "signature");
    });

    return sorted;
  }, [dataset, cat, search, pqOnly, standardOnly, nistOnly, deployedOnly, country, sortBy, showDefaults, globalSearch, favOnly, favorites]);

  const selAlgos = useMemo(() => filtered.filter((a) => sel.includes(a.id)), [filtered, sel]);
  const rows = useMemo(() => buildRows(cat, adv), [cat, adv]);

  const selectedCategoryLabel = CATEGORIES.find((c) => c.id === cat)?.label || cat;

  const toggle = (id: string) => {
    setSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setCmp(false);
  };

  const switchCat = (newCategory: AlgorithmCategory) => {
    setCat(newCategory);
    setSel([]);
    setCmp(false);
    setExplainerOpen(true);
  };

  const copyComparisonLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      console.warn("Clipboard unavailable; copy URL manually", url);
    }
  };

  const kbHandlers = useMemo(
    () => ({
      onFocusSearch: () => searchRef.current?.focus(),
      onToggleAdvanced: () => setAdv((v) => !v),
      onToggleMethodology: () => setShowMethodology((v) => !v),
      onEscape: () => {
        setShowMethodology(false);
        setCmp(false);
      },
      onNextCategory: () => {
        const idx = CATEGORIES.findIndex((c) => c.id === cat);
        if (idx < CATEGORIES.length - 1) switchCat(CATEGORIES[idx + 1].id);
      },
      onPrevCategory: () => {
        const idx = CATEGORIES.findIndex((c) => c.id === cat);
        if (idx > 0) switchCat(CATEGORIES[idx - 1].id);
      },
    }),
    [cat],
  );
  useKeyboardShortcuts(kbHandlers);

  const exportComparison = useCallback(
    (format: "csv" | "markdown") => {
      if (selAlgos.length < 2) return;
      if (format === "csv") {
        downloadText(exportToCSV(rows, selAlgos), "comparison.csv", "text/csv");
      } else {
        downloadText(exportToMarkdown(rows, selAlgos), "comparison.md", "text/markdown");
      }
    },
    [selAlgos, rows],
  );

  const resetToMainMenu = () => {
    setCat("symmetric");
    setAdv(false);
    setSel([]);
    setCmp(false);
    setExplainerOpen(true);
    setSearch("");
    setPqOnly(false);
    setStandardOnly(false);
    setNistOnly(false);
    setDeployedOnly(false);
    setCountry("all");
    setSortBy("name");
    setShowMethodology(false);
    setShowHybrid(false);
    setShowDefaults(false);
    setShowFilters(false);
    setGlobalSearch(false);
    setFavOnly(false);
    setMobileNavOpen(false);
    window.history.replaceState({}, "", window.location.pathname);
  };

  function downloadText(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ background: "#070b12", color: "#e2e8f0", minHeight: "100vh", fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', -apple-system, sans-serif", lineHeight: 1.6 }}>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <div className="headerGradientBar" aria-hidden="true" />
      <div className="pageShell">
        <header style={{ borderBottom: "1px solid #111827", padding: "22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={resetToMainMenu}
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
              <p className="headerSubtitle" style={{ margin: "6px 0 0", fontSize: "16px", color: "#c4d1e3" }}>International cryptographic algorithm reference across 12 categories.</p>
            </div>
            <div className="headerActions" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span className="headerLegend" style={{ fontSize: "14px", color: "#c4d1e3", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>C = Classical, PQ = Post-Quantum</span>
              <Link
                href="/visuals"
                className="headerBtn focusRing"
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
                onClick={() => setAdv(!adv)}
                aria-pressed={adv}
                className="focusRing headerBtn"
                style={{
                  background: adv ? "#11203a" : "#0e1420",
                  color: adv ? "#7dd3fc" : "#d4deea",
                  border: `1px solid ${adv ? "#163052" : "#334155"}`,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                }}
              >
                {adv ? "Advanced" : "Beginner"}
              </button>
              <button
                className="focusRing mobileMenuBtn"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-label="Toggle category menu"
                aria-expanded={mobileNavOpen}
                style={{
                  display: "none",
                  background: "#0e1420",
                  color: "#d4deea",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "18px",
                  cursor: "pointer",
                  minWidth: "44px",
                  minHeight: "44px",
                }}
              >
                {mobileNavOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </header>

        <nav aria-label="Cryptography categories" role="tablist" className={`categoryNav ${mobileNavOpen ? "mobileNavOpen" : ""}`} style={{ display: "flex", gap: 0, borderBottom: "1px solid #111827", overflowX: "auto", WebkitOverflowScrolling: "touch", position: "sticky", top: 0, zIndex: 10, background: "#070b12" }}>
          {CATEGORIES.map((c) => {
            const accent = CATEGORY_ACCENT[c.id];
            return (
              <button
                key={c.id}
                onClick={() => { switchCat(c.id); setMobileNavOpen(false); setGlobalSearch(false); }}
                role="tab"
                aria-selected={cat === c.id}
                className="focusRing categoryTab"
                style={{
                  background: "transparent",
                  color: cat === c.id ? "#f8fafc" : "#c4d1e3",
                  border: "none",
                  borderBottom: cat === c.id ? `2px solid ${accent}` : "2px solid transparent",
                  padding: "14px 18px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: cat === c.id ? 700 : 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                <span aria-hidden="true" style={{ marginRight: "4px" }}>
                  {c.icon}
                </span>
                {c.label}
              </button>
            );
          })}
        </nav>

        <main id="main-content" aria-label={`${globalSearch ? "All categories" : selectedCategoryLabel} algorithms`} style={{ padding: "20px 0 28px" }}>
          <div role="search" aria-label="Filter and search algorithms" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: showFilters ? "8px" : "12px" }}>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={globalSearch ? "Search all categories…" : `Search within ${selectedCategoryLabel}`}
              aria-label="Search algorithms"
              className="focusRing searchInput"
              style={{
                background: "#0c1422",
                color: "#e2e8f0",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "12px 14px",
                minWidth: "220px",
                flex: "1 1 220px",
                fontSize: "16px",
                minHeight: "44px",
              }}
            />
            <button
              className={`focusRing controlBtn ${globalSearch ? "controlBtnActive" : ""}`}
              onClick={() => setGlobalSearch(!globalSearch)}
              aria-pressed={globalSearch}
              title="Search across all categories"
            >
              {globalSearch ? "🌐 All" : "🌐"}
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="focusRing controlSelect" aria-label="Sort algorithms">
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
            <button className="focusRing controlBtn" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-label={`${showFilters ? "Hide" : "Show"} filter options${(pqOnly || standardOnly || nistOnly || deployedOnly || showDefaults || country !== "all" || favOnly) ? " (active)" : ""}`}>
              {showFilters ? "▾" : "▸"} Filters{(pqOnly || standardOnly || nistOnly || deployedOnly || showDefaults || country !== "all" || favOnly) ? " ●" : ""}
            </button>
            <button className="focusRing controlBtn" onClick={() => setShowMethodology(!showMethodology)} aria-expanded={showMethodology} aria-label={`${showMethodology ? "Hide" : "Show"} methodology and trust model`}>
              How to read this site
            </button>
          </div>

          {showFilters && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
              <select value={country} onChange={(e) => setCountry(e.target.value as CountryFilter)} className="focusRing controlSelect" aria-label="Filter by origin region">
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    Origin: {option}
                  </option>
                ))}
              </select>
              <button className={`focusRing controlBtn ${pqOnly ? "controlBtnActive" : ""}`} onClick={() => setPqOnly(!pqOnly)} aria-pressed={pqOnly} aria-label={pqOnly ? "PQ-safe filter active — click to show all" : "Show only PQ-safe algorithms"}>
                PQ-safe only
              </button>
              <button className={`focusRing controlBtn ${standardOnly ? "controlBtnActive" : ""}`} onClick={() => setStandardOnly(!standardOnly)} aria-pressed={standardOnly} aria-label={standardOnly ? "Standards filter active — click to show all" : "Show only standardized algorithms"}>
                Standards only
              </button>
              <button className={`focusRing controlBtn ${nistOnly ? "controlBtnActive" : ""}`} onClick={() => setNistOnly(!nistOnly)} aria-pressed={nistOnly} aria-label={nistOnly ? "NIST filter active — click to show all" : "Show only NIST-standardized algorithms"}>
                NIST only
              </button>
              <button className={`focusRing controlBtn ${deployedOnly ? "controlBtnActive" : ""}`} onClick={() => setDeployedOnly(!deployedOnly)} aria-pressed={deployedOnly} aria-label={deployedOnly ? "Deployed filter active — click to show all" : "Show only widely deployed algorithms"}>
                Widely deployed
              </button>
              <button className={`focusRing controlBtn ${showDefaults ? "controlBtnActive" : ""}`} onClick={() => setShowDefaults(!showDefaults)} aria-pressed={showDefaults} aria-label={showDefaults ? "Showing recommended defaults — click to show all" : "Show only recommended default algorithms"}>
                Recommended defaults
              </button>
              <button className={`focusRing controlBtn ${favOnly ? "controlBtnActive" : ""}`} onClick={() => setFavOnly(!favOnly)} aria-pressed={favOnly} aria-label={favOnly ? "Showing favorites only — click to show all" : "Show only favorited algorithms"}>
                ★ Favorites{favorites.length > 0 ? ` (${favorites.length})` : ""}
              </button>
            </div>
          )}

          {showMethodology && (
            <section className="panel-inner" style={{ marginBottom: "14px" }}>
              <h2 className="panel-heading">Methodology &amp; Trust Model</h2>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "12px 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  Reading Security Values
                </h3>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
                  <li><strong>Classical security (C):</strong> Approximate attack cost in bits against known public cryptanalysis. 128-bit = infeasible with classical compute. 256-bit = maximum conventional strength.</li>
                  <li><strong>Post-quantum security (PQ):</strong> Expected security under quantum algorithms (Grover, Shor). 0 = fully broken by Shor&apos;s. Lattice/hash schemes retain estimated PQ security levels.</li>
                  <li><strong>Best attack:</strong> Strongest published attack path. These are continuously updated as cryptanalysis evolves — not guarantees, but current best knowledge.</li>
                  <li><strong>Performance:</strong> Approximate throughput/latency values. Highly implementation- and platform-dependent; treat as relative ordering, not absolute benchmarks.</li>
                </ul>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  Data Sourcing
                </h3>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
                  <li>Primary sources: NIST FIPS/SP publications, IETF RFCs, ISO standards, national cryptographic standards (KPQC, CRYPTREC, GB/T, GOST, DSTU).</li>
                  <li>Analysis sources: Eurocrypt, CRYPTO, and ASIACRYPT proceedings; ePrint archive; peer-reviewed security proofs and cryptanalysis papers.</li>
                  <li>Deployment sources: Official implementation documentation, adoption reports, real-world usage telemetry where public.</li>
                  <li>Each algorithm entry cites its specific sources in the &quot;Source citations&quot; panel — click any algorithm to see them.</li>
                </ul>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  Recommendation Labels
                </h3>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
                  <li><strong>Recommended:</strong> The default choice for new systems. Well-analyzed, widely deployed, strong security margins.</li>
                  <li><strong>Acceptable:</strong> Safe for use in constrained environments or where a specific property is needed. Not the default pick.</li>
                  <li><strong>Legacy:</strong> Should only be used for backward compatibility with existing systems. Plan migration.</li>
                  <li><strong>Research:</strong> Promising but not yet sufficiently analyzed or deployed for production. Watch and evaluate.</li>
                  <li><strong>Avoid:</strong> Known weaknesses or obsolete. Do not use in new systems.</li>
                </ul>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  Review Process
                </h3>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
                  <li>All entries undergo Zod schema validation at build time, ensuring type correctness, range bounds, and cross-field consistency.</li>
                  <li>Provenance coverage is verified: every algorithm must have at least one cited source and a review date.</li>
                  <li>Security estimates are checked for internal consistency (e.g., PQ-safe algorithms must have non-zero PQ security bits).</li>
                  <li>The dataset undergoes periodic review. Last full review: <strong>March 16, 2026</strong>.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  Limitations
                </h3>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
                  <li>This is a reference tool, not a certification. Security guidance should be validated against your specific threat model and compliance requirements.</li>
                  <li>Implementation quality, side-channel resistance, and key management matter more than primitive selection alone.</li>
                  <li>Cryptanalysis is an active field. Security estimates reflect current public knowledge and may change as new attacks are discovered.</li>
                  <li>Performance data is approximate. Production decisions should rely on application-specific benchmarks.</li>
                </ul>
              </div>
            </section>
          )}

          <CategoryExplainer category={cat} expanded={explainerOpen} onToggle={() => setExplainerOpen(!explainerOpen)} />

          <button className="focusRing controlBtn" onClick={() => setShowHybrid(!showHybrid)} aria-expanded={showHybrid} aria-label={`${showHybrid ? "Hide" : "Show"} hybrid cryptography patterns`} style={{ marginBottom: showHybrid ? "0" : "12px" }}>
            {showHybrid ? "▾" : "▸"} Hybrid Cryptography Patterns
          </button>
          {showHybrid && (
            <section className="panel" aria-label="Hybrid cryptography patterns" style={{ marginBottom: "18px" }}>
              <h2 className="panel-heading">Hybrid Cryptography Patterns</h2>
              <p style={{ color: "#93a4bb", fontSize: "13px", lineHeight: 1.6, margin: "0 0 12px" }}>
                Hybrid constructions combine classical and post-quantum algorithms so that security holds if either assumption remains valid.
              </p>
              {HYBRID_PATTERNS.map((p) => (
                <div key={p.id} style={{ borderTop: "1px solid #1e293b", padding: "10px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <strong style={{ color: "#e2e8f0", fontSize: "14px" }}>{p.name}</strong>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px",
                      background: p.recommendation === "recommended" ? "#0d3320" : p.recommendation === "acceptable" ? "#312e2a" : "#1e1633",
                      color: p.recommendation === "recommended" ? "#34d399" : p.recommendation === "acceptable" ? "#fbbf24" : "#a78bfa",
                      border: `1px solid ${p.recommendation === "recommended" ? "#065f46" : p.recommendation === "acceptable" ? "#78350f" : "#4c1d95"}`,
                    }}>{p.recommendation}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>({p.category})</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#c4d1e3", lineHeight: 1.7 }}>
                    <div><span style={{ color: "#64748b" }}>Classical:</span> {p.classical}</div>
                    <div><span style={{ color: "#64748b" }}>Post-Quantum:</span> {p.postQuantum}</div>
                    <div><span style={{ color: "#64748b" }}>Method:</span> {p.combinationMethod}</div>
                    <pre style={{
                      background: "#0a0e17", border: "1px solid #1e293b", borderRadius: "6px",
                      padding: "10px 14px", margin: "6px 0", fontSize: "11px", lineHeight: 1.5,
                      color: "#93c5fd", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                      overflowX: "auto", whiteSpace: "pre",
                    }}>{p.diagram}</pre>
                    <div><span style={{ color: "#64748b" }}>Deployed in:</span> {p.deployedIn.join(", ")}</div>
                    <div style={{ marginTop: "4px" }}><span style={{ color: "#64748b" }}>Rationale:</span> {p.rationale}</div>
                    <div><span style={{ color: "#64748b" }}>Limitations:</span> {p.limitations}</div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* ── Algorithm Advisor CTA ── */}
          <div style={{ margin: "0 0 18px" }}>
            <Link
              href="/advisor"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                background: "linear-gradient(135deg, #0c1222 0%, #0e1628 100%)",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                padding: "20px 24px",
                textDecoration: "none",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    fontSize: "19px",
                    fontWeight: 700,
                    color: "#f8fafc",
                    marginBottom: "6px",
                  }}
                >
                  What should I use?
                </div>
                <div style={{ fontSize: "14px", color: "#93a4bb", lineHeight: 1.5 }}>
                  Answer a few questions to get a specific algorithm recommendation with a downloadable justification report.
                </div>
              </div>
              <span
                className="advisorCta"
                style={{
                  background: "#1d4ed8",
                  color: "#fff",
                  borderRadius: "7px",
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  textAlign: "center",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Open advisor →
              </span>
            </Link>
          </div>

          {!explainerOpen && <p className="text-body" style={{ fontSize: "15px", margin: "0 0 18px" }}>Select cards to compare algorithms side by side.</p>}

          <section aria-label={`${globalSearch ? "All categories" : selectedCategoryLabel} algorithms`} className="algoGrid" style={{ marginBottom: "18px" }}>
            {filtered.map((a) => (
              <AlgoCard key={a.id} algo={a} advanced={adv} selected={sel.includes(a.id)} onToggle={() => toggle(a.id)} favorited={favorites.includes(a.id)} onToggleFavorite={() => toggleFavorite(a.id)} />
            ))}
          </section>

          {filtered.length === 0 && <p role="status" style={{ color: "#93a4bb" }}>No algorithms match the current filters.</p>}

          <div aria-live="polite" aria-atomic="true" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            {filtered.length} algorithm{filtered.length !== 1 ? "s" : ""} shown
          </div>

          {selAlgos.length >= 2 && !cmp && (
            <div style={{ textAlign: "center", margin: "10px 0", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setCmp(true)}
                className="focusRing"
                aria-label={`Compare ${selAlgos.length} selected algorithms`}
                style={{
                  background: "#1d4ed8",
                  color: "#fff",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                }}
              >
                Compare {selAlgos.length}
              </button>
              <button className="focusRing controlBtn" onClick={copyComparisonLink}>
                Copy comparison link
              </button>
            </div>
          )}

          {selAlgos.length === 1 && <p style={{ textAlign: "center", color: "#d4deea", fontSize: "15px" }}>Select one more algorithm to compare.</p>}

          {cmp && selAlgos.length >= 2 && (
            <section aria-label="Comparison table" style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", gap: "10px", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: CATEGORY_ACCENT[cat] }}>▍</span>Comparison
                </h2>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setSel([]);
                      setCmp(false);
                    }}
                    className="focusRing controlBtn"
                  >
                    Clear selection
                  </button>
                  <button className="focusRing controlBtn" onClick={copyComparisonLink}>
                    Copy link
                  </button>
                  <button className="focusRing controlBtn" onClick={() => exportComparison("csv")}>
                    Export CSV
                  </button>
                  <button className="focusRing controlBtn" onClick={() => exportComparison("markdown")}>
                    Export Markdown
                  </button>
                </div>
              </div>
              <ComparisonTable algos={selAlgos} rows={rows} />
            </section>
          )}

          {selAlgos.length > 0 && (
            <section className="panel" aria-label="Source citations">
              <h2 className="panel-heading">Source citations</h2>
              {selAlgos.map((algo) => (
                <div key={`src-${algo.id}`} style={{ padding: "10px 0", borderTop: "1px solid #111827" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                    <strong>{algo.name}</strong>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {algo.sources && (
                        <span style={{ color: "#7dd3fc", fontSize: "13px", fontWeight: 600 }}>
                          {algo.sources.length} source{algo.sources.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span style={{ color: "#93a4bb", fontSize: "13px" }}>
                        {algo.lastReviewed ? `Reviewed ${algo.lastReviewed}` : "Review pending"}
                      </span>
                    </div>
                  </div>
                  {algo.sources && algo.sources.length > 0 ? (
                    <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "#c4d1e3", listStyle: "none" }}>
                      {algo.sources.map((source) => (
                        <li key={`${algo.id}-${source.label}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <SourceKindBadge kind={source.kind} />
                          <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#7dd3fc" }}>
                            {source.label}
                          </a>
                          <span style={{ color: "#93a4bb" }}>— {source.note}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: "8px 0 0", color: "#93a4bb" }}>Source list pending enrichment for this entry.</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>

        <div className="footerGradientBar" aria-hidden="true" />
        <footer className="site-footer">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "12px",
              fontSize: "12px",
              color: "#7d8a9e",
            }}
            aria-label="Keyboard shortcuts"
          >
            <span><kbd className="kbd">/</kbd> Search</span>
            <span><kbd className="kbd">A</kbd> Toggle Advanced</span>
            <span><kbd className="kbd">← →</kbd> Switch Category</span>
            <span><kbd className="kbd">?</kbd> Methodology</span>
            <span><kbd className="kbd">Esc</kbd> Close</span>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span className="text-accent" style={{ fontWeight: 700 }}>Dataset reviewed:</span>{" "}
            <time dateTime="2026-03-16">March 16, 2026</time>
          </div>
          Sources: NIST FIPS, IETF RFCs, KPQC, CRYPTREC, GB/T, GOST, DSTU, ISO, Eurocrypt/CRYPTO proceedings. Security estimates reflect known attacks and public literature, and should be treated as continuously updated guidance, not certification.
        </footer>
      </div>

      <style jsx>{`
        .headerGradientBar {
          height: 3px;
          background: linear-gradient(
            90deg,
            #3b82f6 0%,
            #06b6d4 12%,
            #8b5cf6 24%,
            #f59e0b 36%,
            #10b981 48%,
            #ec4899 60%,
            #ef4444 72%,
            #6366f1 84%,
            #3b82f6 100%
          );
          background-size: 200% 100%;
          animation: gradientShift 12s linear infinite;
        }

        .footerGradientBar {
          height: 1px;
          margin: 8px 0 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #3b82f640 20%,
            #8b5cf640 50%,
            #06b6d440 80%,
            transparent 100%
          );
        }

        .brandMark {
          font-size: 24px;
          color: #3b82f6;
          filter: drop-shadow(0 0 6px #3b82f640);
        }

        @keyframes gradientShift {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        .categoryTab:hover {
          color: #f8fafc !important;
        }

        .pageShell {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .algoGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .focusRing:focus-visible {
          outline: 3px solid #60a5fa;
          outline-offset: 3px;
        }

        .algoCard:focus-visible {
          border-color: #60a5fa !important;
        }

        .controlBtn,
        .controlSelect {
          background: #0e1420;
          color: #d4deea;
          border: 1px solid #334155;
          border-radius: 7px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 600;
          transition: border-color 0.15s, background 0.15s;
          min-height: 44px;
        }

        .controlBtn:hover {
          border-color: #475569;
          background: #111827;
        }

        .controlBtn {
          cursor: pointer;
        }

        .controlBtnActive {
          background: #11203a !important;
          color: #7dd3fc !important;
          border-color: #163052 !important;
        }

        .controlSelect {
          background: #0e1420;
          color: #d4deea;
        }

        .skipLink {
          position: absolute;
          top: -100px;
          left: 16px;
          background: #1d4ed8;
          color: #fff;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          z-index: 100;
          text-decoration: none;
        }

        .skipLink:focus {
          top: 12px;
        }

        /* Mobile hamburger button - hidden by default, shown on mobile */
        .mobileMenuBtn {
          display: none !important;
        }

        /* ── Mobile: tablets and smaller ── */
        @media (max-width: 900px) {
          .pageShell {
            padding: 0 16px;
          }

          .algoGrid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .headerLegend {
            display: none;
          }

          .headerSubtitle {
            font-size: 14px !important;
          }

          .headerBtn {
            padding: 10px 14px !important;
            font-size: 13px !important;
            min-height: 44px;
          }

          .mobileMenuBtn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          .categoryNav {
            display: none !important;
            flex-direction: column;
            position: static;
            background: #0a0f1a;
            border: 1px solid #1e293b;
            border-radius: 8px;
            margin: 8px 0;
            max-height: 70vh;
            overflow-y: auto;
          }

          .categoryNav.mobileNavOpen {
            display: flex !important;
          }

          .categoryNav .categoryTab {
            text-align: left;
            padding: 14px 18px !important;
            min-height: 48px;
            font-size: 15px !important;
            border-bottom: none !important;
            border-left: 3px solid transparent;
          }

          .categoryNav .categoryTab[aria-selected="true"] {
            border-left-color: #3b82f6;
            background: #0e1628;
          }

          .searchInput {
            min-width: 0 !important;
            flex: 1 1 100% !important;
            font-size: 16px !important;
          }

          .advisorCta {
            flex: 1 1 100%;
          }
        }

        /* ── Mobile: phones ── */
        @media (max-width: 480px) {
          .pageShell {
            padding: 0 12px;
          }

          .headerActions {
            gap: 6px !important;
            width: 100%;
            justify-content: flex-end;
          }

          .headerBtn {
            padding: 10px 12px !important;
            font-size: 12px !important;
            min-height: 44px;
          }

          .controlBtn,
          .controlSelect {
            font-size: 13px;
            padding: 10px 12px;
            min-height: 44px;
            flex: 1 1 auto;
          }

          .algoGrid {
            gap: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .algoCard,
          .focusRing,
          .controlBtn,
          .controlSelect {
            transition: none !important;
          }

          .headerGradientBar {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
