# Changelog

All notable changes to this project will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/) conventions.

## [Unreleased]

## [1.1.0] - 2026-06-27

### Added
- **Interactive Labs index** (`/labs`): a discoverable, searchable, category-filterable catalog of all **123** linked crypto-lab demos, derived from the algorithm→lab mapping and annotated with the algorithms each lab is linked from. Surfaced in the header and mobile nav.
- **About & Methodology page** (`/about`): states what the tool is, who it's for, the **threat model and scope**, how data is sourced and verified, update cadence, and an explicit "educational — not a substitute for a cryptographic review" disclaimer.
- **`SECURITY.md`**: security policy, threat model, data-error reporting guidance, and how data integrity is enforced at build time.
- **End-to-end tests**: Playwright core-journey suite (home filter, labs filter, about disclaimer, robots/sitemap) plus a CI `e2e` job; Lighthouse CI now audits performance and reports Core Web Vitals.
- **SEO**: generated `robots.txt` and `sitemap.xml` (all routes), plus an OpenGraph/Twitter social-card image (`public/og.png`) wired into metadata.
- **Dataset version surfaced as v1.1.0** in the footer and the exported `public/data/*` envelopes.
- **`scripts/convert-images.ts`** and **`scripts/generate-og.ts`**: repeatable asset-optimization tooling.

### Changed
- **Crypto-lab demo catalog synced from 102 → 123 mapped labs.** Wired 21 newly published labs (Bitcoin Wallet, Broken Trust, Ciphertext Mirror, Collision Vault, E91, Enigma Forge, HQC Timing, Hybrid Guide, Jevil, JWT Forge, Key Exchange, LWE Hints, Multivariate UOV, OTP Vault, PQ Families, SSH Handshake, Syndrome Drain, Vigenère Break, Web of Trust, WebAuthn, ZK Arena) to their algorithms; the non-lab awards-badge slug is now ignored by the sync check.
- **Home-page performance**: removed the `backdrop-filter: blur(10px)` from every `.panel` and lightened panel shadows; added `content-visibility: auto` to algorithm cards and below-the-fold panels; code-split the comparison workspace, knowledge sections, methodology panel, and shortcut help via `next/dynamic`. First-load JS dropped ~271 → ~240 kB, blocking time ~1,100 → ~250 ms, and Style & Layout cost roughly halved.
- **Visual Guide images optimized** from PNG to WebP (9.3 MB → ~0.45 MB, ~95% smaller) with blur-up placeholders and explicit dimensions (CLS ≈ 0.002).
- README demo/lab counts updated to reflect 123 linked labs.

### Verified
- **Full primary-source re-verification of all 97 algorithms** (`lastReviewed` bumped 2026-04-18 → 2026-06-27). Each entry's claims and citations were checked against standards bodies and peer-reviewed literature. No security-bit breaks were found. Corrections applied:
  - **Post-quantum standardization status refreshed**: HQC marked NIST-selected (2025, FIPS forthcoming); Classic McEliece and BIKE marked *not selected* in NIST's concluded 4th round (ISO/other tracks); SMAUG-T and HAETAE updated to KpqC winners (Jan 2025). SMAUG-T's security basis corrected from "NTRU/LWE hybrid" to Module-LWE + Module-LWR.
  - **Threshold-signature accuracy**: FROST's RFC 9591 reclassified as an IRTF/CFRG Informational RFC (not an IETF standard); GG20 annotated with documented implementation key-extraction CVEs (BitForge/CVE-2023-33241, TSSHOCK); DKLS23 updated to note production libraries now exist and the "Devious Transfer" OT bugs.
  - **Citation fixes**: corrected broken/mis-attributed DOIs and references (bn254 exTNFS, ot_base, bpcs, wow_stego, lsb_stego, ckks IND-CPA-D attack, kupyna, chacha20_drbg RFC 8439, frodokem ISO label, sm2_enc, snow_v); removed a non-primary "deployment" source that didn't support its claim.
  - **Factual nits**: LMS expanded correctly as Leighton-Micali (was "Levinshtein"); SM4 best-attack wording corrected; RSA-4096 ~140-bit relabeled as an interpolated estimate.
- This was automated primary-source re-verification and a cryptanalysis scan, **not** an expert cryptographer's sign-off. See `/about` for what that distinction means.

### Added — earlier work now shipping in 1.1.0
- **Tier 1 Trust Hardening** — 8-task audit-readiness overhaul:
  - **5-level recommendation system**: Every algorithm labeled Recommended / Acceptable / Legacy / Research / Avoid with rationale, conditions for change
  - **"Why not this?"**: Per-algorithm tradeoff explanations (64 algorithms)
  - **Estimation methodology**: Classical and quantum security basis (exact / conservative / estimated / speculative) with notes per algorithm
  - **Assumptions field**: Security assumptions documented for all 64 algorithms
  - **Hybrid cryptography patterns**: 6 real-world hybrid constructions (X25519+ML-KEM-768, ECDSA+ML-DSA-44, Hybrid TLS 1.3, etc.) with combination methods, deployments, rationale, and limitations
  - **Limitations banner**: Always-visible amber section on live site listing tool constraints
  - **Hardened exports**: CSV/Markdown now include Justification, Changes When, Why Not This?, Sources (labeled), Last Reviewed (Month Year), Assumptions, Classical Basis, Quantum Basis rows
  - **Build-time validation**: `scripts/validate-data.ts` validates all algorithms, provenance, and hybrid patterns with Zod schema + cross-field rules
- **144 tests** (up from 113): Trust hardening fields, hybrid patterns, new export rows, legacy migration guidance validation
- **Decision flowchart**: Interactive "What should I use?" wizard covering all 12 categories with multi-step narrowing questions and algorithm recommendations
- **Comparison export**: Download side-by-side comparisons as CSV or Markdown
- **Keyboard shortcuts**: `/` search, `A` advanced, `← →` categories, `?` methodology, `Esc` close — with hint bar in footer
- **Error boundary**: Catches React render errors with reload option instead of blank page
- **Full provenance**: All 64 algorithms now have linked sources (NIST FIPS, IETF RFCs, academic papers) with review dates
- **Dataset tests**: Vitest test suite validating algorithm data integrity, provenance coverage, and category completeness
- **Type-check + test in CI**: GitHub Actions runs `tsc --noEmit`, `vitest run`, lint, and build
- **Mobile comparison view**: Stacked card layout replaces horizontal table below 768px
- **SEO**: JSON-LD structured data, Twitter cards, expanded OpenGraph tags, keyword metadata
- **CONTRIBUTING.md**: Contribution guidelines and data standards
- **CHANGELOG.md**: This file

### Changed
- Algorithm count corrected from "55+" to **64** across README, metadata, and descriptions
- README completely rewritten: documents all interactive features (decision flowchart, export, keyboard shortcuts, URL deep-linking, filters), adds honest limitations section, updates project structure
- Footer now shows dataset review date (`March 16, 2026`) and keyboard shortcut reference
- Methodology and sources panels use Tailwind component classes instead of inline styles
- `globals.css` expanded with `@layer components` utilities: `.panel`, `.panel-inner`, `.panel-heading`, `.kbd`, `.btn-primary`, `.text-muted`, `.text-accent`

### Fixed
- Trailing `;;` syntax artifacts in `algorithms.ts` and `categories.ts`
- Font variable mismatch: 20 instances of hardcoded `'JetBrains Mono', monospace` → `var(--font-jetbrains-mono)` across 6 files
- IBM Plex Sans hardcoded reference → `var(--font-ibm-plex-sans)`

## [1.0.0] - 2026-03-15

### Added
- Initial release with 64 algorithms across 12 categories
- Beginner / Advanced toggle
- Side-by-side comparison table with category-specific metrics
- Search, sort by 5 fields, filter by origin/PQ/standard/NIST/deployed
- URL deep-linking with full state serialization
- Category explainers with real-world deployment examples
- SecurityMeter visual components (classical + PQ)
- Per-entry source provenance scaffold
- GitHub Pages deployment via Actions
- Runtime algorithm data validation

---

**Dataset review commitment**: Algorithm data will be reviewed against published cryptanalysis at least annually. The review date is displayed in the application footer.
