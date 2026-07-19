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
  onClearAllFilters?: () => void;
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
  onApplyPreset,
  onClearAllFilters,
}: SearchControlsProps) {
  const hasActiveFilters = pqOnly || standardOnly || nistOnly || deployedOnly || showDefaults || country !== "all" || favOnly;
  const activeFilterCount = [pqOnly, standardOnly, nistOnly, deployedOnly, showDefaults, country !== "all", favOnly].filter(Boolean).length;
  const activePresetId = FILTER_PRESETS.find((preset) => {
    const filters = preset.filters;

    return globalSearch === Boolean(filters.globalSearch)
      && pqOnly === Boolean(filters.pqOnly)
      && standardOnly === Boolean(filters.standardOnly)
      && nistOnly === Boolean(filters.nistOnly)
      && deployedOnly === Boolean(filters.deployedOnly)
      && showDefaults === Boolean(filters.showDefaults)
      && favOnly === false
      && country === (filters.country ?? "all")
      && sortBy === (filters.sortBy ?? "name")
      && search === (filters.search ?? "");
  })?.id;

  // Lock body scroll when filter sheet is open on mobile
  useEffect(() => {
    if (!showFilters) return;
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(max-width: 900px)");
    if (!mql.matches) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showFilters]);

  const filterContent = (
    <>
      <div className="filterGroup" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
        <select value={country} onChange={(event) => onCountryChange(event.target.value)} className="focusRing controlSelect" aria-label="Filter by origin region">
          {countryOptions.map((option) => (
            <option key={option} value={option}>
              Origin: {option}
            </option>
          ))}
        </select>
        <button className={`focusRing controlBtn filterChip ${pqOnly ? "controlBtnActive" : ""}`} onClick={onTogglePqOnly} aria-pressed={pqOnly} aria-label={pqOnly ? "PQ-safe filter active — click to show all" : "Show only PQ-safe algorithms"}>
          {pqOnly && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
          PQ-safe only
        </button>
        <button className={`focusRing controlBtn filterChip ${standardOnly ? "controlBtnActive" : ""}`} onClick={onToggleStandardOnly} aria-pressed={standardOnly} aria-label={standardOnly ? "Standards filter active — click to show all" : "Show only standardized algorithms"}>
          {standardOnly && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
          Standards only
        </button>
        <button className={`focusRing controlBtn filterChip ${nistOnly ? "controlBtnActive" : ""}`} onClick={onToggleNistOnly} aria-pressed={nistOnly} aria-label={nistOnly ? "NIST filter active — click to show all" : "Show only NIST-standardized algorithms"}>
          {nistOnly && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
          NIST only
        </button>
        <button className={`focusRing controlBtn filterChip ${deployedOnly ? "controlBtnActive" : ""}`} onClick={onToggleDeployedOnly} aria-pressed={deployedOnly} aria-label={deployedOnly ? "Deployed filter active — click to show all" : "Show only widely deployed algorithms"}>
          {deployedOnly && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
          Widely deployed
        </button>
        <button className={`focusRing controlBtn filterChip ${showDefaults ? "controlBtnActive" : ""}`} onClick={onToggleDefaults} aria-pressed={showDefaults} aria-label={showDefaults ? "Showing recommended defaults — click to show all" : "Show only recommended default algorithms"}>
          {showDefaults && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
          Recommended defaults
        </button>
        <button className={`focusRing controlBtn filterChip ${favOnly ? "controlBtnActive" : ""}`} onClick={onToggleFavorites} aria-pressed={favOnly} aria-label={favOnly ? "Showing favorites only — click to show all" : "Show only favorited algorithms"}>
          {favOnly && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
          Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ""}
        </button>
        {hasActiveFilters && onClearAllFilters && (
          <button
            className="focusRing controlBtn"
            onClick={onClearAllFilters}
            aria-label="Clear all active filters"
            style={{ color: "var(--color-badge-red-text)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {onApplyPreset && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "4px", fontFamily: "var(--font-mono)" }}>Presets</span>
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`focusRing controlBtn ${activePresetId === preset.id ? "controlBtnActive" : ""}`}
              onClick={() => onApplyPreset(preset)}
              title={preset.description}
              aria-label={`Apply preset: ${preset.label} — ${preset.description}`}
              aria-pressed={activePresetId === preset.id}
              style={{ fontSize: "12.5px", padding: "6px 12px", minHeight: "34px" }}
            >
              {activePresetId === preset.id && <span className="filterChipIndicator" aria-hidden="true">✓</span>}
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <div role="search" aria-label="Filter and search algorithms" className="toolbar">
        <input
          ref={searchRef}
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          placeholder={globalSearch ? "Search all categories…" : `Search within ${selectedCategoryLabel}…`}
          aria-label="Search algorithms"
          className="focusRing searchInput"
        />
        <button
          className={`focusRing controlBtn ${globalSearch ? "controlBtnActive" : ""}`}
          onClick={onToggleGlobalSearch}
          aria-pressed={globalSearch}
          title="Search across all categories"
        >
          All categories ({datasetSize})
        </button>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="focusRing controlSelect" aria-label="Sort algorithms">
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              Sort: {option.label}
            </option>
          ))}
        </select>
        <button className={`focusRing controlBtn ${hasActiveFilters ? "controlBtnActive" : ""}`} onClick={onToggleFilters} aria-expanded={showFilters} aria-label={`${showFilters ? "Hide" : "Show"} filter options${hasActiveFilters ? " (active)" : ""}`}>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
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
              <h3 style={{ margin: 0, fontSize: "18px" }}>
                Filters {activeFilterCount > 0 && <span style={{ color: "var(--color-text-accent-bright)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>({activeFilterCount} active)</span>}
              </h3>
              <button
                onClick={onToggleFilters}
                className="focusRing controlBtn"
                aria-label="Close filters"
                style={{ fontWeight: 700, fontSize: "16px", lineHeight: 1, padding: "8px 12px" }}
              >
                ✕
              </button>
            </div>
            <div className="filterSheetBody">
              {filterContent}
            </div>
            <div className="filterSheetFooter">
              {hasActiveFilters && onClearAllFilters && (
                <button onClick={() => { onClearAllFilters(); onToggleFilters(); }} className="focusRing" style={{
                  background: "transparent", color: "var(--color-badge-red-text)", border: "1px solid var(--color-badge-red-border)", padding: "14px 16px",
                  borderRadius: "8px", fontSize: "15px", fontWeight: 500, cursor: "pointer", flex: "0 0 auto",
                  fontFamily: "var(--font-mono)",
                }}
                aria-label="Clear all filters and close"
                >
                  Clear all
                </button>
              )}
              <button onClick={onToggleFilters} className="focusRing" style={{
                background: "var(--color-button-primary)", color: "var(--color-button-primary-text)", border: "none", padding: "14px 28px",
                borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: "pointer", flex: "1 1 auto",
                fontFamily: "var(--font-mono)",
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
