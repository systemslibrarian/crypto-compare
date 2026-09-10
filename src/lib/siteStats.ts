/**
 * The catalog's headline numbers, derived — never typed.
 *
 * Every place this site claims "N algorithms", "N categories" or "N linked
 * labs" must import from here. The counts are computed from the same datasets
 * the UI renders (`ALGORITHMS`, `CATEGORIES`, and `buildLabIndex()` over
 * `ALGORITHM_DEMOS`), so adding a demo moves the number everywhere at once.
 *
 * Why this file exists: the lab count sat frozen at 123 in six places while
 * the rendered /labs body said 192, because each one was a literal typed once
 * and never re-derived. The page served both numbers in the same document, 69
 * apart. `src/__tests__/site-stats.test.ts` fails if any of them drifts again.
 *
 * Consumers that cannot import TypeScript at read time (README.md, the
 * rasterized public/og.png) get their literals *written* by generators that
 * import from here — `scripts/sync-stats.ts` and `scripts/generate-og.ts` —
 * and are checked against these values by the test above.
 */
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";
import { buildLabIndex } from "@/lib/labs";

export const ALGORITHM_COUNT = ALGORITHMS.length;
export const CATEGORY_COUNT = CATEGORIES.length;

/**
 * Unique crypto-lab demos linked from the algorithm reference. Same index the
 * /labs page renders, so the page heading and the page metadata cannot
 * disagree.
 */
export const LINKED_LAB_COUNT = buildLabIndex().length;

/** Fragments used verbatim inside the generated social card. */
export const OG_ALGORITHM_LABEL = `${ALGORITHM_COUNT} algorithms`;
export const OG_CATEGORY_LABEL = `${CATEGORY_COUNT} categories`;
export const OG_LINKED_LAB_LABEL = `${LINKED_LAB_COUNT} linked labs`;

/** Alt text for /og.png, in `src/app/layout.tsx`. */
export const OG_IMAGE_ALT = `crypto::compare — Cryptographic Algorithm Reference. ${OG_ALGORITHM_LABEL}, ${OG_CATEGORY_LABEL}, ${OG_LINKED_LAB_LABEL}.`;

/** `<meta name="description">` for /labs, in `src/app/labs/page.tsx`. */
export const LABS_PAGE_DESCRIPTION = `${LINKED_LAB_COUNT} hands-on crypto-lab demos linked from the algorithm reference — encryption, signatures, attacks, and post-quantum schemes you can run in the browser.`;

/** README.md hero line, written by `scripts/sync-stats.ts`. */
export const README_HERO_STATS = `${ALGORITHM_COUNT} algorithms. ${CATEGORY_COUNT} categories. ${LINKED_LAB_COUNT} unique linked public demos.`;

/** README.md "What you can do" rows, written by `scripts/sync-stats.ts`. */
export const README_BROWSE_ROW = `${ALGORITHM_COUNT} algorithms across elliptic curves`;
export const README_DEMOS_ROW = `${LINKED_LAB_COUNT} unique linked public demos across the mapped categories`;

/** README.md "Related Projects" line, written by `scripts/sync-stats.ts`. */
export const README_MAPPED_DEMOS = `Current mapped crypto-lab demos: **${LINKED_LAB_COUNT}**`;

/**
 * Stamped into public/og.png as a PNG `tEXt` chunk by scripts/generate-og.ts.
 *
 * The raster itself is not byte-reproducible across machines (sharp shells the
 * SVG text out to the host font stack), so the test cannot diff the committed
 * bytes against a fresh render. It reads this chunk instead: the chunk and the
 * pixels are written in the same generator run from the same constants, so a
 * committed PNG whose chunk still says 123 is a PNG that was never regenerated.
 */
export const OG_STATS_STAMP = JSON.stringify({
  algorithms: ALGORITHM_COUNT,
  categories: CATEGORY_COUNT,
  linkedLabs: LINKED_LAB_COUNT,
});
