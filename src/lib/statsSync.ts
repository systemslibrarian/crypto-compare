/**
 * README.md is the one consumer of the headline stats that cannot import
 * TypeScript, so its literals are *written* from src/lib/siteStats.ts by
 * scripts/sync-stats.ts rather than typed by hand.
 *
 * The rules below are the single definition of where those literals live.
 * `scripts/sync-stats.ts` uses them to rewrite the file; the test in
 * src/__tests__/site-stats.test.ts uses them to fail when the committed README
 * has drifted. Before this existed, README.md contradicted itself — 123 in its
 * opening sentence, 192 sixteen lines from the end — and only the one line an
 * assertion covered had been updated.
 *
 * Each rule must match exactly once. A rule that stops matching is an error,
 * not a no-op: silently skipping a reworded line is how a checked number goes
 * back to being an unchecked one.
 */
import {
  ALGORITHM_COUNT,
  CATEGORY_COUNT,
  README_BROWSE_ROW,
  README_DEMOS_ROW,
  README_HERO_STATS,
  README_MAPPED_DEMOS,
} from "@/lib/siteStats";

export type StatRule = {
  /** Human-readable location, used in drift messages. */
  name: string;
  /** Must match exactly once against the file. */
  pattern: RegExp;
  /** What that match is required to be. */
  replacement: string;
};

export const README_STAT_RULES: StatRule[] = [
  {
    name: "README.md hero line",
    pattern: /^\d+ algorithms\. \d+ categories\. \d+ unique linked public demos\./m,
    replacement: README_HERO_STATS,
  },
  {
    name: 'README.md "Browse by category" row',
    pattern: /\d+ algorithms across elliptic curves/,
    replacement: README_BROWSE_ROW,
  },
  {
    name: 'README.md "Explore linked demo projects" row',
    pattern: /\d+ unique linked public demos across the mapped categories/,
    replacement: README_DEMOS_ROW,
  },
  {
    name: 'README.md "Why Trust This" coverage row',
    pattern: /\d+ algorithms across \d+ categories/,
    replacement: `${ALGORITHM_COUNT} algorithms across ${CATEGORY_COUNT} categories`,
  },
  {
    name: "README.md mapped crypto-lab demo count",
    pattern: /Current mapped crypto-lab demos: \*\*\d+\*\*/,
    replacement: README_MAPPED_DEMOS,
  },
];

/**
 * package.json's `description` is npm metadata rather than page copy, but it is
 * the same defect: two counts typed into a file no reader ever re-derives.
 */
export const PACKAGE_JSON_STAT_RULES: StatRule[] = [
  {
    name: "package.json description",
    pattern: /\d+ categories, \d+ algorithms/,
    replacement: `${CATEGORY_COUNT} categories, ${ALGORITHM_COUNT} algorithms`,
  },
];

/** Every file whose stat literals are written rather than typed. */
export const STAT_TARGETS: { path: string; rules: StatRule[] }[] = [
  { path: "README.md", rules: README_STAT_RULES },
  { path: "package.json", rules: PACKAGE_JSON_STAT_RULES },
];

export type StatSyncResult = {
  /** The file with every rule's literal rewritten from the constants. */
  text: string;
  /** One entry per rule whose committed literal was stale. Empty means in sync. */
  drift: string[];
};

function globalize(pattern: RegExp): RegExp {
  return pattern.flags.includes("g") ? pattern : new RegExp(pattern.source, `${pattern.flags}g`);
}

export function applyStatRules(source: string, rules: StatRule[] = README_STAT_RULES): StatSyncResult {
  let text = source;
  const drift: string[] = [];

  for (const rule of rules) {
    const pattern = globalize(rule.pattern);
    const matches = text.match(pattern);

    if (matches === null || matches.length !== 1) {
      throw new Error(
        `Stat rule "${rule.name}" matched ${matches?.length ?? 0} times, expected exactly 1. ` +
          "The wording changed — update the rule in src/lib/statsSync.ts rather than dropping it.",
      );
    }

    if (matches[0] !== rule.replacement) {
      drift.push(`${rule.name}: "${matches[0]}" should be "${rule.replacement}"`);
    }

    text = text.replace(pattern, () => rule.replacement);
  }

  return { text, drift };
}
