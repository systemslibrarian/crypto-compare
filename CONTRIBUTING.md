# Contributing to crypto::compare

Thanks for your interest. This is a solo project, but pull requests and issues are welcome.

## What to Contribute

**High-value contributions:**
- Correcting algorithm security parameters (with a published source)
- Adding missing provenance sources to `src/data/provenance.ts`
- Reporting outdated entries (new attacks, NIST updates, standard revisions)
- Accessibility improvements
- Bug fixes

**Welcome but discuss first (open an issue):**
- New algorithm entries
- New categories
- UI/UX redesigns
- New interactive features

**Out of scope:**
- Adding executable crypto (encrypt/decrypt playgrounds, key generation demos)
- Backend services, databases, or APIs
- Ads, analytics, or tracking

## How to Submit

1. Fork the repo
2. Create a feature branch (`git checkout -b fix/algorithm-name`)
3. Make your changes
4. Run checks: `npm run type-check && npm run test && npm run lint && npm run build`
5. Open a PR with a clear description of what changed and why

## Data Standards

When adding or modifying algorithm data:

- **Every claim needs a source.** Add entries to `src/data/provenance.ts` with a URL, label, note, and kind (`standard`, `analysis`, `deployment`, or `benchmark`).
- **Security bits must reflect published cryptanalysis**, not marketing claims.
- **Use the exact parameter names** from the TypeScript types in `src/types/crypto.ts`.
- **Run `npm run test`** — the dataset validation tests will catch missing fields, duplicate IDs, and orphaned provenance entries.

## Code Style

- TypeScript strict mode — no `any`, no type assertions without justification
- Functional React components with hooks
- Existing ESLint config (`next/core-web-vitals`)
- Prefer editing existing files over creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
