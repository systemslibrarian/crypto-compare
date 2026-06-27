#!/usr/bin/env tsx
/**
 * One-time / repeatable image optimization for the Visual Guide.
 *
 * Converts the large source PNGs in public/images to WebP (much smaller,
 * lossless-ish at q82) and prints a tiny base64 blur placeholder for each so
 * next/image can render a blur-up while the full image loads. The static export
 * uses `images.unoptimized`, so Next does no conversion at build time — this
 * script is the optimization step.
 *
 * Run: npx tsx scripts/convert-images.ts
 */
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const IMAGES_DIR = join(process.cwd(), "public", "images");

async function main() {
  const pngs = readdirSync(IMAGES_DIR).filter((f) => f.toLowerCase().endsWith(".png"));
  if (pngs.length === 0) {
    console.log("No PNGs found to convert.");
    return;
  }

  const blurMap: Record<string, string> = {};

  for (const png of pngs) {
    const src = join(IMAGES_DIR, png);
    const base = png.replace(/\.png$/i, "");
    const webpPath = join(IMAGES_DIR, `${base}.webp`);

    const beforeBytes = statSync(src).size;
    await sharp(src).webp({ quality: 82, effort: 6 }).toFile(webpPath);
    const afterBytes = statSync(webpPath).size;

    const blur = await sharp(src)
      .resize(20, null, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();
    blurMap[base] = `data:image/webp;base64,${blur.toString("base64")}`;

    const pct = Math.round((1 - afterBytes / beforeBytes) * 100);
    console.log(
      `${png}: ${(beforeBytes / 1e6).toFixed(2)}MB -> ${base}.webp ${(afterBytes / 1e6).toFixed(2)}MB (-${pct}%)`,
    );
  }

  console.log("\nBlur placeholders (paste into VisualsView):");
  console.log(JSON.stringify(blurMap, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
