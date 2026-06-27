#!/usr/bin/env tsx
/**
 * Generates the 1200x630 OpenGraph / Twitter social card at public/og.png.
 * Rasterized from an inline SVG with sharp so it works under `output: export`
 * (no edge runtime needed). Re-run if the brand or headline stats change.
 *
 * Run: npx tsx scripts/generate-og.ts
 */
import sharp from "sharp";
import { join } from "node:path";

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="20%" stop-color="#06b6d4"/>
      <stop offset="45%" stop-color="#8b5cf6"/>
      <stop offset="70%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070b12"/>
      <stop offset="100%" stop-color="#0d1626"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="10" fill="url(#bar)"/>

  <text x="80" y="250" font-family="monospace" font-size="84" font-weight="700" fill="#e8eef7">
    <tspan fill="#3b82f6">crypto</tspan><tspan fill="#e8eef7">::compare</tspan>
  </text>

  <text x="80" y="320" font-family="Arial, sans-serif" font-size="36" fill="#c4d1e3">
    Cryptographic Algorithm Reference
  </text>

  <text x="80" y="392" font-family="Arial, sans-serif" font-size="27" fill="#8aa0bd">
    Choose cryptography with evidence, tradeoffs, and safe defaults.
  </text>

  <g font-family="monospace" font-size="30" font-weight="700">
    <text x="80" y="500" fill="#10b981">97 algorithms</text>
    <text x="370" y="500" fill="#8aa0bd">·</text>
    <text x="400" y="500" fill="#06b6d4">17 categories</text>
    <text x="660" y="500" fill="#8aa0bd">·</text>
    <text x="690" y="500" fill="#8b5cf6">123 linked labs</text>
  </g>

  <text x="80" y="575" font-family="monospace" font-size="22" fill="#5d6b80">
    crypto-compare.systemslibrarian.dev
  </text>

  <text x="1120" y="250" font-family="monospace" font-size="120" fill="#1c2740" text-anchor="end">◈</text>
</svg>
`;

async function main() {
  const out = join(process.cwd(), "public", "og.png");
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`Wrote ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
