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

  it("summarizes provenance review window, citations, and unique sources", () => {
    const summary = summarizeReviewWindow(dataset);
    const reviewDates = Object.values(ALGORITHM_PROVENANCE).map((entry) => entry.lastReviewed).sort();
    const sourceUrls = Object.values(ALGORITHM_PROVENANCE).flatMap((entry) => entry.sources.map((source) => source.url));
    expect(summary.earliest).toBe(reviewDates[0]);
    expect(summary.latest).toBe(reviewDates.at(-1));
    expect(summary.coverage).toBe(dataset.length);
    expect(summary.totalCitations).toBe(sourceUrls.length);
    expect(summary.uniqueSources).toBe(new Set(sourceUrls).size);
  });

  it("counts recommendation levels in a filtered set", () => {
    const subset = dataset.filter((algo) => ["recommended", "acceptable", "research"].includes(algo.recommendation));
    const counts = countRecommendations(subset);
    expect((counts.recommended ?? 0) + (counts.acceptable ?? 0) + (counts.research ?? 0)).toBe(subset.length);
  });

  it("handles empty datasets safely", () => {
    const summary = summarizeReviewWindow([]);
    const counts = countRecommendations([]);

    expect(summary).toEqual({ earliest: undefined, latest: undefined, coverage: 0, totalCitations: 0, uniqueSources: 0 });
    expect(counts).toEqual({});
  });
});
