import type { Algorithm, RecommendationLevel } from "@/types/crypto";

export type TrustSnapshot = {
  earliest?: string;
  latest?: string;
  coverage: number;
  totalCitations: number;
  uniqueSources: number;
};

export type RecommendationCounts = Partial<Record<RecommendationLevel, number>>;

export function summarizeReviewWindow(algorithms: Algorithm[]): TrustSnapshot {
  let earliest: string | undefined;
  let latest: string | undefined;
  let coverage = 0;
  let totalCitations = 0;
  const uniqueSourceUrls = new Set<string>();

  for (const algo of algorithms) {
    if (algo.sources?.length) {
      totalCitations += algo.sources.length;
      for (const source of algo.sources) uniqueSourceUrls.add(source.url);
    }
    if (!algo.lastReviewed) continue;
    coverage += 1;
    if (!earliest || algo.lastReviewed < earliest) earliest = algo.lastReviewed;
    if (!latest || algo.lastReviewed > latest) latest = algo.lastReviewed;
  }

  return { earliest, latest, coverage, totalCitations, uniqueSources: uniqueSourceUrls.size };
}

export function countRecommendations(algorithms: Algorithm[]): RecommendationCounts {
  return algorithms.reduce<RecommendationCounts>((acc, algo) => {
    acc[algo.recommendation] = (acc[algo.recommendation] ?? 0) + 1;
    return acc;
  }, {});
}
