import type { Algorithm, RecommendationLevel } from "@/types/crypto";

export type TrustSnapshot = {
  earliest?: string;
  latest?: string;
  coverage: number;
  totalSources: number;
};

export type RecommendationCounts = Partial<Record<RecommendationLevel, number>>;

export function summarizeReviewWindow(algorithms: Algorithm[]): TrustSnapshot {
  let earliest: string | undefined;
  let latest: string | undefined;
  let coverage = 0;
  let totalSources = 0;

  for (const algo of algorithms) {
    if (algo.sources?.length) totalSources += algo.sources.length;
    if (!algo.lastReviewed) continue;
    coverage += 1;
    if (!earliest || algo.lastReviewed < earliest) earliest = algo.lastReviewed;
    if (!latest || algo.lastReviewed > latest) latest = algo.lastReviewed;
  }

  return { earliest, latest, coverage, totalSources };
}

export function countRecommendations(algorithms: Algorithm[]): RecommendationCounts {
  return algorithms.reduce<RecommendationCounts>((acc, algo) => {
    acc[algo.recommendation] = (acc[algo.recommendation] ?? 0) + 1;
    return acc;
  }, {});
}