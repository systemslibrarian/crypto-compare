import { describe, expect, it } from "vitest";
import { filterAlgorithms } from "@/lib/filterAlgorithms";
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
    standardized: true,
    nistStandardized: true,
    widelyDeployed: true,
    countryTag: "Europe",
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
    standardized: false,
    nistStandardized: false,
    widelyDeployed: false,
    countryTag: "USA",
  },
];

describe("filterAlgorithms", () => {
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
      sortBy: "security",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("aes256gcm");
  });
});