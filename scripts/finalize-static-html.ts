#!/usr/bin/env tsx
/**
 * Move the static-export CSP meta element ahead of every resource request.
 *
 * Next.js emits framework preloads and scripts before layout-provided metadata.
 * A CSP delivered by meta only protects content that follows it, so Chrome
 * reports those earlier resources as a DevTools issue. GitHub Pages cannot set
 * response headers; placing the policy first in <head> is the secure fallback.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CSP_META_PATTERN = /<meta\s+[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi;

export function placeCspMetaFirst(html: string): string {
  const policies = html.match(CSP_META_PATTERN) ?? [];
  if (policies.length !== 1) {
    throw new Error(`Expected exactly one CSP meta element; found ${policies.length}.`);
  }

  if (!html.includes("<head>")) {
    throw new Error("Cannot place CSP meta element: document has no <head> element.");
  }

  const withoutPolicy = html.replace(CSP_META_PATTERN, "");
  return withoutPolicy.replace("<head>", `<head>${policies[0]}`);
}

function htmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? htmlFiles(path)
      : path.endsWith(".html")
        ? [path]
        : [];
  });
}

export function finalizeStaticHtml(outputDirectory: string): number {
  const files = htmlFiles(outputDirectory);
  for (const path of files) {
    const html = readFileSync(path, "utf8");
    writeFileSync(path, placeCspMetaFirst(html));
  }
  return files.length;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  const outputDirectory = resolve(process.cwd(), process.argv[2] ?? "out");
  const count = finalizeStaticHtml(outputDirectory);
  console.log(`Placed CSP first in <head> for ${count} exported HTML files.`);
}
