import { useEffect } from "react";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

type UrlState<Country extends string, Sort extends string> = {
  cat: AlgorithmCategory;
  cmp: boolean;
  sel: string[];
  search: string;
  pqOnly: boolean;
  standardOnly: boolean;
  nistOnly: boolean;
  deployedOnly: boolean;
  country: Country;
  sortBy: Sort;
  showDefaults: boolean;
  favOnly: boolean;
};

type UrlSetters<Country extends string, Sort extends string> = {
  setCat: (value: AlgorithmCategory) => void;
  setCmp: (value: boolean) => void;
  setSel: (value: string[]) => void;
  setSearch: (value: string) => void;
  setPqOnly: (value: boolean) => void;
  setStandardOnly: (value: boolean) => void;
  setNistOnly: (value: boolean) => void;
  setDeployedOnly: (value: boolean) => void;
  setCountry: (value: Country) => void;
  setSortBy: (value: Sort) => void;
  setShowDefaults: (value: boolean) => void;
  setFavOnly: (value: boolean) => void;
};

type ParsedUrlState<Country extends string, Sort extends string> = Partial<UrlState<Country, Sort>> & {
  algoId?: string;
};

type UseCryptoCompareUrlStateArgs<Country extends string, Sort extends string> = {
  state: UrlState<Country, Sort>;
  setters: UrlSetters<Country, Sort>;
  categoryOptions: readonly AlgorithmCategory[];
  countryOptions: readonly Country[];
  sortOptions: readonly Sort[];
  algorithms: Algorithm[];
};

export function parseCryptoCompareQueryState<Country extends string, Sort extends string>(
  searchString: string,
  options: {
    categoryOptions: readonly AlgorithmCategory[];
    countryOptions: readonly Country[];
    sortOptions: readonly Sort[];
    algorithms: Algorithm[];
  },
): ParsedUrlState<Country, Sort> {
  const params = new URLSearchParams(searchString);
  const parsed: ParsedUrlState<Country, Sort> = {};

  const catParam = params.get("cat") as AlgorithmCategory | null;
  const selectedParam = params.get("sel");
  const countryParam = params.get("country") as Country | null;
  const sortParam = params.get("sort") as Sort | null;

  if (catParam && options.categoryOptions.includes(catParam)) parsed.cat = catParam;
  if (selectedParam) parsed.sel = selectedParam.split(",").filter(Boolean);
  if (params.get("cmp") === "1") parsed.cmp = true;
  if (params.get("q")) parsed.search = params.get("q") || "";
  if (params.get("pq") === "1") parsed.pqOnly = true;
  if (params.get("std") === "1") parsed.standardOnly = true;
  if (params.get("nist") === "1") parsed.nistOnly = true;
  if (params.get("dep") === "1") parsed.deployedOnly = true;
  if (countryParam && options.countryOptions.includes(countryParam)) parsed.country = countryParam;
  if (sortParam && options.sortOptions.includes(sortParam)) parsed.sortBy = sortParam;
  if (params.get("defaults") === "1") parsed.showDefaults = true;
  if (params.get("fav") === "1") parsed.favOnly = true;

  const algoParam = params.get("algo");
  if (algoParam && options.algorithms.some((algorithm) => algorithm.id === algoParam)) {
    parsed.algoId = algoParam;
  }

  return parsed;
}

export const DEFAULT_CATEGORY: AlgorithmCategory = "symmetric";

export function buildCryptoCompareQueryString<Country extends string, Sort extends string>(state: UrlState<Country, Sort>) {
  const params = new URLSearchParams();
  if (state.cat !== DEFAULT_CATEGORY) params.set("cat", state.cat);
  if (state.cmp && state.sel.length >= 2) params.set("cmp", "1");
  if (state.sel.length > 0) params.set("sel", state.sel.join(","));
  if (state.search) params.set("q", state.search);
  if (state.pqOnly) params.set("pq", "1");
  if (state.standardOnly) params.set("std", "1");
  if (state.nistOnly) params.set("nist", "1");
  if (state.deployedOnly) params.set("dep", "1");
  if (state.country !== "all") params.set("country", state.country);
  if (state.sortBy !== "name") params.set("sort", state.sortBy);
  if (state.showDefaults) params.set("defaults", "1");
  if (state.favOnly) params.set("fav", "1");
  return params.toString();
}

export function useCryptoCompareUrlState<Country extends string, Sort extends string>({
  state,
  setters,
  categoryOptions,
  countryOptions,
  sortOptions,
  algorithms,
}: UseCryptoCompareUrlStateArgs<Country, Sort>) {
  const {
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
  } = state;

  useEffect(() => {
    const parsed = parseCryptoCompareQueryState(window.location.search, {
      categoryOptions,
      countryOptions,
      sortOptions,
      algorithms,
    });

    if (parsed.cat) setters.setCat(parsed.cat);
    if (parsed.sel) setters.setSel(parsed.sel);
    if (parsed.cmp) setters.setCmp(true);
    if (typeof parsed.search === "string") setters.setSearch(parsed.search);
    if (parsed.pqOnly) setters.setPqOnly(true);
    if (parsed.standardOnly) setters.setStandardOnly(true);
    if (parsed.nistOnly) setters.setNistOnly(true);
    if (parsed.deployedOnly) setters.setDeployedOnly(true);
    if (parsed.country) setters.setCountry(parsed.country);
    if (parsed.sortBy) setters.setSortBy(parsed.sortBy);
    if (parsed.showDefaults) setters.setShowDefaults(true);
    if (parsed.favOnly) setters.setFavOnly(true);

    if (parsed.algoId) {
      const algorithm = algorithms.find((item) => item.id === parsed.algoId);
      if (algorithm) {
        setters.setCat(algorithm.category);
        setters.setSel([algorithm.id]);
        setTimeout(() => {
          const element = document.getElementById(`algo-${algorithm.id}`);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
    // Initial URL hydration should run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const queryString = buildCryptoCompareQueryString({
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
    });
    window.history.replaceState({}, "", queryString ? `?${queryString}` : window.location.pathname);
  }, [cat, cmp, sel, search, pqOnly, standardOnly, nistOnly, deployedOnly, country, sortBy, showDefaults, favOnly]);
}