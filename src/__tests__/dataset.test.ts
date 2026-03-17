import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { HYBRID_PATTERNS } from "@/data/hybridPatterns";
import { validateAlgorithms } from "@/lib/validation";
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

  it("every source has required fields", () => {
    for (const [id, entry] of Object.entries(ALGORITHM_PROVENANCE)) {
      for (const source of entry.sources) {
        expect(source.label.length, `${id}: source label`).toBeGreaterThan(0);
        expect(source.url.length, `${id}: source url`).toBeGreaterThan(0);
        expect(source.note.length, `${id}: source note`).toBeGreaterThan(0);
        expect(["standard", "analysis", "deployment", "benchmark"]).toContain(source.kind);
      }
    }
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
