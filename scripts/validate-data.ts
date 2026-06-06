/**
 * Build-time dataset validation.
 * Run: npx tsx scripts/validate-data.ts
 * CI should fail on any validation error.
 */
import { ALGORITHMS } from "../src/data/algorithms";
import { ALGORITHM_PROVENANCE } from "../src/data/provenance";
import { HYBRID_PATTERNS } from "../src/data/hybridPatterns";
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

// Citation policy: every algorithm must have at least one primary source
// (a "standard" — NIST/IETF/ISO/national standard — or "analysis" — peer-reviewed paper).
// "deployment" and "benchmark" sources alone are not enough.
const PRIMARY_SOURCE_KINDS = new Set(["standard", "analysis"]);
for (const [id, entry] of Object.entries(ALGORITHM_PROVENANCE)) {
  if (!entry.sources || entry.sources.length === 0) {
    errors.push(`Provenance ${id}: no sources cited`);
    continue;
  }
  const hasPrimary = entry.sources.some((s) => PRIMARY_SOURCE_KINDS.has(s.kind));
  if (!hasPrimary) {
    errors.push(
      `Provenance ${id}: needs at least one primary source (kind="standard" or "analysis"), found only [${entry.sources.map((s) => s.kind).join(", ")}]`,
    );
  }
}

// Validate hybrid patterns
const patternIds = new Set<string>();
for (const p of HYBRID_PATTERNS) {
  if (patternIds.has(p.id)) {
    errors.push(`Duplicate hybrid pattern id: ${p.id}`);
  }
  patternIds.add(p.id);
  if (!p.name || !p.classical || !p.postQuantum || !p.combinationMethod || !p.rationale || !p.limitations) {
    errors.push(`Hybrid pattern ${p.id}: missing required fields`);
  }
  if (!["key-exchange", "signature", "encryption", "hash-and-sign"].includes(p.category)) {
    errors.push(`Hybrid pattern ${p.id}: invalid category "${p.category}"`);
  }
  if (!["recommended", "acceptable", "research"].includes(p.recommendation)) {
    errors.push(`Hybrid pattern ${p.id}: invalid recommendation "${p.recommendation}"`);
  }
  if (p.deployedIn.length === 0) {
    errors.push(`Hybrid pattern ${p.id}: must have at least one deployment reference`);
  }
}

if (errors.length > 0) {
  console.error("❌ Dataset validation failed:\n");
  for (const e of errors) {
    console.error(`  • ${e}`);
  }
  process.exit(1);
} else {
  console.log(`✅ Dataset validated: ${ALGORITHMS.length} algorithms, ${provenanceIds.size} provenance entries, ${HYBRID_PATTERNS.length} hybrid patterns, 0 errors.`);
}
