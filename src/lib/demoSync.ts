import type { DemoResource } from "@/data/demoResources";

const LIVE_SLUG_PATTERN = /https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\//g;
const LOCAL_URL_PATTERN = /^https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\/$/;

export type InvalidLocalDemoUrl = {
  algorithmId: string;
  url: string;
};

export function extractLiveSlugsFromHtml(html: string): string[] {
  const slugs = new Set<string>();
  for (const match of html.matchAll(LIVE_SLUG_PATTERN)) {
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

export function diffDemoSlugs(liveSlugs: string[], localSlugs: string[]) {
  const liveSet = new Set(liveSlugs);
  const localSet = new Set(localSlugs);

  const missingFromLocal = liveSlugs.filter((slug) => !localSet.has(slug));
  const onlyInLocal = localSlugs.filter((slug) => !liveSet.has(slug));

  return { missingFromLocal, onlyInLocal };
}
