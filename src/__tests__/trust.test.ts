import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { countRecommendations, summarizeReviewWindow } from "@/lib/trust";
import type { Algorithm } from "@/types/crypto";

function withProvenance(algo: Algorithm): Algorithm {
  const traced = ALGORITHM_PROVENANCE[algo.id];
  return {
    ...algo,
    sources: traced?.sources,
    lastReviewed: traced?.lastReviewed,
  };
}

describe("trust helpers", () => {
  const dataset = ALGORITHMS.map(withProvenance);

  it("summarizes provenance review window and source count", () => {
    const summary = summarizeReviewWindow(dataset);
    expect(summary.earliest).toBe("2026-03-16");
    expect(summary.latest).toBe("2026-04-09");
    expect(summary.coverage).toBe(dataset.length);
    expect(summary.totalSources).toBeGreaterThan(0);
  });

  it("counts recommendation levels in a filtered set", () => {
    const subset = dataset.filter((algo) => ["recommended", "acceptable", "research"].includes(algo.recommendation));
    const counts = countRecommendations(subset);
    expect((counts.recommended ?? 0) + (counts.acceptable ?? 0) + (counts.research ?? 0)).toBe(subset.length);
  });

  it("handles empty datasets safely", () => {
    const summary = summarizeReviewWindow([]);
    const counts = countRecommendations([]);

    expect(summary).toEqual({ earliest: undefined, latest: undefined, coverage: 0, totalSources: 0 });
    expect(counts).toEqual({});
  });
});