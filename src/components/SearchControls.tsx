import type { ChangeEvent, Ref } from "react";

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
}: SearchControlsProps) {
  const hasActiveFilters = pqOnly || standardOnly || nistOnly || deployedOnly || showDefaults || country !== "all" || favOnly;
  const activeFilterCount = [pqOnly, standardOnly, nistOnly, deployedOnly, showDefaults, country !== "all", favOnly].filter(Boolean).length;

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
          🌐 All 85
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

      {showFilters && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
          <select value={country} onChange={(event) => onCountryChange(event.target.value)} className="focusRing controlSelect" aria-label="Filter by origin region">
            {countryOptions.map((option) => (
              <option key={option} value={option}>
                Origin: {option}
              </option>
            ))}
          </select>
          <button className={`focusRing controlBtn ${pqOnly ? "controlBtnActive" : ""}`} onClick={onTogglePqOnly} aria-pressed={pqOnly} aria-label={pqOnly ? "PQ-safe filter active — click to show all" : "Show only PQ-safe algorithms"}>
            PQ-safe only
          </button>
          <button className={`focusRing controlBtn ${standardOnly ? "controlBtnActive" : ""}`} onClick={onToggleStandardOnly} aria-pressed={standardOnly} aria-label={standardOnly ? "Standards filter active — click to show all" : "Show only standardized algorithms"}>
            Standards only
          </button>
          <button className={`focusRing controlBtn ${nistOnly ? "controlBtnActive" : ""}`} onClick={onToggleNistOnly} aria-pressed={nistOnly} aria-label={nistOnly ? "NIST filter active — click to show all" : "Show only NIST-standardized algorithms"}>
            NIST only
          </button>
          <button className={`focusRing controlBtn ${deployedOnly ? "controlBtnActive" : ""}`} onClick={onToggleDeployedOnly} aria-pressed={deployedOnly} aria-label={deployedOnly ? "Deployed filter active — click to show all" : "Show only widely deployed algorithms"}>
            Widely deployed
          </button>
          <button className={`focusRing controlBtn ${showDefaults ? "controlBtnActive" : ""}`} onClick={onToggleDefaults} aria-pressed={showDefaults} aria-label={showDefaults ? "Showing recommended defaults — click to show all" : "Show only recommended default algorithms"}>
            Recommended defaults
          </button>
          <button className={`focusRing controlBtn ${favOnly ? "controlBtnActive" : ""}`} onClick={onToggleFavorites} aria-pressed={favOnly} aria-label={favOnly ? "Showing favorites only — click to show all" : "Show only favorited algorithms"}>
            ★ Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ""}
          </button>
        </div>
      )}

      {!globalSearch && (
        <button
          onClick={onActivateSearchAll}
          className="focusRing"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            background: "linear-gradient(135deg, #0c1422 0%, #111d33 100%)",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "14px 20px",
            marginBottom: "14px",
            cursor: "pointer",
            color: "#c4d1e3",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            transition: "border-color 0.15s, background 0.15s",
          }}
          aria-label="Search across all 85 algorithms"
        >
          <span aria-hidden="true" style={{ fontSize: "18px" }}>🔍</span>
          Search all {datasetSize} algorithms across {categoryCount} categories
        </button>
      )}
    </>
  );
}