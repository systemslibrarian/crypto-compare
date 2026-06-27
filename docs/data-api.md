# Dataset JSON API

The crypto::compare dataset is also published as static JSON under
`public/data/`, regenerated on every build by
[`scripts/export-dataset.ts`](../scripts/export-dataset.ts). This lets
other apps, scripts, and the Counsel AI consume the same data the UI
uses without scraping the TypeScript modules.

Live URLs (replace with the deployed origin):

- `https://crypto-compare.systemslibrarian.dev/data/index.json`
- `https://crypto-compare.systemslibrarian.dev/data/algorithms.json`
- `https://crypto-compare.systemslibrarian.dev/data/provenance.json`
- `https://crypto-compare.systemslibrarian.dev/data/demo-resources.json`
- `https://crypto-compare.systemslibrarian.dev/data/hybrid-patterns.json`
- `https://crypto-compare.systemslibrarian.dev/data/categories.json`
- `https://crypto-compare.systemslibrarian.dev/data/migrations.json`
- `https://crypto-compare.systemslibrarian.dev/data/stacks.json`
- `https://crypto-compare.systemslibrarian.dev/data/implementations.json`
- `https://crypto-compare.systemslibrarian.dev/data/resources.json`

## Envelope

Every file uses the same wrapper:

```jsonc
{
  "$schema": "https://crypto-compare.systemslibrarian.dev/data/schema/<name>.json",
  "version": "1.1.0",          // semver of the dataset (package.json version)
  "generatedAt": "2026-06-06T18:00:00.000Z",
  "data": /* type-specific payload */
}
```

The TypeScript shapes inside `data` are the source of truth — see
[`src/types/crypto.ts`](../src/types/crypto.ts) and the per-file
exports in [`src/data/`](../src/data/). Treat them as a stable contract
within a major version.

## Versioning

The dataset is versioned with [Semantic Versioning](https://semver.org/):

- **MAJOR** — breaking schema change (renamed/removed required fields, type
  changes that break existing consumers).
- **MINOR** — additive schema change (new optional fields, new entries,
  new files).
- **PATCH** — content updates only (new sources, refreshed `lastReviewed`
  dates, corrected typos).

Consumers SHOULD pin to a major version and watch the
[CHANGELOG](../CHANGELOG.md) for breaking releases.

## Index

`index.json` lists the available files and high-level counts. Use it as
a manifest:

```jsonc
{
  "data": {
    "files": ["algorithms.json", "provenance.json", "..."],
    "counts": {
      "algorithms": 97,
      "provenanceEntries": 97,
      "hybridPatterns": 8,
      "categories": 17
    }
  }
}
```

## Local regeneration

```sh
npm run export:dataset
```

The script is also wired as a `prebuild` step, so any `next build` (or
deploy) produces fresh files.

## Citation policy

Every algorithm in `provenance.json` should have at least one primary
source (NIST FIPS/SP, IETF RFC, ISO/IEC standard, or IACR ePrint paper).
See [data-sources.md](data-sources.md) for the list of upstream sources
we track and the source-of-truth precedence we apply when they disagree.
