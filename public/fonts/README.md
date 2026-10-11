# Self-hosted site fonts

These are the unmodified DM Mono 400/500 and Fraunces normal 400/500/600 WOFF2 subsets already emitted by the baseline Next build at `7b9177b2fd495ebe190b467bdd1e7451edb1f904`. Every downloaded file matched the baseline emitted bytes by SHA-256 before copying. `manifest.json` records exact URLs, capture time, hashes, sizes and subsets. This establishes identity with the captured distribution, not a reproducible build from font source.

`fonts.css` preserves all 13 original real font faces (Latin, Latin Extended and Fraunces Vietnamese), both original fallback faces and their exact metric overrides. The layout preloads the same three Latin files; relative CSS URLs and the layout's base path keep both custom-domain and repository-path exports usable. No Google request is required at build or browser runtime.

Both fonts use the SIL Open Font License 1.1; Git normalizes the DM Mono license line endings without changing its wording; the accompanying license wording was read at the immutable Google Fonts repository revision `bd8f81ddb5c74d5c8897b36ad88b440266245103`:

- [DM Mono license](https://github.com/google/fonts/blob/bd8f81ddb5c74d5c8897b36ad88b440266245103/ofl/dmmono/OFL.txt)
- [Fraunces license](https://github.com/google/fonts/blob/bd8f81ddb5c74d5c8897b36ad88b440266245103/ofl/fraunces/OFL.txt)

This avoids [Next.js issue #99114](https://github.com/vercel/next.js/issues/99114), whose Google loader cannot parse extensionless font URLs. The failed CI URL itself was not logged; a controlled extensionless response independently reproduces the identical loader failure. When deliberately updating fonts, review the upstream licenses, capture and hash all subsets, preserve the intended face/weight/range and fallback behavior, then run build, end-to-end tests and desktop/mobile visual comparison.
