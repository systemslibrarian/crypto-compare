#!/usr/bin/env tsx
/**
 * Writes the headline stats into README.md from src/lib/siteStats.ts.
 *
 * README.md cannot import the constants, so the numbers in it are generated
 * rather than typed. The rules live in src/lib/statsSync.ts and are shared with
 * src/__tests__/site-stats.test.ts, so the checker and the writer can never
 * disagree about which literals are covered.
 *
 *   npm run sync:stats     rewrite README.md in place
 *   npm run check:stats    report drift and exit 1 (CI-friendly, writes nothing)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { applyStatRules, README_STAT_RULES } from "@/lib/statsSync";
import { ALGORITHM_COUNT, CATEGORY_COUNT, LINKED_LAB_COUNT } from "@/lib/siteStats";

const README_PATH = join(process.cwd(), "README.md");
const checkOnly = process.argv.includes("--check");

const source = readFileSync(README_PATH, "utf8");
const { text, drift } = applyStatRules(source);

console.log(
  `Derived stats: ${ALGORITHM_COUNT} algorithms, ${CATEGORY_COUNT} categories, ${LINKED_LAB_COUNT} linked labs ` +
    `(${README_STAT_RULES.length} README literals covered)`,
);

if (drift.length === 0) {
  console.log("README.md is in sync.");
  process.exit(0);
}

for (const entry of drift) console.log(`  drift  ${entry}`);

if (checkOnly) {
  console.error(`::error::README.md has ${drift.length} stale stat literal(s). Run: npm run sync:stats`);
  process.exit(1);
}

writeFileSync(README_PATH, text);
console.log(`Updated README.md (${drift.length} literal(s) rewritten).`);
