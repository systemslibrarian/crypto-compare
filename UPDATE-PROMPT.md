# crypto::compare — AI Content Update Prompt

Use this prompt with GitHub Copilot (or any AI assistant with codebase access) to perform a comprehensive content review and update of the crypto::compare dataset.

## When to run

- Monthly, or after major standards publications (NIST FIPS, IETF RFCs)
- After the automated `data-freshness.yml` workflow opens an issue
- When you learn of a new algorithm, deprecation, or attack

## How to run

Open this repository in VS Code with Copilot, then paste the prompt below into chat.

---

## Prompt

```
@workspace I need you to perform a comprehensive data review and update of the crypto::compare dataset. Follow these steps precisely:

### 1. Run the freshness check first

Run `npx tsx scripts/refresh-data.ts --check-links` and review the output. Note any stale entries, dead links, or upstream notices.

### 2. Review and update algorithm data

For each algorithm in `src/data/algorithms.ts`, verify and update if needed:

- **Status & recommendation**: Check against current NIST, IETF, ISO, and national standards. Has any algorithm been deprecated, promoted, or had its recommendation changed?
- **Security bits**: Have new attacks been published that reduce classical or PQ security margins?
- **Best attack**: Check IACR ePrint (eprint.iacr.org) for new cryptanalysis papers since the last review date.
- **PQ relevance**: Has NIST PQC project status changed? New rounds, new selections, new deprecations?
- **Performance notes**: Any significant new benchmarks or hardware support changes?
- **Recommendation rationale**: Update if the basis for the recommendation has shifted.
- **recommendationChangesWhen**: Update trigger conditions if landscape has changed.

### 3. Check for new algorithms to add

Review these sources for algorithms not yet in the dataset:
- NIST PQC additional selections or new rounds
- IETF CFRG adopted drafts that reached RFC status
- KPQC (Korean PQC) new round results
- Any widely-deployed algorithm missing from our 17 categories

For new algorithms, follow the exact schema in `src/types/crypto.ts` and the patterns in existing entries.

### 4. Update provenance

For every algorithm you reviewed or updated, set `lastReviewed` to today's date in `src/data/provenance.ts`. Add or update source citations with current URLs.

### 5. Update supplementary data

- `src/data/hybridPatterns.ts` — any new recommended hybrid combinations?
- `src/data/migrations.ts` — any new migration paths needed (e.g., new deprecations)?
- `src/data/stacks.ts` — any new recommended stacks for common use cases?
- `src/data/implementations.ts` — any new major library releases?
- `src/data/demoResources.ts` — any new interactive demos or playgrounds?

### 6. Update the resources section

Check `src/data/resources.ts` for:
- Dead links or moved URLs
- New newsletters, conferences, or community resources worth adding
- Outdated descriptions

### 7. Validate everything

Run these commands and fix any issues:
- `npm run validate` — schema validation
- `npm run type-check` — TypeScript
- `npm run test` — all tests must pass
- `npm run refresh -- --check-links` — verify no dead links remain

### 8. Summary

After completing all updates, provide a summary of:
- How many algorithms were reviewed
- What changed (new entries, updated recommendations, new attacks, etc.)
- Any entries you couldn't verify (flag for manual review)
- Current dataset health metrics
```

---

## What the AI will do

The prompt instructs the AI to:
1. Use the existing validation tooling to find issues
2. Cross-reference each algorithm against authoritative sources
3. Apply updates directly to the TypeScript data files
4. Maintain the provenance audit trail
5. Run validation to ensure nothing breaks

## What it won't do

- Push changes — you review the diff and decide
- Make judgment calls on recommendations without evidence — it will flag uncertainties
- Remove algorithms — only add or update

## Tips

- If an algorithm has `estimationMethodology.classicalBasis: "speculative"`, pay extra attention — these are the least certain entries.
- After the AI finishes, review the git diff carefully. Cryptographic recommendations have real-world consequences.
- Run `npm run refresh -- --check-links` after to verify all source URLs are still valid.
