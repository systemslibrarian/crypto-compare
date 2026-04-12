# Crypto-Lab Demo Gap Analysis

Algorithms in **crypto-compare** mapped against existing demos in **crypto-lab**, with recommended new projects for uncovered algorithms.

---

## Symmetric Encryption (5 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **Camellia-256** | `crypto-lab-camellia-forge` | Japanese/EU Feistel cipher — side-by-side AES vs Camellia round structure, CRYPTREC compliance badge, and performance comparison without AES-NI |
| **ARIA-256** | `crypto-lab-aria-forge` | Korean SPN cipher — involutional S-box visualizer, compare to AES structure, Korean compliance context |
| **SM4** | `crypto-lab-sm4-forge` | Chinese national cipher — unbalanced Feistel network, WAPI context, 128-bit key limitation warning for post-quantum |
| **Kuznyechik** | `crypto-lab-kuznyechik-forge` | Russian GOST cipher — Galois field S-box construction, compare to AES-NI-less performance, GOST R 34.12-2015 context |
| **SNOW-V** | `crypto-lab-snow-stream` | 5G stream cipher — LFSR/FSM visualizer, designed for ≥256-bit security at 5G NR speeds, comparison to ChaCha20 for stream cipher concepts |

**Bundled alternative**: A single `crypto-lab-world-ciphers` demo covering Camellia, ARIA, SM4, and Kuznyechik as "national standard" ciphers, with round-structure animation and performance benchmarks. This avoids four very similar standalone demos.

---

## Elliptic Curves (4 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **P-384 / P-521** | `crypto-lab-nist-curves` | NIST higher-order curves — key size vs security tradeoff, TLS certificate chain demo with P-384 (increasingly common in enterprise), performance penalty visualization |
| **Ed448 / Curve448** | `crypto-lab-ed448-forge` | The "larger Ed25519" — 224-bit security, Goldilocks prime, comparison to Ed25519 for use cases needing higher margin |
| **BN254** | `crypto-lab-bn254-gate` | The "Ethereum pairing curve" — BN vs BLS12-381 tradeoffs, why Ethereum moved from BN254 to BLS12-381, 100-bit security warning |
| **Brainpool P-256r1** | Could be folded into `crypto-lab-nist-curves` or `crypto-lab-curve-lens` update — verifiably random parameter generation vs NIST "nothing up my sleeve" controversy |

---

## KEM (1 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **FrodoKEM-976** | `crypto-lab-frodo-vault` | The "conservative" lattice KEM — standard LWE (no ring structure), much larger keys but conceptually simpler, side-by-side vs ML-KEM showing the ring-LWE optimization tradeoff |

---

## Digital Signatures (1 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **XMSS** | `crypto-lab-xmss-ledger` | Stateful hash-based signatures (RFC 8391) — Merkle tree key management, state tracking danger (reuse = forgery), comparison to LMS/HSS, firmware signing use case |

---

## Hash Functions (3 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **SM3** | `crypto-lab-sm3-lens` | Chinese hash standard — Merkle-Damgård construction, compare to SHA-256 (structurally similar), Chinese PKI context |
| **Streebog** | `crypto-lab-streebog-lens` | Russian GOST R 34.11-2012 hash — wide-pipe Merkle-Damgård, S-box controversy (possible kleptographic concerns), compare to SHA-512 |
| **Kupyna-256** | `crypto-lab-kupyna-lens` | Ukrainian national hash — sponge-like construction, compare to SHA-3 |

**Bundled alternative**: `crypto-lab-world-hashes` — SM3, Streebog, and Kupyna side-by-side with SHA-256/SHA-3, emphasizing national crypto sovereignty and construction differences.

---

## MAC (2 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **KMAC256** | `crypto-lab-kmac-forge` | SHA-3-based MAC — no length extension vulnerability (unlike HMAC-SHA-256), cSHAKE customization strings, compare to HMAC construction |
| **SipHash** | `crypto-lab-siphash-race` | Hash table DoS prevention — the MAC that protects every HashMap in Rust/Python/Ruby, HashDoS attack demo, why speed matters here |

---

## Password Hashing (2 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **bcrypt** | `crypto-lab-bcrypt-forge` | The original memory-hard(ish) password hash — Blowfish key schedule, cost factor tuning, 72-byte input limit gotcha, why Argon2id supersedes it |
| **Balloon Hashing** | `crypto-lab-balloon-forge` | Provably memory-hard — the only password hash with a formal proof of memory-hardness, DAG construction visualizer, compare to Argon2id |

---

## Secret Sharing (3 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **Blakley's Scheme** | `crypto-lab-blakley-visual` | Geometric secret sharing — hyperplane intersection (vs Shamir's polynomial), visual 3D intersection demo |
| **Feldman VSS / Pedersen VSS** | `crypto-lab-vss-gate` | Verifiable Secret Sharing — combine both in one demo: Feldman adds commitments to Shamir so dealers can't cheat, Pedersen adds information-theoretic hiding. Show a cheating dealer detected |
| **Additive Sharing** | Fold into `crypto-lab-silent-tally` or `crypto-lab-vss-gate` — XOR-based sharing is the trivial n-of-n case, best shown as contrast to threshold schemes |

---

## Homomorphic Encryption (3 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **BGV / BFV** | `crypto-lab-fhe-arena` | Integer/exact FHE — encrypted integer arithmetic, noise budget visualizer showing why bootstrapping is needed, compare to TFHE (bit-level) |
| **CKKS** | `crypto-lab-ckks-lab` | Approximate FHE for ML — encrypted floating-point arithmetic, precision loss visualization, the scheme behind encrypted machine learning inference |

---

## Zero-Knowledge Proofs (3 uncovered as standalone)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **Groth16 vs PLONK** | `crypto-lab-snark-arena` | Trusted setup vs universal setup — Groth16's per-circuit ceremony, PLONK's universal SRS, proof size and verification time comparison |
| **zk-STARK** | `crypto-lab-stark-tower` | No trusted setup, quantum-resistant — FRI commitment, AIR constraints, larger proofs but transparency, StarkNet/Cairo context |
| **Bulletproofs** | `crypto-lab-bulletproof-range` | Range proofs without trusted setup — Pedersen commitments, inner product argument, Monero's confidential transactions |

---

## Secure MPC (3 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **SPDZ** | `crypto-lab-spdz-tally` | Malicious-secure MPC — Beaver triple pre-processing, MAC-based cheating detection, compare to semi-honest protocols |
| **ABY** | `crypto-lab-aby-mix` | Mixed-protocol MPC — Arithmetic + Boolean + Yao's garbled circuits, automatic protocol switching, show when each sub-protocol wins |
| **Yao's Garbled Circuits** | `crypto-lab-garbled-gate` | The foundational MPC protocol — garble a simple circuit (e.g., millionaire's problem), oblivious transfer for input wires, gate-by-gate evaluation visualizer |

---

## OT/PIR (2 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **OT Extension** | `crypto-lab-ot-extend` | From k base OTs to millions — IKNP03 protocol, how a few expensive OTs bootstrap cheap ones, foundation of every practical MPC system |
| **Computational PIR** | `crypto-lab-cpir-shelf` | Single-server PIR — lattice-based (SealPIR-style), compare to 2-server IT-PIR in Oblivious Shelf, practical cost analysis |

---

## Asymmetric Encryption (2 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **ElGamal** | `crypto-lab-elgamal-forge` | Multiplicatively homomorphic encryption — the textbook public-key scheme, re-randomization property, why it matters for e-voting |
| **SM2 Encryption** | `crypto-lab-sm2-forge` | Chinese elliptic curve encryption + signatures, compare to ECIES/ECDSA on P-256. Could also fold into `crypto-lab-world-ciphers` |

---

## Threshold Signatures (4 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **GG20** | `crypto-lab-gg20-wallet` | ECDSA threshold signing — the protocol behind Fireblocks/Coinbase custody, why ECDSA threshold is harder than Schnorr threshold |
| **BLS Threshold** | `crypto-lab-bls-threshold` | Aggregatable threshold sigs — deterministic signatures, aggregation for Ethereum validators, compare to FROST |
| **DKLS23** | `crypto-lab-dkls-sign` | 2-of-2 ECDSA — the newest efficient two-party signing protocol, compare to GG20 for the 2-party case |
| **Shamir+Schnorr** | Already conceptually covered by FROST Threshold — add a "classic Schnorr threshold" tab or footnote |

---

## CSPRNG (4 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **HMAC-DRBG / CTR-DRBG / Hash-DRBG** | `crypto-lab-drbg-arena` | NIST SP 800-90A family — seeding, reseeding, prediction resistance, compare all three constructions, entropy source visualization |
| **ChaCha20-DRBG** | Fold into `crypto-lab-drbg-arena` — the non-NIST alternative used in Linux /dev/urandom |
| **Fortuna** | `crypto-lab-fortuna-pool` | Entropy pool management — multiple accumulator pools, automatic reseeding schedule, the design behind macOS/FreeBSD randomness |

---

## Steganography (3 uncovered)

| Algorithm | Suggested Demo | Concept |
|-----------|---------------|---------|
| **LSB Substitution** | `crypto-lab-stego-lens` | Classic least-significant-bit embedding — hide a message in an image, chi-squared steganalysis detection, visual pixel difference map |
| **DCT-Domain (F5)** | `crypto-lab-f5-stego` | JPEG steganography — DCT coefficient manipulation, matrix embedding for efficiency, compare detectability to LSB |
| **BPCS / Spread Spectrum / Adaptive (WOW)** | `crypto-lab-stego-arena` | Advanced steganography comparison — BPCS complexity segmentation, spread spectrum robustness, WOW adaptive embedding in "noisy" regions, ML-based steganalysis arms race |

**Bundled alternative**: A single `crypto-lab-stego-suite` covering LSB, F5, and one adaptive method, with a built-in steganalysis detector so users can see which techniques survive detection.

---

## Priority Recommendations

### High Priority
Categories with 0–1 demos and high educational value:

1. **`crypto-lab-garbled-gate`** — Yao's Garbled Circuits (foundational MPC, nothing like it exists)
2. **`crypto-lab-snark-arena`** — Groth16 vs PLONK (ZKP is hot, only 1 demo exists)
3. **`crypto-lab-fhe-arena`** — BGV/BFV integer FHE (only Blind Oracle exists for HE)
4. **`crypto-lab-drbg-arena`** — NIST DRBG family (Corrupted Oracle shows the failure case; need the correct case)
5. **`crypto-lab-world-ciphers`** — Camellia/ARIA/SM4/Kuznyechik bundle (covers 4 algorithms efficiently)
6. **`crypto-lab-bcrypt-forge`** — bcrypt (most-deployed password hash, no demo)

### Medium Priority
Good educational value, fills specific gaps:

7. **`crypto-lab-vss-gate`** — Feldman/Pedersen VSS
8. **`crypto-lab-gg20-wallet`** — GG20 threshold ECDSA
9. **`crypto-lab-stark-tower`** — zk-STARKs
10. **`crypto-lab-ckks-lab`** — CKKS approximate FHE for ML
11. **`crypto-lab-world-hashes`** — SM3/Streebog/Kupyna
12. **`crypto-lab-frodo-vault`** — FrodoKEM conservative PQ KEM
13. **`crypto-lab-stego-suite`** — LSB/F5/adaptive steganography with steganalysis

### Lower Priority
Niche or can be folded into existing demos:

- **BN254, Brainpool, P-384/P-521** → extend Curve Lens
- **Additive Sharing** → fold into Silent Tally
- **KMAC256** → fold into MAC Race
- **OT Extension** → fold into OT Gate
- **Shamir+Schnorr** → already in FROST Threshold
- **SM2 Encryption** → fold into world-ciphers or standalone

---

## Summary

| Category | Total Algorithms | With Demos | Uncovered | Suggested New Repos |
|----------|-----------------|------------|-----------|-------------------|
| Symmetric | 9 | 4 | 5 | 1–2 (bundle recommended) |
| Curves | 11 | 7 | 4 | 2–3 |
| KEM | 7 | 6 | 1 | 1 |
| Signatures | 11 | 7 | 1 | 1 |
| Hash | 8 | 5 | 3 | 1 (bundle) |
| KDF | 5 | 5 | 0 | — |
| MAC | 5 | 3 | 2 | 1–2 |
| Password | 5 | 3 | 2 | 2 |
| Sharing | 5 | 2 | 3 | 2 |
| HE | 4 | 1 | 3 | 2 |
| ZKP | 4 | 1 | 3 | 3 |
| MPC | 4 | 1 | 3 | 3 |
| OT/PIR | 4 | 3 | 1–2 | 1–2 |
| Asymmetric | 5 | 3 | 2 | 1–2 |
| Stego | 5 | 2 | 3 | 1–2 (bundle) |
| Threshold Sigs | 5 | 1 | 4 | 3 |
| CSPRNG | 5 | 2 | 3–4 | 2 |
| **Total** | **~97** | **~56** | **~41** | **~25–30 new repos** |
