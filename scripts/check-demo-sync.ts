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
 *   npx tsx scripts/check-demo-sync.ts --json
 *   npx tsx scripts/check-demo-sync.ts --live-html-path=/tmp/crypto-lab.html --strict
 */

import { ALGORITHM_DEMOS } from "../src/data/demoResources";
import { diffDemoSlugs, extractLiveSlugsFromHtml, extractLocalSlugs } from "../src/lib/demoSync";
import { readFileSync, writeFileSync } from "node:fs";

const LIVE_CATALOG_URL = "https://systemslibrarian.github.io/crypto-lab/";
const STRICT_MODE = process.argv.includes("--strict");
const JSON_MODE = process.argv.includes("--json");
const REPORT_PATH_ARG = process.argv.find((arg) => arg.startsWith("--report-path="));
const REPORT_PATH = REPORT_PATH_ARG ? REPORT_PATH_ARG.split("=")[1] : null;
const LIVE_HTML_PATH_ARG = process.argv.find((arg) => arg.startsWith("--live-html-path="));
const LIVE_HTML_PATH = LIVE_HTML_PATH_ARG ? LIVE_HTML_PATH_ARG.split("=")[1] : null;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;

type SyncResult = {
  liveSlugs: string[];
  localSlugs: string[];
  missingFromLocal: string[];
  onlyInLocal: string[];
  invalidLocalUrls: Array<{ algorithmId: string; url: string }>;
};

type SyncReport = SyncResult & {
  generatedAt: string;
  hasIssues: boolean;
};

async function fetchLiveCatalogHtml(): Promise<string> {
  if (LIVE_HTML_PATH) {
    return readFileSync(LIVE_HTML_PATH, "utf8");
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(LIVE_CATALOG_URL, {
        headers: { "User-Agent": "crypto-compare-demo-sync-check/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Failed to fetch live catalog: HTTP ${res.status}`);
      }

      return await res.text();
    } catch (error) {
      clearTimeout(timeout);
      const message = error instanceof Error ? error.message : "Unknown fetch error";
      lastError = new Error(`Attempt ${attempt}/${MAX_RETRIES} failed: ${message}`);

      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw new Error(lastError?.message ?? "Unable to fetch live catalog");
}

async function fetchLiveSlugs(): Promise<string[]> {
  const html = await fetchLiveCatalogHtml();
  return extractLiveSlugsFromHtml(html);
}

function printResult(result: SyncReport) {
  if (JSON_MODE) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

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

function writeReport(report: SyncReport) {
  if (!REPORT_PATH) return;
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  if (!JSON_MODE) {
    console.log(`\nReport written to ${REPORT_PATH}`);
  }
}

async function main() {
  try {
    const liveSlugs = await fetchLiveSlugs();
    const { slugs: localSlugs, invalidLocalUrls } = extractLocalSlugs(ALGORITHM_DEMOS);
    const { missingFromLocal, onlyInLocal } = diffDemoSlugs(liveSlugs, localSlugs);

    const result: SyncResult = {
      liveSlugs,
      localSlugs,
      missingFromLocal,
      onlyInLocal,
      invalidLocalUrls,
    };

    const hasIssues =
      result.invalidLocalUrls.length > 0 ||
      result.missingFromLocal.length > 0 ||
      result.onlyInLocal.length > 0;

    const report: SyncReport = {
      ...result,
      generatedAt: new Date().toISOString(),
      hasIssues,
    };

    printResult(report);
    writeReport(report);

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
