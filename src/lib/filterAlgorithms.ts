import { getSizeMetric } from "@/lib/dataset";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

const DEFAULT_RECOMMENDED_IDS = new Set(["xchacha20poly", "aes256gcm", "mlkem768", "mldsa65", "argon2id", "hmac_sha256", "kmac256"]);

export type AlgorithmSortOption = "name" | "security" | "pq" | "publicKey" | "signature";

export type FilterAlgorithmsOptions = {
  category: AlgorithmCategory;
  globalSearch: boolean;
  showDefaults: boolean;
  favoritesOnly: boolean;
  favorites: string[];
  search: string;
  pqOnly: boolean;
  standardOnly: boolean;
  nistOnly: boolean;
  deployedOnly: boolean;
  country: string;
  sortBy: AlgorithmSortOption;
};

export function filterAlgorithms(algorithms: Algorithm[], options: FilterAlgorithmsOptions): Algorithm[] {
  let items = options.globalSearch ? [...algorithms] : algorithms.filter((algorithm) => algorithm.category === options.category);

  if (options.showDefaults) {
    items = items.filter((algorithm) => DEFAULT_RECOMMENDED_IDS.has(algorithm.id));
  }

  if (options.favoritesOnly && options.favorites.length > 0) {
    items = items.filter((algorithm) => options.favorites.includes(algorithm.id));
  }

  if (options.search.trim()) {
    const query = options.search.trim().toLowerCase();
    items = items.filter((algorithm) => `${algorithm.name} ${algorithm.family} ${algorithm.useCases} ${algorithm.origin} ${algorithm.statusLabel} ${algorithm.category}`.toLowerCase().includes(query));
  }

  if (options.pqOnly) items = items.filter((algorithm) => algorithm.pqSecurityBits >= 128);
  if (options.standardOnly) items = items.filter((algorithm) => algorithm.standardized);
  if (options.nistOnly) items = items.filter((algorithm) => algorithm.nistStandardized);
  if (options.deployedOnly) items = items.filter((algorithm) => algorithm.widelyDeployed);
  if (options.country !== "all") items = items.filter((algorithm) => algorithm.countryTag === options.country);

  const sorted = [...items];
  sorted.sort((left, right) => {
    if (options.sortBy === "name") return left.name.localeCompare(right.name);
    if (options.sortBy === "security") return right.securityBits - left.securityBits;
    if (options.sortBy === "pq") return right.pqSecurityBits - left.pqSecurityBits;
    if (options.sortBy === "publicKey") return getSizeMetric(left, "publicKey") - getSizeMetric(right, "publicKey");
    return getSizeMetric(left, "signature") - getSizeMetric(right, "signature");
  });

  return sorted;
}