#!/usr/bin/env tsx
/**
 * Rasterizes the 1200x630 OpenGraph / Twitter social card to public/og.png.
 * Rendered from an inline SVG with sharp so it works under `output: export`
 * (no edge runtime needed).
 *
 * The artwork lives in src/lib/ogCard.ts and its headline numbers come from
 * src/lib/siteStats.ts — nothing here is typed. This script used to hardcode
 * "123 linked labs" into the SVG, which is how the committed card kept
 * advertising 123 long after the site itself said 192: a frozen number inside a
 * binary that nothing re-derives.
 *
 * The finished PNG carries a `tEXt` chunk (`OG_STATS_KEYWORD`) recording the
 * stats it was rendered with, so src/__tests__/site-stats.test.ts can prove the
 * *committed* image is current without re-rasterizing it.
 *
 * Run: npm run generate:og   (or npx tsx scripts/generate-og.ts)
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildOgSvg, OG_STATS_KEYWORD } from "@/lib/ogCard";
import { OG_STATS_STAMP } from "@/lib/siteStats";
import { withPngTextChunk } from "@/lib/pngText";

/** Rasterizes the card and stamps the stats it was rendered with into it. */
export async function renderOgPng(): Promise<Buffer> {
  const raster = await sharp(Buffer.from(buildOgSvg())).png().toBuffer();
  return withPngTextChunk(raster, OG_STATS_KEYWORD, OG_STATS_STAMP);
}

async function main() {
  const out = join(process.cwd(), "public", "og.png");
  writeFileSync(out, await renderOgPng());
  console.log(`Wrote ${out} (${OG_STATS_KEYWORD}=${OG_STATS_STAMP})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
