# Crypto-Lab Coverage Analysis (Updated April 2026)

Current-state coverage analysis for crypto::compare category project mappings versus live crypto-lab demos.

---

## Executive Summary

- There is no longer a broad demo-mapping gap.
- Live crypto-lab index demos: **64**
- crypto-lab demos mapped in `src/data/categories.ts`: **65**
- Live demos not mapped: **0**
- Mapped but not currently listed on live index: **1** (`crypto-lab-ckks-lab`)
- Total unique public demo repos referenced (crypto-lab + non-crypto-lab): **68**

Bottom line: the remaining gap is not missing category mappings. It is uneven category depth and one publish/index mismatch.

---

## Data Sources

Counts were derived from:

- `src/data/categories.ts` (project mappings)
- `https://systemslibrarian.github.io/crypto-lab/` (live index)

---

## Coverage Reconciliation

| Metric | Count |
|---|---:|
| Live `crypto-lab-*` demos | 64 |
| Mapped `crypto-lab-*` demos in categories | 65 |
| `live_not_mapped` | 0 |
| `mapped_not_live` | 1 |
| Unique public repos in category mappings | 68 |

### Mapped-but-not-live

- `crypto-lab-ckks-lab`

This is mapped in the HE category but not currently listed on the live crypto-lab index.

---

## Category Depth Snapshot

Counts below are current entries in `src/data/categories.ts`.

| Category | Total Projects | Public | Private |
|---|---:|---:|---:|
| Symmetric | 17 | 16 | 1 |
| KEM | 11 | 10 | 1 |
| Signatures | 10 | 10 | 0 |
| Elliptic Curves | 8 | 8 | 0 |
| Hash | 8 | 7 | 1 |
| KDF | 7 | 7 | 0 |
| MAC | 5 | 4 | 1 |
| Password | 5 | 4 | 1 |
| Sharing | 5 | 5 | 0 |
| ZKP | 4 | 4 | 0 |
| Asymmetric | 4 | 3 | 1 |
| HE | 3 | 3 | 0 |
| OT/PIR | 3 | 3 | 0 |
| Stego | 3 | 3 | 0 |
| Threshold Sigs | 3 | 3 | 0 |
| CSPRNG | 3 | 3 | 0 |
| MPC | 2 | 2 | 0 |

---

## Where the Real Gap Is Now

The current gap is depth concentration, not missing presence.

### Thinnest categories

1. **MPC (2)**
2. **HE (3)**
3. **OT/PIR (3)**
4. **Threshold Sigs (3)**
5. **Stego (3)**
6. **CSPRNG (3)**

### Most saturated categories

1. **Symmetric (17)**
2. **KEM (11)**
3. **Signatures (10)**

---

## Recommended Next Actions

### 1) Resolve publish/index mismatch

- If `crypto-lab-ckks-lab` is live, add it to the crypto-lab index page.
- If not live yet, keep the mapping but note it as "coming soon" in project notes.

### 2) Prioritize new demos by depth impact

Highest marginal educational impact is likely in:

- MPC
- HE
- OT/PIR
- Threshold signatures

### 3) Keep README and analysis synchronized

When demo totals change, update:

- `README.md` summary counts
- this `analysis.md` reconciliation section

---

## Conclusion

The original broad "uncovered demo" problem is effectively closed. Coverage now behaves like a mature portfolio: all categories are represented, with remaining work focused on balancing depth across lower-count domains and keeping the live index synchronized with mappings.
