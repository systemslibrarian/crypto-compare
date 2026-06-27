# Security Policy

## Scope and intent

**crypto::compare is an educational reference for *choosing* cryptography. It is not a cryptographic library, a security audit, or a compliance attestation.**

Recommendations, security-bit estimates, and post-quantum labels reflect known attacks and public literature at review time. They are guidance, not certification, and can change as cryptanalysis advances. Always validate a production decision against current standards, your own threat model, and — for high-stakes systems — a qualified cryptographer.

### Threat model

- Recommendations assume a **standard adversary**: a well-resourced attacker bounded by publicly known cryptanalysis, including a future large-scale quantum computer for post-quantum guidance.
- They do **not** model implementation backdoors, supply-chain compromise, side channels in third-party code, or physical coercion.
- Scope is **algorithm selection and tradeoffs** — not protocol design, key-management operations, or constant-time implementation, each of which can undo a sound algorithm choice.

## Reporting a vulnerability or data error

This project ships **no runtime cryptography and handles no user data** — it is a statically exported, read-only reference site. The most valuable reports are therefore:

1. **Incorrect or outdated guidance** — a recommendation, security estimate, or attack note that is wrong or stale.
2. **Citation problems** — a missing, broken, or misattributed primary source.
3. **Site/supply-chain issues** — a dependency or build concern in this repository.

Please open a GitHub issue for data corrections, or a pull request with the corrected entry and its primary-source citation. For anything you consider sensitive, contact the maintainers privately via the GitHub profile rather than filing a public issue.

## How data integrity is enforced

- Every algorithm must carry **primary-source citations** (NIST FIPS/SP, IETF RFC, ISO, CRYPTREC, KPQC, etc.); a build-time check (`npm run validate`) fails the build otherwise.
- Linked interactive labs are kept in sync with the live catalog by an automated check (`npm run check:demos:strict`).
- An automated freshness job flags entries whose review date is older than 180 days.

## Supported versions

The deployed site always reflects the `main` branch. There are no long-lived release branches to patch.
