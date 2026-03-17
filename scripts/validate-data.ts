/**
 * Build-time dataset validation.
 * Run: npx tsx scripts/validate-data.ts
 * CI should fail on any validation error.
 */
import { ALGORITHMS } from "../src/data/algorithms";
import { ALGORITHM_PROVENANCE } from "../src/data/provenance";
import { validateAlgorithms } from "../src/lib/validation";

const errors = validateAlgorithms(ALGORITHMS);

// Check provenance coverage
const algoIds = new Set(ALGORITHMS.map((a) => a.id));
const provenanceIds = new Set(Object.keys(ALGORITHM_PROVENANCE));

for (const id of Array.from(algoIds)) {
  if (!provenanceIds.has(id)) {
    errors.push(`Missing provenance entry for algorithm: ${id}`);
  }
}

for (const id of Array.from(provenanceIds)) {
  if (!algoIds.has(id)) {
    errors.push(`Provenance entry for unknown algorithm: ${id}`);
  }
}

if (errors.length > 0) {
  console.error("❌ Dataset validation failed:\n");
  for (const e of errors) {
    console.error(`  • ${e}`);
  }
  process.exit(1);
} else {
  console.log(`✅ Dataset validated: ${ALGORITHMS.length} algorithms, ${provenanceIds.size} provenance entries, 0 errors.`);
}
