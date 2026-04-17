"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdvisorCta from "@/components/AdvisorCta";
import AlgoCard from "@/components/AlgoCard";
import { CounselButton } from "@/components/CounselButton";
import AppHeaderNav from "@/components/AppHeaderNav";
import CategoryExplainer from "@/components/CategoryExplainer";
import ComparisonWorkspace from "@/components/ComparisonWorkspace";
import FooterShell from "@/components/FooterShell";
import HeroOverview from "@/components/HeroOverview";
import IntentCards from "@/components/IntentCards";
import KnowledgeSections from "@/components/KnowledgeSections";
import MethodologyPanel from "@/components/MethodologyPanel";
import QuickStartPanel from "@/components/QuickStartPanel";
import ReferenceGuidePanel from "@/components/ReferenceGuidePanel";
import ResultsStatus from "@/components/ResultsStatus";
import SearchControls from "@/components/SearchControls";
import ShortcutHelp from "@/components/ShortcutHelp";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES, CATEGORY_ACCENT } from "@/data/categories";
import type { FilterPreset } from "@/data/filterPresets";
import { buildRows, exportToCSV, exportToJSON, exportToMarkdown } from "@/lib/comparison";
import { withProvenance } from "@/lib/dataset";
import { filterAlgorithms } from "@/lib/filterAlgorithms";
import { useCryptoCompareController } from "@/lib/useCryptoCompareController";
import { countRecommendations, summarizeReviewWindow } from "@/lib/trust";
import { useCryptoCompareUrlState } from "@/lib/useCryptoCompareUrlState";
import { useMobileNavBehavior } from "@/lib/useMobileNavBehavior";
import { usePersistentFavorites } from "@/lib/usePersistentFavorites";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { useTheme } from "@/lib/useTheme";
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

export default function CryptoCompare() {
  const dataset = useMemo(() => withProvenance(ALGORITHMS), []);
  const searchRef = useRef<HTMLInputElement>(null);

  const [cat, setCat] = useState<AlgorithmCategory>("symmetric");
  const [sel, setSel] = useState<string[]>([]);
  const [cmp, setCmp] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
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
  const [showGuide, setShowGuide] = useState(false);
  const [showSafeUsage, setShowSafeUsage] = useState(false);
  const [showArchitectures, setShowArchitectures] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [showLibraries, setShowLibraries] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { favorites, toggleFavorite } = usePersistentFavorites();
  const [favOnly, setFavOnly] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [advisorHighlight, setAdvisorHighlight] = useState<string | null>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const controller = useCryptoCompareController({
    searchRef,
    setCat,
    setSel,
    setCmp,
    setExplainerOpen,
    setSearch,
    setPqOnly,
    setStandardOnly,
    setNistOnly,
    setDeployedOnly,
    setCountry,
    setSortBy,
    setShowMethodology,
    setShowHybrid,
    setShowDefaults,
    setShowGuide,
    setShowSafeUsage,
    setShowArchitectures,
    setShowPhilosophy,
    setShowLibraries,
    setShowResources,
    setShowFilters,
    setGlobalSearch,
    setFavOnly,
    setMobileNavOpen,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const validationErrors = validateAlgorithms(dataset);
      if (validationErrors.length > 0) {
        console.warn("Algorithm validation issues", validationErrors);
      }
    }
  }, [dataset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "advisor") {
      const selParam = params.get("sel");
      if (selParam) {
        const algoId = selParam.split(",")[0];
        setAdvisorHighlight(algoId);
        // Scroll to the highlighted card after render
        requestAnimationFrame(() => {
          const el = document.getElementById(`algo-${algoId}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        // Clean the URL param
        params.delete("from");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  useMobileNavBehavior({
    isOpen: mobileNavOpen,
    navElement: mobileNavRef.current,
    onClose: () => setMobileNavOpen(false),
  });

  useCryptoCompareUrlState({
    state: {
      cat,
      cmp,
      sel,
      search,
      pqOnly,
      standardOnly,
      nistOnly,
      deployedOnly,
      country,
      sortBy,
      showDefaults,
      favOnly,
    },
    setters: {
      setCat,
      setCmp,
      setSel,
      setSearch,
      setPqOnly,
      setStandardOnly,
      setNistOnly,
      setDeployedOnly,
      setCountry,
      setSortBy,
      setShowDefaults,
      setFavOnly,
    },
    categoryOptions: CATEGORIES.map((category) => category.id),
    countryOptions: COUNTRY_OPTIONS,
    sortOptions: SORT_OPTIONS.map((option) => option.id),
    algorithms: ALGORITHMS,
  });

  const filtered = useMemo(
    () =>
      filterAlgorithms(dataset, {
        category: cat,
        globalSearch,
        showDefaults,
        favoritesOnly: favOnly,
        favorites,
        search,
        pqOnly,
        standardOnly,
        nistOnly,
        deployedOnly,
        country,
        sortBy,
      }),
    [dataset, cat, globalSearch, showDefaults, favOnly, favorites, search, pqOnly, standardOnly, nistOnly, deployedOnly, country, sortBy],
  );

  const selAlgos = useMemo(() => filtered.filter((a) => sel.includes(a.id)), [filtered, sel]);
  const rows = useMemo(() => buildRows(cat), [cat]);
  const trustSnapshot = useMemo(() => summarizeReviewWindow(dataset), [dataset]);
  const filteredRecommendationCounts = useMemo(() => countRecommendations(filtered), [filtered]);

  const selectedCategoryLabel = CATEGORIES.find((c) => c.id === cat)?.label || cat;

  const kbHandlers = useMemo(
    () => ({
      onFocusSearch: () => searchRef.current?.focus(),
      onToggleMethodology: () => setShowMethodology((v) => !v),
      onToggleShortcuts: () => setShowShortcuts((v) => !v),
      onEscape: () => {
        setShowMethodology(false);
        setShowShortcuts(false);
        setCmp(false);
      },
      onNextCategory: () => {
        const idx = CATEGORIES.findIndex((c) => c.id === cat);
        if (idx < CATEGORIES.length - 1) controller.switchCategory(CATEGORIES[idx + 1].id);
      },
      onPrevCategory: () => {
        const idx = CATEGORIES.findIndex((c) => c.id === cat);
        if (idx > 0) controller.switchCategory(CATEGORIES[idx - 1].id);
      },
    }),
    [cat, controller],
  );
  useKeyboardShortcuts(kbHandlers);

  const exportComparison = useCallback(
    (format: "csv" | "markdown" | "json") => {
      if (selAlgos.length < 2) return;
      if (format === "csv") {
        downloadText(exportToCSV(rows, selAlgos), "comparison.csv", "text/csv");
      } else if (format === "json") {
        downloadText(exportToJSON(rows, selAlgos), "comparison.json", "application/json");
      } else {
        downloadText(exportToMarkdown(rows, selAlgos), "comparison.md", "text/markdown");
      }
    },
    [selAlgos, rows],
  );

  const applyPreset = useCallback(
    (preset: FilterPreset) => {
      // Reset all filters to defaults before applying preset
      setGlobalSearch(false);
      setPqOnly(false);
      setStandardOnly(false);
      setNistOnly(false);
      setDeployedOnly(false);
      setShowDefaults(false);
      setCountry("all");
      setSortBy("name");
      setSearch("");
      setFavOnly(false);

      // Apply preset-specific values
      const f = preset.filters;
      if (f.globalSearch) setGlobalSearch(f.globalSearch);
      if (f.pqOnly) setPqOnly(f.pqOnly);
      if (f.standardOnly) setStandardOnly(f.standardOnly);
      if (f.nistOnly) setNistOnly(f.nistOnly);
      if (f.deployedOnly) setDeployedOnly(f.deployedOnly);
      if (f.showDefaults) setShowDefaults(f.showDefaults);
      if (f.country) setCountry(f.country as typeof country);
      if (f.sortBy) setSortBy(f.sortBy as SortOption);
      if (f.search) setSearch(f.search);
    },
    [],
  );

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
    <div className="cryptoCompareRoot">
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <ShortcutHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <div className="headerGradientBar" aria-hidden="true" />
      <div className="pageShell">
        <AppHeaderNav
          categories={CATEGORIES}
          categoryAccent={CATEGORY_ACCENT}
          selectedCategory={cat}
          mobileNavOpen={mobileNavOpen}
          mobileNavRef={mobileNavRef}
          theme={theme}
          onReset={controller.resetToMainMenu}
          onToggleMobileNav={() => setMobileNavOpen((value) => !value)}
          onCloseMobileNav={() => setMobileNavOpen(false)}
          onSelectCategory={(category) => {
            controller.switchCategory(category);
            setMobileNavOpen(false);
            setGlobalSearch(false);
          }}
          onShowDefaults={controller.showRecommendedDefaults}
          onShowSafeUsage={() => setShowSafeUsage(true)}
          onToggleMethodology={() => setShowMethodology((value) => !value)}
          onToggleTheme={toggleTheme}
        />

        <main id="main-content" className="cryptoCompareMain" aria-label={`${globalSearch ? "All categories" : selectedCategoryLabel} algorithms`}>
          <HeroOverview
            selectedCategoryLabel={selectedCategoryLabel}
            globalSearch={globalSearch}
            datasetSize={dataset.length}
            filteredCount={filtered.length}
            recommendationCounts={filteredRecommendationCounts}
            trustSnapshot={trustSnapshot}
            totalSources={trustSnapshot.totalSources}
          />

          <IntentCards />

          <AdvisorCta />

          <QuickStartPanel
            showMethodology={showMethodology}
            onToggleMethodology={() => setShowMethodology((value) => !value)}
            onShowDefaults={controller.showRecommendedDefaults}
            onSearchAll={controller.activateGlobalSearch}
            onShowSafeUsage={() => setShowSafeUsage(true)}
          />

          <SearchControls
            searchRef={searchRef}
            search={search}
            selectedCategoryLabel={selectedCategoryLabel}
            globalSearch={globalSearch}
            sortBy={sortBy}
            sortOptions={SORT_OPTIONS}
            showFilters={showFilters}
            showMethodology={showMethodology}
            pqOnly={pqOnly}
            standardOnly={standardOnly}
            nistOnly={nistOnly}
            deployedOnly={deployedOnly}
            showDefaults={showDefaults}
            favOnly={favOnly}
            favoritesCount={favorites.length}
            country={country}
            countryOptions={COUNTRY_OPTIONS}
            datasetSize={dataset.length}
            categoryCount={CATEGORIES.length}
            onSearchChange={setSearch}
            onToggleGlobalSearch={() => setGlobalSearch((value) => !value)}
            onSortChange={(value) => setSortBy(value as SortOption)}
            onToggleFilters={() => setShowFilters((value) => !value)}
            onToggleMethodology={() => setShowMethodology((value) => !value)}
            onCountryChange={(value) => setCountry(value as CountryFilter)}
            onTogglePqOnly={() => setPqOnly((value) => !value)}
            onToggleStandardOnly={() => setStandardOnly((value) => !value)}
            onToggleNistOnly={() => setNistOnly((value) => !value)}
            onToggleDeployedOnly={() => setDeployedOnly((value) => !value)}
            onToggleDefaults={() => setShowDefaults((value) => !value)}
            onToggleFavorites={() => setFavOnly((value) => !value)}
            onActivateSearchAll={controller.activateGlobalSearch}
            onApplyPreset={applyPreset}
            onClearAllFilters={() => {
              setPqOnly(false);
              setStandardOnly(false);
              setNistOnly(false);
              setDeployedOnly(false);
              setShowDefaults(false);
              setFavOnly(false);
              setCountry("all" as CountryFilter);
            }}
          />

          {showMethodology && <MethodologyPanel trustSnapshot={trustSnapshot} />}

          <CategoryExplainer category={cat} expanded={explainerOpen} onToggle={() => setExplainerOpen(!explainerOpen)} onNavigateCategory={controller.switchCategory} />

          <ResultsStatus explainerOpen={explainerOpen} filteredCount={filtered.length} />

          <section aria-label={`${globalSearch ? "All categories" : selectedCategoryLabel} algorithms`} className="algoGrid" style={{ marginBottom: "18px" }}>
            {filtered.map((a) => (
              <AlgoCard key={a.id} algo={a} selected={sel.includes(a.id)} onToggle={() => controller.toggleSelection(a.id)} favorited={favorites.includes(a.id)} onToggleFavorite={() => toggleFavorite(a.id)} advisorPick={advisorHighlight === a.id} />
            ))}
          </section>

          <ComparisonWorkspace
            algorithms={selAlgos}
            comparing={cmp}
            categoryAccent={CATEGORY_ACCENT[cat]}
            rows={rows}
            onStartCompare={() => setCmp(true)}
            onClose={() => setCmp(false)}
            onCopyLink={controller.copyComparisonLink}
            onClearSelection={controller.clearComparison}
            onExportCsv={() => exportComparison("csv")}
            onExportMarkdown={() => exportComparison("markdown")}
            onExportJson={() => exportComparison("json")}
          />

          <ReferenceGuidePanel algorithms={filtered} />

          <KnowledgeSections
            showHybrid={showHybrid}
            showGuide={showGuide}
            showSafeUsage={showSafeUsage}
            showArchitectures={showArchitectures}
            showLibraries={showLibraries}
            showPhilosophy={showPhilosophy}
            showResources={showResources}
            onToggleHybrid={() => setShowHybrid((value) => !value)}
            onToggleGuide={() => setShowGuide((value) => !value)}
            onToggleSafeUsage={() => setShowSafeUsage((value) => !value)}
            onToggleArchitectures={() => setShowArchitectures((value) => !value)}
            onToggleLibraries={() => setShowLibraries((value) => !value)}
            onTogglePhilosophy={() => setShowPhilosophy((value) => !value)}
            onToggleResources={() => setShowResources((value) => !value)}
          />
        </main>

        <FooterShell trustSnapshot={trustSnapshot} />
      </div>
      <CounselButton variant="floating" ariaLabel="Open Crypto Counsel AI advisor" />
    </div>
  );
}
