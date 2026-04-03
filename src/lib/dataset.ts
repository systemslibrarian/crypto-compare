import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import type { Algorithm } from "@/types/crypto";

function deriveCountryTag(origin: string): string {
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

export function withProvenance(algorithms: Algorithm[]): Algorithm[] {
  return algorithms.map((algorithm) => {
    const traced = ALGORITHM_PROVENANCE[algorithm.id];
    return {
      ...algorithm,
      sources: traced?.sources,
      lastReviewed: traced?.lastReviewed,
      standardized: algorithm.status === "standard",
      nistStandardized: algorithm.statusLabel.includes("NIST") || algorithm.statusLabel.includes("FIPS"),
      widelyDeployed: /deployed|widely|ubiquitous|default/i.test(`${algorithm.statusLabel} ${algorithm.notes}`),
      countryTag: deriveCountryTag(algorithm.origin),
    };
  });
}

export function getSizeMetric(algorithm: Algorithm, key: "publicKey" | "signature"): number {
  if (key === "publicKey" && "publicKeySize" in algorithm && typeof algorithm.publicKeySize === "number") {
    return algorithm.publicKeySize;
  }
  if (key === "signature" && "signatureSize" in algorithm && typeof algorithm.signatureSize === "number") {
    return algorithm.signatureSize;
  }
  return Number.MAX_SAFE_INTEGER;
}