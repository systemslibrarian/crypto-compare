import { ALGORITHM_DEMOS } from "@/data/demoResources";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";
import type { AlgorithmCategory } from "@/types/crypto";

export type Lab = {
  slug: string;
  title: string;
  url: string;
  note: string;
  algorithms: { id: string; name: string }[];
  categories: AlgorithmCategory[];
};

const SLUG_FROM_URL = /\/(crypto-lab-[a-z0-9-]+)\/?$/;

const ALGO_BY_ID = new Map(ALGORITHMS.map((algorithm) => [algorithm.id, algorithm]));

/**
 * Flattens the per-algorithm ALGORITHM_DEMOS mapping into a unique, sorted list
 * of crypto-labs, each annotated with the algorithms and categories that link
 * to it. This is the source for the discoverable /labs index.
 */
export function buildLabIndex(): Lab[] {
  const bySlug = new Map<string, Lab>();

  for (const [algorithmId, demos] of Object.entries(ALGORITHM_DEMOS)) {
    const algorithm = ALGO_BY_ID.get(algorithmId);
    if (!algorithm) continue;

    for (const demo of demos) {
      const slug = demo.url.match(SLUG_FROM_URL)?.[1];
      if (!slug) continue;

      const existing = bySlug.get(slug);
      if (existing) {
        if (!existing.algorithms.some((entry) => entry.id === algorithm.id)) {
          existing.algorithms.push({ id: algorithm.id, name: algorithm.name });
        }
        if (!existing.categories.includes(algorithm.category)) {
          existing.categories.push(algorithm.category);
        }
        continue;
      }

      bySlug.set(slug, {
        slug,
        title: demo.title,
        url: demo.url,
        note: demo.note,
        algorithms: [{ id: algorithm.id, name: algorithm.name }],
        categories: [algorithm.category],
      });
    }
  }

  return Array.from(bySlug.values())
    .map((lab) => ({
      ...lab,
      algorithms: lab.algorithms.sort((a, b) => a.name.localeCompare(b.name)),
      categories: lab.categories.sort(),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

const CATEGORY_LABEL = new Map(CATEGORIES.map((category) => [category.id, category.label]));

export function categoryLabel(category: AlgorithmCategory): string {
  return CATEGORY_LABEL.get(category) ?? category;
}
