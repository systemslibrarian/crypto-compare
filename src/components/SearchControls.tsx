import { useEffect, type ChangeEvent, type Ref } from "react";
import { FILTER_PRESETS, type FilterPreset } from "@/data/filterPresets";

type SortOption = {
  id: string;
  label: string;
};

type SearchControlsProps = {
  searchRef: Ref<HTMLInputElement>;
  search: string;
  selectedCategoryLabel: string;
  globalSearch: boolean;
  sortBy: string;
  sortOptions: readonly SortOption[];
  showFilters: boolean;
  showMethodology: boolean;
  pqOnly: boolean;
  standardOnly: boolean;
  nistOnly: boolean;
  deployedOnly: boolean;
  showDefaults: boolean;
  favOnly: boolean;
  favoritesCount: number;
  country: string;
  countryOptions: readonly string[];
  datasetSize: number;
  categoryCount: number;
  onSearchChange: (value: string) => void;
  onToggleGlobalSearch: () => void;
  onSortChange: (value: string) => void;
  onToggleFilters: () => void;
  onToggleMethodology: () => void;
  onCountryChange: (value: string) => void;
  onTogglePqOnly: () => void;
  onToggleStandardOnly: () => void;
  onToggleNistOnly: () => void;
  onToggleDeployedOnly: () => void;
  onToggleDefaults: () => void;
  onToggleFavorites: () => void;
  onActivateSearchAll: () => void;
  onApplyPreset?: (preset: FilterPreset) => void;
};

export default function SearchControls({
  searchRef,
  search,
  selectedCategoryLabel,
  globalSearch,
  sortBy,
  sortOptions,
  showFilters,
  showMethodology,
  pqOnly,
  standardOnly,
  nistOnly,
  deployedOnly,
  showDefaults,
  favOnly,
  favoritesCount,
  country,
  countryOptions,
  datasetSize,
  categoryCount,
  onSearchChange,
  onToggleGlobalSearch,
  onSortChange,
  onToggleFilters,
  onToggleMethodology,
  onCountryChange,
  onTogglePqOnly,
  onToggleStandardOnly,
  onToggleNistOnly,
  onToggleDeployedOnly,
  onToggleDefaults,
  onToggleFavorites,
  onActivateSearchAll,
  onApplyPreset,
}: SearchControlsProps) {
  const hasActiveFilters = pqOnly || standardOnly || nistOnly || deployedOnly || showDefaults || country !== "all" || favOnly;
  const activeFilterCount = [pqOnly, standardOnly, nistOnly, deployedOnly, showDefaults, country !== "all", favOnly].filter(Boolean).length;

  // Lock body scroll when filter sheet is open on mobile
  useEffect(() => {
    if (!showFilters) return;
    const mql = window.matchMedia("(max-width: 900px)");
    if (!mql.matches) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showFilters]);

  const filterContent = (
    <>
      <div className="filterGroup" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        <select value={country} onChange={(event) => onCountryChange(event.target.value)} className="focusRing controlSelect" aria-label="Filter by origin region">
          {countryOptions.map((option) => (
            <option key={option} value={option}>
              Origin: {option}
            </option>
          ))}
        </select>
        <button className={`focusRing controlBtn filterChip ${pqOnly ? "controlBtnActive" : ""}`} onClick={onTogglePqOnly} aria-pressed={pqOnly} aria-label={pqOnly ? "PQ-safe filter active — click to show all" : "Show only PQ-safe algorithms"}>
          PQ-safe only
        </button>
        <button className={`focusRing controlBtn filterChip ${standardOnly ? "controlBtnActive" : ""}`} onClick={onToggleStandardOnly} aria-pressed={standardOnly} aria-label={standardOnly ? "Standards filter active — click to show all" : "Show only standardized algorithms"}>
          Standards only
        </button>
        <button className={`focusRing controlBtn filterChip ${nistOnly ? "controlBtnActive" : ""}`} onClick={onToggleNistOnly} aria-pressed={nistOnly} aria-label={nistOnly ? "NIST filter active — click to show all" : "Show only NIST-standardized algorithms"}>
          NIST only
        </button>
        <button className={`focusRing controlBtn filterChip ${deployedOnly ? "controlBtnActive" : ""}`} onClick={onToggleDeployedOnly} aria-pressed={deployedOnly} aria-label={deployedOnly ? "Deployed filter active — click to show all" : "Show only widely deployed algorithms"}>
          Widely deployed
        </button>
        <button className={`focusRing controlBtn filterChip ${showDefaults ? "controlBtnActive" : ""}`} onClick={onToggleDefaults} aria-pressed={showDefaults} aria-label={showDefaults ? "Showing recommended defaults — click to show all" : "Show only recommended default algorithms"}>
          Recommended defaults
        </button>
        <button className={`focusRing controlBtn filterChip ${favOnly ? "controlBtnActive" : ""}`} onClick={onToggleFavorites} aria-pressed={favOnly} aria-label={favOnly ? "Showing favorites only — click to show all" : "Show only favorited algorithms"}>
          ★ Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ""}
        </button>
      </div>

      {onApplyPreset && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.4px", alignSelf: "center", marginRight: "4px" }}>Presets</span>
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="focusRing controlBtn"
              onClick={() => onApplyPreset(preset)}
              title={preset.description}
              aria-label={`Apply preset: ${preset.label} — ${preset.description}`}
              style={{ fontSize: "13px", padding: "6px 12px" }}
            >
              {preset.icon} {preset.label}
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <div role="search" aria-label="Filter and search algorithms" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: showFilters ? "8px" : "12px" }}>
        <input
          ref={searchRef}
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
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
          onClick={onToggleGlobalSearch}
          aria-pressed={globalSearch}
          title="Search across all categories"
        >
          🌐 All {datasetSize}
        </button>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="focusRing controlSelect" aria-label="Sort algorithms">
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              Sort: {option.label}
            </option>
          ))}
        </select>
        <button className="focusRing controlBtn" onClick={onToggleFilters} aria-expanded={showFilters} aria-label={`${showFilters ? "Hide" : "Show"} filter options${hasActiveFilters ? " (active)" : ""}`}>
          {showFilters ? "▾" : "▸"} Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <button className="focusRing controlBtn" onClick={onToggleMethodology} aria-expanded={showMethodology} aria-label={`${showMethodology ? "Hide" : "Show"} methodology and trust model`}>
          How to read this site
        </button>
      </div>

      {/* Desktop: inline filters */}
      {showFilters && (
        <div className="filterInlineDesktop">
          {filterContent}
        </div>
      )}

      {/* Mobile: bottom sheet overlay */}
      {showFilters && (
        <>
          <div className="filterSheetBackdrop" onClick={onToggleFilters} />
          <div className="filterSheet" role="dialog" aria-modal="true" aria-label="Filter options">
            <div className="filterSheetHeader">
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                Filters {activeFilterCount > 0 && <span style={{ color: "#7dd3fc" }}>({activeFilterCount} active)</span>}
              </h3>
              <button
                onClick={onToggleFilters}
                className="focusRing controlBtn"
                aria-label="Close filters"
                style={{ fontWeight: 700, fontSize: "18px", lineHeight: 1, padding: "8px 12px" }}
              >
                ✕
              </button>
            </div>
            <div className="filterSheetBody">
              {filterContent}
            </div>
            <div className="filterSheetFooter">
              <button onClick={onToggleFilters} className="focusRing" style={{
                background: "#1d4ed8", color: "#fff", border: "none", padding: "14px 28px",
                borderRadius: "8px", fontSize: "16px", fontWeight: 700, cursor: "pointer", width: "100%",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}>
                Done
              </button>
            </div>
          </div>
        </>
      )}

    </>
  );
}