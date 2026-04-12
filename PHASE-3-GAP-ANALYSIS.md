# Phase 3 — Conceptual Gap Analysis

Evaluated as a cryptography educator reviewing this collection for educational completeness.
Everything referenced below is grounded in what was actually read in the source.

---

## What IS present (conceptual coverage)

The collection already teaches these concepts effectively, either through algorithm entries,
category explanations, Use Case Guide, Safe Usage, Reference Architectures, or Decision Flowchart:

1. **Authenticated encryption (AEAD)** — AES-GCM, ChaCha20-Poly1305, XChaCha20, GCM-SIV all present. Nonce misuse explained. Encrypt-then-MAC vs integrated AEAD covered implicitly.
2. **Post-quantum transition** — ML-KEM, ML-DSA, SLH-DSA, hybrid patterns, "harvest now decrypt later" threat. Excellent coverage.
3. **Key derivation vs password hashing** — HKDF for high-entropy, Argon2 for low-entropy. The distinction is explicitly called out. KDF Chain and KDF Arena labs reinforce this.
4. **Memory-hardness** — Argon2id vs bcrypt vs scrypt vs PBKDF2. GPU/ASIC resistance explained. Balloon Hashing's provable memory-hardness noted.
5. **Nonce management** — Nonce reuse catastrophe for AES-GCM, safe random nonces for XChaCha20, SIV construction for misuse resistance. Nonce Guard lab.
6. **Curve rigidity and design philosophy** — SafeCurves discussion, Montgomery ladders, constant-time by construction, NIST curve debate.
7. **Threshold cryptography vs secret sharing** — Clear distinction between "key is never reconstructed" (FROST) and "key is split and reassembled" (Shamir). Critical conceptual point well made.
8. **Trust model for ZKPs** — Trusted setup (Groth16, PLONK) vs transparency (STARKs). Per-circuit vs universal setup.
9. **Information-theoretic vs computational security** — Shamir's perfect secrecy, Poly1305 one-time security, IT-PIR. Distinction is present in multiple entries.
10. **Block cipher modes** — AES Modes lab covers ECB, CBC, CTR, GCM, CCM with padding oracle and ECB penguin.
11. **Pairing-based cryptography** — BLS12-381, BN254, KZG commitments, BLS signatures, aggregation. Covered in curves and threshold sigs.
12. **Side-channel awareness** — Timing Oracle lab, constant-time discussion in ChaCha20, cache-timing in AES, SafeUsage warnings.
13. **Library selection** — SafeUsage recommends libsodium, BoringSSL, ring, Web Crypto API with rationale.
14. **International cryptography standards** — SM4, SM3, SM2 (China), ARIA (Korea), Camellia (Japan), Kuznyechik/Streebog (Russia), Kupyna (Ukraine), Brainpool (Germany). Excellent breadth.
15. **CSPRNG and entropy** — Debian OpenSSL incident, Dual_EC_DRBG backdoor, entropy pool architecture (Fortuna), NIST DRBGs.
16. **Steganography vs cryptography** — Hiding existence vs hiding content. LSB to WOW progression. Steganalysis arms race.

---

## Algorithmic Gaps (specific algorithms not present)

These are algorithms that a cryptography course would mention but are absent from the 97 entries.
Ranked by educational significance:

| Priority | Missing Algorithm | Why It Matters Educationally |
|----------|-------------------|------------------------------|
| High | **ECDSA** (standalone entry) | The most deployed classical signature scheme in the world (TLS certificates, Bitcoin, Ethereum). Ed25519 is present but ECDSA is only mentioned in passing via GG20 and secp256k1. A student could leave without understanding ECDSA's nonce vulnerability, RFC 6979 deterministic nonces, or why Ed25519 is preferred. |
| High | **Diffie-Hellman / ECDH** (explicit entry) | The foundational key exchange protocol. X25519 is present as a curve, and ECDH is mentioned in hybrid patterns, but there is no standalone DH/ECDH entry explaining the protocol, the small-subgroup attack, or the man-in-the-middle problem. |
| Medium | **RSA Signatures (RSA-PSS)** | RSA-OAEP encryption is present but RSA-PSS signing is absent. Students see RSA encryption but not the signature scheme that still dominates TLS certificate chains. |
| Medium | **AES-CCM** | Present in the AES Modes lab but absent from the algorithm dataset. CCM matters for IoT/802.15.4/BLE. |
| Medium | **Serpent** | Mentioned in the Iron Serpent lab but absent from the algorithm dataset. The AES finalist with the largest security margin — useful for teaching design tradeoffs. |
| Medium | **Twofish** | The other major AES finalist. Absent entirely. Feistel + S-box design contrast with Rijndael's SPN. |
| Low | **DSA (original)** | Legacy but historically important. Students should understand why it was superseded. |
| Low | **DES / 3DES** | Not present. The Dead Sea Cipher lab references historical ciphers but the dataset has no DES entry. Key for teaching meet-in-the-middle and key length evolution. |
| Low | **SHA-1** | Repeatedly warned against but has no dataset entry. A student might not understand *what* SHA-1 is or why SHAttered worked. |
| Low | **MD5** | Same — warned against but never explained. |
| Low | **RC4** | The most important cipher to *avoid*. Absent. Would teach cipher deprecation in context. |

---

## Conceptual Gaps (ideas not demonstrated or explained)

This is the more important section. A concept is missing if no existing entry teaches it,
even partially. Ranked by educational impact.

### Tier 1 — High Educational Impact

**1. The Diffie-Hellman Key Exchange Protocol as a Concept**

The collection has curves (X25519) and KEMs (ML-KEM) but never explains the *protocol* of
key exchange itself. A student sees "key encapsulation" but not:
- The original Diffie-Hellman construction over a cyclic group
- Why ephemeral keys provide forward secrecy
- The man-in-the-middle problem and why authentication must be layered on top
- The conceptual leap from "shared computation over public channels" to "shared secret"

The KEM category explanation comes closest, but it jumps to encapsulation without grounding the reader in the interactive DH protocol that preceded it. X25519 is listed as a curve, not as a key exchange protocol. The Reference Architectures mention "ephemeral key agreement" but never define it.

**2. Public Key Infrastructure (PKI) and Certificate Chains**

No entry, section, or component explains:
- What a certificate is (binding of identity to public key, signed by a CA)
- Certificate chains and root-of-trust hierarchy
- Certificate validation, revocation (CRL, OCSP)
- Why HTTPS works (the certificate answer, not just the cipher answer)
- The CA/Browser Forum, Certificate Transparency logs

The signature category explains *what signatures do* but not how they compose into a trust infrastructure. The TLS Reference Architecture says "certificate validation" is a step but never explains it. This is arguably the single largest conceptual gap because it's the system that makes all the other primitives *useful* on the internet.

**3. Protocol Composition and the Danger of Correct Primitives in Wrong Order**

The collection is excellent at individual primitives. But it doesn't teach:
- Why Encrypt-then-MAC is secure but MAC-then-Encrypt caused real TLS vulnerabilities
- The difference between IND-CPA and IND-CCA2 and why it matters for padding oracles
- Why combining two secure primitives can produce an insecure protocol
- The general principle that security is not compositional by default

SafeUsage says "bad protocol composition" is a threat but never explains what that means. The Padding Oracle lab demonstrates *an attack* but the conceptual lesson about composition order is not drawn in the dataset or educational components.

**4. Key Management Lifecycle**

SafeUsage lists "key management basics" as bullet points but the collection has no entry that teaches:
- Key generation → distribution → storage → rotation → revocation → destruction as a lifecycle
- Envelope encryption (wrapping keys with KEKs)
- Hardware security modules (HSMs) and their role
- The principle that "key management is harder than cryptography"

This matters because the most common real-world cryptographic failures are key management failures, not algorithm failures.

### Tier 2 — Medium Educational Impact

**5. Entropy and Randomness as a Foundational Concept**

The CSPRNG category mentions entropy and the Debian incident, but no entry explains:
- What entropy *is* (Shannon entropy, min-entropy)
- Where it comes from (hardware noise, OS entropy pools, CPU jitter)
- How to measure whether you have enough
- The distinction between true randomness and computational indistinguishability

The Corrupted Oracle lab demonstrates a *broken* CSPRNG but the positive concept of entropy quality is assumed rather than taught.

**6. Security Proofs and Reduction-Based Reasoning**

Each algorithm has a `reductionQuality` field, but the collection never explains:
- What a security reduction *is* (if you break scheme X, you can break hard problem Y)
- The random oracle model and why it matters
- Tight vs loose reductions and what that means for confidence
- Why "provably secure" doesn't mean "unbreakable"

This is a gap because the collection already *uses* this vocabulary (every entry says "reduces to..." or "proven under...") without teaching the reader how to interpret it.

**7. Lattice-Based Cryptography Foundations**

ML-KEM and ML-DSA are listed with excellent operational detail. But:
- What a lattice *is* (discrete subgroup of R^n)
- What LWE and Module-LWE mean concretely
- Why shortest vector problem is hard
- How noise hides the secret in LWE
- Why ring/module structure helps performance but may introduce risk

A student can use ML-KEM correctly without this, but cannot evaluate *why* we trust it or debate whether ring-LWE assumptions are conservative enough — which is exactly the kind of judgment the project says it wants to support.

**8. Formal Definitions of Security Properties**

The collection uses terms like "forward secrecy," "post-compromise security," "indistinguishability," and "unforgeability" without formal definitions. Missing:
- IND-CPA, IND-CCA, IND-CCA2 (what they mean for encryption)
- EUF-CMA (what it means for signatures)
- Forward secrecy (formal: compromise of long-term key doesn't compromise past sessions)
- Post-compromise security (even if adversary had your state, future messages become secure again after ratchet)

These definitions would ground the existing excellent intuitive explanations.

### Tier 3 — Lower Educational Impact (but notable)

**9. Authenticated Key Exchange (AKE) Protocols**

The Noise Protocol lab exists but the dataset/components don't explain:
- What makes a key exchange *authenticated*
- Station-to-Station protocol
- SIGMA protocol (basis for IKE/IPsec)
- Why unauthenticated DH is dangerous

**10. Commitment Schemes**

Pedersen commitments are mentioned in VSS but the concept of *commitment* as a primitive (hiding + binding) is never defined independently. Commitments are foundational to ZKPs, coin flipping, auctions, and many protocols.

**11. Garbled Circuits Internals**

Yao's GC has an entry and lab, but the conceptual chain from "Boolean circuit" → "garbled table" → "oblivious evaluation" → "secure computation" could be more explicit in the educational content.

**12. Blockchain Cryptographic Architecture**

secp256k1 is listed, BLS12-381 aggregation is explained, and Ethereum/Bitcoin are referenced. But there's no entry or section that synthesizes: Merkle trees + digital signatures + hash pointers + consensus = blockchain trust model. The Merkle Vault lab exists but stands alone.

---

## Summary: Ranked Conceptual Gaps by Educational Impact

| Rank | Conceptual Gap | Present Anywhere? |
|------|---------------|-------------------|
| 1 | **PKI / Certificate Chains / Trust Hierarchy** | No — only mentioned as a step in Reference Architectures |
| 2 | **DH Key Exchange as a Protocol Concept** | Partially — X25519 is a curve entry, not a protocol explanation |
| 3 | **Protocol Composition Safety** | Partially — Padding Oracle lab demonstrates it, but principle never stated |
| 4 | **Key Management Lifecycle** | Partially — SafeUsage bullet points, no full treatment |
| 5 | **Security Proofs / Reductions (what "provably secure" means)** | No — vocabulary used but never defined |
| 6 | **Entropy Foundations** | Partially — Debian incident mentioned, concept not defined |
| 7 | **Lattice Cryptography Foundations** | No — ML-KEM/ML-DSA present but underlying math not explained |
| 8 | **Formal Security Definitions (IND-CPA, EUF-CMA, etc.)** | No — terms used intuitively, never defined |
| 9 | **ECDSA as a Standalone Entry** | No — only referenced through GG20 and secp256k1 context |
| 10 | **Commitment Schemes** | Partially — Pedersen commitments in VSS, concept not independent |

---

*Analysis based solely on source files read in Phase 1. No external knowledge used to evaluate coverage — only to identify what a cryptography student would need.*
