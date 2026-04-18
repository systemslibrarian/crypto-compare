#!/usr/bin/env tsx
/**
 * Demo catalog sync check.
 *
 * Compares live demo slugs from https://systemslibrarian.github.io/crypto-lab/
 * with local demo URLs in src/data/demoResources.ts.
 *
 * Run:
 *   npx tsx scripts/check-demo-sync.ts
 *   npx tsx scripts/check-demo-sync.ts --strict
 */

import { ALGORITHM_DEMOS } from "../src/data/demoResources";

const LIVE_CATALOG_URL = "https://systemslibrarian.github.io/crypto-lab/";
const LIVE_SLUG_REGEX = /https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\//g;
const LOCAL_URL_REGEX = /^https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\/$/;
const STRICT_MODE = process.argv.includes("--strict");

type SyncResult = {
  liveSlugs: string[];
  localSlugs: string[];
  missingFromLocal: string[];
  onlyInLocal: string[];
  invalidLocalUrls: Array<{ algorithmId: string; url: string }>;
};

async function fetchLiveSlugs(): Promise<string[]> {
  const res = await fetch(LIVE_CATALOG_URL, {
    headers: { "User-Agent": "crypto-compare-demo-sync-check/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch live catalog: HTTP ${res.status}`);
  }

  const html = await res.text();
  const slugs = new Set<string>();
  let match: RegExpExecArray | null = LIVE_SLUG_REGEX.exec(html);

  while (match) {
    slugs.add(match[1]);
    match = LIVE_SLUG_REGEX.exec(html);
  }

  return Array.from(slugs).sort();
}

function getLocalSlugs(): { slugs: string[]; invalidLocalUrls: Array<{ algorithmId: string; url: string }> } {
  const slugs = new Set<string>();
  const invalidLocalUrls: Array<{ algorithmId: string; url: string }> = [];

  for (const [algorithmId, demos] of Object.entries(ALGORITHM_DEMOS)) {
    for (const demo of demos) {
      const match = demo.url.match(LOCAL_URL_REGEX);
      if (!match) {
        invalidLocalUrls.push({ algorithmId, url: demo.url });
        continue;
      }
      slugs.add(match[1]);
    }
  }

  return { slugs: Array.from(slugs).sort(), invalidLocalUrls };
}

function diffSlugs(liveSlugs: string[], localSlugs: string[]) {
  const liveSet = new Set(liveSlugs);
  const localSet = new Set(localSlugs);

  const missingFromLocal = liveSlugs.filter((slug) => !localSet.has(slug));
  const onlyInLocal = localSlugs.filter((slug) => !liveSet.has(slug));

  return { missingFromLocal, onlyInLocal };
}

function printResult(result: SyncResult) {
  console.log("\nDemo catalog sync check");
  console.log(`Live slugs:  ${result.liveSlugs.length}`);
  console.log(`Local slugs: ${result.localSlugs.length}`);

  if (result.invalidLocalUrls.length > 0) {
    console.log(`\nInvalid local demo URLs (${result.invalidLocalUrls.length}):`);
    for (const entry of result.invalidLocalUrls) {
      console.log(`  - [${entry.algorithmId}] ${entry.url}`);
    }
  }

  if (result.missingFromLocal.length > 0) {
    console.log(`\nMissing from local (${result.missingFromLocal.length}):`);
    for (const slug of result.missingFromLocal) {
      console.log(`  - ${slug}`);
    }
  }

  if (result.onlyInLocal.length > 0) {
    console.log(`\nOnly in local (${result.onlyInLocal.length}):`);
    for (const slug of result.onlyInLocal) {
      console.log(`  - ${slug}`);
    }
  }

  if (
    result.invalidLocalUrls.length === 0 &&
    result.missingFromLocal.length === 0 &&
    result.onlyInLocal.length === 0
  ) {
    console.log("\nAll demo slugs are in sync with the live catalog.");
  }
}

async function main() {
  try {
    const liveSlugs = await fetchLiveSlugs();
    const { slugs: localSlugs, invalidLocalUrls } = getLocalSlugs();
    const { missingFromLocal, onlyInLocal } = diffSlugs(liveSlugs, localSlugs);

    const result: SyncResult = {
      liveSlugs,
      localSlugs,
      missingFromLocal,
      onlyInLocal,
      invalidLocalUrls,
    };

    printResult(result);

    const hasIssues =
      result.invalidLocalUrls.length > 0 ||
      result.missingFromLocal.length > 0 ||
      result.onlyInLocal.length > 0;

    if (STRICT_MODE && hasIssues) {
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`\nFailed to run demo sync check: ${message}`);
    process.exit(1);
  }
}

main();
