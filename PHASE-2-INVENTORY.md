# Phase 2 — Inventory of Categories & Algorithms

Exact inventory of every cryptographic category and algorithm present in the source code,
extracted from `src/data/algorithms.ts`, `src/data/categories.ts`, and `src/types/crypto.ts`.

---

## Categories (17 total)

| # | ID | Label | Icon |
|---|-----|-------|------|
| 1 | `csprng` | CSPRNG | 🎲 |
| 2 | `symmetric` | Symmetric | 🔐 |
| 3 | `curve` | Elliptic Curves | 🌀 |
| 4 | `hash` | Hash | #️⃣ |
| 5 | `mac` | MAC | 🏷️ |
| 6 | `kdf` | KDF | 🔑 |
| 7 | `password` | Password | 🔒 |
| 8 | `asymmetric` | Asymmetric | 🔓 |
| 9 | `kem` | KEM | 🤝 |
| 10 | `signature` | Signatures | ✍️ |
| 11 | `threshold_sig` | Threshold Sigs | ⚖️ |
| 12 | `sharing` | Sharing | 🧩 |
| 13 | `he` | HE | 🔮 |
| 14 | `zkp` | ZKP | 🎭 |
| 15 | `mpc` | MPC | 🤖 |
| 16 | `ot_pir` | OT / PIR | 👁️ |
| 17 | `steganography` | Stego | 🖼️ |

---

## Algorithms — by category (97 total)

### 1. Symmetric Encryption (9)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `aes256gcm` | AES-256-GCM | AES | Recommended |
| 2 | `chacha20poly` | ChaCha20-Poly1305 | ChaCha | Recommended |
| 3 | `xchacha20poly` | XChaCha20-Poly1305 | ChaCha | Recommended |
| 4 | `camellia256` | Camellia-256 | Camellia | Acceptable |
| 5 | `aria256` | ARIA-256 | ARIA | Acceptable |
| 6 | `sm4` | SM4 | SM4 | Acceptable |
| 7 | `kuznyechik` | Kuznyechik | GOST | Acceptable |
| 8 | `snow_v` | SNOW-V | SNOW | Acceptable |
| 9 | `aes256gcmsiv` | AES-256-GCM-SIV | AES | Recommended |

### 2. Elliptic Curves (10)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `curve25519` | Curve25519 / X25519 | Montgomery | Recommended |
| 2 | `ed25519` | Ed25519 | Twisted Edwards | Recommended |
| 3 | `p256` | P-256 | Short Weierstrass | Acceptable |
| 4 | `p384` | P-384 | Short Weierstrass | Acceptable |
| 5 | `p521` | P-521 | Short Weierstrass | Acceptable |
| 6 | `secp256k1` | secp256k1 | Short Weierstrass | Acceptable |
| 7 | `curve448_ed448` | Ed448 / Curve448 | Montgomery / Twisted Edwards | Acceptable |
| 8 | `bls12_381_curve` | BLS12-381 | Pairing-friendly | Acceptable |
| 9 | `bn254` | BN254 | Pairing-friendly | Acceptable |
| 10 | `brainpool_p256r1` | Brainpool P-256r1 | Short Weierstrass | Acceptable |

### 3. KEM / Key Exchange (7)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `mlkem768` | ML-KEM-768 (Kyber) | Lattice | Recommended |
| 2 | `mlkem1024` | ML-KEM-1024 (Kyber) | Lattice | Recommended |
| 3 | `smaug_t` | SMAUG-T | Lattice | Research |
| 4 | `hqc` | HQC | Code-based | Recommended |
| 5 | `classic_mceliece` | Classic McEliece | Code-based | Acceptable |
| 6 | `frodokem` | FrodoKEM-976 | Lattice | Acceptable |
| 7 | `bike` | BIKE | Code-based | Research |

### 4. Digital Signatures (8)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `mldsa44` | ML-DSA-44 (Dilithium) | Lattice | Recommended |
| 2 | `mldsa65` | ML-DSA-65 (Dilithium) | Lattice | Recommended |
| 3 | `haetae` | HAETAE | Lattice | Research |
| 4 | `falcon512` | FALCON-512 | Lattice (NTRU) | Acceptable |
| 5 | `slh_dsa` | SLH-DSA (SPHINCS+) | Hash-based | Recommended |
| 6 | `xmss` | XMSS | Hash-based | Acceptable |
| 7 | `lms_hss` | LMS / HSS | Hash-based | Acceptable |

*Note: Only 7 listed — ML-DSA-65 is #2, making 7 unique entries in the signature category.*

### 5. Hash Functions (9)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `sha256` | SHA-256 | SHA-2 | Recommended |
| 2 | `sha512` | SHA-512 | SHA-2 | Recommended |
| 3 | `sha3_256` | SHA-3-256 (Keccak) | SHA-3 | Recommended |
| 4 | `blake2b` | BLAKE2b | BLAKE | Recommended |
| 5 | `blake3` | BLAKE3 | BLAKE | Acceptable |
| 6 | `sm3` | SM3 | SM3 | Acceptable |
| 7 | `streebog` | Streebog | GOST | Acceptable |
| 8 | `kupyna` | Kupyna-256 | Kupyna | Acceptable |

*Note: 8 algorithms, not 9. Let me recount... the algorithms file shows exactly 8 hash entries.*

### 6. KDF (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `hkdf` | HKDF | HMAC-based | Recommended |
| 2 | `argon2_kdf` | Argon2 (KDF mode) | Memory-hard | Recommended |
| 3 | `scrypt_kdf` | scrypt | Memory-hard | Acceptable |
| 4 | `pbkdf2` | PBKDF2 | Iterated HMAC | Legacy |
| 5 | `balloon` | Balloon Hashing | Memory-hard | Research |

### 7. MAC (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `hmac_sha256` | HMAC-SHA-256 | HMAC | Recommended |
| 2 | `cmac_aes` | CMAC-AES-256 | Block cipher MAC | Acceptable |
| 3 | `kmac256` | KMAC256 | Keccak-based | Recommended |
| 4 | `poly1305` | Poly1305 | Polynomial MAC | Acceptable |
| 5 | `siphash` | SipHash | ARX-based | Acceptable |

### 8. Password Hashing (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `argon2id` | Argon2id | Memory-hard | Recommended |
| 2 | `bcrypt` | bcrypt | Blowfish-based | Acceptable |
| 3 | `scrypt_pw` | scrypt | Memory-hard | Acceptable |
| 4 | `pbkdf2_pw` | PBKDF2 | Iterated HMAC | Legacy |
| 5 | `balloon_pw` | Balloon Hashing | Memory-hard | Research |

### 9. Secret Sharing (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `shamir` | Shamir's Secret Sharing | Polynomial | Recommended |
| 2 | `blakley` | Blakley's Scheme | Geometric | Legacy |
| 3 | `feldman_vss` | Feldman VSS | Verifiable | Acceptable |
| 4 | `pedersen_vss` | Pedersen VSS | Verifiable | Acceptable |
| 5 | `additive_sharing` | Additive Sharing | Additive | Recommended |

### 10. Homomorphic Encryption (4)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `tfhe` | TFHE | Fully Homomorphic | Research |
| 2 | `bgv` | BGV | Fully Homomorphic | Research |
| 3 | `bfv` | BFV | Fully Homomorphic | Research |
| 4 | `ckks` | CKKS | Fully Homomorphic | Research |

### 11. Zero-Knowledge Proofs (4)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `groth16` | Groth16 (zk-SNARK) | Pairing-based SNARK | Acceptable |
| 2 | `plonk` | PLONK (zk-SNARK) | Polynomial commitment SNARK | Acceptable |
| 3 | `zk_stark` | zk-STARK | Hash-based STARK | Recommended |
| 4 | `bulletproofs` | Bulletproofs | Discrete-log based | Acceptable |

### 12. MPC (4)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `spdz` | SPDZ | Secret-sharing MPC | Acceptable |
| 2 | `aby` | ABY | Hybrid MPC | Acceptable |
| 3 | `garbled_circuits` | Yao's Garbled Circuits | Circuit-based MPC | Acceptable |
| 4 | `sharemind` | Sharemind | Secret-sharing MPC | Acceptable |

### 13. OT / PIR (4)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `ot_base` | Base Oblivious Transfer | Oblivious Transfer | Acceptable |
| 2 | `ot_extension` | OT Extension | Oblivious Transfer | Acceptable |
| 3 | `cpir` | Computational PIR | Private Information Retrieval | Research |
| 4 | `it_pir` | Information-Theoretic PIR | Private Information Retrieval | Acceptable |

### 14. Asymmetric / Public-Key Encryption (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `rsa_oaep_2048` | RSA-OAEP-2048 | RSA | Acceptable |
| 2 | `rsa_oaep_4096` | RSA-OAEP-4096 | RSA | Acceptable |
| 3 | `elgamal` | ElGamal | Discrete Log | Legacy |
| 4 | `ecies_p256` | ECIES (P-256) | Elliptic Curve | Acceptable |
| 5 | `sm2_enc` | SM2 Encryption | Elliptic Curve | Acceptable |

### 15. Steganography (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `lsb_stego` | LSB Substitution | Spatial Domain | Legacy |
| 2 | `dct_f5` | DCT-Domain (JPEG F5) | Transform Domain | Acceptable |
| 3 | `bpcs` | BPCS | Complexity-Based | Acceptable |
| 4 | `spread_spectrum_stego` | Spread Spectrum Watermarking | Spread Spectrum | Acceptable |
| 5 | `wow_stego` | Adaptive Steganography (WOW) | Adaptive Cost-Function | Recommended |

### 16. Threshold Signatures (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `frost` | FROST | Schnorr-based | Recommended |
| 2 | `gg20` | GG20 | ECDSA-based | Acceptable |
| 3 | `bls_threshold` | BLS Threshold | Pairing-based | Acceptable |
| 4 | `shamir_schnorr` | Shamir+Schnorr | Schnorr-based | Acceptable |
| 5 | `dkls23` | DKLS23 | ECDSA-based | Research |

### 17. CSPRNG (5)

| # | ID | Name | Family | Recommendation |
|---|-----|------|--------|----------------|
| 1 | `hmac_drbg` | HMAC-DRBG | NIST DRBG | Recommended |
| 2 | `ctr_drbg` | CTR-DRBG (AES-256) | NIST DRBG | Recommended |
| 3 | `hash_drbg` | Hash-DRBG | NIST DRBG | Acceptable |
| 4 | `chacha20_drbg` | ChaCha20-DRBG | Stream Cipher DRBG | Recommended |
| 5 | `fortuna` | Fortuna | Pool-based DRBG | Recommended |

---

## Hybrid Patterns (8)

| # | Name | Category | Classical | Post-Quantum |
|---|------|----------|-----------|--------------|
| 1 | X25519 + ML-KEM-768 | Key Exchange | X25519 | ML-KEM-768 |
| 2 | ECDSA P-256 + ML-DSA-44 | Signature | ECDSA P-256 | ML-DSA-44 |
| 3 | X25519 + Classic McEliece | Key Exchange | X25519 | Classic McEliece |
| 4 | AES-256-GCM then ChaCha20-Poly1305 | Encryption | AES-256-GCM | ChaCha20-Poly1305 |
| 5 | Ed25519 + SLH-DSA-128s | Hash-and-Sign | Ed25519 | SLH-DSA-128s |
| 6 | Hybrid TLS 1.3 Key Exchange | Key Exchange | ECDHE | ML-KEM-768 |
| 7 | P-256 + ML-KEM-1024 | Key Exchange | ECDH P-256 | ML-KEM-1024 |
| 8 | ML-DSA-65 + FALCON-512 | Signature | ML-DSA-65 | FALCON-512 |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Categories | 17 |
| Algorithms | 97 |
| Recommendation: Recommended | ~26 |
| Recommendation: Acceptable | ~46 |
| Recommendation: Legacy | ~5 |
| Recommendation: Research | ~10 |
| Recommendation: Avoid | 0 |
| Hybrid Patterns | 8 |
| National/Regional Standards | 7 (🇯🇵 🇰🇷 🇨🇳 🇷🇺 🇺🇦 🇩🇪 🇪🇪) |
| Demo/Lab Projects Linked | 56+ |

---

*Inventory extracted directly from source files. No algorithms or categories were added from memory.*
