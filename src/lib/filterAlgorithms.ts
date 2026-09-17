import { getSizeMetric } from "@/lib/dataset";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

const DEFAULT_RECOMMENDED_IDS = new Set(["xchacha20poly", "aes256gcm", "curve25519", "ed25519", "mlkem768", "mldsa65", "argon2id", "hmac_sha256", "kmac256"]);

export type AlgorithmSortOption = "name" | "publicKey" | "signature";

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

export function belongsToCategory(algorithm: Algorithm, category: AlgorithmCategory): boolean {
  return algorithm.category === category
    || algorithm.operationProfiles?.some((profile) => profile.category === category) === true;
}

export function countAlgorithmsByCategory(algorithms: Algorithm[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const algorithm of algorithms) {
    const categories = new Set<AlgorithmCategory>([
      algorithm.category,
      ...(algorithm.operationProfiles?.map((profile) => profile.category) ?? []),
    ]);
    for (const category of categories) counts[category] = (counts[category] ?? 0) + 1;
  }
  return counts;
}

export function filterAlgorithms(algorithms: Algorithm[], options: FilterAlgorithmsOptions): Algorithm[] {
  let items = options.globalSearch ? [...algorithms] : algorithms.filter((algorithm) => belongsToCategory(algorithm, options.category));

  if (options.showDefaults) {
    items = items.filter((algorithm) => DEFAULT_RECOMMENDED_IDS.has(algorithm.id));
  }

  if (options.favoritesOnly && options.favorites.length > 0) {
    items = items.filter((algorithm) => options.favorites.includes(algorithm.id));
  }

  if (options.search.trim()) {
    const query = options.search.trim().toLowerCase();
    items = items.filter((algorithm) => `${algorithm.name} ${algorithm.family} ${algorithm.useCases} ${algorithm.origin} ${algorithm.statusLabel} ${algorithm.category} ${algorithm.operationProfiles?.map((profile) => `${profile.category} ${profile.label}`).join(" ") ?? ""}`.toLowerCase().includes(query));
  }

  if (options.pqOnly) items = items.filter((algorithm) => algorithm.pqRelevance === "pq-safe");
  if (options.standardOnly) {
    items = items.filter((algorithm) =>
      algorithm.catalogEvidence?.standardization.stage === "final"
      && algorithm.catalogEvidence.standardization.formalPublication,
    );
  }
  if (options.nistOnly) {
    items = items.filter((algorithm) =>
      algorithm.catalogEvidence?.standardization.stage === "final"
      && algorithm.catalogEvidence.standardization.formalPublication
      && algorithm.catalogEvidence.standardization.bodies.includes("NIST"),
    );
  }
  if (options.deployedOnly) {
    items = items.filter((algorithm) =>
      algorithm.catalogEvidence?.deployment.level === "ubiquitous"
      || algorithm.catalogEvidence?.deployment.level === "widespread",
    );
  }
  if (options.country !== "all") items = items.filter((algorithm) => algorithm.countryTag === options.country);

  const sorted = [...items];
  sorted.sort((left, right) => {
    if (options.sortBy === "name") return left.name.localeCompare(right.name);
    if (options.sortBy === "publicKey") return getSizeMetric(left, "publicKey") - getSizeMetric(right, "publicKey");
    return getSizeMetric(left, "signature") - getSizeMetric(right, "signature");
  });

  return sorted;
}
