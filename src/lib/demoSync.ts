import type { DemoResource } from "@/data/demoResources";

const LIVE_SLUG_PATTERN = /\/(crypto-lab-[a-z0-9-]+)(?=\/|["'?#\s<])/g;
const LOCAL_URL_PATTERN =
  /^https:\/\/(?:crypto-lab\.systemslibrarian\.dev|systemslibrarian\.github\.io)\/(crypto-lab-[a-z0-9-]+)\/$/;

// Slugs that live on the catalog domain but are not teaching labs (award badges,
// landing pages, etc.) and therefore have no algorithm to map to.
const NON_LAB_SLUGS = new Set<string>([
  "crypto-lab-2026", // 2026 Cybersecurity Excellence Awards badge link, not a lab
]);

export type InvalidLocalDemoUrl = {
  algorithmId: string;
  url: string;
};

export function extractLiveSlugsFromHtml(html: string): string[] {
  const slugs = new Set<string>();
  for (const match of html.matchAll(LIVE_SLUG_PATTERN)) {
    if (NON_LAB_SLUGS.has(match[1])) continue;
    slugs.add(match[1]);
  }
  return Array.from(slugs).sort();
}

export function extractLocalSlugs(
  algorithmDemos: Record<string, DemoResource[]>,
): { slugs: string[]; invalidLocalUrls: InvalidLocalDemoUrl[] } {
  const slugs = new Set<string>();
  const invalidLocalUrls: InvalidLocalDemoUrl[] = [];

  for (const [algorithmId, demos] of Object.entries(algorithmDemos)) {
    for (const demo of demos) {
      const match = demo.url.match(LOCAL_URL_PATTERN);
      if (!match) {
        invalidLocalUrls.push({ algorithmId, url: demo.url });
        continue;
      }
      slugs.add(match[1]);
    }
  }

  return { slugs: Array.from(slugs).sort(), invalidLocalUrls };
}

/**
 * `exclusions` maps a live slug to the reason it deliberately has no entry in
 * ALGORITHM_DEMOS (see src/data/demoExclusions.ts).
 *
 * It subtracts from `missingFromLocal` and from nothing else. Two new ways to
 * fail come with it, because an exclusion list that only ever silences things
 * rots into a list of problems nobody can see any more:
 *
 *   staleExclusions         excluded, but no longer live — the reason is about
 *                           a demo that is gone, so the line has to go too.
 *   contradictoryExclusions excluded AND attached — two answers for one slug,
 *                           and no way to tell which one was meant.
 *
 * Everything else is unchanged: a live slug that is neither attached nor
 * excluded is still `missingFromLocal`, and a local slug that is not live is
 * still `onlyInLocal`.
 */
export function diffDemoSlugs(
  liveSlugs: string[],
  localSlugs: string[],
  exclusions: Record<string, string> = {},
) {
  const liveSet = new Set(liveSlugs);
  const localSet = new Set(localSlugs);
  const excludedSlugs = Object.keys(exclusions);
  const excludedSet = new Set(excludedSlugs);

  const missingFromLocal = liveSlugs.filter(
    (slug) => !localSet.has(slug) && !excludedSet.has(slug),
  );
  const onlyInLocal = localSlugs.filter((slug) => !liveSet.has(slug));
  const excluded = excludedSlugs.filter((slug) => liveSet.has(slug));
  const staleExclusions = excludedSlugs.filter((slug) => !liveSet.has(slug));
  const contradictoryExclusions = excludedSlugs.filter((slug) => localSet.has(slug));

  return { missingFromLocal, onlyInLocal, excluded, staleExclusions, contradictoryExclusions };
}
