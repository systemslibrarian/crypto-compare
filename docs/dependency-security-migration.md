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

`vendor/eslint-plugin-next` contains the exact npm15.5.27 distribution, recorded
with SHA512 tar integrity and per-file SHA256 in `UPSTREAM.json`. All21 upstream rule implementations
(42 JavaScript/declaration files) remain unchanged. Only the root-directory glob consumer and
package runtime dependencies are patched. `.gitattributes` exempts only that
external compiled distribution from whitespace checking so authentic bytes
remain unchanged; application and handwritten files retain normal checks. glob13.0.6 replaces the vulnerable
fast-glob path for that consumer, with directory/symlink/path-format semantics
checked against frozen outputs from the actual original package. This is not a
general fast-glob compatibility shim. The upstream development-only ESLint8.56
is omitted; the application retains its current ESLint8.57.1/config/rules.

Application lint coverage is unchanged: the external vendored package was
previously under ignored node_modules and is now excluded as external source by
`.eslintignore`. Dedicated regression tests check every upstream file and all
42 unchanged rule-file hashes, plus actual navigation-rule positive/negative controls.
They also reject a future config/plugin version mismatch: a newer Next lint
release requires reviewing/removing this patch rather than silently keeping an
older rule set. No Next runtime downgrade or lint-rule suppression is used.
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

Maintenance record: b1ef1d65-0201-48db-8261-a4603583443c. A candidate audit passing
does not establish integration or production delivery; those are recorded only
after exact PR-head checks, normal merge and current-head deployment verification.
