/**
 * The OpenGraph card's artwork, as an SVG string.
 *
 * Kept out of scripts/generate-og.ts so tests can assert what the card says
 * without pulling in sharp's native binding. The headline numbers come from
 * src/lib/siteStats.ts — this file contains no typed count.
 */
import {
  OG_ALGORITHM_LABEL,
  OG_CATEGORY_LABEL,
  OG_LINKED_LAB_LABEL,
} from "@/lib/siteStats";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** PNG `tEXt` keyword under which the card records the stats it was built from. */
export const OG_STATS_KEYWORD = "crypto-compare-stats";

/** The exact SVG rasterized into public/og.png. */
export function buildOgSvg(): string {
  return `
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
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

  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bg)"/>
  <rect width="${OG_WIDTH}" height="10" fill="url(#bar)"/>

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
    <text x="80" y="500" fill="#10b981">${OG_ALGORITHM_LABEL}</text>
    <text x="370" y="500" fill="#8aa0bd">·</text>
    <text x="400" y="500" fill="#06b6d4">${OG_CATEGORY_LABEL}</text>
    <text x="660" y="500" fill="#8aa0bd">·</text>
    <text x="690" y="500" fill="#8b5cf6">${OG_LINKED_LAB_LABEL}</text>
  </g>

  <text x="80" y="575" font-family="monospace" font-size="22" fill="#5d6b80">
    crypto-compare.systemslibrarian.dev
  </text>

  <text x="1120" y="250" font-family="monospace" font-size="120" fill="#1c2740" text-anchor="end">◈</text>
</svg>
`;
}
