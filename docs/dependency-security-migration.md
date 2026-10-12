# Development dependency security migration

The immutable current lock included unpatched Braces through both Tailwind3 and
Next15's lint plugin (GHSA-vfj7-8cjw-p6xm). Production-only audit was insufficient.

Tailwind4.3.3 uses its supported `@tailwindcss/postcss` plugin. The existing config,
self-hosted fonts and component CSS remain authoritative. Base typography is now
in the base layer so component rules retain their original precedence. Existing
emerald UI colors, default borders and rounded-full rendering are retained.
Browser minimums: Safari16.4+, Chrome111+, Firefox128+, per the official upgrade
[guide](https://tailwindcss.com/docs/upgrade-guide). These browsers are the
supported minimums for this migration; older-browser compatibility is not claimed.

`vendor/eslint-plugin-next` now contains the exact npm16.4.0 distribution,
recorded with SHA512 tar integrity, tarball SHA256 and per-file SHA256 in
`UPSTREAM.json`. The upstream package still depends on fast-glob3.3.1, which
resolves the Braces version affected by GHSA-vfj7-8cjw-p6xm. The same narrow
security replacement therefore remains necessary: all22 upstream rule
implementations (44 JavaScript/declaration files) remain unchanged, while only
the root-directory glob consumer and package runtime dependencies are patched.
glob13.0.6 replaces the vulnerable fast-glob path for that consumer, with
directory/symlink/path-format semantics checked against frozen outputs from the
actual upstream consumer. This is not a general fast-glob compatibility shim.
`.gitattributes` exempts only that external compiled distribution from
whitespace checking; application and handwritten files retain normal checks.

The lint runner is ESLint9.39.5 with the supported flat configuration exported
by eslint-config-next16.4.0. The external vendored package remains globally
ignored in `eslint.config.mjs`. Dedicated regression tests check every upstream
file and all44 unchanged rule-file hashes, plus actual navigation-rule
positive/negative controls. They also prove that all52 prior resolved rules are
retained after severity normalization and that the only additions are the
reviewed Next relative-location rule and14 React Hooks compiler rules. The
application changes satisfy those rules; none is disabled or downgraded. Tests
reject a future config/plugin version mismatch so a later release cannot
silently retain an older rule set. No Next runtime downgrade is used.
The existing selector-parser security regression now has an explicit7.1.6
dev dependency instead of relying on Tailwind3 to bring its test prerequisite.

Run `npm ci`, `npm ls braces micromatch fast-glob glob --all`,
`npm audit --package-lock-only --ignore-scripts --json` and the same audit with
`--omit=dev`. Then run `npm run lint` (max-warnings0), `npm run type-check`,
`npm test`, `npm run validate:full`, `npm run build`, and `npm run test:e2e`.
`npm test` includes the frozen consumer fixtures and vendor integrity checks.

UI migration review also compares fresh baseline/candidate builds at desktop,
390px and320px widths, including fonts, focus and navigation behavior. The source
has long contained semantic badge modifiers that Tailwind3 pruned when dynamically
composed; Tailwind4 retains that authored component CSS. Such badges now display
the existing declared semantic palette instead of inheriting unstyled text.
This known rendering difference is recorded explicitly; full pixel equality in
all scrolled states is not claimed.

Initial maintenance record: b1ef1d65-0201-48db-8261-a4603583443c. The Next16
follow-up preserves that history and refreshes the recorded upstream package.
A candidate audit passing does not establish integration or production delivery;
those are recorded only after exact PR-head checks, normal merge and current-head
deployment verification.
