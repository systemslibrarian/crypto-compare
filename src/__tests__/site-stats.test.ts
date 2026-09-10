/**
 * Guard for the frozen-snapshot defect class: a headline number typed once into
 * prose, code or a rendered image, which then rots because nothing re-derives
 * it.
 *
 * On 2026-09-09 the linked-lab count was frozen at 123 in six places while the
 * true figure — `buildLabIndex().length` over src/data/demoResources.ts — was
 * 192. The /labs page served both numbers in the same document: 123 in its
 * <meta name="description">, 192 in its rendered body, 69 apart. The only spot
 * that had been kept current was README.md's "Current mapped crypto-lab demos"
 * line, and it survived for exactly one reason: a test asserted it.
 *
 * So this file asserts all six, against the one exported constant:
 *
 *   1. src/app/labs/page.tsx     metadata description        (was LIVE)
 *   2. src/app/layout.tsx        og:image alt                (was LIVE)
 *   3. public/og.png             the committed social card   (was LIVE)
 *   4. scripts/generate-og.ts    + src/lib/ogCard.ts artwork
 *   5. README.md                 hero line
 *   6. README.md                 "What you can do" rows and the mapped count
 *
 * and three more of the same shape found while fixing those: README.md's "Why
 * Trust This" coverage row, package.json's description, and the "17 categories"
 * typed beside a derived algorithm count in AboutView.
 *
 * On public/og.png: the strong form would be regenerating the card to a temp
 * path and diffing it against the committed bytes. That check is not available
 * here — sharp rasterizes the SVG's text through the host font stack, so the
 * same generator on this machine produces a different PNG from the committed
 * one (87083 vs 85891 bytes with no source change), and CI runs on ubuntu while
 * the card is generated on macOS. Byte equality would fail for reasons that have
 * nothing to do with the number.
 *
 * Instead the generator stamps the stats it rendered with into the PNG itself as
 * a `tEXt` chunk, and the test reads that chunk out of the *committed* bytes.
 * Pixels and stamp are written in the same run from the same constants, so a
 * card left un-regenerated carries a stale stamp and fails. Say plainly what
 * this does not prove: it does not read the glyphs. Someone who edits the chunk
 * by hand, or replaces the artwork by hand, can still lie to it. What it does
 * prove is that the committed file came out of a generator run at these values.
 * The generator's SVG text is asserted separately, below.
 */
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { buildLabIndex } from "@/lib/labs";
import { ALGORITHM_DEMOS } from "@/data/demoResources";
import { extractLocalSlugs } from "@/lib/demoSync";
import { buildOgSvg, OG_STATS_KEYWORD } from "@/lib/ogCard";
import { readPngTextChunk, withPngTextChunk } from "@/lib/pngText";
import { applyStatRules, README_STAT_RULES, STAT_TARGETS } from "@/lib/statsSync";
import {
  ALGORITHM_COUNT,
  CATEGORY_COUNT,
  LABS_PAGE_DESCRIPTION,
  LINKED_LAB_COUNT,
  OG_ALGORITHM_LABEL,
  OG_CATEGORY_LABEL,
  OG_IMAGE_ALT,
  OG_LINKED_LAB_LABEL,
  OG_STATS_STAMP,
} from "@/lib/siteStats";

// next/font/google is a build-time loader with no runtime implementation
// outside the Next compiler. Stubbing it is what lets this test read the real
// metadata object out of the real layout instead of grepping its source.
vi.mock("next/font/google", () => {
  const loader = () => ({ className: "font-stub", variable: "--font-stub", style: { fontFamily: "stub" } });
  return { DM_Mono: loader, Fraunces: loader };
});

const read = (relative: string) => readFileSync(join(process.cwd(), relative), "utf8");

describe("headline stats are derived from one constant", () => {
  it("tracks the lab index the /labs page renders", () => {
    expect(LINKED_LAB_COUNT).toBe(buildLabIndex().length);
    expect(LINKED_LAB_COUNT).toBe(extractLocalSlugs(ALGORITHM_DEMOS).slugs.length);
    expect(LINKED_LAB_COUNT).toBeGreaterThan(0);
  });

  // 1. LIVE: https://crypto-compare.systemslibrarian.dev/labs/ <meta name="description">
  it("uses the constant in the /labs page metadata description", async () => {
    const { metadata } = await import("@/app/labs/page");

    expect(metadata.description).toBe(LABS_PAGE_DESCRIPTION);
    expect(metadata.description).toContain(`${LINKED_LAB_COUNT} hands-on crypto-lab demos`);

    // The body of the same page prints LABS.length. The two must agree — that
    // disagreement, inside one document, is the bug this file exists for.
    const bodyCount = buildLabIndex().length;
    const metaCount = Number.parseInt(String(metadata.description).match(/^(\d+)/)![1], 10);
    expect(metaCount).toBe(bodyCount);
  });

  // 2. LIVE: og:image alt on every page
  it("uses the constant in the og:image alt text", async () => {
    const { metadata } = await import("@/app/layout");
    const image = (metadata.openGraph?.images as { alt?: string }[])[0];

    expect(image.alt).toBe(OG_IMAGE_ALT);
    expect(image.alt).toContain(`${LINKED_LAB_COUNT} linked labs`);
    expect(image.alt).toContain(`${ALGORITHM_COUNT} algorithms`);
    expect(image.alt).toContain(`${CATEGORY_COUNT} categories`);
  });

  // 3. LIVE: the committed social card served as the OpenGraph image
  it("ships a public/og.png rendered at the current stats", () => {
    const png = readFileSync(join(process.cwd(), "public", "og.png"));
    const stamp = readPngTextChunk(png, OG_STATS_KEYWORD);

    expect(
      stamp,
      `public/og.png carries no "${OG_STATS_KEYWORD}" stamp — regenerate it: npm run generate:og`,
    ).not.toBeNull();
    expect(stamp).toBe(OG_STATS_STAMP);
    expect(JSON.parse(stamp!)).toEqual({
      algorithms: ALGORITHM_COUNT,
      categories: CATEGORY_COUNT,
      linkedLabs: LINKED_LAB_COUNT,
    });
  });

  // 4. the generator that draws that card
  it("draws the card's headline row from the constant", () => {
    const svg = buildOgSvg();

    expect(svg).toContain(`>${OG_LINKED_LAB_LABEL}</text>`);
    expect(svg).toContain(`>${OG_ALGORITHM_LABEL}</text>`);
    expect(svg).toContain(`>${OG_CATEGORY_LABEL}</text>`);
    expect(svg).toContain(`${LINKED_LAB_COUNT} linked labs`);
  });

  // 5 + 6. README.md (and package.json), written by scripts/sync-stats.ts
  it("keeps every generated literal in sync", () => {
    for (const target of STAT_TARGETS) {
      const { drift } = applyStatRules(read(target.path), target.rules);
      expect(drift, `${target.path} is stale — run: npm run sync:stats\n${drift.join("\n")}`).toEqual([]);
    }
  });

  it("covers the README's hero line, both table rows, and the mapped count", () => {
    // Belt and braces: the rules array is what sync-stats.ts writes, so a rule
    // quietly deleted from it would silently un-cover a line.
    expect(README_STAT_RULES.map((rule) => rule.name)).toEqual([
      "README.md hero line",
      'README.md "Browse by category" row',
      'README.md "Explore linked demo projects" row',
      'README.md "Why Trust This" coverage row',
      "README.md mapped crypto-lab demo count",
    ]);
    expect(STAT_TARGETS.map((target) => target.path)).toEqual(["README.md", "package.json"]);

    const readme = read("README.md");
    expect(readme).toContain(`${ALGORITHM_COUNT} algorithms. ${CATEGORY_COUNT} categories. ${LINKED_LAB_COUNT} unique linked public demos.`);
    expect(readme).toContain(`${LINKED_LAB_COUNT} unique linked public demos across the mapped categories`);
    expect(readme).toContain(`Current mapped crypto-lab demos: **${LINKED_LAB_COUNT}**`);
  });
});

describe("no headline count is typed back in", () => {
  // Repointing the six at the constant only helps until someone types a number
  // in again. These read the sources, so a literal reintroduced anywhere in the
  // chain fails even when it happens to be today's correct value.
  const sources: [string, RegExp[]][] = [
    ["src/app/labs/page.tsx", [/\d+ hands-on/]],
    ["src/components/AboutView.tsx", [/\d+ categories/, /\d+ cryptographic algorithms/]],
    ["src/app/layout.tsx", [/\d+ linked labs/, /\d+ algorithms/, /\d+ categories/, /alt: "/]],
    ["src/lib/ogCard.ts", [/\d+ linked labs/, /\d+ algorithms/, /\d+ categories/]],
    ["scripts/generate-og.ts", [/\d+ linked labs/, /\d+ algorithms/]],
  ];

  for (const [file, patterns] of sources) {
    it(`keeps ${file} free of typed counts`, () => {
      // Comments explain the history and quote the old numbers; only code counts.
      const code = read(file)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");

      for (const pattern of patterns) {
        const found = code.match(pattern)?.[0] ?? null;
        expect(found, `${file} types a literal (${pattern}) that must come from @/lib/siteStats`).toBeNull();
      }
    });
  }
});

describe("the og.png stamp survives a round trip", () => {
  it("reads back what it wrote, replacing rather than appending", () => {
    const committed = readFileSync(join(process.cwd(), "public", "og.png"));
    const restamped = withPngTextChunk(committed, OG_STATS_KEYWORD, '{"linkedLabs":1}');

    expect(readPngTextChunk(restamped, OG_STATS_KEYWORD)).toBe('{"linkedLabs":1}');
    expect(restamped.length).toBeLessThan(committed.length + 64);
    expect(readPngTextChunk(withPngTextChunk(restamped, OG_STATS_KEYWORD, OG_STATS_STAMP), OG_STATS_KEYWORD)).toBe(
      OG_STATS_STAMP,
    );
  });
});
