import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import { withProvenance } from "@/lib/dataset";
import { countAlgorithmsByCategory, filterAlgorithms } from "@/lib/filterAlgorithms";
import type { Algorithm } from "@/types/crypto";

const algorithms: Algorithm[] = [
  {
    id: "aes256gcm",
    name: "AES-256-GCM",
    category: "symmetric",
    family: "AES",
    origin: "Belgium",
    originDetail: "NIST",
    useCases: "TLS",
    status: "standard",
    statusLabel: "NIST Standard",
    recommendation: "recommended",
    recommendationRationale: "Default",
    recommendationChangesWhen: "Changes",
    whyNotThis: "None",
    assumptions: "Trusted implementation",
    securityBits: 256,
    pqSecurityBits: 128,
    bestAttack: "Brute force",
    reductionQuality: "Strong",
    performance: "Fast",
    notes: "widely deployed",
    estimationMethodology: {
      classicalBasis: "exact",
      quantumBasis: "exact",
      classicalNote: "Exact",
      quantumNote: "Grover",
    },
    keySize: 256,
    nonceSize: 96,
    tagSize: 128,
    blockSize: 128,
    catalogEvidence: {
      standardization: { stage: "final", formalPublication: true, bodies: ["NIST"] },
      deployment: { level: "ubiquitous" },
    },
    countryTag: "Europe",
    pqRelevance: "pq-ready",
  },
  {
    id: "xchacha20poly",
    name: "XChaCha20-Poly1305",
    category: "symmetric",
    family: "ChaCha",
    origin: "United States",
    originDetail: "IETF",
    useCases: "Messaging",
    status: "candidate",
    statusLabel: "RFC",
    recommendation: "recommended",
    recommendationRationale: "Strong",
    recommendationChangesWhen: "Changes",
    whyNotThis: "None",
    assumptions: "Trusted implementation",
    securityBits: 256,
    pqSecurityBits: 128,
    bestAttack: "Brute force",
    reductionQuality: "Strong",
    performance: "Fast",
    notes: "software optimized",
    estimationMethodology: {
      classicalBasis: "exact",
      quantumBasis: "exact",
      classicalNote: "Exact",
      quantumNote: "Grover",
    },
    keySize: 256,
    nonceSize: 192,
    tagSize: 128,
    blockSize: null,
    catalogEvidence: {
      standardization: { stage: "draft", formalPublication: false, bodies: ["IRTF"] },
      deployment: { level: "limited" },
    },
    countryTag: "USA",
    pqRelevance: "pq-safe",
  },
];

describe("filterAlgorithms", () => {
  it("surfaces curve-backed operations in their applied categories without duplicating records", () => {
    const dataset = withProvenance(ALGORITHMS);
    const baseOptions = {
      globalSearch: false,
      showDefaults: false,
      favoritesOnly: false,
      favorites: [],
      search: "",
      pqOnly: false,
      standardOnly: false,
      nistOnly: false,
      deployedOnly: false,
      country: "all",
      sortBy: "name" as const,
    };
    const keyExchange = filterAlgorithms(dataset, { ...baseOptions, category: "kem" });
    const signatures = filterAlgorithms(dataset, { ...baseOptions, category: "signature" });

    expect(keyExchange.map((algorithm) => algorithm.id)).toContain("curve25519");
    expect(signatures.map((algorithm) => algorithm.id)).toContain("ed25519");
    expect(new Set(keyExchange.map((algorithm) => algorithm.id)).size).toBe(keyExchange.length);
    expect(new Set(signatures.map((algorithm) => algorithm.id)).size).toBe(signatures.length);
  });

  it("includes operation profiles in category counts", () => {
    const counts = countAlgorithmsByCategory(ALGORITHMS);
    expect(counts.kem).toBe(ALGORITHMS.filter((algorithm) => algorithm.category === "kem").length + 1);
    expect(counts.signature).toBe(ALGORITHMS.filter((algorithm) => algorithm.category === "signature").length + 1);
  });

  it("filters by favorites, search, and sort order", () => {
    const filtered = filterAlgorithms(algorithms, {
      category: "symmetric",
      globalSearch: false,
      showDefaults: false,
      favoritesOnly: true,
      favorites: ["xchacha20poly"],
      search: "cha",
      pqOnly: false,
      standardOnly: false,
      nistOnly: false,
      deployedOnly: false,
      country: "all",
      sortBy: "name",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("xchacha20poly");
  });

  it("applies standards and country filters", () => {
    const filtered = filterAlgorithms(algorithms, {
      category: "symmetric",
      globalSearch: false,
      showDefaults: false,
      favoritesOnly: false,
      favorites: [],
      search: "",
      pqOnly: false,
      standardOnly: true,
      nistOnly: true,
      deployedOnly: true,
      country: "Europe",
      sortBy: "name",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("aes256gcm");
  });

  it("keeps only explicitly PQ-safe entries when PQ-only is enabled", () => {
    const filtered = filterAlgorithms(algorithms, {
      category: "symmetric",
      globalSearch: false,
      showDefaults: false,
      favoritesOnly: false,
      favorites: [],
      search: "",
      pqOnly: true,
      standardOnly: false,
      nistOnly: false,
      deployedOnly: false,
      country: "all",
      sortBy: "name",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("xchacha20poly");
  });

  it("does not treat NIST selections as final NIST publications", () => {
    const filtered = filterAlgorithms(withProvenance(ALGORITHMS), {
      category: "kem",
      globalSearch: true,
      showDefaults: false,
      favoritesOnly: false,
      favorites: [],
      search: "",
      pqOnly: false,
      standardOnly: false,
      nistOnly: true,
      deployedOnly: false,
      country: "all",
      sortBy: "name",
    });
    const ids = filtered.map((algorithm) => algorithm.id);

    expect(ids).toContain("mlkem768");
    expect(ids).not.toContain("hqc");
    expect(ids).not.toContain("falcon512");
  });

  it("does not treat research protocols as final publications", () => {
    const filtered = filterAlgorithms(withProvenance(ALGORITHMS), {
      category: "zkp",
      globalSearch: true,
      showDefaults: false,
      favoritesOnly: false,
      favorites: [],
      search: "",
      pqOnly: false,
      standardOnly: true,
      nistOnly: false,
      deployedOnly: false,
      country: "all",
      sortBy: "name",
    });
    const ids = filtered.map((algorithm) => algorithm.id);

    expect(ids).not.toContain("groth16");
    expect(ids).not.toContain("plonk");
    expect(ids).not.toContain("spdz");
  });

  it("uses explicit deployment levels rather than prose matches", () => {
    const filtered = filterAlgorithms(withProvenance(ALGORITHMS), {
      category: "kdf",
      globalSearch: true,
      showDefaults: false,
      favoritesOnly: false,
      favorites: [],
      search: "",
      pqOnly: false,
      standardOnly: false,
      nistOnly: false,
      deployedOnly: true,
      country: "all",
      sortBy: "name",
    });
    const ids = filtered.map((algorithm) => algorithm.id);

    expect(ids).toContain("aes256gcm");
    expect(ids).not.toContain("balloon");
    expect(ids).not.toContain("bfv");
    expect(ids).not.toContain("wow_stego");
  });
});
