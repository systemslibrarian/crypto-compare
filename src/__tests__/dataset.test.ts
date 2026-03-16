import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
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
