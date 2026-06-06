#!/usr/bin/env tsx
/**
 * Build-time dataset export.
 *
 * Emits the in-app TypeScript dataset as static JSON files under
 * public/data/, so downstream consumers (other apps, scripts, the Counsel
 * AI) can pin to a stable URL instead of scraping our TS modules.
 *
 * Run:
 *   npx tsx scripts/export-dataset.ts
 *
 * Hooked into the Next.js build via the `prebuild` npm script.
 *
 * The schema is documented in docs/data-api.md.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ALGORITHMS } from "../src/data/algorithms";
import { ALGORITHM_PROVENANCE } from "../src/data/provenance";
import { ALGORITHM_DEMOS } from "../src/data/demoResources";
import { HYBRID_PATTERNS } from "../src/data/hybridPatterns";
import { CATEGORIES } from "../src/data/categories";
import { MIGRATION_PATHS } from "../src/data/migrations";
import { CRYPTO_STACKS } from "../src/data/stacks";
import { IMPLEMENTATIONS } from "../src/data/implementations";
import { RESOURCES } from "../src/data/resources";
import pkg from "../package.json";

const outputDir = join(process.cwd(), "public", "data");
mkdirSync(outputDir, { recursive: true });

const generatedAt = new Date().toISOString();
const datasetVersion = (pkg as { version: string }).version;

type Envelope<T> = {
  $schema: string;
  version: string;
  generatedAt: string;
  data: T;
};

function envelope<T>(schemaName: string, data: T): Envelope<T> {
  return {
    $schema: `https://crypto-compare.systemslibrarian.dev/data/schema/${schemaName}.json`,
    version: datasetVersion,
    generatedAt,
    data,
  };
}

function emit(filename: string, body: unknown): void {
  const path = join(outputDir, filename);
  writeFileSync(path, JSON.stringify(body, null, 2) + "\n");
  console.log(`  wrote ${filename}`);
}

console.log(`Exporting dataset v${datasetVersion} to public/data/`);

emit("algorithms.json", envelope("algorithms", ALGORITHMS));
emit("provenance.json", envelope("provenance", ALGORITHM_PROVENANCE));
emit("demo-resources.json", envelope("demo-resources", ALGORITHM_DEMOS));
emit("hybrid-patterns.json", envelope("hybrid-patterns", HYBRID_PATTERNS));
emit("categories.json", envelope("categories", CATEGORIES));
emit("migrations.json", envelope("migrations", MIGRATION_PATHS));
emit("stacks.json", envelope("stacks", CRYPTO_STACKS));
emit("implementations.json", envelope("implementations", IMPLEMENTATIONS));
emit("resources.json", envelope("resources", RESOURCES));

emit(
  "index.json",
  envelope("index", {
    files: [
      "algorithms.json",
      "provenance.json",
      "demo-resources.json",
      "hybrid-patterns.json",
      "categories.json",
      "migrations.json",
      "stacks.json",
      "implementations.json",
      "resources.json",
    ],
    counts: {
      algorithms: ALGORITHMS.length,
      provenanceEntries: Object.keys(ALGORITHM_PROVENANCE).length,
      hybridPatterns: HYBRID_PATTERNS.length,
      categories: CATEGORIES.length,
      migrations: MIGRATION_PATHS.length,
      stacks: CRYPTO_STACKS.length,
      implementations: IMPLEMENTATIONS.length,
      resources: RESOURCES.length,
    },
  }),
);

console.log(`Done. ${ALGORITHMS.length} algorithms, ${Object.keys(ALGORITHM_PROVENANCE).length} provenance entries.`);
