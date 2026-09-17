import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES, CATEGORY_INFO } from "@/data/categories";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { CATALOG_EVIDENCE } from "@/data/catalogEvidence";
import { HYBRID_PATTERNS } from "@/data/hybridPatterns";
import { validateAlgorithms } from "@/lib/validation";
import { withProvenance } from "@/lib/dataset";
import type { AlgorithmCategory } from "@/types/crypto";

describe("Algorithm Dataset", () => {
  it("has no validation errors", () => {
    const errors = validateAlgorithms(ALGORITHMS);
    expect(errors).toEqual([]);
  });

  it("has no duplicate IDs", () => {
    const ids = ALGORITHMS.map((a) => a.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it("uses unique operation profiles outside each record's primary category", () => {
    for (const algorithm of ALGORITHMS) {
      const profileCategories = algorithm.operationProfiles?.map((profile) => profile.category) ?? [];
      expect(profileCategories).not.toContain(algorithm.category);
      expect(new Set(profileCategories).size).toBe(profileCategories.length);
    }
  });

  it("has at least 55 algorithms", () => {
    expect(ALGORITHMS.length).toBeGreaterThanOrEqual(55);
  });

  it("covers all defined categories", () => {
    const categoryIds = CATEGORIES.map((c) => c.id);
    const coveredCategories = new Set(ALGORITHMS.map((a) => a.category));
    for (const catId of categoryIds) {
      expect(coveredCategories.has(catId as AlgorithmCategory)).toBe(true);
    }
  });

  it("has positive security bits for all algorithms", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.securityBits).toBeGreaterThan(0);
    }
  });

  it("has valid status values", () => {
    for (const algo of ALGORITHMS) {
      expect(["standard", "candidate"]).toContain(algo.status);
    }
  });

  it("has non-empty names and families", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.name.length).toBeGreaterThan(0);
      expect(algo.family.length).toBeGreaterThan(0);
    }
  });
});

describe("Categories", () => {
  it("has at least 12 categories", () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(12);
  });

  it("has unique category IDs", () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each category has a label and icon", () => {
    for (const cat of CATEGORIES) {
      expect(cat.label.length).toBeGreaterThan(0);
      expect(cat.icon.length).toBeGreaterThan(0);
    }
  });

  it("covers every related public project listed in the README", () => {
    const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");
    const relatedProjectsSection = readme.match(/## Related Projects([\s\S]*?)---/)?.[1] ?? "";
    const readmeRepos = Array.from(
      new Set(Array.from(relatedProjectsSection.matchAll(/https:\/\/github\.com\/systemslibrarian\/([A-Za-z0-9._-]+)/g), (match) => match[1])),
    );
    const listedRepos = new Set(
      Object.values(CATEGORY_INFO)
        .flatMap((category) => category.projects)
        .map((project) => project.url?.match(/github\.com\/systemslibrarian\/([A-Za-z0-9._-]+)/)?.[1])
        .filter((repo): repo is string => Boolean(repo)),
    );

    const missingRepos = readmeRepos.filter((repo) => !listedRepos.has(repo));
    expect(missingRepos).toEqual([]);
  });
});

describe("Provenance", () => {
  it("covers all algorithm IDs", () => {
    const missing = ALGORITHMS.filter((a) => !ALGORITHM_PROVENANCE[a.id]);
    expect(missing.map((a) => a.id)).toEqual([]);
  });

  it("every provenance entry has at least one source", () => {
    for (const [id, entry] of Object.entries(ALGORITHM_PROVENANCE)) {
      expect(entry.sources.length, `${id} should have sources`).toBeGreaterThan(0);
    }
  });

  it("every provenance entry has a lastReviewed date", () => {
    for (const [id, entry] of Object.entries(ALGORITHM_PROVENANCE)) {
      expect(entry.lastReviewed, `${id} should have lastReviewed`).toBeTruthy();
      expect(entry.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("includes the final NIST lightweight AEAD profile", () => {
    const ascon = ALGORITHMS.find((algorithm) => algorithm.id === "ascon_aead128");
    expect(ascon?.statusLabel).toBe("NIST SP 800-232");
    expect(ascon?.category).toBe("symmetric");
    expect(ascon?.securityBits).toBe(128);
    expect(ascon?.pqSecurityBits).toBe(64);
  });

  it("includes all three FIPS 203 ML-KEM parameter sets", () => {
    const ids = new Set(ALGORITHMS.filter((algorithm) => algorithm.category === "kem").map((algorithm) => algorithm.id));
    expect(ids.has("mlkem512")).toBe(true);
    expect(ids.has("mlkem768")).toBe(true);
    expect(ids.has("mlkem1024")).toBe(true);
  });

  it("includes all three FIPS 204 ML-DSA parameter sets", () => {
    const ids = new Set(ALGORITHMS.filter((algorithm) => algorithm.category === "signature").map((algorithm) => algorithm.id));
    expect(ids.has("mldsa44")).toBe(true);
    expect(ids.has("mldsa65")).toBe(true);
    expect(ids.has("mldsa87")).toBe(true);
  });

  it("every source has required fields", () => {
    for (const [id, entry] of Object.entries(ALGORITHM_PROVENANCE)) {
      for (const source of entry.sources) {
        expect(source.label.length, `${id}: source label`).toBeGreaterThan(0);
        expect(source.url.length, `${id}: source url`).toBeGreaterThan(0);
        expect(source.note.length, `${id}: source note`).toBeGreaterThan(0);
        expect(["standard", "analysis", "deployment", "benchmark"]).toContain(source.kind);
        expect(source.supports.length, `${id}: supported claims`).toBeGreaterThan(0);
      }
    }
  });
});

describe("Catalog Evidence", () => {
  it("covers every algorithm exactly once", () => {
    const algorithmIds = new Set(ALGORITHMS.map((algorithm) => algorithm.id));
    const evidenceIds = Object.keys(CATALOG_EVIDENCE);

    expect(evidenceIds.filter((id) => !algorithmIds.has(id))).toEqual([]);
    expect(ALGORITHMS.filter((algorithm) => !CATALOG_EVIDENCE[algorithm.id]).map((algorithm) => algorithm.id)).toEqual([]);
    expect(evidenceIds).toHaveLength(algorithmIds.size);
  });

  it("does not mark pending NIST selections as final publications", () => {
    expect(CATALOG_EVIDENCE.hqc.standardization.stage).toBe("selected");
    expect(CATALOG_EVIDENCE.falcon512.standardization.stage).toBe("selected");
  });

  it("passes schema validation after evidence is attached", () => {
    expect(validateAlgorithms(withProvenance(ALGORITHMS))).toEqual([]);
  });
});

describe("Trust Hardening Fields", () => {
  const ESTIMATION_BASES = ["exact", "conservative", "estimated", "speculative"];

  it("every algorithm has recommendationRationale (≥10 chars)", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.recommendationRationale.length, `${algo.id}: rationale too short`).toBeGreaterThanOrEqual(10);
    }
  });

  it("every algorithm has recommendationChangesWhen (≥10 chars)", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.recommendationChangesWhen.length, `${algo.id}: changesWhen too short`).toBeGreaterThanOrEqual(10);
    }
  });

  it("every algorithm has whyNotThis (≥10 chars)", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.whyNotThis.length, `${algo.id}: whyNotThis too short`).toBeGreaterThanOrEqual(10);
    }
  });

  it("every algorithm has assumptions (≥10 chars)", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.assumptions.length, `${algo.id}: assumptions too short`).toBeGreaterThanOrEqual(10);
    }
  });

  it("every algorithm has valid estimationMethodology", () => {
    for (const algo of ALGORITHMS) {
      const m = algo.estimationMethodology;
      expect(ESTIMATION_BASES, `${algo.id}: invalid classicalBasis`).toContain(m.classicalBasis);
      expect(ESTIMATION_BASES, `${algo.id}: invalid quantumBasis`).toContain(m.quantumBasis);
      expect(m.classicalNote.length, `${algo.id}: classicalNote empty`).toBeGreaterThan(0);
      expect(m.quantumNote.length, `${algo.id}: quantumNote empty`).toBeGreaterThan(0);
    }
  });

  it("legacy/avoid algorithms mention migration in rationale", () => {
    const legacyAvoid = ALGORITHMS.filter((a) => a.recommendation === "legacy" || a.recommendation === "avoid");
    expect(legacyAvoid.length).toBeGreaterThan(0);
    for (const algo of legacyAvoid) {
      const r = algo.recommendationRationale.toLowerCase();
      const hasMigration = r.includes("migrat") || r.includes("replac") || r.includes("backward compat") || r.includes("retained only");
      expect(hasMigration, `${algo.id}: legacy/avoid rationale should mention migration`).toBe(true);
    }
  });

  it("warns that ChaCha20-Poly1305 nonce reuse endangers authentication", () => {
    const chacha20Poly1305 = ALGORITHMS.find((algorithm) => algorithm.id === "chacha20poly");

    expect(chacha20Poly1305).toBeDefined();
    expect(chacha20Poly1305?.assumptions.toLowerCase()).toContain("authentication forgeries");
    expect(chacha20Poly1305?.assumptions.toLowerCase()).not.toContain("but not authenticity");
  });

  it("does not make absolute side-channel claims", () => {
    const serializedAlgorithms = JSON.stringify(ALGORITHMS).toLowerCase();

    expect(serializedAlgorithms).not.toContain("constant-time by construction");
    expect(serializedAlgorithms).not.toContain("immune to cache-timing");
    expect(serializedAlgorithms).not.toContain("requires aes-ni for timing-safe");
  });

  it("does not present AES-GCM as a full-disk-encryption mode", () => {
    const aesGcm = ALGORITHMS.find((algorithm) => algorithm.id === "aes256gcm");

    expect(aesGcm).toBeDefined();
    expect(aesGcm?.useCases).toContain("XTS-AES");
    expect(aesGcm?.useCases).not.toMatch(/TLS 1\.3, disk encryption/i);
  });
});

describe("Hybrid Patterns", () => {
  it("has at least 5 patterns", () => {
    expect(HYBRID_PATTERNS.length).toBeGreaterThanOrEqual(5);
  });

  it("has unique pattern IDs", () => {
    const ids = HYBRID_PATTERNS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every pattern has required fields", () => {
    for (const p of HYBRID_PATTERNS) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(["key-exchange", "signature", "encryption", "hash-and-sign"]).toContain(p.category);
      expect(p.classical.length).toBeGreaterThan(0);
      expect(p.postQuantum.length).toBeGreaterThan(0);
      expect(p.combinationMethod.length).toBeGreaterThan(0);
      expect(p.rationale.length).toBeGreaterThan(0);
      expect(p.limitations.length).toBeGreaterThan(0);
      expect(["recommended", "acceptable", "research"]).toContain(p.recommendation);
    }
  });

  it("every pattern has at least one deployment reference", () => {
    for (const p of HYBRID_PATTERNS) {
      expect(p.deployedIn.length, `${p.id}: should have at least one deployedIn entry`).toBeGreaterThan(0);
    }
  });

  it("has at least one recommended pattern", () => {
    const recommended = HYBRID_PATTERNS.filter((p) => p.recommendation === "recommended");
    expect(recommended.length).toBeGreaterThanOrEqual(1);
  });
});
