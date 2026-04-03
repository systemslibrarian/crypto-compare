import { useCallback, type RefObject } from "react";
import type { AlgorithmCategory } from "@/types/crypto";

type SortOption = "name" | "security" | "pq" | "publicKey" | "signature";
type CountryFilter = "all" | "Korea" | "USA" | "Europe" | "Japan" | "China" | "Russia" | "Ukraine";

type UseCryptoCompareControllerArgs = {
  searchRef: RefObject<HTMLInputElement | null>;
  setCat: (value: AlgorithmCategory) => void;
  setAdv: (value: boolean) => void;
  setSel: (value: string[] | ((previous: string[]) => string[])) => void;
  setCmp: (value: boolean) => void;
  setExplainerOpen: (value: boolean) => void;
  setSearch: (value: string) => void;
  setPqOnly: (value: boolean) => void;
  setStandardOnly: (value: boolean) => void;
  setNistOnly: (value: boolean) => void;
  setDeployedOnly: (value: boolean) => void;
  setCountry: (value: CountryFilter) => void;
  setSortBy: (value: SortOption) => void;
  setShowMethodology: (value: boolean) => void;
  setShowHybrid: (value: boolean) => void;
  setShowDefaults: (value: boolean) => void;
  setShowGuide: (value: boolean) => void;
  setShowSafeUsage: (value: boolean) => void;
  setShowArchitectures: (value: boolean) => void;
  setShowPhilosophy: (value: boolean) => void;
  setShowLibraries: (value: boolean) => void;
  setShowFilters: (value: boolean) => void;
  setGlobalSearch: (value: boolean) => void;
  setFavOnly: (value: boolean) => void;
  setMobileNavOpen: (value: boolean) => void;
};

export function useCryptoCompareController({
  searchRef,
  setCat,
  setAdv,
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
  setShowFilters,
  setGlobalSearch,
  setFavOnly,
  setMobileNavOpen,
}: UseCryptoCompareControllerArgs) {
  const toggleSelection = useCallback(
    (id: string) => {
      setSel((previous) => (previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]));
      setCmp(false);
    },
    [setSel, setCmp],
  );

  const switchCategory = useCallback(
    (newCategory: AlgorithmCategory) => {
      setCat(newCategory);
      setSel([]);
      setCmp(false);
      setExplainerOpen(true);
    },
    [setCat, setSel, setCmp, setExplainerOpen],
  );

  const activateGlobalSearch = useCallback(() => {
    setGlobalSearch(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchRef, setGlobalSearch]);

  const showRecommendedDefaults = useCallback(() => {
    setShowDefaults(true);
    setFavOnly(false);
    setGlobalSearch(false);
  }, [setShowDefaults, setFavOnly, setGlobalSearch]);

  const clearComparison = useCallback(() => {
    setSel([]);
    setCmp(false);
  }, [setSel, setCmp]);

  const resetToMainMenu = useCallback(() => {
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
    setShowGuide(false);
    setShowSafeUsage(false);
    setShowArchitectures(false);
    setShowPhilosophy(false);
    setShowLibraries(false);
    setShowFilters(false);
    setGlobalSearch(false);
    setFavOnly(false);
    setMobileNavOpen(false);
    window.history.replaceState({}, "", window.location.pathname);
  }, [
    setCat,
    setAdv,
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
    setShowFilters,
    setGlobalSearch,
    setFavOnly,
    setMobileNavOpen,
  ]);

  const copyComparisonLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      console.warn("Clipboard unavailable; copy URL manually", url);
    }
  }, []);

  return {
    activateGlobalSearch,
    clearComparison,
    copyComparisonLink,
    resetToMainMenu,
    showRecommendedDefaults,
    switchCategory,
    toggleSelection,
  };
}