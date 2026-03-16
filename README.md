# crypto::compare 🔐

**Interactive cryptographic algorithm reference — 12 categories, 64 algorithms, 16+ countries.**

🌐 **[Live Site → systemslibrarian.github.io/crypto-compare](https://systemslibrarian.github.io/crypto-compare/)**

> *So whether you eat or drink or whatever you do, do it all for the glory of God.* — 1 Corinthians 10:31

---

## What This Is

A browser-based reference tool for exploring, comparing, and choosing cryptographic algorithms. No backend, no accounts, no tracking — open it and start comparing.

**It is not:**
- A cryptographic library or implementation
- A certification authority or compliance checker
- An interactive playground for running crypto operations
- A substitute for professional cryptographic engineering review

**It is:**
- An algorithm-level reference with real data from published standards and peer-reviewed research
- A comparison tool for evaluating primitives across key sizes, security bits, attack complexity, and performance
- A decision helper for answering "which algorithm should I use?"
- A learning resource with educational explainers for each category

---

## What You Can Do

### Browse 64 Algorithms Across 12 Categories

| Category | Algorithms |
|----------|------------|
| Symmetric Encryption | AES-256-GCM, ChaCha20-Poly1305, XChaCha20-Poly1305, Camellia-256, ARIA-256, SM4, Kuznyechik |
| Key Encapsulation (KEM) | ML-KEM-768, ML-KEM-1024, SMAUG-T, HQC, Classic McEliece, FrodoKEM-976, BIKE |
| Digital Signatures | ML-DSA-44, ML-DSA-65, HAETAE, FALCON-512, SLH-DSA, XMSS |
| Hash Functions | SHA-256, SHA-512, SHA-3-256, BLAKE2b, BLAKE3, SM3, Streebog, Kupyna-256 |
| Key Derivation (KDF) | HKDF, Argon2 (KDF), scrypt, PBKDF2, Balloon Hashing |
| MACs | HMAC-SHA-256, CMAC-AES-256, KMAC256, Poly1305, SipHash |
| Password Hashing | Argon2id, bcrypt, scrypt, PBKDF2, Balloon Hashing |
| Secret Sharing | Shamir, Blakley, Feldman VSS, Pedersen VSS, Additive Sharing |
| Homomorphic Encryption | TFHE, BGV, BFV, CKKS |
| Zero-Knowledge Proofs | Groth16, PLONK, zk-STARK, Bulletproofs |
| Multi-Party Computation | SPDZ, ABY, Yao's Garbled Circuits, Sharemind |
| OT / PIR | Base OT, OT Extension, Computational PIR, IT-PIR |

Each algorithm shows: origin country, use cases, classical security bits, post-quantum security bits (with visual meters), best known attack, reduction quality, performance summary, and standardization status.

### Compare Side by Side

Select any 2+ algorithms within a category → compare them in a structured table showing every relevant metric. The comparison table adapts to your category (symmetric shows key/nonce/block sizes; KEM shows public key/ciphertext/shared secret sizes; etc.).

**Export comparisons** as CSV or Markdown. **Copy a deep link** to share your exact comparison with someone else.

### "What Should I Use?" Decision Flowchart

An interactive step-by-step wizard that asks what you need to accomplish and recommends a specific algorithm with reasoning. Covers all 12 categories with 2–3 narrowing questions per path.

### Search, Filter, Sort

- **Text search** within any category
- **Filter by**: PQ-safe only, standards only, NIST only, widely deployed, recommended defaults
- **Filter by origin**: Korea, USA, Europe, Japan, China, Russia, Ukraine
- **Sort by**: name, classical security, PQ security, public key size, signature size
- **Beginner / Advanced toggle**: beginner shows essentials; advanced reveals attack vectors and performance details

All filter state is persisted in the URL. Copy-paste the address bar to share any filtered view.

### Educational Explainers

Every category includes a collapsible panel with:
- **What it does** — technical explanation accessible to non-cryptographers
- **Where you see it** — named, specific real-world deployments (Chrome/Firefox hybrid TLS, WireGuard, BitLocker, ICANN ceremonies, Zcash, etc.)
- **Why it matters** — what breaks if this category of crypto fails
- **Related projects** — links to repos that demonstrate each crypto type

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` or `Ctrl+K` | Focus search |
| `A` | Toggle beginner/advanced |
| `← →` | Switch category |
| `?` | Toggle methodology panel |
| `Esc` | Close panels, blur search |

### Source Provenance

Every algorithm has linked source references (NIST FIPS, IETF RFCs, academic papers) and a last-reviewed date. Select any algorithm to see its sources in a panel below the cards.

---

## Limitations

This tool has real constraints worth knowing:

- **No executable crypto**: You cannot encrypt, hash, sign, or run algorithms here. This is a reference, not a playground.
- **No formal verification status tracking**: Whether an algorithm has formally verified implementations is not captured.
- **No hybrid scheme entries**: PQ + classical hybrid combinations (e.g., ML-KEM + X25519 as used in Chrome) aren't modeled as distinct entries.
- **No side-channel resistance ratings**: The data tracks whether password hashing functions are side-channel resistant, but not general-purpose primitives.
- **Static data**: Algorithm data is embedded in TypeScript files. Updates require code changes and redeployment. There's no API or database.
- **Security estimates are time-bound**: Data reflects published cryptanalysis as of the review date shown in the footer. New attacks can change the picture.
- **Solo project**: One maintainer. No institutional backing, no external auditors, no guaranteed update cadence.

---

## Data Sources

Security parameters and algorithm properties are drawn from:

- **NIST**: FIPS 180-4, 197, 198-1, 202, 203, 204, 205; SP 800-38B, 800-38D, 800-132, 800-185, 800-208
- **IETF**: RFCs 2104, 5794, 5869, 7693, 7801, 7914, 8018, 8391, 8439, 8998, 9106
- **National standards**: KPQC (Korea), CRYPTREC (Japan), GB/T (China), GOST (Russia), DSTU (Ukraine), KS (Korea)
- **ISO**: ISO/IEC 10118-3, 18033-3
- **Academic**: Eurocrypt, CRYPTO, ACM CCS, IEEE S&P, NDSS proceedings — original papers for Groth16, PLONK, zk-STARK, Bulletproofs, TFHE, BGV, BFV, CKKS, Shamir, Feldman, SPDZ, ABY, and others

Full per-algorithm source links are in the app's provenance panel and in [`src/data/provenance.ts`](src/data/provenance.ts).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (static export) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS variables |
| Deployment | GitHub Pages via Actions |
| Testing | Vitest + Testing Library |
| CI | Type-check → Test → Lint → Build |

No backend. No external API calls. No cookies. No analytics.

---

## Getting Started

```bash
git clone https://github.com/systemslibrarian/crypto-compare.git
cd crypto-compare
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Static export to `out/` |
| `npm run test` | Run vitest test suite |
| `npm run type-check` | TypeScript strict check |
| `npm run lint` | ESLint |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, SEO metadata, JSON-LD
│   ├── page.tsx                # Entry point (wraps CryptoCompare in ErrorBoundary)
│   └── globals.css             # Tailwind layers + component classes
├── components/
│   ├── CryptoCompare.tsx       # Main shell: tabs, search, filters, comparison, export
│   ├── CategoryExplainer.tsx   # Educational panels + project links per category
│   ├── AlgoCard.tsx            # Algorithm selection cards with SecurityMeters
│   ├── ComparisonTable.tsx     # Side-by-side table (desktop) + stacked cards (mobile)
│   ├── DecisionFlowchart.tsx   # "What should I use?" interactive wizard
│   ├── ErrorBoundary.tsx       # React error boundary with reload
│   └── ui.tsx                  # Badge, SecurityMeter, formatBytes
├── data/
│   ├── algorithms.ts           # 64 algorithm definitions (12–18 fields each)
│   ├── categories.ts           # 12 category definitions + explainers
│   └── provenance.ts           # Per-algorithm source links + review dates
├── lib/
│   ├── comparison.tsx          # Row-building logic per category for comparison table
│   ├── validation.ts           # Runtime data validation
│   └── useKeyboardShortcuts.ts # Keyboard shortcut hook
├── types/
│   └── crypto.ts               # Strict TypeScript types for all data models
└── __tests__/
    ├── setup.ts                # Vitest + testing-library setup
    └── dataset.test.ts         # Dataset validation + provenance coverage tests
```

---

## Related Projects

| Project | Crypto Categories |
|---------|------------------|
| [Quantum Vault KPQC](https://github.com/systemslibrarian/quantum-vault-kpqc) | Symmetric, KEM, Signatures, KDF, MAC, Secret Sharing |
| [meow-decoder](https://github.com/systemslibrarian/meow-decoder) | Symmetric, Hash, Steganography |
| [Scripture Cloak](https://github.com/systemslibrarian/scripture-cloak) | ZKP concepts, Hash, PIR concept |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Author

**Paul** — Library systems engineer, Tallahassee, Florida. Building at the intersection of cryptography, faith, and public service.

[GitHub: systemslibrarian](https://github.com/systemslibrarian)

---

## License

MIT
