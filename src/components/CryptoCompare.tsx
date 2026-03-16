"use client";

import { useEffect, useMemo, useState } from "react";
import AlgoCard from "@/components/AlgoCard";
import CategoryExplainer from "@/components/CategoryExplainer";
import ComparisonTable from "@/components/ComparisonTable";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { buildRows } from "@/lib/comparison";
import { validateAlgorithms } from "@/lib/validation";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

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
  const [showDefaults, setShowDefaults] = useState(false);

  useEffect(() => {
    const validationErrors = validateAlgorithms(dataset);
    if (validationErrors.length > 0) {
      console.warn("Algorithm validation issues", validationErrors);
    }
  }, [dataset]);

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
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [cat, adv, cmp, sel, search, pqOnly, standardOnly, nistOnly, deployedOnly, country, sortBy]);

  const filtered = useMemo(() => {
    let items = dataset.filter((a) => a.category === cat);

    if (showDefaults) {
      const recommended = new Set(["xchacha20poly", "aes256gcm", "mlkem768", "mldsa65", "argon2id", "hmac_sha256", "kmac256"]);
      items = items.filter((a) => recommended.has(a.id));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((a) => `${a.name} ${a.family} ${a.useCases} ${a.origin} ${a.statusLabel}`.toLowerCase().includes(q));
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
  }, [dataset, cat, search, pqOnly, standardOnly, nistOnly, deployedOnly, country, sortBy, showDefaults]);

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

  return (
    <div style={{ background: "#070b12", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'IBM Plex Sans',-apple-system,sans-serif", lineHeight: 1.6 }}>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <div className="pageShell">
        <header style={{ borderBottom: "1px solid #111827", padding: "22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.5px" }}>
                <span style={{ color: "#3b82f6" }}>crypto</span>::compare
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "16px", color: "#c4d1e3" }}>International cryptographic algorithm reference across 12 categories.</p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", color: "#c4d1e3", fontFamily: "'JetBrains Mono',monospace" }}>C = Classical, PQ = Post-Quantum</span>
              <button
                onClick={() => setAdv(!adv)}
                aria-pressed={adv}
                className="focusRing"
                style={{
                  background: adv ? "#11203a" : "#0e1420",
                  color: adv ? "#7dd3fc" : "#d4deea",
                  border: `1px solid ${adv ? "#163052" : "#334155"}`,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {adv ? "Advanced" : "Beginner"}
              </button>
            </div>
          </div>
        </header>

        <nav aria-label="Cryptography categories" role="tablist" style={{ display: "flex", gap: 0, borderBottom: "1px solid #111827", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCat(c.id)}
              role="tab"
              aria-selected={cat === c.id}
              className="focusRing"
              style={{
                background: "transparent",
                color: cat === c.id ? "#f8fafc" : "#b1bfd2",
                border: "none",
                borderBottom: cat === c.id ? "2px solid #3b82f6" : "2px solid transparent",
                padding: "14px 18px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: cat === c.id ? 700 : 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span aria-hidden="true" style={{ marginRight: "4px" }}>
                {c.icon}
              </span>
              {c.label}
            </button>
          ))}
        </nav>

        <main id="main-content" style={{ padding: "20px 0 28px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search within ${selectedCategoryLabel}`}
              aria-label="Search algorithms"
              className="focusRing"
              style={{
                background: "#0c1422",
                color: "#e2e8f0",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "10px 12px",
                minWidth: "220px",
              }}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="focusRing controlSelect" aria-label="Sort algorithms">
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
            <select value={country} onChange={(e) => setCountry(e.target.value as CountryFilter)} className="focusRing controlSelect" aria-label="Filter by origin region">
              {COUNTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Origin: {option}
                </option>
              ))}
            </select>
            <button className="focusRing controlBtn" onClick={() => setPqOnly(!pqOnly)} aria-pressed={pqOnly}>
              PQ-safe only
            </button>
            <button className="focusRing controlBtn" onClick={() => setStandardOnly(!standardOnly)} aria-pressed={standardOnly}>
              Standards only
            </button>
            <button className="focusRing controlBtn" onClick={() => setNistOnly(!nistOnly)} aria-pressed={nistOnly}>
              NIST only
            </button>
            <button className="focusRing controlBtn" onClick={() => setDeployedOnly(!deployedOnly)} aria-pressed={deployedOnly}>
              Widely deployed
            </button>
            <button className="focusRing controlBtn" onClick={() => setShowDefaults(!showDefaults)} aria-pressed={showDefaults}>
              Recommended defaults
            </button>
            <button className="focusRing controlBtn" onClick={() => setShowMethodology(!showMethodology)} aria-expanded={showMethodology}>
              How to read this site
            </button>
          </div>

          {showMethodology && (
            <section style={{ marginBottom: "14px", border: "1px solid #1e293b", borderRadius: "10px", padding: "14px", background: "#0c1220" }}>
              <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "18px", fontFamily: "'JetBrains Mono',monospace" }}>Methodology</h2>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3" }}>
                <li>Classical security bits approximate attack cost against known public cryptanalysis.</li>
                <li>PQ security bits indicate expected security under quantum search assumptions where applicable.</li>
                <li>Best attack fields summarize strongest currently published attack paths, not guarantees.</li>
                <li>Performance values are approximate and implementation-dependent.</li>
                <li>Status labels distinguish deployed standards from candidates under active analysis.</li>
                <li>Implementation quality, side-channel safety, and key management usually matter more than primitive selection alone.</li>
              </ul>
            </section>
          )}

          <CategoryExplainer category={cat} expanded={explainerOpen} onToggle={() => setExplainerOpen(!explainerOpen)} />

          {!explainerOpen && <p style={{ color: "#d4deea", fontSize: "15px", margin: "0 0 18px" }}>Select cards to compare algorithms side by side.</p>}

          <section aria-label={`${selectedCategoryLabel} algorithms`} className="algoGrid" style={{ marginBottom: "18px" }}>
            {filtered.map((a) => (
              <AlgoCard key={a.id} algo={a} advanced={adv} selected={sel.includes(a.id)} onToggle={() => toggle(a.id)} />
            ))}
          </section>

          {filtered.length === 0 && <p style={{ color: "#93a4bb" }}>No algorithms match the current filters.</p>}

          {selAlgos.length >= 2 && !cmp && (
            <div style={{ textAlign: "center", margin: "10px 0", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setCmp(true)}
                className="focusRing"
                style={{
                  background: "#1d4ed8",
                  color: "#fff",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono',monospace",
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
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>Comparison</h2>
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
                </div>
              </div>
              <ComparisonTable algos={selAlgos} rows={rows} />
            </section>
          )}

          {selAlgos.length > 0 && (
            <section style={{ border: "1px solid #1e293b", borderRadius: "10px", padding: "14px", background: "#0a0f1a" }}>
              <h2 style={{ margin: "0 0 8px", fontSize: "18px", fontFamily: "'JetBrains Mono',monospace" }}>Selected algorithm sources</h2>
              {selAlgos.map((algo) => (
                <div key={`src-${algo.id}`} style={{ padding: "10px 0", borderTop: "1px solid #111827" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                    <strong>{algo.name}</strong>
                    <span style={{ color: "#93a4bb", fontSize: "13px" }}>
                      {algo.lastReviewed ? `Last review: ${algo.lastReviewed}` : "Source review pending"}
                    </span>
                  </div>
                  {algo.sources && algo.sources.length > 0 ? (
                    <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "#c4d1e3" }}>
                      {algo.sources.map((source) => (
                        <li key={`${algo.id}-${source.label}`}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#7dd3fc" }}>
                            {source.label}
                          </a>{" "}
                          - {source.note}
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

        <footer style={{ borderTop: "1px solid #1e293b", padding: "20px 0 28px", fontSize: "14px", color: "#b4c1d2", fontFamily: "'JetBrains Mono',monospace", lineHeight: "1.7" }}>
          Sources: NIST FIPS, IETF RFCs, KPQC, CRYPTREC, GB/T, GOST, DSTU, ISO, Eurocrypt/CRYPTO proceedings. Security estimates reflect known attacks and public literature, and should be treated as continuously updated guidance, not certification.
        </footer>
      </div>

      <style jsx>{`
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
          padding: 9px 12px;
          font-size: 14px;
          font-weight: 600;
        }

        .controlBtn {
          cursor: pointer;
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

        @media (max-width: 900px) {
          .pageShell {
            padding: 0 16px;
          }

          .algoGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .algoCard,
          .focusRing {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
