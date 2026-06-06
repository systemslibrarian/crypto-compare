# crypto::compare — Transformation Plan (Phase 1)

**Generated**: 2026-04-13
**Status**: Awaiting approval before Phase 2 begins

---

## Repo Inspection Discrepancies

Before the plan: findings from the mandatory full-repo read.

| # | Discrepancy | Location | Detail |
|---|-------------|----------|--------|
| 1 | **Algorithm count drift** | Prompt says "85 algorithms" throughout. README says "97 algorithms". `layout.tsx` metadata says "97". `package.json` description says "97". Actual dataset count: **97 entries** across 17 categories. The prompt's "85" figure is stale. All references in this plan will use **97**. |
| 2 | **Prompt says "55+ in repo description, 85 in body"** | The repo description (`package.json`) actually says **97**. The README also says **97**. Neither "55" nor "85" appears in the current repo. This discrepancy exists only in the prompt itself — the repo is internally consistent at 97. |
| 3 | **Category count** | Prompt mentions "16 categories" in the proposed meta description. Actual: **17 categories** (including `csprng`). The proposed description must use 17. |
| 4 | **Existing `/advisor` route** | The prompt asks whether `/advisor` should be a "New page OR redirect to existing wizard?" — it already exists as `src/app/advisor/page.tsx` with `AdvisorView.tsx`. It wraps `DecisionFlowchart`. This route is preserved; Phase 5 elevates it. |
| 5 | **Existing `/visuals` route** | Not mentioned in the prompt at all, but `src/app/visuals/page.tsx` exists. It will be preserved unchanged. |
| 6 | **`layout.tsx` metadata already says 97** | The prompt's Phase 5C asks to "update to 85 algorithms" — this would be a regression. Update target: keep at 97 (or update if algorithms are added). |
| 7 | **GitHub topics** | Cannot be changed via code — topics are a GitHub repo setting. Phase 5C will note this as a manual action. |
| 8 | **RecommendationBadge icons** | Prompt says current badges are `✅ 🟡 ⚠️ 🔬 ❌`. Actual in `ui.tsx`: `✅ ⚠️ 🔄 🔬 ❌`. The `🟡` does not exist; `acceptable` uses `⚠️` and `legacy` uses `🔄`. |

---

## 1A. Proposed Site Structure

After transformation, the following routes will exist:

| Route | Status | Purpose |
|-------|--------|---------|
| `/` | **Modified** | Homepage restructured: intent-driven entry cards ("What are you trying to protect?") above the fold, existing category browser preserved below |
| `/advisor` | **Preserved + Elevated** | Already exists. Phase 5 upgrades the result display and adds "Copy as Markdown". Homepage gets prominent CTA linking here. |
| `/visuals` | **Preserved** | Already exists. No changes. |
| `/safe-defaults` | **New** | Static "send this to any engineer" reference page. 8 use-case cards with justification, warnings, common mistakes. No interactivity required. |
| `/stacks` | **New** | Stack-level comparison: 6 complete cryptographic stacks (Messaging, Password Storage, File Encryption, Code Signing, TLS, PQ Migration). Editorial view, not algorithmic comparison. |
| `/migrate` | **New** | Migration guidance: 8 upgrade paths from legacy to modern crypto. Each with urgency, risk, steps, pitfalls. |
| `/implementations` | **New** | Library mapping: algorithm → ecosystem → library. Filterable by ecosystem. Prominent disclaimer. |

### Route Detail

**`/safe-defaults`**
- **Primary audience**: Any engineer who needs to quickly know "what should I use?"
- **Reuses**: Algorithm IDs for deep links, existing CSS variable system, `CollapsibleSection` component
- **New**: `SafeDefaultsPage` component with 8 structured cards + warning section + link to Architecture Checklist
- **Static export compatible**: Yes — pure static render, no server data fetching

**`/stacks`**
- **Primary audience**: Architects designing complete systems, not choosing individual primitives
- **Reuses**: Algorithm IDs for deep links, hybrid pattern IDs for cross-links, CSS variable system
- **New**: `StacksPage` component, `src/data/stacks.ts` data file
- **Static export compatible**: Yes

**`/migrate`**
- **Primary audience**: Engineers maintaining systems with known legacy crypto
- **Reuses**: Existing 5-tier recommendation labels, algorithm IDs for browser links
- **New**: `MigratePage` component, `src/data/migrations.ts` data file
- **Static export compatible**: Yes

**`/implementations`**
- **Primary audience**: Engineers ready to write code and choosing a library
- **Reuses**: Algorithm IDs as foreign key, CSS variable system
- **New**: `ImplementationsPage` component, `src/data/implementations.ts` data file
- **Static export compatible**: Yes

---

## 1B. New TypeScript Types Required

All additions go in `src/types/crypto.ts` unless noted.

### Addition to `AlgorithmBase`

```
wrongChoiceConsequence?: {
  scenario: string;       // "Used for password storage"
  consequence: string;    // "Trivial GPU brute force — millions of guesses/sec"
  severity: 'critical' | 'high' | 'medium' | 'low';
}[]
```

### Addition to `AlgorithmBase` (Phase 5 trust signals)

```
maturity?: 'mature' | 'established' | 'emerging' | 'experimental';
standardization?: 'nist-fips' | 'ietf-rfc' | 'national-standard' | 'academic';
pqRelevance?: 'pq-safe' | 'hybrid-ready' | 'classical-only' | 'quantum-vulnerable';
```

### New type: `ImplementationEntry` (in `src/data/implementations.ts`)

```
type Ecosystem = 'rust' | 'python' | 'typescript' | 'go' | 'dotnet' | 'java';

interface ImplementationEntry {
  algorithmId: string;
  ecosystem: Ecosystem;
  library: string;
  packageName: string;
  url: string;
  notes: string;
  auditStatus: 'audited' | 'unaudited' | 'unknown';
  lastVerified: string;  // ISO date
  warning?: string;
}
```

### New type: `MigrationPath` (in `src/data/migrations.ts`)

```
interface MigrationPath {
  id: string;
  from: string;
  to: string;
  priority: 'critical' | 'high' | 'medium';
  recommendation: RecommendationLevel;  // existing type
  whyMigrate: string;
  riskOfStaying: string;
  safeUpgradePath: string[];
  migrationPitfall: string;
}
```

### New type: `CryptoStack` (in `src/data/stacks.ts`)

```
interface CryptoStack {
  id: string;
  name: string;
  primitives: { algorithmId: string; role: string; protectsAgainst: string }[];
  tradeoffs: string;
  alternativeWhen: string;
  hybridPatternIds?: string[];  // links to HYBRID_PATTERNS
}
```

---

## 1C. New Data Structures Required

| File | Purpose | Approximate Shape |
|------|---------|-------------------|
| `src/data/implementations.ts` | Library mappings per algorithm per ecosystem | Array of `ImplementationEntry`. ~48 entries initially (8 algorithms × 6 ecosystems). |
| `src/data/migrations.ts` | Migration path definitions | Array of `MigrationPath`. 8 entries per the prompt spec. |
| `src/data/stacks.ts` | Complete cryptographic stack definitions | Array of `CryptoStack`. 6 entries per the prompt spec. |

No other new data files are needed. The `wrongChoiceConsequence`, `maturity`, `standardization`, and `pqRelevance` fields are added directly to existing entries in `src/data/algorithms.ts`.

---

## 1D. Component Inventory

### New Components

| Component | File | Route/Location | Notes |
|-----------|------|----------------|-------|
| `SafeDefaultsPage` | `src/app/safe-defaults/page.tsx` | `/safe-defaults` | Static page with 8 use-case cards + warning section. Links to ArchitectureChecklist. |
| `StacksPage` | `src/app/stacks/page.tsx` | `/stacks` | 6 stack cards with cross-links. |
| `MigratePage` | `src/app/migrate/page.tsx` | `/migrate` | 8 migration path entries. |
| `ImplementationsPage` | `src/app/implementations/page.tsx` | `/implementations` | Algorithm → ecosystem → library. Tab/dropdown ecosystem filter. Client component. |
| `IntentCards` | `src/components/IntentCards.tsx` | Homepage (above fold) | 6 interactive entry-path cards ("What are you trying to protect?"). |
| `ArchitectureChecklist` | `src/components/ArchitectureChecklist.tsx` | Linked from nav + `/safe-defaults` | Printable/copy-ready checklist for crypto architecture reviews. Exportable as Markdown. |
| `WrongChoiceWarning` | `src/components/WrongChoiceWarning.tsx` | Inside `AlgoCard.tsx` | Collapsible warning section showing `wrongChoiceConsequence` data. |
| `AdvisorResultBlock` | `src/components/AdvisorResultBlock.tsx` | Inside `DecisionFlowchart.tsx` | Enhanced result display (stack + justification + why-not + risk + implementation link) with "Copy as Markdown" button. |
| `TrustBadges` | `src/components/TrustBadges.tsx` | Inside `AlgoCard.tsx` | Styled Tailwind badges for maturity, standardization, PQ relevance. Supplements existing emoji badges. |

### Modified Components

| Component | What Changes | What Is Preserved |
|-----------|-------------|-------------------|
| `CryptoCompare.tsx` | Insert `IntentCards` above the existing category browser. Add prominent "What should I use?" CTA linking to `/advisor`. Reorder layout so wizard entry is above the fold. | All existing state, URL persistence, keyboard shortcuts, search/filter, comparison, exports. All existing sections remain in same order below the fold. |
| `AlgoCard.tsx` | Add collapsible `WrongChoiceWarning` section (only renders when `wrongChoiceConsequence` data exists). Add `TrustBadges` sub-component for maturity/standardization/PQ-relevance. Add collapsible "Implementations" section pulling from `implementations.ts`. | All existing fields, layout, detail toggle, favorite toggle, copy-recommendation button, advisor-pick highlight. |
| `DecisionFlowchart.tsx` | Replace inline result block with `AdvisorResultBlock`. Add "Copy as Markdown" button. Add links to `/implementations`. | Decision tree data unchanged. Back/reset/step flow unchanged. `buildJustificationReport` preserved exactly. Download button preserved. |
| `AppHeaderNav.tsx` | Add nav links for `/safe-defaults`, `/stacks`, `/migrate`, `/implementations`. | All existing category tabs, mobile nav, theme toggle. |
| `src/types/crypto.ts` | Add optional fields to `AlgorithmBase`: `wrongChoiceConsequence`, `maturity`, `standardization`, `pqRelevance`. | All existing types untouched. Union type `Algorithm` unchanged. |
| `src/data/algorithms.ts` | Add `wrongChoiceConsequence` to ~8 high-value algorithms. Add `maturity`, `standardization`, `pqRelevance` to all `recommended` algorithms first. | All 97 existing entries preserved field-for-field. No existing field values altered. |
| `src/app/layout.tsx` | Update meta description to reflect new positioning. Update JSON-LD description. Correct algorithm count to 97 + 17 categories. | Title format, fonts, icon, all other metadata preserved. |
| `HeroOverview.tsx` | Minor: adjust headline copy to align with intent-driven framing. | Stats display, recommendation counts, trust snapshot — all preserved. |

### Unchanged Components

All other components (30+) remain completely untouched:
`CategoryExplainer`, `ComparisonTable`, `ComparisonWorkspace`, `FooterShell`, `QuickStartPanel`, `SearchControls`, `ResultsStatus`, `MethodologyPanel`, `SourceCitationsPanel`, `ShortcutHelp`, `CollapsibleSection`, `KnowledgeSections`, `DesignPhilosophy`, `HybridPatternsSection`, `RecommendedLibraries`, `ReferenceArchitectures`, `SafeUsage`, `TrustSnapshotPanel`, `UseCaseGuide`, `ui.tsx` (Badge, RecommendationBadge, ReviewBadge, SecurityMeter all unchanged), `AdvisorCta`, `AdvisorView`, `VisualsView`, `ErrorBoundary`.

---

## 1E. Risk Flags

### 1. URL State Compatibility

**Risk**: Adding `IntentCards` to the homepage could interfere with existing URL-persisted filter state (`cat`, `sel`, `cmp`, `search`, `pqOnly`, etc.).

**Mitigation**: `IntentCards` will operate by calling existing controller methods (`switchCategory`, `activateGlobalSearch`, etc.) and navigating to `/advisor` via standard links. It will not introduce new URL parameters. The `useCryptoCompareUrlState` hook remains unchanged.

### 2. Static Export Compatibility

**Risk**: New pages must work with `output: 'export'` and `trailingSlash: true`.

**Mitigation**: All new pages are static client components or pure static renders. No `getServerSideProps`, no dynamic routes, no runtime data fetching. Each new page is a simple `page.tsx` under `src/app/[route]/`. Verified against `next.config.mjs` settings.

### 3. Algorithm Data Integrity

**Risk**: Adding new optional fields (`wrongChoiceConsequence`, `maturity`, `standardization`, `pqRelevance`) to `AlgorithmBase` could break Zod validation in `validation.ts`.

**Mitigation**: All new fields are optional (`?`). Zod schema will be extended with `.optional()` validators for each new field. Existing validation rules remain unchanged. Run `npm run validate` after changes.

### 4. Test Stability

**Risk**: 119+ existing behavioral tests could break if homepage structure changes.

**Mitigation**:
- `IntentCards` is additive — inserted before the existing category browser, not replacing it.
- Tests that query for existing elements (search, category tabs, algorithm cards) will still find them.
- Tests for `CryptoCompare` that check rendering order may need minor adjustment if they assert first-rendered content.
- Will run full test suite after each phase and fix any breakage before committing.

### 5. Tailwind Config

**Risk**: New components may need colors or spacing not in current config.

**Mitigation**: The existing CSS variable system (`--color-*`) provides comprehensive dark/light theme coverage. New components will use CSS variables via inline styles (consistent with the existing pattern throughout the codebase — nearly all components use inline styles, not Tailwind utility classes). No Tailwind config extensions needed.

### 6. Navigation Complexity

**Risk**: Adding 4 new nav links to `AppHeaderNav` could crowd the mobile navigation.

**Mitigation**: Group new pages under a "Guides" or "Resources" section in mobile nav. Desktop nav can accommodate additional top-level links. Will test on mobile viewport before committing.

### 7. Bundle Size

**Risk**: New data files (`implementations.ts`, `migrations.ts`, `stacks.ts`) increase the JS bundle.

**Mitigation**: Each new data file is modest (~5-15 KB). New pages are separate routes, so they are code-split by Next.js automatically. Homepage bundle only grows by the `IntentCards` component and the `wrongChoiceConsequence` additions to `algorithms.ts` (minimal).

### 8. `basePath` Compatibility

**Risk**: New page links must respect the GitHub Pages `basePath` (`/crypto-compare`).

**Mitigation**: Use Next.js `<Link>` component for all internal navigation (which handles `basePath` automatically). For any programmatic navigation, use `process.env.NEXT_PUBLIC_BASE_PATH` prefix as the existing codebase does.

---

## Phase Execution Order

| Phase | Scope | Commit Message |
|-------|-------|----------------|
| **1** | This plan document (no code) | `docs: transformation plan` |
| **2** | Homepage restructure + `/safe-defaults` page | `feat: homepage restructure + safe-defaults page` |
| **3** | `/stacks` + `/migrate` + `wrongChoiceConsequence` data | `feat: stacks page, migration guide, wrong-choice consequences` |
| **4** | `implementations.ts` + `/implementations` page + AlgoCard integration | `feat: implementation mapping page and AlgoCard integration` |
| **5** | Advisor elevation, trust badges, Architecture Checklist, metadata fixes | `feat: advisor elevation, trust signals, architecture checklist, metadata fixes` |

Each phase ends with `npm run type-check && npm run test && npm run build` passing.

---

*So whether you eat or drink or whatever you do, do it all for the glory of God.* — 1 Corinthians 10:31
