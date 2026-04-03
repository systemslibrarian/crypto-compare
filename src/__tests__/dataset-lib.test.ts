import { describe, expect, it } from "vitest";
import { getSizeMetric, withProvenance } from "@/lib/dataset";
import type { Algorithm } from "@/types/crypto";

const signatureAlgorithm: Algorithm = {
  id: "mldsa65",
  name: "ML-DSA-65",
  category: "signature",
  family: "ML-DSA",
  origin: "United States",
  originDetail: "NIST",
  useCases: "Signatures",
  status: "standard",
  statusLabel: "NIST FIPS",
  recommendation: "recommended",
  recommendationRationale: "Standardized",
  recommendationChangesWhen: "Changes",
  whyNotThis: "None",
  assumptions: "Trusted implementation",
  securityBits: 192,
  pqSecurityBits: 192,
  bestAttack: "Unknown",
  reductionQuality: "Strong",
  performance: "Good",
  notes: "widely deployed default",
  estimationMethodology: {
    classicalBasis: "conservative",
    quantumBasis: "conservative",
    classicalNote: "Conservative",
    quantumNote: "Conservative",
  },
  publicKeySize: 1952,
  signatureSize: 3309,
};

describe("dataset helpers", () => {
  it("adds provenance-derived trust fields", () => {
    const [algorithm] = withProvenance([signatureAlgorithm]);

    expect(algorithm.standardized).toBe(true);
    expect(algorithm.nistStandardized).toBe(true);
    expect(algorithm.widelyDeployed).toBe(true);
    expect(algorithm.countryTag).toBe("USA");
  });

  it("returns size metrics or a large sentinel when missing", () => {
    expect(getSizeMetric(signatureAlgorithm, "publicKey")).toBe(1952);
    expect(getSizeMetric(signatureAlgorithm, "signature")).toBe(3309);
  });
});