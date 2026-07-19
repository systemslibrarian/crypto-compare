# Brief for Claude: make crypto::compare look and handle like a professional sibling to Crypto Lab

The goal is to redesign this repo's interface so it feels worthy of the same family as `https://crypto-lab.systemslibrarian.dev/`: dense, confident, editorial, fast, and able to handle a large catalog without looking cramped or toy-like. Crypto Lab currently presents 158 interactive cryptography exhibits with a strong dark editorial look, compact category navigation, polished exhibit cards, and clear browsing status. This repo has the data and functionality, but the main UI feels less finished.

Do not rewrite the product. Preserve the existing app behavior: category browsing, global search, filters, presets, favorites, URL state, comparison workflow, advisor handoff, exports, accessibility affordances, and tests. Treat this as a professional UI restructuring and polish pass over the existing Next/React app.

## Current diagnosis

The main surface is `src/components/CryptoCompare.tsx`. It renders the header, hero, search controls, context bar, category explainer, result status, algorithm grid, comparison workspace, guide panels, footer, and floating advisor button.

The roughness is concentrated in these files:

- `src/app/globals.css`: design tokens already try to borrow Crypto Lab's dark teal/editorial palette, but the file still has duplicated `body` rules, old neon blue/purple/yellow gradient bars, stale header/category-nav classes, mixed legacy colors, and one-off rules that make the system feel inconsistent.
- `src/components/AppHeaderNav.tsx`: header and slide-out nav are simple, but they rely on text/emoji marks and hide too much category power in the menu. For a catalog this large, navigation should feel intentional and inspectable.
- `src/components/HomeHero.tsx`: the hero is clean but too quiet. It needs to establish the product, show scale, and make the first action obvious without turning into a marketing landing page.
- `src/components/SearchControls.tsx`: controls are functional but visually busy. Emoji/text buttons, inline styles, and cramped filter chips make the catalog feel less professional.
- `src/components/AlgoCard.tsx`: this is the biggest problem. Cards are overloaded with inline styles, emoji controls, multiple competing badges, meters, implementation snippets, warnings, demos, sources, and expandable details. The result is dense without being scannable.
- `src/components/HeroOverview.tsx` and `src/components/ResultsStatus.tsx`: these should become part of a polished catalog toolbar/status system instead of isolated pills and helper text.

## Design direction

Match Crypto Lab's strengths, adapted for an algorithm reference rather than a demo gallery:

- Dark editorial background, restrained teal/amber/crimson/violet accents, no rainbow/neon striping.
- Fraunces for display headings, DM Mono/mono-style UI labels where already configured, but avoid making every paragraph feel like code.
- Dense catalog browsing that still has hierarchy: users should see what category they are in, how many results are shown, what filters are active, and which algorithms are recommended.
- Cards should scan like professional reference records, not like dashboards full of badges.
- Use fewer decorative symbols. Replace emoji controls with text, CSS marks, or small accessible icon-like glyphs only where useful.
- Keep borders subtle, radii consistent, and spacing disciplined. Avoid glowing borders except for true active/selected states.

## Implementation plan

1. Establish a coherent design system in `src/app/globals.css`.
   - Remove duplicated `body` definitions and retire the old rainbow/neon `headerGradientBar` and hard-coded blue leftovers.
   - Keep the Crypto Lab-inspired palette, but normalize all control, card, panel, badge, and focus colors to the CSS variables.
   - Add reusable classes for shell layout, catalog toolbar, filter chips, record cards, compact metadata rows, selected states, warnings, and empty states.
   - Delete or quarantine stale CSS for obsolete header/category nav classes once confirmed unused.

2. Redesign the top of the homepage.
   - Make `HomeHero` a stronger first viewport: product name, scale, short value proposition, and primary routes to browse, advisor, safe defaults, and labs/resources.
   - Keep it usable as an app screen, not a marketing page. The catalog should remain visible quickly below the hero.
   - Pull the strongest Crypto Lab pattern into this repo: compact category/count navigation and a clear "Explore / filter / compare" rhythm.

3. Rework navigation and catalog status.
   - In `AppHeaderNav`, make the brand and menu look like a professional app header, not a placeholder. Avoid emoji-heavy nav.
   - Make category selection easier to inspect. A large catalog should not depend only on a hidden slide-out menu.
   - In `HeroOverview` and `ResultsStatus`, combine result count, source count, reviewed date, recommended count, and current category into a single polished status row near the controls.

4. Rebuild `SearchControls` as a proper catalog command bar.
   - Search should be the dominant control.
   - Sort, global/category scope, filters, and methodology should be secondary controls with consistent sizing.
   - Active filters should be obvious and removable without making the toolbar wrap into visual noise.
   - Preserve mobile bottom-sheet behavior, but make it feel designed: clear title, active count, grouped filter sections, stable buttons, and no overlapping text.

5. Redesign `AlgoCard` as a scannable algorithm record.
   - Move most inline styles into CSS classes.
   - Give each card a consistent structure: header, recommendation/status, use case summary, key security facts, provenance/source summary, actions.
   - Make the primary scan path obvious: algorithm name, recommendation, family/category, use case, classical/PQ security, standardization/maturity.
   - Move heavy details, source lists, demos, implementation links, wrong-choice consequences, and long rationale text behind a clean disclosure area.
   - Keep selected/favorite/detail actions accessible, but make them visually quiet. Avoid large text pills floating over the title area.
   - Ensure cards remain stable in height as much as practical and do not jump when hovered or selected.

6. Improve information architecture for scale.
   - This app must handle roughly 100+ algorithms now and should not collapse when it grows. Use compact category summaries, sticky or near-sticky controls where appropriate, and strong section rhythm.
   - Do not dump all educational panels into the user's scan path. Below-the-fold panels are fine, but the top browsing experience must stay focused.

7. Mobile polish is required, not optional.
   - Test at 390px, 768px, and desktop width.
   - No horizontal overflow, overlapping controls, clipped button labels, or cards with action buttons covering algorithm names.
   - The filter sheet, menu, comparison overlay, and floating advisor button must coexist without blocking core actions.

## Constraints

- Keep the existing data model and public behavior intact unless a bug is found.
- Do not remove accessibility: keep skip link, focus-visible styles, ARIA labels, keyboard selection, live result count, and mobile menu behavior.
- Do not add a heavy component library just for visual polish.
- Keep performance work already present: dynamic imports, `content-visibility`, and below-the-fold deferral.
- Prefer CSS classes over large inline style objects. Inline styles should be reserved for truly dynamic values such as category accent colors.
- Avoid broad unrelated refactors. This should be a focused UI/product polish pass.

## Suggested validation

Before editing, capture the current state if possible:

- `npm run type-check`
- `npm test -- --runInBand` is not appropriate for Vitest; use `npm test` or targeted `vitest run` commands instead.
- Desktop and mobile screenshots of `/` if Playwright/browser tools are available.

After editing, run at least:

- `npm run type-check`
- `npm test`
- `npm run test:e2e` if the browser environment is available
- Manual visual checks at desktop, tablet, and mobile widths

Key acceptance checks:

- The homepage immediately reads as a polished professional reference app.
- The visual language is recognizably related to Crypto Lab but not a clone.
- Search/filter/sort/category workflows still work.
- Cards are easier to scan than before.
- Selected, favorited, warning, legacy, recommended, and advisor-pick states remain visible and accessible.
- Comparison workflow still opens, exports, copies links, and clears selection.
- No new horizontal scrolling or mobile overlap.
- The root page remains fast enough for the full catalog.

## What not to do

- Do not merely change colors and call it done.
- Do not add another hero card grid above the real tool.
- Do not make the page look like a SaaS marketing landing page.
- Do not hide the catalog behind extra onboarding.
- Do not remove sources, trust metadata, warnings, or recommendation rationale; restructure them.
- Do not replace the app's practical reference behavior with a decorative demo gallery.

The end state should feel like: Crypto Lab is the interactive exhibit museum; crypto::compare is the sober, high-trust reference desk beside it.