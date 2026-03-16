# crypto::compare 🔐

**Interactive cryptographic algorithm reference — 12 categories, 55+ algorithms, international.**

A browser-based tool for exploring, comparing, and understanding cryptographic primitives across symmetric encryption, key encapsulation, digital signatures, hashing, key derivation, MACs, password hashing, secret sharing, homomorphic encryption, zero-knowledge proofs, secure multi-party computation, and oblivious transfer / PIR.

> *So whether you eat or drink or whatever you do, do it all for the glory of God.* — 1 Corinthians 10:31

---

## Features

- **12 cryptographic categories** with rich educational explainers
- **55+ algorithms** from 16+ countries (USA, Korea, Japan, China, Russia, Ukraine, Belgium, France, Israel, Germany, Estonia, Denmark, Switzerland, Canada, UK, Luxembourg)
- **Beginner / Advanced toggle** — high-level overview or deep technical detail
- **Side-by-side comparison** — select any algorithms within a category and compare key sizes, security levels, attack complexity, performance, and more
- **Per-category project links** — each category shows which of my repos demonstrate that crypto type
- **PQ-safe focus** — all KEM, signature, and advanced categories feature quantum-resistant algorithms
- **Honest sourcing** — data from NIST FIPS, IETF RFCs, KPQC submissions, CRYPTREC, GB/T, GOST, DSTU, ISO, and published research

## Categories

| Category | What It Does | Algorithms |
|----------|-------------|------------|
| Symmetric Encryption | Encrypt data with a shared key | AES-256-GCM, ChaCha20-Poly1305, Camellia, ARIA, SM4, Kuznyechik |
| Key Encapsulation | Establish shared secrets (PQ-safe) | ML-KEM, SMAUG-T, HQC, Classic McEliece, FrodoKEM, BIKE |
| Digital Signatures | Prove authenticity | ML-DSA, HAETAE, FALCON, SLH-DSA, XMSS |
| Hash Functions | Fixed-size fingerprints | SHA-2, SHA-3, BLAKE2/3, SM3, Streebog, Kupyna |
| Key Derivation | Derive multiple keys from one secret | HKDF, Argon2, scrypt, PBKDF2, Balloon |
| MACs | Message authentication | HMAC, CMAC, KMAC, Poly1305, SipHash |
| Password Hashing | Crack-resistant credential storage | Argon2id, bcrypt, scrypt, PBKDF2, Balloon |
| Secret Sharing | Split secrets into threshold shares | Shamir, Blakley, Feldman VSS, Pedersen VSS, Additive |
| Homomorphic Encryption | Compute on encrypted data | TFHE, BGV, BFV, CKKS |
| Zero-Knowledge Proofs | Prove without revealing | Groth16, PLONK, zk-STARK, Bulletproofs |
| Multi-Party Computation | Joint computation, zero sharing | SPDZ, ABY, Yao's GC, Sharemind |
| OT / PIR | Private data retrieval | Base OT, OT Extension, Computational PIR, IT-PIR |

## Category Explainers

Each category includes a full educational panel with four sections:

- **One-liner** — what it does in plain language
- **What it does** — technical explanation accessible to non-cryptographers
- **Where you see it in the real world** — 5-8 named, concrete real-world deployments
- **Why it matters** — the stakes if this category of crypto fails
- **Your projects** — links to repos that demonstrate each crypto type

---

## Tech Stack

- **Next.js 14** / TypeScript / React
- **Tailwind CSS** with custom color system
- **No backend** — runs entirely in the browser
- **No external API calls** — all data is embedded

---

## Getting Started

```bash
git clone https://github.com/systemslibrarian/crypto-compare.git
cd crypto-compare
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
crypto-compare/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── CryptoCompare.tsx      # Main shell with tabs
│   │   ├── CategoryExplainer.tsx   # Educational panels + project links
│   │   ├── AlgoCard.tsx            # Algorithm selection cards
│   │   ├── ComparisonTable.tsx     # Side-by-side comparison
│   │   └── ui.tsx                  # Badge, SecurityMeter
│   ├── data/
│   │   ├── algorithms.ts           # 55+ algorithm definitions
│   │   ├── categories.ts           # 12 category definitions + explainers
│   │   └── projects.ts             # Portfolio project links per category
│   └── lib/
│       └── comparison.ts           # Row-building logic per category
├── docs/
│   └── data-sources.md             # Where the algorithm data comes from
├── .github/workflows/ci.yml
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Data Sources

Algorithm data is sourced from published standards and peer-reviewed research:

- NIST FIPS 180-4, 198-1, 202, 203, 204, 205
- IETF RFCs 2104, 5869, 7693, 7748, 7914, 8032, 8391, 8439, 9106
- KPQC Competition Round 2 submissions
- CRYPTREC (Japan), GB/T (China), GOST (Russia), DSTU (Ukraine), KS (Korea)
- ISO/IEC 10118-3, 18033-3
- Eurocrypt, CRYPTO, and ACM CCS proceedings

Security estimates reflect known attacks as of 2025. This is a reference tool, not a certification.

---

## Related Projects

| Project | Crypto Categories |
|---------|------------------|
| [Quantum Vault KPQC](https://github.com/systemslibrarian/quantum-vault-kpqc) | Symmetric, KEM, Signatures, KDF, MAC, Secret Sharing |
| [meow-decoder](https://github.com/systemslibrarian/meow-decoder) | Symmetric, Hash, Steganography |
| [Scripture Journey](https://github.com/systemslibrarian/scripture-journey) | — |
| [Scripture Cloak](https://github.com/systemslibrarian/scripture-cloak) | ZKP concepts, Hash, PIR concept |
| **crypto::compare** (this repo) | Reference tool for all 12 categories |

---

## Author

**Paul** — Library systems engineer, Tallahassee, Florida. Building at the intersection of cryptography, faith, and public service.

[GitHub: systemslibrarian](https://github.com/systemslibrarian)

---

## License

MIT
