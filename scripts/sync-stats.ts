#!/usr/bin/env tsx
/**
 * Writes the headline stats into the files that cannot import them.
 *
 * README.md and package.json cannot read src/lib/siteStats.ts, so their numbers
 * are generated rather than typed. The rules live in src/lib/statsSync.ts and
 * are shared with src/__tests__/site-stats.test.ts, so the checker and the
 * writer can never disagree about which literals are covered.
 *
 *   npm run sync:stats     rewrite the target files in place
 *   npm run check:stats    report drift and exit 1 (CI-friendly, writes nothing)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { applyStatRules, STAT_TARGETS } from "@/lib/statsSync";
import { ALGORITHM_COUNT, CATEGORY_COUNT, LINKED_LAB_COUNT } from "@/lib/siteStats";

const checkOnly = process.argv.includes("--check");
const covered = STAT_TARGETS.reduce((total, target) => total + target.rules.length, 0);

console.log(
  `Derived stats: ${ALGORITHM_COUNT} algorithms, ${CATEGORY_COUNT} categories, ${LINKED_LAB_COUNT} linked labs ` +
    `(${covered} generated literals across ${STAT_TARGETS.length} files)`,
);

let stale = 0;

for (const target of STAT_TARGETS) {
  const path = join(process.cwd(), target.path);
  const { text, drift } = applyStatRules(readFileSync(path, "utf8"), target.rules);

  if (drift.length === 0) {
    console.log(`  ok     ${target.path}`);
    continue;
  }

  stale += drift.length;
  for (const entry of drift) console.log(`  drift  ${entry}`);

  if (!checkOnly) {
    writeFileSync(path, text);
    console.log(`  wrote  ${target.path} (${drift.length} literal(s) rewritten)`);
  }
}

if (stale === 0) {
  console.log("All generated stat literals are in sync.");
  process.exit(0);
}

if (checkOnly) {
  console.error(`::error::${stale} stale stat literal(s). Run: npm run sync:stats`);
  process.exit(1);
}
