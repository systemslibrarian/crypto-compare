#!/usr/bin/env tsx
/**
 * Demo catalog sync check.
 *
 * Compares live demo slugs from https://crypto-lab.systemslibrarian.dev/crypto-lab/
 * with local demo URLs in src/data/demoResources.ts.
 *
 * Run:
 *   npx tsx scripts/check-demo-sync.ts
 *   npx tsx scripts/check-demo-sync.ts --strict
 *   npx tsx scripts/check-demo-sync.ts --json
 *   npx tsx scripts/check-demo-sync.ts --live-html-path=/tmp/crypto-lab.html --strict
 *   npx tsx scripts/check-demo-sync.ts --timeout-ms=10000 --max-retries=2
 */

import { ALGORITHM_DEMOS } from "../src/data/demoResources";
import { diffDemoSlugs, extractLiveSlugsFromHtml, extractLocalSlugs } from "../src/lib/demoSync";
import { readFileSync, writeFileSync } from "node:fs";

const LIVE_CATALOG_URL = "https://crypto-lab.systemslibrarian.dev/crypto-lab/";
const HELP_TEXT = `
Usage:
  npx tsx scripts/check-demo-sync.ts [options]

Options:
  --strict                       Exit with code 1 when sync issues are found
  --json                         Print report as JSON to stdout
  --report-path=<path>           Write JSON report to file
  --live-html-path=<path>        Read live catalog HTML from local file (offline mode)
  --timeout-ms=<n>               Fetch timeout in ms (default: 15000)
  --max-retries=<n>              Number of fetch attempts (default: 3)
  --help, -h                     Show this help text
`.trim();

type CliOptions = {
  strict: boolean;
  json: boolean;
  reportPath: string | null;
  liveHtmlPath: string | null;
  timeoutMs: number;
  maxRetries: number;
};

function parsePositiveInt(value: string | undefined, fallback: number, flagName: string): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${flagName}: expected a positive integer, got "${value}"`);
  }
  return parsed;
}

function parseOptionValue(args: string[], prefix: string): string | undefined {
  const match = args.find((arg) => arg.startsWith(prefix));
  if (!match) return undefined;
  return match.slice(prefix.length);
}

function isKnownOption(arg: string): boolean {
  return (
    arg === "--strict" ||
    arg === "--json" ||
    arg === "--help" ||
    arg === "-h" ||
    arg.startsWith("--report-path=") ||
    arg.startsWith("--live-html-path=") ||
    arg.startsWith("--timeout-ms=") ||
    arg.startsWith("--max-retries=")
  );
}

function parseCliOptions(args: string[]): CliOptions {
  for (const arg of args) {
    if (arg.startsWith("--") && !isKnownOption(arg)) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return {
    strict: args.includes("--strict"),
    json: args.includes("--json"),
    reportPath: parseOptionValue(args, "--report-path=") ?? null,
    liveHtmlPath: parseOptionValue(args, "--live-html-path=") ?? null,
    timeoutMs: parsePositiveInt(parseOptionValue(args, "--timeout-ms="), 15_000, "--timeout-ms"),
    maxRetries: parsePositiveInt(parseOptionValue(args, "--max-retries="), 3, "--max-retries"),
  };
}

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
  summary: {
    liveSlugCount: number;
    localSlugCount: number;
    missingCount: number;
    localOnlyCount: number;
    invalidUrlCount: number;
  };
};

async function fetchLiveCatalogHtml(options: CliOptions): Promise<string> {
  if (options.liveHtmlPath) {
    return readFileSync(options.liveHtmlPath, "utf8");
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

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
      lastError = new Error(`Attempt ${attempt}/${options.maxRetries} failed: ${message}`);

      if (attempt < options.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw new Error(lastError?.message ?? "Unable to fetch live catalog");
}

async function fetchLiveSlugs(options: CliOptions): Promise<string[]> {
  const html = await fetchLiveCatalogHtml(options);
  return extractLiveSlugsFromHtml(html);
}

function printResult(result: SyncReport, options: CliOptions) {
  if (options.json) {
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

function writeReport(report: SyncReport, options: CliOptions) {
  if (!options.reportPath) return;
  writeFileSync(options.reportPath, JSON.stringify(report, null, 2));
  if (!options.json) {
    console.log(`\nReport written to ${options.reportPath}`);
  }
}

async function main() {
  try {
    const rawArgs = process.argv.slice(2);
    if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
      console.log(HELP_TEXT);
      return;
    }

    const options = parseCliOptions(rawArgs);
    const liveSlugs = await fetchLiveSlugs(options);
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
      summary: {
        liveSlugCount: result.liveSlugs.length,
        localSlugCount: result.localSlugs.length,
        missingCount: result.missingFromLocal.length,
        localOnlyCount: result.onlyInLocal.length,
        invalidUrlCount: result.invalidLocalUrls.length,
      },
    };

    printResult(report, options);
    writeReport(report, options);

    if (options.strict && hasIssues) {
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`\nFailed to run demo sync check: ${message}`);
    process.exit(1);
  }
}

main();
