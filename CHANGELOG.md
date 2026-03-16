# Changelog

All notable changes to this project will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/) conventions.

## [Unreleased]

### Added
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
