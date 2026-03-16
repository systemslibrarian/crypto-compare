// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

const ALGORITHMS = [
  // ═══════════════════════════════════════
  // SYMMETRIC ENCRYPTION
  // ═══════════════════════════════════════
  { id:"aes256gcm", name:"AES-256-GCM", category:"symmetric", family:"AES", origin:"🇧🇪 Belgium",
    originDetail:"Joan Daemen & Vincent Rijmen (Belgium). NIST standardized.",
    useCases:"General-purpose authenticated encryption. TLS 1.3, disk encryption, government classified data.",
    status:"standard", statusLabel:"NIST Standard",
    keySize:256, nonceSize:96, tagSize:128, blockSize:128,
    securityBits:256, pqSecurityBits:128,
    bestAttack:"Biclique (2^254.4 — theoretical). Grover reduces to 2^128.",
    reductionQuality:"Proven secure under PRP assumption",
    performance:"~1 cycle/byte with AES-NI",
    notes:"Ubiquitous hardware support. GCM nonce reuse is catastrophic. 128-bit PQ security after Grover's."
  },
  { id:"chacha20poly", name:"ChaCha20-Poly1305", category:"symmetric", family:"ChaCha", origin:"🇺🇸 United States",
    originDetail:"Daniel J. Bernstein.",
    useCases:"Authenticated encryption without AES hardware. Mobile, TLS 1.3 fallback, WireGuard.",
    status:"standard", statusLabel:"IETF RFC 8439",
    keySize:256, nonceSize:96, tagSize:128, blockSize:null,
    securityBits:256, pqSecurityBits:128,
    bestAttack:"No known shortcut. Full 256-bit brute force. Grover reduces to 2^128.",
    reductionQuality:"Provable Poly1305 MAC; ChaCha20 assumed hardness",
    performance:"~2-4 cycles/byte software",
    notes:"Constant-time by construction — no lookup tables, immune to cache-timing. Preferred without AES-NI."
  },
  { id:"xchacha20poly", name:"XChaCha20-Poly1305", category:"symmetric", family:"ChaCha", origin:"🇺🇸 United States",
    originDetail:"Daniel J. Bernstein. Extended nonce variant.",
    useCases:"File/at-rest encryption needing random nonces safely. libsodium default.",
    status:"standard", statusLabel:"IETF Draft / libsodium",
    keySize:256, nonceSize:192, tagSize:128, blockSize:null,
    securityBits:256, pqSecurityBits:128,
    bestAttack:"Same as ChaCha20-Poly1305.",
    reductionQuality:"Reduces to HChaCha20 + ChaCha20-Poly1305",
    performance:"Negligible overhead vs ChaCha20-Poly1305",
    notes:"192-bit nonce makes random generation safe. Strongly preferred for at-rest encryption."
  },
  { id:"camellia256", name:"Camellia-256", category:"symmetric", family:"Camellia", origin:"🇯🇵 Japan",
    originDetail:"Mitsubishi Electric & NTT. ISO/IEC 18033-3.",
    useCases:"Japanese government, TLS suites, NESSIE-approved applications.",
    status:"standard", statusLabel:"CRYPTREC / ISO / IETF",
    keySize:256, nonceSize:128, tagSize:128, blockSize:128,
    securityBits:256, pqSecurityBits:128,
    bestAttack:"No practical attacks. Security margin comparable to AES.",
    reductionQuality:"Provably secure Feistel with FL layers",
    performance:"~2-3 cycles/byte software (no hardware accel)",
    notes:"Peer to AES. Approved by CRYPTREC (Japan), NESSIE (EU), ISO. Lacks AES-NI speed advantage."
  },
  { id:"aria256", name:"ARIA-256", category:"symmetric", family:"ARIA", origin:"🇰🇷 South Korea",
    originDetail:"Korean Agency for Technology and Standards (KATS).",
    useCases:"Korean government and financial systems.",
    status:"standard", statusLabel:"Korean Standard KS X 1213",
    keySize:256, nonceSize:128, tagSize:128, blockSize:128,
    securityBits:256, pqSecurityBits:128,
    bestAttack:"No practical attacks on full ARIA.",
    reductionQuality:"SPN with involutional structure",
    performance:"~3-5 cycles/byte software",
    notes:"Structurally similar to AES with different S-box. Mandatory for Korean government."
  },
  { id:"sm4", name:"SM4", category:"symmetric", family:"SM4", origin:"🇨🇳 China",
    originDetail:"Chinese State Cryptography Administration.",
    useCases:"Chinese government, banking, wireless LAN (WAPI).",
    status:"standard", statusLabel:"GB/T 32907 / ISO 18033-3",
    keySize:128, nonceSize:128, tagSize:null, blockSize:128,
    securityBits:128, pqSecurityBits:64,
    bestAttack:"No practical attack on full SM4. Reduced-round attacks at 23/32.",
    reductionQuality:"Unbalanced Feistel with nonlinear key schedule",
    performance:"~4-6 cycles/byte software",
    notes:"128-bit key only — PQ security only 64-bit after Grover (marginal). Open specification."
  },
  { id:"kuznyechik", name:"Kuznyechik", category:"symmetric", family:"GOST", origin:"🇷🇺 Russia",
    originDetail:"Russian Federal Security Service (FSB). GOST R 34.12-2015.",
    useCases:"Russian government and military systems.",
    status:"standard", statusLabel:"GOST R 34.12-2015",
    keySize:256, nonceSize:128, tagSize:128, blockSize:128,
    securityBits:256, pqSecurityBits:128,
    bestAttack:"S-box decomposition published (Perrin & Udovenko, 2016) — no direct break.",
    reductionQuality:"SPN. S-box derivation undisclosed — transparency concern",
    performance:"~5-8 cycles/byte software",
    notes:"Undisclosed S-box derivation is controversial internationally. Functionally sound but opaque design."
  },

  // ═══════════════════════════════════════
  // KEY ENCAPSULATION / KEY EXCHANGE
  // ═══════════════════════════════════════
  { id:"mlkem768", name:"ML-KEM-768 (Kyber)", category:"kem", family:"Lattice", origin:"🇪🇺 Europe",
    originDetail:"CRYSTALS team: Avanzi (DE), Bos (NL), Ducas (FR/NL), et al.",
    useCases:"PQ key encapsulation. Hybrid TLS (Chrome, Firefox). Recommended default.",
    status:"standard", statusLabel:"NIST FIPS 203",
    publicKeySize:1184, ciphertextSize:1088, sharedSecretSize:256,
    securityBits:192, pqSecurityBits:192,
    bestAttack:"Primal lattice via BKZ (est. 2^180+)",
    reductionQuality:"Tight reduction to Module-LWE",
    performance:"~0.07ms keygen, ~0.10ms encaps",
    notes:"NIST primary PQ KEM (Aug 2024). Deployed in Chrome/Firefox hybrid TLS."
  },
  { id:"mlkem1024", name:"ML-KEM-1024 (Kyber)", category:"kem", family:"Lattice", origin:"🇪🇺 Europe",
    originDetail:"CRYSTALS team.",
    useCases:"PQ KEM at highest security. Government, long-term secrets.",
    status:"standard", statusLabel:"NIST FIPS 203",
    publicKeySize:1568, ciphertextSize:1568, sharedSecretSize:256,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Primal lattice via BKZ (est. 2^230+)",
    reductionQuality:"Tight reduction to Module-LWE",
    performance:"~0.10ms keygen, ~0.13ms encaps",
    notes:"Maximum security parameter set. Conservative choice."
  },
  { id:"smaug_t", name:"SMAUG-T", category:"kem", family:"Lattice", origin:"🇰🇷 South Korea",
    originDetail:"Korean PQC research team. KPQC Round 2.",
    useCases:"Korean PQC KEM candidate. KPQC standardization track.",
    status:"candidate", statusLabel:"KPQC Round 2",
    publicKeySize:null, ciphertextSize:null, sharedSecretSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Lattice attacks (NTRU/LWE hybrid — under analysis)",
    reductionQuality:"Reduces to NTRU/LWE hybrid problem",
    performance:"Competitive with ML-KEM",
    notes:"Used in Quantum Vault KPQC. Novel NTRU/LWE hybrid. Sizes pending final spec."
  },
  { id:"hqc", name:"HQC", category:"kem", family:"Code-based", origin:"🇫🇷 France",
    originDetail:"Aguilar Melchor, Blazy, Deneuville, et al.",
    useCases:"PQ KEM with code-based assumption. Diversifies away from lattice dependence.",
    status:"standard", statusLabel:"NIST Selected",
    publicKeySize:2249, ciphertextSize:4481, sharedSecretSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Information set decoding on quasi-cyclic codes (est. 2^128+)",
    reductionQuality:"Decisional quasi-cyclic syndrome decoding",
    performance:"~1-3ms operations",
    notes:"Code-based alternative to lattice. If lattice problems break, HQC is unaffected."
  },
  { id:"classic_mceliece", name:"Classic McEliece", category:"kem", family:"Code-based", origin:"🇺🇸/🇪🇺 International",
    originDetail:"Bernstein, Chou, Lange, et al. Based on McEliece (1978).",
    useCases:"Ultra-conservative PQ. When long-term security outweighs key size.",
    status:"candidate", statusLabel:"NIST Round 4",
    publicKeySize:261120, ciphertextSize:128, sharedSecretSize:256,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Information set decoding (45+ years of cryptanalysis)",
    reductionQuality:"Decoding random linear codes",
    performance:"Fast encaps/decaps, slow keygen. PK ~261 KB.",
    notes:"Oldest PQ assumption. Enormous public keys, tiny ciphertexts. Maximum confidence."
  },
  { id:"frodokem", name:"FrodoKEM-976", category:"kem", family:"Lattice", origin:"🇪🇺/🇨🇦 Europe/Canada",
    originDetail:"Microsoft Research, CWI Amsterdam, McMaster University.",
    useCases:"Conservative PQ KEM when ring/module structure is too risky.",
    status:"candidate", statusLabel:"BSI Recommended",
    publicKeySize:15632, ciphertextSize:15744, sharedSecretSize:256,
    securityBits:192, pqSecurityBits:192,
    bestAttack:"Primal lattice on plain LWE (est. 2^150+)",
    reductionQuality:"Plain LWE — more conservative than ML-KEM",
    performance:"~5-10ms operations",
    notes:"German BSI recommended. No ring structure avoids ring-specific attacks. Very large keys."
  },
  { id:"bike", name:"BIKE", category:"kem", family:"Code-based", origin:"🇫🇷/🇮🇱 France/Israel",
    originDetail:"Aragon, Barreto, Bettaieb, et al.",
    useCases:"Lightweight PQ KEM with moderate sizes.",
    status:"candidate", statusLabel:"NIST Round 4",
    publicKeySize:1541, ciphertextSize:1573, sharedSecretSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Decoding QC-MDPC codes (est. 2^128+)",
    reductionQuality:"QC-MDPC code decoding",
    performance:"~1-3ms operations",
    notes:"Compact code-based KEM. Small failure probability in decapsulation must be handled."
  },

  // ═══════════════════════════════════════
  // DIGITAL SIGNATURES
  // ═══════════════════════════════════════
  { id:"mldsa44", name:"ML-DSA-44 (Dilithium)", category:"signature", family:"Lattice", origin:"🇪🇺 Europe",
    originDetail:"CRYSTALS: Ducas (NL), Lepoint (FR), Lyubashevsky (CH), et al.",
    useCases:"PQ signatures. Certificate, firmware, document signing.",
    status:"standard", statusLabel:"NIST FIPS 204",
    publicKeySize:1312, signatureSize:2420,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Lattice on Module-LWE/SIS (est. 2^118+)",
    reductionQuality:"Tight reduction to Module-LWE and Module-SIS",
    performance:"~0.2ms sign, ~0.1ms verify",
    notes:"NIST primary PQ signature standard (Aug 2024)."
  },
  { id:"mldsa65", name:"ML-DSA-65 (Dilithium)", category:"signature", family:"Lattice", origin:"🇪🇺 Europe",
    originDetail:"CRYSTALS team.",
    useCases:"PQ signatures at 192-bit security. Recommended default.",
    status:"standard", statusLabel:"NIST FIPS 204",
    publicKeySize:1952, signatureSize:3309,
    securityBits:192, pqSecurityBits:192,
    bestAttack:"Lattice on Module-LWE/SIS (est. 2^180+)",
    reductionQuality:"Tight reduction to Module-LWE and Module-SIS",
    performance:"~0.3ms sign, ~0.15ms verify",
    notes:"Recommended default. Good balance of margin and practicality."
  },
  { id:"haetae", name:"HAETAE", category:"signature", family:"Lattice", origin:"🇰🇷 South Korea",
    originDetail:"Korean PQC research team. KPQC Round 2.",
    useCases:"Korean PQC signature candidate. KPQC standardization track.",
    status:"candidate", statusLabel:"KPQC Round 2",
    publicKeySize:null, signatureSize:null,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Lattice attacks (under analysis)",
    reductionQuality:"Module-LWE variant with novel sampling",
    performance:"Competitive with ML-DSA",
    notes:"Used in Quantum Vault KPQC. Novel lattice signature approach. Sizes pending final spec."
  },
  { id:"falcon512", name:"FALCON-512", category:"signature", family:"Lattice (NTRU)", origin:"🇫🇷 France",
    originDetail:"Fouque (FR), Hoffstein (US), Kirchner (FR), et al.",
    useCases:"PQ signatures where small size matters. Constrained devices, blockchain.",
    status:"standard", statusLabel:"NIST (FIPS 206 pending)",
    publicKeySize:897, signatureSize:666,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"NTRU lattice attacks (est. 2^108+)",
    reductionQuality:"Short vector problem in NTRU lattices",
    performance:"~5ms sign (discrete Gaussian), ~0.1ms verify",
    notes:"Smallest PQ signatures. Constant-time floating point signing is very hard to implement safely."
  },
  { id:"slh_dsa", name:"SLH-DSA (SPHINCS+)", category:"signature", family:"Hash-based", origin:"🇪🇺 Europe",
    originDetail:"Bernstein, Hülsing (NL), Kölbl (DK), et al.",
    useCases:"Ultra-conservative PQ signatures. Fallback if lattice assumptions fail.",
    status:"standard", statusLabel:"NIST FIPS 205",
    publicKeySize:32, signatureSize:7856,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Generic hash attacks only (2^128).",
    reductionQuality:"Minimal — only hash function properties",
    performance:"~100ms sign, ~5ms verify",
    notes:"Most conservative PQ assumption. Only needs hash security. Large signatures, slow signing."
  },
  { id:"xmss", name:"XMSS", category:"signature", family:"Hash-based", origin:"🇩🇪 Germany",
    originDetail:"Hülsing, Butin, Gazdag, et al. BSI/ANSSI recommended.",
    useCases:"Firmware/code signing. Stateful — needs careful state management.",
    status:"standard", statusLabel:"IETF RFC 8391 / NIST SP 800-208",
    publicKeySize:68, signatureSize:2500,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Generic hash attacks only (2^128).",
    reductionQuality:"Only second-preimage resistance needed",
    performance:"~10ms sign, ~1ms verify",
    notes:"Stateful — reusing a signature index completely breaks security. BSI and ANSSI recommended."
  },

  // ═══════════════════════════════════════
  // HASH FUNCTIONS
  // ═══════════════════════════════════════
  { id:"sha256", name:"SHA-256", category:"hash", family:"SHA-2", origin:"🇺🇸 United States",
    originDetail:"NSA design, NIST standard.",
    useCases:"General-purpose. TLS, Git, Bitcoin, HMAC.",
    status:"standard", statusLabel:"NIST FIPS 180-4",
    outputSize:256, blockSize:512, stateSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"No practical attacks. Collision at 2^128.",
    reductionQuality:"N/A",
    performance:"~3-6 cycles/byte (SHA-NI: ~1)",
    notes:"Ubiquitous. Hardware-accelerated. Vulnerable to length extension (use HMAC)."
  },
  { id:"sha512", name:"SHA-512", category:"hash", family:"SHA-2", origin:"🇺🇸 United States",
    originDetail:"NSA design, NIST standard.",
    useCases:"Maximum SHA-2 security. Used internally by Ed25519.",
    status:"standard", statusLabel:"NIST FIPS 180-4",
    outputSize:512, blockSize:1024, stateSize:512,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"No practical attacks.",
    reductionQuality:"N/A",
    performance:"~2-4 cycles/byte 64-bit (faster than SHA-256 on 64-bit)",
    notes:"Faster than SHA-256 on 64-bit CPUs using native 64-bit operations."
  },
  { id:"sha3_256", name:"SHA-3-256 (Keccak)", category:"hash", family:"SHA-3", origin:"🇧🇪 Belgium",
    originDetail:"Bertoni, Daemen, Peeters, Van Assche.",
    useCases:"Algorithm diversity. Ethereum, PQ constructions.",
    status:"standard", statusLabel:"NIST FIPS 202",
    outputSize:256, blockSize:1088, stateSize:1600,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"No practical attacks.",
    reductionQuality:"N/A — sponge with wide state",
    performance:"~5-10 cycles/byte software",
    notes:"Different design from SHA-2. If SHA-2 breaks, SHA-3 is unaffected. No length extension. Same team as AES."
  },
  { id:"blake2b", name:"BLAKE2b", category:"hash", family:"BLAKE", origin:"🇨🇭 Switzerland",
    originDetail:"Aumasson (CH), Neves (PT), Wilcox-O'Hearn, Winnerlein.",
    useCases:"High-speed hashing. Argon2 internally, libsodium, WireGuard.",
    status:"standard", statusLabel:"IETF RFC 7693",
    outputSize:512, blockSize:1024, stateSize:512,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"No practical attacks.",
    reductionQuality:"Based on ChaCha permutation",
    performance:"~1-3 cycles/byte (faster than SHA-256 in software)",
    notes:"Built-in keyed hashing and personalization. Inside Argon2."
  },
  { id:"blake3", name:"BLAKE3", category:"hash", family:"BLAKE", origin:"🇺🇸/🇨🇭 International",
    originDetail:"O'Connor, Aumasson (CH), Neves (PT), Wilcox-O'Hearn.",
    useCases:"Ultra-fast hashing. File integrity, content addressing, parallel workloads.",
    status:"standard", statusLabel:"Published spec",
    outputSize:256, blockSize:512, stateSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"No practical attacks. 7 rounds vs BLAKE2's 12 — less margin.",
    reductionQuality:"Reduced-round ChaCha permutation",
    performance:"~0.3-0.5 cycles/byte — massively parallel SIMD",
    notes:"Tree structure enables parallelism. Built-in KDF and MAC. Not NIST standardized."
  },
  { id:"sm3", name:"SM3", category:"hash", family:"SM3", origin:"🇨🇳 China",
    originDetail:"Wang Xiaoyun et al., Chinese State Cryptography Administration.",
    useCases:"Chinese national hash. Digital signatures (SM2), government, banking.",
    status:"standard", statusLabel:"GB/T 32905 / ISO 10118-3",
    outputSize:256, blockSize:512, stateSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Reduced-round attacks (32/64). No practical full attack.",
    reductionQuality:"N/A — Merkle-Damgård",
    performance:"~4-6 cycles/byte software",
    notes:"Resembles SHA-256 with different constants and expansion. ISO standardized. Open spec."
  },
  { id:"streebog", name:"Streebog", category:"hash", family:"GOST", origin:"🇷🇺 Russia",
    originDetail:"FSB. GOST R 34.11-2012.",
    useCases:"Russian government. GOST-mandated hashing.",
    status:"standard", statusLabel:"GOST R 34.11-2012",
    outputSize:512, blockSize:512, stateSize:512,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Rebound on reduced rounds (9.5/12). No full attack.",
    reductionQuality:"N/A",
    performance:"~6-10 cycles/byte software",
    notes:"Same S-box transparency concern as Kuznyechik."
  },
  { id:"kupyna", name:"Kupyna-256", category:"hash", family:"Kupyna", origin:"🇺🇦 Ukraine",
    originDetail:"Oliynykov, Gorbenko, et al.",
    useCases:"Ukrainian government and digital signatures.",
    status:"standard", statusLabel:"DSTU 7564:2014",
    outputSize:256, blockSize:512, stateSize:1024,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"No known practical attacks on full Kupyna.",
    reductionQuality:"N/A — wide-pipe AES-like round function",
    performance:"~5-8 cycles/byte software",
    notes:"Open design with public constant rationale. Independent of Russian GOST."
  },

  // ═══════════════════════════════════════
  // KEY DERIVATION FUNCTIONS
  // ═══════════════════════════════════════
  { id:"hkdf", name:"HKDF", category:"kdf", family:"HMAC-based", origin:"🇮🇱 Israel",
    originDetail:"Hugo Krawczyk. IETF RFC 5869.",
    useCases:"Deriving multiple keys from a shared secret. TLS 1.3, Signal, Noise Protocol, Quantum Vault KPQC.",
    status:"standard", statusLabel:"IETF RFC 5869",
    inputType:"High-entropy key material", outputType:"Multiple derived keys",
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Security reduces to underlying HMAC/hash. No independent attacks.",
    reductionQuality:"Proven secure extract-then-expand under random oracle model",
    performance:"Near-native hash speed — negligible overhead",
    notes:"Two-phase: Extract (condense entropy) + Expand (derive keys). Supports domain separation labels. NOT for passwords — needs high-entropy input."
  },
  { id:"argon2_kdf", name:"Argon2 (KDF mode)", category:"kdf", family:"Memory-hard", origin:"🇱🇺 Luxembourg",
    originDetail:"Alex Biryukov, Daniel Dinu, Dmitry Khovratovich. PHC winner 2015.",
    useCases:"Deriving keys from passwords or low-entropy inputs. Password-based encryption.",
    status:"standard", statusLabel:"IETF RFC 9106",
    inputType:"Low-entropy (passwords)", outputType:"Derived key",
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Memory-hardness limits ASIC/GPU acceleration. Time-memory tradeoff attacks partially mitigated by Argon2id.",
    reductionQuality:"Proven memory-hardness bounds",
    performance:"Tunable — typically 0.5-2 seconds per derivation",
    notes:"Argon2id recommended (hybrid of side-channel resistant Argon2i and tradeoff-resistant Argon2d). Use for password → key derivation."
  },
  { id:"scrypt_kdf", name:"scrypt", category:"kdf", family:"Memory-hard", origin:"🇨🇦 Canada",
    originDetail:"Colin Percival. IETF RFC 7914.",
    useCases:"Password-based key derivation. Cryptocurrency proof-of-work (Litecoin), file encryption.",
    status:"standard", statusLabel:"IETF RFC 7914",
    inputType:"Low-entropy (passwords)", outputType:"Derived key",
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Time-memory tradeoff attacks reduce memory requirements somewhat. Less resistant than Argon2id.",
    reductionQuality:"Memory-hardness based on sequential memory-hard function (SMix)",
    performance:"Tunable — typically 0.1-1 second",
    notes:"Predates Argon2. Still widely used. Cannot separately tune time and memory — Argon2 is more flexible."
  },
  { id:"pbkdf2", name:"PBKDF2", category:"kdf", family:"Iterated HMAC", origin:"🇺🇸 United States",
    originDetail:"RSA Laboratories. IETF RFC 8018.",
    useCases:"Legacy password-based key derivation. WPA2 WiFi, LUKS disk encryption, PKCS#12.",
    status:"standard", statusLabel:"NIST SP 800-132",
    inputType:"Low-entropy (passwords)", outputType:"Derived key",
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Trivially parallelizable on GPUs/ASICs — NOT memory-hard. Cost to attack scales linearly with hardware.",
    reductionQuality:"Simple iterated PRF — no memory-hardness",
    performance:"Tunable iterations — but only CPU-hard, not memory-hard",
    notes:"Obsolete for new designs. GPU farms can attack billions of iterations cheaply. Use Argon2id instead for any new system."
  },
  { id:"balloon", name:"Balloon Hashing", category:"kdf", family:"Memory-hard", origin:"🇺🇸 United States",
    originDetail:"Dan Boneh, Henry Corrigan-Gibbs, Stuart Schechter. Stanford.",
    useCases:"Provably memory-hard key derivation. Research-oriented, NIST consideration.",
    status:"candidate", statusLabel:"Academic / NIST consideration",
    inputType:"Low-entropy (passwords)", outputType:"Derived key",
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Provable memory-hardness — stronger theoretical guarantees than scrypt or Argon2.",
    reductionQuality:"Formally proven memory-hardness in random oracle model",
    performance:"Comparable to Argon2",
    notes:"Strongest theoretical memory-hardness proof of any password KDF. Less deployed than Argon2 but mathematically better understood."
  },

  // ═══════════════════════════════════════
  // MESSAGE AUTHENTICATION CODES
  // ═══════════════════════════════════════
  { id:"hmac_sha256", name:"HMAC-SHA-256", category:"mac", family:"HMAC", origin:"🇮🇱/🇺🇸 Israel/US",
    originDetail:"Bellare, Canetti, Krawczyk. IETF RFC 2104.",
    useCases:"General-purpose message authentication. TLS, API authentication, JWT signing, HKDF foundation.",
    status:"standard", statusLabel:"NIST FIPS 198-1 / IETF RFC 2104",
    keySize:256, tagSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"No attacks beyond generic birthday (2^128). Security reduces to hash.",
    reductionQuality:"Proven secure under PRF assumption on compression function",
    performance:"Same as underlying SHA-256",
    notes:"Workhorse MAC. Works with any hash. PQ-safe because it only relies on hash security."
  },
  { id:"cmac_aes", name:"CMAC-AES-256", category:"mac", family:"Block cipher MAC", origin:"🇺🇸 United States",
    originDetail:"NIST SP 800-38B. Based on OMAC by Iwata & Kurosawa (Japan).",
    useCases:"Block cipher-based MAC. Payment systems (EMV), low-level protocols where AES is already available.",
    status:"standard", statusLabel:"NIST SP 800-38B",
    keySize:256, tagSize:128,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Birthday bound at 2^64 blocks (same as any 128-bit block cipher MAC).",
    reductionQuality:"Proven secure under PRP assumption on AES",
    performance:"Same as AES encryption",
    notes:"Deterministic — no nonce needed. Birthday bound at 2^64 blocks limits data per key. Useful when hash is unavailable but AES is."
  },
  { id:"kmac256", name:"KMAC256", category:"mac", family:"Keccak-based", origin:"🇧🇪 Belgium",
    originDetail:"Based on Keccak/SHA-3. NIST SP 800-185.",
    useCases:"Keccak-native MAC. PQ constructions, systems already using SHA-3.",
    status:"standard", statusLabel:"NIST SP 800-185",
    keySize:256, tagSize:256,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"No known attacks beyond generic.",
    reductionQuality:"Direct Keccak sponge construction — no need for HMAC wrapper",
    performance:"Same as SHA-3",
    notes:"Native MAC from Keccak — no HMAC-style double-hash needed. Built-in domain separation and customization string."
  },
  { id:"poly1305", name:"Poly1305", category:"mac", family:"Polynomial MAC", origin:"🇺🇸 United States",
    originDetail:"Daniel J. Bernstein.",
    useCases:"Fast one-time MAC. Paired with ChaCha20 or AES for AEAD constructions.",
    status:"standard", statusLabel:"IETF RFC 8439",
    keySize:256, tagSize:128,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Information-theoretically secure as a one-time MAC (2^-106 forgery probability per message).",
    reductionQuality:"Proven secure as one-time MAC. Key MUST be unique per message.",
    performance:"Extremely fast — ~1 cycle/byte",
    notes:"One-time MAC — key must NEVER repeat. Always used with a cipher (ChaCha20 or AES) that generates fresh keys per message. Not standalone."
  },
  { id:"siphash", name:"SipHash", category:"mac", family:"ARX-based", origin:"🇨🇭/🇧🇷 Switzerland/Brazil",
    originDetail:"Jean-Philippe Aumasson (CH) & Daniel J. Bernstein.",
    useCases:"Hash table protection against HashDoS. Short-input MAC. Rust default HashMap, Python dict, Linux kernel.",
    status:"standard", statusLabel:"Published spec / widely deployed",
    keySize:128, tagSize:64,
    securityBits:64, pqSecurityBits:64,
    bestAttack:"64-bit tag limits security to 2^64. Designed for anti-DoS, not cryptographic authentication.",
    reductionQuality:"PRF-secure for short inputs under key secrecy",
    performance:"Extremely fast for short inputs (~1ns per hash)",
    notes:"Not a general-purpose MAC. Designed to protect hash tables from adversarial collision attacks. Used in virtually every modern language runtime."
  },

  // ═══════════════════════════════════════
  // PASSWORD HASHING
  // ═══════════════════════════════════════
  { id:"argon2id", name:"Argon2id", category:"password", family:"Memory-hard", origin:"🇱🇺 Luxembourg",
    originDetail:"Biryukov, Dinu, Khovratovich. Password Hashing Competition winner 2015.",
    useCases:"Password storage. Modern web apps, credential databases, login systems.",
    status:"standard", statusLabel:"IETF RFC 9106 / OWASP recommended",
    memoryHard:true, gpuResistant:true, sidechannelResistant:true,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Memory-hardness limits GPU/ASIC. Hybrid mode resists both side-channel and TMTO attacks.",
    reductionQuality:"Proven memory-hardness bounds. Hybrid of Argon2i (side-channel safe) + Argon2d (TMTO resistant)",
    performance:"Tunable: recommended ≥64 MiB memory, ≥0.5s on target hardware",
    notes:"Current gold standard for password hashing. Three tuning parameters: memory, iterations, parallelism. OWASP first recommendation."
  },
  { id:"bcrypt", name:"bcrypt", category:"password", family:"Blowfish-based", origin:"🇨🇦 Canada",
    originDetail:"Niels Provos & David Mazières. OpenBSD.",
    useCases:"Password storage. Legacy but still widely deployed and acceptable.",
    status:"standard", statusLabel:"OpenBSD / OWASP acceptable",
    memoryHard:false, gpuResistant:false, sidechannelResistant:true,
    securityBits:184, pqSecurityBits:184,
    bestAttack:"GPU-parallelizable but Blowfish's expensive key schedule provides some resistance. ~100x harder to GPU-crack than PBKDF2.",
    reductionQuality:"Eksblowfish key schedule with cost factor",
    performance:"Tunable cost factor — typically 100-400ms",
    notes:"72-byte password limit (truncates silently). Not memory-hard but still decent GPU resistance. Acceptable if Argon2 unavailable."
  },
  { id:"scrypt_pw", name:"scrypt", category:"password", family:"Memory-hard", origin:"🇨🇦 Canada",
    originDetail:"Colin Percival.",
    useCases:"Password storage with memory-hard protection. Cryptocurrency, file encryption systems.",
    status:"standard", statusLabel:"IETF RFC 7914",
    memoryHard:true, gpuResistant:true, sidechannelResistant:false,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Time-memory tradeoff partially effective. Less resistant than Argon2id to sophisticated ASIC.",
    reductionQuality:"Sequential memory-hard function (SMix/ROMix)",
    performance:"Tunable — typically 0.1-1s",
    notes:"First practical memory-hard password hash. Cannot tune time and memory independently — Argon2id is strictly more flexible."
  },
  { id:"pbkdf2_pw", name:"PBKDF2", category:"password", family:"Iterated HMAC", origin:"🇺🇸 United States",
    originDetail:"RSA Laboratories. RFC 8018.",
    useCases:"Legacy. WPA2, LUKS, older systems. Being replaced everywhere.",
    status:"standard", statusLabel:"NIST SP 800-132 (legacy)",
    memoryHard:false, gpuResistant:false, sidechannelResistant:true,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Trivially GPU-parallelizable. Billions of guesses/sec on commodity hardware.",
    reductionQuality:"Simple iterated PRF",
    performance:"Tunable iterations only",
    notes:"DO NOT use for new systems. GPU farms destroy PBKDF2 at any iteration count. Only acceptable with 600,000+ iterations (OWASP 2023) and only if nothing else is available."
  },
  { id:"balloon_pw", name:"Balloon Hashing", category:"password", family:"Memory-hard", origin:"🇺🇸 United States",
    originDetail:"Boneh, Corrigan-Gibbs, Schechter. Stanford.",
    useCases:"Provably memory-hard password hashing. Research-stage.",
    status:"candidate", statusLabel:"Academic",
    memoryHard:true, gpuResistant:true, sidechannelResistant:true,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Provable memory-hardness — strongest theoretical guarantee of any password hash.",
    reductionQuality:"Formal proof in random oracle model",
    performance:"Comparable to Argon2",
    notes:"Best theoretical guarantees but less battle-tested. Interesting for future standardization."
  },

  // ═══════════════════════════════════════
  // SECRET SHARING
  // ═══════════════════════════════════════
  { id:"shamir", name:"Shamir's Secret Sharing", category:"sharing", family:"Polynomial", origin:"🇮🇱 Israel",
    originDetail:"Adi Shamir, 1979.",
    useCases:"Threshold key recovery. Cryptocurrency wallets, backup systems, Quantum Vault KPQC.",
    status:"standard", statusLabel:"Foundational / widely deployed",
    threshold:true, verifiable:false, proactive:false, informationTheoretic:true,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Information-theoretically secure with t-1 shares — no computational attack possible.",
    reductionQuality:"Perfect secrecy: t-1 shares reveal zero information about the secret",
    performance:"O(n·t) computation — very fast",
    notes:"Used in Quantum Vault. t-of-n threshold: any t shares reconstruct, t-1 shares reveal nothing. Works over finite fields (typically GF(256) or prime fields). PQ-safe by nature — no algebraic structure to attack."
  },
  { id:"blakley", name:"Blakley's Scheme", category:"sharing", family:"Geometric", origin:"🇺🇸 United States",
    originDetail:"George Blakley, 1979.",
    useCases:"Alternative threshold sharing via hyperplane intersection. Less common than Shamir.",
    status:"standard", statusLabel:"Foundational",
    threshold:true, verifiable:false, proactive:false, informationTheoretic:false,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Not perfectly secret — shares leak partial information about the secret. Fewer than t shares reduce the search space.",
    reductionQuality:"Geometric intersection — NOT information-theoretically secure (unlike Shamir)",
    performance:"O(t^3) for reconstruction (matrix operations)",
    notes:"Shares are points in t-dimensional space; secret is their intersection. Larger shares than Shamir. Leaks partial info with <t shares. Shamir is strictly superior for most applications."
  },
  { id:"feldman_vss", name:"Feldman VSS", category:"sharing", family:"Verifiable", origin:"🇺🇸 United States",
    originDetail:"Paul Feldman, 1987. Based on Shamir + discrete log commitments.",
    useCases:"Verifiable secret sharing. Distributed key generation, threshold cryptography protocols.",
    status:"standard", statusLabel:"Foundational",
    threshold:true, verifiable:true, proactive:false, informationTheoretic:false,
    securityBits:128, pqSecurityBits:0,
    bestAttack:"Verification relies on discrete log hardness — broken by quantum computers.",
    reductionQuality:"Computational security under discrete log assumption",
    performance:"Shamir + group exponentiations for verification",
    notes:"Adds verifiability to Shamir — each shareholder can verify their share is consistent without learning the secret. DL-based verification is NOT PQ-safe. PQ alternatives exist but aren't standardized."
  },
  { id:"pedersen_vss", name:"Pedersen VSS", category:"sharing", family:"Verifiable", origin:"🇩🇰 Denmark",
    originDetail:"Torben Pedersen, 1991.",
    useCases:"Information-theoretically hiding VSS. Stronger privacy than Feldman.",
    status:"standard", statusLabel:"Foundational",
    threshold:true, verifiable:true, proactive:false, informationTheoretic:true,
    securityBits:128, pqSecurityBits:0,
    bestAttack:"Verification relies on discrete log. Hiding is information-theoretic but binding is computational.",
    reductionQuality:"IT-hiding, computationally binding under DL assumption",
    performance:"2x Shamir cost (double polynomial)",
    notes:"Uses two polynomials and Pedersen commitments. Hides the secret information-theoretically (unlike Feldman). Verification still DL-based — not PQ-safe."
  },
  { id:"additive_sharing", name:"Additive Sharing", category:"sharing", family:"Additive", origin:"🌐 International",
    originDetail:"Foundational construction. Used in MPC protocols.",
    useCases:"MPC building block. SPDZ, ABY. n-of-n sharing for secure computation.",
    status:"standard", statusLabel:"Foundational",
    threshold:false, verifiable:false, proactive:false, informationTheoretic:true,
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Information-theoretically secure. ALL shares required — loss of one share destroys the secret.",
    reductionQuality:"Perfect secrecy: n-1 shares reveal nothing",
    performance:"O(n) — trivial computation",
    notes:"Simplest scheme: secret = sum of all shares. n-of-n only (no threshold). Foundation of additive-sharing MPC. PQ-safe by nature."
  },

  // ═══════════════════════════════════════
  // HOMOMORPHIC ENCRYPTION
  // ═══════════════════════════════════════
  { id:"tfhe", name:"TFHE", category:"he", family:"Fully Homomorphic", origin:"🇫🇷 France / 🇧🇪 Belgium",
    originDetail:"Chillotti, Gama (FR), Georgieva, Izabachène. Zama (FR) leads development.",
    useCases:"Boolean/integer FHE. Privacy-preserving ML inference, encrypted database queries, confidential computing.",
    status:"candidate", statusLabel:"Research / Zama production",
    heType:"Fully Homomorphic (Boolean/Integer)", bootstrappingSpeed:"~10ms per gate",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Lattice attacks on LWE (est. 2^128+).",
    reductionQuality:"Based on LWE with torus structure",
    performance:"~10ms per Boolean gate. Programmable bootstrapping enables arbitrary functions.",
    notes:"Fastest bootstrapping of any FHE scheme. Zama (French company) builds production libraries (concrete). PQ-safe — based on LWE lattice problem."
  },
  { id:"bgv", name:"BGV", category:"he", family:"Fully Homomorphic", origin:"🇮🇱/🇺🇸 Israel/US",
    originDetail:"Brakerski (IL), Gentry (US), Vaikuntanathan (US/IN), 2012.",
    useCases:"Batched integer FHE. Privacy-preserving statistics, aggregation, voting, exact arithmetic.",
    status:"candidate", statusLabel:"Research / HElib",
    heType:"Fully Homomorphic (Integer/Modular)", bootstrappingSpeed:"~100ms-1s",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Lattice attacks on Ring-LWE (est. 2^128+).",
    reductionQuality:"Based on Ring-LWE / RLWE",
    performance:"Efficient for batched integer operations. Slower bootstrapping than TFHE.",
    notes:"Excels at SIMD-style batch operations on integers. Modulus switching for noise management. Implemented in HElib (IBM)."
  },
  { id:"bfv", name:"BFV", category:"he", family:"Fully Homomorphic", origin:"🇮🇱/🇬🇧 Israel/UK",
    originDetail:"Brakerski (IL), Fan & Vercauteren (BE/UK).",
    useCases:"Integer FHE. Similar to BGV with simpler noise management. Microsoft SEAL default.",
    status:"candidate", statusLabel:"Research / Microsoft SEAL",
    heType:"Fully Homomorphic (Integer)", bootstrappingSpeed:"~100ms-1s",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Lattice attacks on Ring-LWE (est. 2^128+).",
    reductionQuality:"Based on Ring-LWE",
    performance:"Comparable to BGV. Simpler scale management.",
    notes:"Default scheme in Microsoft SEAL. Simpler implementation than BGV at slight efficiency cost. Good for database-style queries."
  },
  { id:"ckks", name:"CKKS", category:"he", family:"Fully Homomorphic", origin:"🇰🇷 South Korea",
    originDetail:"Cheon, Kim, Kim, Song. Seoul National University, 2017.",
    useCases:"Approximate arithmetic FHE. Privacy-preserving ML training/inference, statistical analysis on encrypted data.",
    status:"candidate", statusLabel:"Research / widely implemented",
    heType:"Fully Homomorphic (Approximate Real Numbers)", bootstrappingSpeed:"~100ms-1s",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Li & Micciancio passive attack on approximate decryption (2021) — mitigated in updated versions.",
    reductionQuality:"Based on Ring-LWE. Approximate nature introduces unique security considerations.",
    performance:"Efficient for real-number computation. SIMD batching of floating-point operations.",
    notes:"Only FHE scheme supporting native floating-point. Essential for ML on encrypted data. Korean origin. The 2021 passive attack showed decryption leaks some info — mitigated but important to understand."
  },

  // ═══════════════════════════════════════
  // ZERO-KNOWLEDGE PROOFS
  // ═══════════════════════════════════════
  { id:"groth16", name:"Groth16 (zk-SNARK)", category:"zkp", family:"Pairing-based SNARK", origin:"🇩🇰 Denmark",
    originDetail:"Jens Groth, University College London / DFINITY, 2016.",
    useCases:"Succinct blockchain verification. Zcash (shielded transactions), private DeFi, credential proofs.",
    status:"standard", statusLabel:"Deployed (Zcash, others)",
    proofSize:"~200 bytes", verificationTime:"~3ms", trustedSetup:true, transparent:false, pqSafe:false,
    securityBits:128, pqSecurityBits:0,
    bestAttack:"Relies on pairing-based assumptions — broken by quantum computers. Toxic waste from trusted setup must be destroyed.",
    reductionQuality:"Based on knowledge-of-exponent assumption in pairing groups",
    performance:"Fastest verification. Proof generation ~seconds. Per-circuit trusted setup required.",
    notes:"Smallest proofs and fastest verification of any ZKP. But: needs trusted setup per circuit (toxic waste risk) and is NOT PQ-safe."
  },
  { id:"plonk", name:"PLONK (zk-SNARK)", category:"zkp", family:"Polynomial commitment SNARK", origin:"🇬🇧/🇮🇱 UK/Israel",
    originDetail:"Gabizon (IL), Williamson (UK), Ciobotaru, Aztec Protocol, 2019.",
    useCases:"Universal zk-SNARK. General-purpose private smart contracts, rollups (zkSync, Aztec).",
    status:"standard", statusLabel:"Widely deployed",
    proofSize:"~400 bytes", verificationTime:"~5ms", trustedSetup:true, transparent:false, pqSafe:false,
    securityBits:128, pqSecurityBits:0,
    bestAttack:"Pairing-based — broken by quantum. Universal trusted setup (one-time, not per-circuit).",
    reductionQuality:"Based on polynomial commitment (KZG) and pairing assumptions",
    performance:"Slower than Groth16 but universal setup amortizes cost across all circuits.",
    notes:"Universal and updatable trusted setup — much better than Groth16's per-circuit setup. Foundation for many L2 rollups. Not PQ-safe."
  },
  { id:"zk_stark", name:"zk-STARK", category:"zkp", family:"Hash-based STARK", origin:"🇮🇱 Israel",
    originDetail:"Eli Ben-Sasson, Iddo Bentov, et al. Technion / StarkWare, 2018.",
    useCases:"Transparent, PQ-safe zero-knowledge proofs. Blockchain scaling (StarkNet), computation integrity.",
    status:"standard", statusLabel:"Deployed (StarkNet, others)",
    proofSize:"~50-200 KB", verificationTime:"~50ms", trustedSetup:false, transparent:true, pqSafe:true,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Only relies on collision-resistant hashing — no algebraic attacks.",
    reductionQuality:"Based only on hash function collision resistance — minimal assumptions",
    performance:"Larger proofs and slower verification than SNARKs, but no trusted setup.",
    notes:"PQ-SAFE. No trusted setup (transparent). Proofs are much larger than SNARKs. Prover is fast. Ideal when trust assumptions must be minimal."
  },
  { id:"bulletproofs", name:"Bulletproofs", category:"zkp", family:"Discrete-log based", origin:"🇬🇧/🇺🇸 UK/US",
    originDetail:"Bünz (US), Bootle (UK), et al. Stanford / UCL, 2018.",
    useCases:"Range proofs, confidential transactions. Monero, Mimblewimble, small witness proofs.",
    status:"standard", statusLabel:"Deployed (Monero, others)",
    proofSize:"~700 bytes (range proof)", verificationTime:"~50ms", trustedSetup:false, transparent:true, pqSafe:false,
    securityBits:128, pqSecurityBits:0,
    bestAttack:"Based on discrete log — broken by quantum computers.",
    reductionQuality:"Based on discrete log assumption",
    performance:"Small proofs, no trusted setup, but verification scales linearly (slow for large circuits).",
    notes:"Excellent for range proofs and small statements. No trusted setup. Not PQ-safe. Verification too slow for large general computation."
  },

  // ═══════════════════════════════════════
  // SECURE MULTI-PARTY COMPUTATION
  // ═══════════════════════════════════════
  { id:"spdz", name:"SPDZ", category:"mpc", family:"Secret-sharing MPC", origin:"🇩🇰/🇬🇧 Denmark/UK",
    originDetail:"Damgård (DK), Pastro, Smart (UK), Zakarias, et al. 2012.",
    useCases:"General-purpose malicious-secure MPC. Private auctions, secure analytics, joint ML training.",
    status:"standard", statusLabel:"Academic / MP-SPDZ framework",
    adversaryModel:"Active (malicious)", numParties:"n ≥ 2", preprocessingNeeded:true,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Preprocessing phase uses somewhat homomorphic encryption (SHE). Online phase is information-theoretically secure.",
    reductionQuality:"IT-secure online phase; SHE-based preprocessing under LWE",
    performance:"Online: ~μs per multiplication. Preprocessing: expensive.",
    notes:"State-of-the-art for malicious-secure MPC. Offline/online paradigm: expensive precomputation, fast online phase. MP-SPDZ framework supports many variants."
  },
  { id:"aby", name:"ABY", category:"mpc", family:"Hybrid MPC", origin:"🇩🇪 Germany",
    originDetail:"Demmler, Schneider, Zohner. TU Darmstadt, 2015.",
    useCases:"Two-party secure computation. Private set intersection, biometric matching, ML inference.",
    status:"standard", statusLabel:"Academic / TU Darmstadt framework",
    adversaryModel:"Semi-honest (passive)", numParties:"2", preprocessingNeeded:true,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Security relies on OT (oblivious transfer) security — reducible to LWE for PQ.",
    reductionQuality:"Combines Arithmetic, Boolean, Yao sharing with efficient conversion",
    performance:"Millions of gates/second in 2-party setting",
    notes:"A (arithmetic) + B (boolean) + Y (Yao) sharing — automatically picks the most efficient per operation. Semi-honest only. Very practical for 2-party."
  },
  { id:"garbled_circuits", name:"Yao's Garbled Circuits", category:"mpc", family:"Circuit-based MPC", origin:"🇺🇸/🇨🇳 US/China",
    originDetail:"Andrew Yao (born China, US-based), 1986. Foundational MPC construction.",
    useCases:"Two-party secure computation. Foundation for most 2-party MPC protocols.",
    status:"standard", statusLabel:"Foundational",
    adversaryModel:"Semi-honest (extensions for malicious)", numParties:"2", preprocessingNeeded:false,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Security reduces to OT security. Semi-honest base; malicious extensions add overhead.",
    reductionQuality:"Based on oblivious transfer security (can be instantiated from LWE for PQ)",
    performance:"Constant rounds. ~millions of gates/second with optimizations (Free XOR, Half Gates).",
    notes:"Foundational 2-party MPC. One party garbles a Boolean circuit, the other evaluates. Constant round complexity. Free XOR and Half Gates optimizations make it very practical."
  },
  { id:"sharemind", name:"Sharemind", category:"mpc", family:"Secret-sharing MPC", origin:"🇪🇪 Estonia",
    originDetail:"Cybernetica (Estonia). Dan Bogdanov, et al.",
    useCases:"Privacy-preserving data analysis. Government statistics, tax analytics, healthcare research.",
    status:"standard", statusLabel:"Commercial (Cybernetica)",
    adversaryModel:"Semi-honest, 3-party", numParties:"3", preprocessingNeeded:false,
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Additive secret sharing — information-theoretically secure against 1-of-3 corruption.",
    reductionQuality:"IT-secure for passive adversary corrupting 1 of 3 parties",
    performance:"Very fast for simple operations. Production-deployed.",
    notes:"Deployed by Estonian government for tax/statistical analysis. 3-party additive sharing is extremely efficient. Commercial product with real government deployments."
  },

  // ═══════════════════════════════════════
  // OBLIVIOUS TRANSFER / PIR
  // ═══════════════════════════════════════
  { id:"ot_base", name:"Base Oblivious Transfer", category:"ot_pir", family:"Oblivious Transfer", origin:"🇮🇱 Israel",
    originDetail:"Michael Rabin (1981), Even/Goldreich/Lempel. Foundational.",
    useCases:"Foundation for MPC, garbled circuits, and private set intersection. Building block for higher protocols.",
    status:"standard", statusLabel:"Foundational",
    otType:"1-out-of-2", computationalModel:"Public-key based",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Base OT from RSA/DH is broken by quantum. PQ instantiation from lattices (LWE-OT) available.",
    reductionQuality:"Can be based on RSA, DDH, LWE, or other assumptions",
    performance:"~ms per OT (public-key operations)",
    notes:"Sender has two messages; receiver picks one without sender learning which. Fundamental MPC primitive. PQ versions exist using LWE."
  },
  { id:"ot_extension", name:"OT Extension", category:"ot_pir", family:"Oblivious Transfer", origin:"🇮🇱/🇺🇸 Israel/US",
    originDetail:"Ishai, Kilian, Nissim, Petrank, 2003. IKNP protocol.",
    useCases:"Efficient bulk OT for large-scale MPC. Millions of OTs from a few base OTs.",
    status:"standard", statusLabel:"Foundational / IKNP",
    otType:"1-out-of-2 (bulk)", computationalModel:"Symmetric crypto + few base OTs",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Security reduces to base OT security + correlation-robust hash function.",
    reductionQuality:"Reduces millions of OTs to ~128 base OTs + symmetric operations",
    performance:"~millions of OTs per second after base OT setup",
    notes:"Makes OT practical at scale. Only need ~128 expensive base OTs, then extend to millions using only hash functions. Foundation of practical MPC."
  },
  { id:"cpir", name:"Computational PIR", category:"ot_pir", family:"Private Information Retrieval", origin:"🇮🇱 Israel",
    originDetail:"Chor, Kushilevitz, Goldreich, Sudan, 1995 (IT-PIR). Computational variants by Kushilevitz/Ostrovsky.",
    useCases:"Private database queries. DNS privacy, certificate transparency lookups, ad-tech, private search.",
    status:"candidate", statusLabel:"Research / emerging deployment",
    otType:"Single-server PIR", computationalModel:"Lattice-based (LWE/RLWE) or homomorphic",
    securityBits:128, pqSecurityBits:128,
    bestAttack:"Security based on LWE/RLWE — PQ-safe.",
    reductionQuality:"Based on Ring-LWE or FHE assumptions",
    performance:"~100ms-10s per query depending on DB size. Communication sublinear in DB size.",
    notes:"Query a database without the server learning which record you want. Single-server schemes need computational assumptions (usually LWE). Major active research area — becoming practical."
  },
  { id:"it_pir", name:"Information-Theoretic PIR", category:"ot_pir", family:"Private Information Retrieval", origin:"🇮🇱 Israel",
    originDetail:"Chor, Goldreich, Kushilevitz, Sudan, 1995.",
    useCases:"Multi-server PIR with unconditional privacy. Maximum privacy guarantee.",
    status:"standard", statusLabel:"Foundational",
    otType:"Multi-server PIR", computationalModel:"No computational assumptions — IT-secure",
    securityBits:256, pqSecurityBits:256,
    bestAttack:"Information-theoretically secure — no computational attack possible. Requires non-colluding servers.",
    reductionQuality:"Unconditional privacy: servers learn nothing regardless of computing power",
    performance:"Requires 2+ non-colluding servers. Communication overhead depends on construction.",
    notes:"Perfect privacy but requires trust assumption: servers must not collude. If they collude, privacy breaks completely. PQ-safe by nature."
  },
];

const CATEGORIES = [
  { id:"symmetric", label:"Symmetric", icon:"🔐" },
  { id:"kem", label:"KEM", icon:"🤝" },
  { id:"signature", label:"Signatures", icon:"✍️" },
  { id:"hash", label:"Hash", icon:"#️⃣" },
  { id:"kdf", label:"KDF", icon:"🔑" },
  { id:"mac", label:"MAC", icon:"🏷️" },
  { id:"password", label:"Password", icon:"🔒" },
  { id:"sharing", label:"Sharing", icon:"🧩" },
  { id:"he", label:"HE", icon:"🔮" },
  { id:"zkp", label:"ZKP", icon:"🎭" },
  { id:"mpc", label:"MPC", icon:"🤖" },
  { id:"ot_pir", label:"OT / PIR", icon:"👁️" },
];

const CAT_INFO = {
  symmetric:{
    title:"Symmetric Encryption",
    oneLiner:"The padlock on your data. One key locks it, same key unlocks it.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"AES-256-GCM for payload encryption", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"Sealed in the Word", tech:"AES-256-GCM with per-member key wrapping", url:null, public:false, app:"PrayerWarriors.Mobi" },
      { name:"meow-decoder", tech:"AES-256-GCM encrypted QR file transfer", url:"https://github.com/systemslibrarian/meow-decoder", public:true },
    ],
    explanation:"Every time you open a website, send a message, or save an encrypted file, symmetric encryption is doing the actual work. It takes your data and a secret key and scrambles the data so thoroughly that without the key, a supercomputer running until the heat death of the universe couldn't unscramble it. The \"symmetric\" part means both sides use the same key — which is blazing fast but creates a chicken-and-egg problem: how do you safely share that key in the first place? That's where KEM and key exchange come in.",
    realWorld:"When your browser shows a padlock icon, symmetric encryption (AES or ChaCha20) is encrypting every byte between you and the server. When you encrypt a hard drive with BitLocker or FileVault, that's AES. When WireGuard VPN tunnels your traffic, that's ChaCha20. When a government stamps a document TOP SECRET and encrypts it, that's AES-256. Every single HTTPS connection, every encrypted chat message, every secure file transfer — symmetric encryption is the workhorse doing the heavy lifting at the center of all of it.",
    whyItMatters:"This is the foundation everything else builds on. Key exchange negotiates a key, signatures verify who you're talking to, but symmetric encryption is what actually protects the data. Get this wrong and nothing else matters."
  },
  kem:{
    title:"Key Encapsulation / Key Exchange",
    oneLiner:"The secret handshake. Two strangers agree on a shared secret that nobody else can figure out — even if they're being watched.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"SMAUG-T post-quantum KEM", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"Sealed in the Word", tech:"RSA-OAEP / ECIES key wrapping + Cloud KMS envelope encryption", url:null, public:false, app:"PrayerWarriors.Mobi" },
    ],
    explanation:"Here's the fundamental problem of cryptography: you need a shared secret key to encrypt data, but how do two people who've never met agree on a secret while an attacker listens to every word they say? Key exchange solves this impossible-sounding problem using math so elegant it's almost magic. One side creates a \"puzzle\" that's easy to solve if you know the secret but impossibly hard otherwise, sends it across a public channel, and both sides end up with the same key. In the post-quantum world, this uses lattice-based math that even quantum computers can't break. KEM (Key Encapsulation Mechanism) is the modern version — instead of an interactive back-and-forth, one side wraps a secret in a mathematical puzzle that only the recipient's private key can unwrap.",
    realWorld:"Every time you open a new HTTPS connection, a key exchange happens in the first fraction of a second. Your browser and the server agree on a fresh, unique encryption key — and even if someone recorded every byte of that exchange, they can't figure out what key was agreed on. Chrome and Firefox are already using ML-KEM (Kyber) hybrid key exchange to protect against future quantum computers recording today's traffic to crack later. Signal, WhatsApp, and iMessage all use key exchange to set up encrypted chats. SSH uses it every time you connect to a server.",
    whyItMatters:"This is the first thing that breaks in a quantum world. Classical key exchange (ECDH, RSA) is completely destroyed by Shor's algorithm. The entire internet's security depends on replacing these with post-quantum KEMs before large quantum computers arrive. This is why ML-KEM adoption is moving so fast — it's an emergency in slow motion."
  },
  signature:{
    title:"Digital Signatures",
    oneLiner:"A tamper-evident seal that proves who wrote something and that nobody changed it — mathematically unforgeable.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"HAETAE post-quantum signature scheme", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
    ],
    explanation:"When you sign a physical document, anyone can copy your signature. Digital signatures are fundamentally different — they're mathematically impossible to forge. The signer uses a private key (that only they know) to produce a signature, and anyone can verify it using the public key (which is freely shared). If even a single bit of the signed data changes, the signature fails. This gives you two guarantees simultaneously: authenticity (this really came from who it claims) and integrity (it hasn't been altered since signing). In the post-quantum era, these must be built on math that quantum computers can't crack — lattice problems or hash functions.",
    realWorld:"Every software update your phone installs was digitally signed — that's how your device knows it's a real update from Apple or Google and not malware. Every HTTPS certificate that proves \"this is really google.com\" is digitally signed by a Certificate Authority. Git commits are signed. Government documents are signed. Court filings are signed. Code libraries are signed. Every time your computer trusts that software is legitimate or a website is who it claims to be, digital signatures are the reason.",
    whyItMatters:"If an attacker could forge digital signatures, they could push malicious software updates to every phone on earth, impersonate any website, and forge legal documents. The entire trust infrastructure of the internet — certificates, code signing, secure boot — collapses without unforgeable signatures."
  },
  hash:{
    title:"Hash Functions",
    oneLiner:"A digital fingerprint machine. Feed in any amount of data, get back a unique fixed-size fingerprint that's impossible to reverse.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"SHA-256 for container integrity, HKDF foundation", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"meow-decoder", tech:"Hash-based integrity verification for QR frames", url:"https://github.com/systemslibrarian/meow-decoder", public:true },
      { name:"LCPL Registration Platform", tech:"HMAC-based webhook signatures, integrity checks", url:null, public:false, app:"Enterprise" },
    ],
    explanation:"A hash function takes any input — a single character, a 4K movie, an entire database — and produces a fixed-size output (say, 256 bits) called a digest. Three properties make this powerful: it's one-way (you can't reverse the hash to get the input), it's collision-resistant (no two different inputs should produce the same hash), and it's avalanche-sensitive (changing one bit of input changes roughly half the output bits). This means you can use a hash as a unique fingerprint for any piece of data. Same input always gives the same hash. Different inputs always give different hashes. And knowing the hash tells you nothing about the original data.",
    realWorld:"When you log into a website, the server doesn't store your password — it stores a hash of your password, then hashes what you type and compares. Git uses SHA-1 hashes to track every change to every file (and is migrating to SHA-256). Bitcoin mining is literally a competition to find hash inputs that produce outputs with enough leading zeros. When you download software and check a \"SHA-256 checksum,\" you're verifying the download matches the original. Blockchain, password storage, file integrity, data deduplication, digital forensics, and certificate transparency all run on hash functions.",
    whyItMatters:"Hash functions are the quiet workhorses behind almost everything else on this list. HMAC needs them. Digital signatures hash the data before signing. Key derivation functions are built on them. Password hashing is built on them. If hash functions broke, the cascading failure would take down virtually every security system in existence."
  },
  kdf:{
    title:"Key Derivation Functions",
    oneLiner:"The key factory. Takes one piece of secret material and produces as many unique, independent cryptographic keys as you need.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"HKDF with domain separation labels (HKDF_LABEL_SHARE_KEY, HKDF_LABEL_SHARE_NONCE)", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
    ],
    explanation:"After a key exchange, you have a shared secret — but you often need multiple keys from it: one for encrypting, one for authenticating, one for each direction of communication. You can't just reuse the same key for different purposes (that's catastrophic). A KDF takes your original secret and, using domain separation labels, derives as many independent keys as you need — each one cryptographically unrelated to the others even though they came from the same source. The critical distinction: some KDFs (like HKDF) expect high-quality input material from a key exchange. Others (like Argon2) are designed for low-quality input like human-chosen passwords. Using the wrong one is a serious mistake.",
    realWorld:"TLS 1.3 uses HKDF to derive all its session keys — handshake keys, application keys, resumption keys — all from a single shared secret. Signal Protocol derives new message keys for every single message (forward secrecy) using KDF chains. When Quantum Vault KPQC takes the shared secret from SMAUG-T and derives separate encryption and authentication keys with distinct labels, that's HKDF doing the work. Every VPN, every encrypted messaging app, and every secure protocol uses KDFs to turn one secret into the many keys it needs.",
    whyItMatters:"Reusing a key for two different purposes can destroy the security of both. KDFs solve this by cleanly separating key material. They're also the bridge between the \"we agreed on a secret\" step and the \"now let's actually encrypt things\" step. Get the KDF wrong and everything downstream is compromised — even if every other component is perfect."
  },
  mac:{
    title:"Message Authentication Codes",
    oneLiner:"A tamper detector with a secret. Proves a message hasn't been altered — and that it came from someone who knows the key.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"GMAC via AES-256-GCM authenticated encryption", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"SwipeWatcher", tech:"HMAC-signed webhooks for access control events", url:null, public:false, app:"LCPL Enterprise" },
    ],
    explanation:"A MAC is like a hash, but with a secret key mixed in. The sender computes a short tag over the message using a shared secret, and attaches it. The receiver recomputes the tag with the same key and checks it matches. If even one bit of the message changed, the tag won't match. If someone without the key tries to forge a tag, they can't — it's computationally impossible. Unlike digital signatures, MACs are symmetric: both sides need the same key, so they prove \"someone with the key sent this\" but not which specific person. The tradeoff is that MACs are dramatically faster than signatures.",
    realWorld:"Every HTTPS connection uses a MAC on every single packet to ensure nothing was tampered with in transit. AEAD ciphers (AES-GCM, ChaCha20-Poly1305) have a MAC built in — the \"A\" in AEAD is \"Authenticated\" and that authentication is a MAC. API authentication tokens (HMAC-SHA256) are MACs. JWT tokens signed with HS256 use HMAC. When your operating system verifies that a kernel module hasn't been tampered with before loading it, that's often a MAC. Every authenticated encryption operation in every browser, every server, every VPN — MACs are embedded in all of it.",
    whyItMatters:"Encryption without authentication is dangerous. An attacker might not be able to read your encrypted data, but they could flip bits and corrupt it in useful ways. MACs prevent this — they ensure that if anything was altered, you'll know. This is why modern cryptography insists on authenticated encryption (AEAD), not just encryption alone."
  },
  password:{
    title:"Password Hashing",
    oneLiner:"The vault door for credentials. Makes cracking stolen password databases so expensive that attackers give up.",
    projects:[
      { name:"PrayerWarriors.Mobi", tech:"Firebase Auth (handles bcrypt/scrypt internally)", url:null, public:false, app:"PrayerWarriors.Mobi", note:"Indirect — Firebase handles the hashing. No standalone demo yet." },
    ],
    explanation:"Regular hash functions are designed to be fast. That's exactly wrong for passwords. If hashing is fast, an attacker who steals a database of password hashes can try billions of guesses per second using GPUs. Password hashing algorithms are intentionally slow and expensive — they force every guess to consume significant CPU time, memory, or both. The key insight: legitimate users only hash their password once (at login), so a half-second delay is fine. But an attacker trying millions of passwords now needs millions of half-seconds. Memory-hard functions go further: they require large amounts of RAM per guess, which makes GPU and ASIC cracking rigs either impossible or prohibitively expensive to build. This turns a million-dollar cracking rig into an expensive paperweight.",
    realWorld:"Every competent web application stores passwords using one of these algorithms. When LinkedIn was breached in 2012, passwords were stored as plain SHA-1 hashes — millions were cracked in hours. When Dropbox was breached in 2016, passwords were bcrypt-hashed — cracking was impractically slow. That's the difference. Major password managers (1Password, Bitstrike) use Argon2 or PBKDF2 to derive encryption keys from your master password. Cryptocurrency wallets use scrypt or Argon2 to protect wallet keys. Every time you create an account on a well-built website, your password goes through one of these before storage.",
    whyItMatters:"Data breaches happen constantly. The question isn't whether a password database will be stolen — it's what happens when it is. With proper password hashing, the stolen hashes are nearly useless. With bad hashing (MD5, SHA-1, unsalted anything), every password is cracked within hours. This single choice — which password hash to use — determines whether a breach is a nuisance or a catastrophe."
  },
  sharing:{
    title:"Secret Sharing",
    oneLiner:"The master key that's split into pieces. No single person holds enough to unlock anything — but bring enough pieces together and the secret reassembles.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"Shamir secret sharing over GF(256) for threshold key recovery", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
    ],
    explanation:"Secret sharing solves a fundamental trust problem: how do you protect a critical secret (a master key, a nuclear launch code, a cryptocurrency wallet seed) so that no single person can abuse it, but it's still recoverable when legitimately needed? The answer: split the secret into shares distributed to different people or locations. Threshold secret sharing (like Shamir's) lets you set a policy — for example, any 3-out-of-5 shares can reconstruct the secret, but 2 shares reveal absolutely nothing. Not \"a little bit\" of information — literally zero. This is mathematically provable and information-theoretically secure, meaning no amount of computing power helps an attacker with fewer than the threshold number of shares.",
    realWorld:"Cryptocurrency exchanges store wallet keys using Shamir secret sharing — split across multiple secure locations so that no single breach compromises funds. Corporate root certificate authorities split their signing keys so that multiple officers must be present to sign a certificate. The ICANN root DNS key ceremony uses threshold sharing — multiple trusted community members each hold a share, and a quorum must physically gather to perform critical DNS operations. Nuclear launch authorization uses a two-person rule that's conceptually identical. Quantum Vault KPQC uses Shamir sharing to split the payload encryption key across multiple recipients.",
    whyItMatters:"Single points of failure destroy security. If one person holds the master key, they can be coerced, bribed, compromised, or hit by a bus. Secret sharing eliminates single points of failure while maintaining the ability to recover the secret when legitimately needed. It's the mathematical backbone of every \"requires multiple approvals\" security system."
  },
  he:{
    title:"Homomorphic Encryption",
    oneLiner:"Encrypted computation. Send your data encrypted, the server processes it encrypted, you get encrypted results back — and the server never sees your data.",
    projects:[],
    projectIdea:"Private Prayer Analytics — aggregate prayer statistics computed on fully encrypted prayer data. Churches see trends without seeing individual prayers. Pairs with PrayerWarriors.Mobi.",
    explanation:"This is the holy grail of privacy technology. Normal encryption requires you to decrypt data before you can do anything with it — which means whoever processes your data sees your data. Homomorphic encryption breaks this barrier: you can add, multiply, and run computations on encrypted data and get encrypted results that, when you decrypt them, are exactly what you would have gotten by computing on the plaintext. The server doing the computation never sees anything unencrypted. Fully Homomorphic Encryption (FHE) supports arbitrary computations. This was considered theoretically impossible until Craig Gentry's breakthrough in 2009, and it's been getting exponentially more practical since. Current FHE is still 1,000-10,000x slower than plaintext computation, but for many applications the privacy gain is worth the cost.",
    realWorld:"Banks are using FHE to run anti-money-laundering checks across institutions without sharing customer data. Healthcare researchers are running genomic analyses on encrypted patient data — the patients' actual genetic information is never exposed to the computing infrastructure. Apple uses a form of homomorphic encryption in its Private Cloud Compute system. Machine learning models can be trained on encrypted data, so a hospital can contribute to an AI model without ever exposing patient records. Zama (France) and Microsoft SEAL are building production FHE libraries that real companies are deploying today. CKKS (Korean-designed) is specifically built for ML workloads on encrypted data.",
    whyItMatters:"The current paradigm requires you to trust whoever processes your data. Cloud computing means trusting Amazon, Google, or Microsoft with your raw data. FHE eliminates that trust requirement entirely. If FHE becomes fast enough for general use, it fundamentally changes the privacy equation of cloud computing — you get the benefits of cloud processing without giving up the data. This is arguably the most transformative cryptographic technology under active development."
  },
  zkp:{
    title:"Zero-Knowledge Proofs",
    oneLiner:"Mathematical proof without revelation. Prove you know a secret, prove a statement is true, prove you qualify — without revealing anything beyond the truth of the claim itself.",
    projects:[],
    projectIdea:"Scripture Knowledge Proof — prove completion of a Scripture Journey lesson path without revealing which lessons or quiz scores. Or: church membership credential verification without revealing identity.",
    explanation:"Imagine proving you're over 21 without showing your ID. Proving you have enough money for a transaction without revealing your balance. Proving a computation was done correctly without showing the inputs. Zero-knowledge proofs make all of this possible. The prover convinces the verifier that a statement is true while revealing absolutely nothing else. There are two main families: SNARKs produce tiny proofs (a few hundred bytes) that verify in milliseconds but often require a trusted setup ceremony. STARKs produce larger proofs but need no trusted setup and are quantum-resistant. Both are enabling a revolution in blockchain scalability and privacy.",
    realWorld:"Zcash uses zk-SNARKs so you can make transactions on a public blockchain where the sender, receiver, and amount are all hidden — but the network can still verify no money was created from thin air. Ethereum Layer 2 rollups (zkSync, StarkNet, Polygon zkEVM) use ZK proofs to bundle thousands of transactions into a single proof, verified on-chain in milliseconds — this is how Ethereum plans to scale. Digital identity systems use ZK proofs for selective disclosure: prove your age without revealing your birthday, prove citizenship without revealing your passport number. ZK proofs are also used in verifiable computation — outsource computation to a cloud server and get a proof that the result is correct without re-running the computation.",
    whyItMatters:"ZKPs solve the fundamental tension between privacy and verification. Until now, verification required revelation — to prove something, you had to show the evidence. ZKPs break this coupling. The implications ripple through every system that currently requires you to over-share personal information to prove a claim. Finance, identity, healthcare, voting — any domain where \"trust but verify\" currently forces unwanted disclosure."
  },
  mpc:{
    title:"Secure Multi-Party Computation",
    oneLiner:"Joint computation, zero shared data. Multiple parties compute a result together — but nobody learns anything about anyone else's input.",
    projects:[],
    projectIdea:"Church Budget Consensus — elders privately submit budget priorities, system computes consensus allocation without revealing individual submissions. Or: multi-branch library acquisition planning without sharing circulation data.",
    explanation:"Picture three companies that want to know their combined average salary without any company revealing their individual salary data. Or two hospitals that want to train an AI model together without sharing patient records. MPC makes this possible: each party keeps their private data locally, they interact through a cryptographic protocol, and at the end everyone learns the agreed-upon output — and nothing else. Not a single bit of anyone else's input leaks. This isn't just encryption — the computation itself is distributed so that no single point ever holds the combined data. Different MPC protocols handle different trust models: some protect against honest-but-curious parties, others protect even against actively malicious participants trying to cheat.",
    realWorld:"The Boston Women's Workforce Council used MPC to compute gender pay gap statistics across multiple companies — no company revealed their salary data to each other or to the council, but the aggregate statistics were accurately computed. Estonian government uses Sharemind (MPC platform) for tax fraud detection across databases that legally cannot be combined. Sugar beet auctions in Denmark were conducted via MPC so bidders couldn't learn each other's bids. Private Set Intersection (a specialized MPC) is used by Apple and Google for contact tracing, password breach detection, and ad measurement — checking if two lists overlap without revealing the lists themselves. Cryptocurrency wallets use MPC-based threshold signing so no single device ever holds the complete private key.",
    whyItMatters:"MPC solves the \"data silo\" problem without creating privacy risk. Today, combining datasets for analysis means someone sees all the data — creating legal liability, privacy violations, and security risk. MPC lets organizations collaborate on data analysis without centralizing the data. As data regulation tightens globally (GDPR, CCPA, HIPAA), MPC becomes the only way to get the analytical benefits of data sharing without the legal and ethical costs."
  },
  ot_pir:{
    title:"Oblivious Transfer & Private Information Retrieval",
    oneLiner:"Invisible access. Retrieve exactly what you need from a database — and the database never learns what you looked at.",
    projects:[],
    projectIdea:"Private Scripture Lookup — query a Bible verse database without the server learning which verse was requested. Protects people searching for verses about grief, addiction, or abuse from revealing their situation.",
    explanation:"Oblivious Transfer (OT) is a two-party protocol where a sender holds multiple messages and a receiver picks one to receive — but the sender doesn't learn which one was chosen, and the receiver only gets the one they picked. It sounds simple but it's the fundamental building block of virtually all MPC protocols. Private Information Retrieval (PIR) scales this idea to databases: a user queries a database and gets back their result, but the database server has no idea which record was accessed. Current PIR schemes are based on lattice cryptography (making them quantum-resistant) or use multiple non-colluding servers for information-theoretic guarantees. The practical challenge is efficiency — truly private database access is expensive compared to just asking openly.",
    realWorld:"Apple's iCloud Private Relay uses PIR-like techniques so Apple's servers help route your traffic without knowing which websites you visit. Signal uses Private Contact Discovery — you can check which of your phone contacts are on Signal without Signal learning your contact list. Certificate Transparency systems are exploring PIR so browsers can check if a certificate has been revoked without telling the CA which sites they're visiting (which would leak browsing history). Password breach checking services (like Have I Been Pwned's k-anonymity API and 1Password's implementation) use PIR-adjacent techniques so you can check if your password was breached without sending the password. Chrome's SafeBrowsing is exploring PIR to check URLs against malware databases without Google learning which URLs you visit.",
    whyItMatters:"The metadata problem: even when data is encrypted, the access pattern reveals information. If a medical database can see you looked up \"oncology treatment protocols,\" the query itself leaks your health situation. OT and PIR protect the access pattern — not just the data, but the fact that you accessed it. As surveillance concerns grow and privacy regulations tighten, hiding what you access becomes as important as encrypting what you send."
  },
};

const STATUS_COLORS = {
  standard: { bg:"#0d3320", text:"#34d399", border:"#065f46" },
  candidate: { bg:"#312e2a", text:"#fbbf24", border:"#78350f" },
};

function Badge({ status, label }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.standard;
  return <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`, padding:"2px 8px", borderRadius:"4px", fontSize:"11px", fontWeight:700, letterSpacing:"0.4px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{label}</span>;
}

function SecurityMeter({ bits, max=256, label }) {
  if (bits == null) return <span style={{color:"#7f8ea3",fontSize:"13px"}}>TBD</span>;
  const pct = Math.min((bits/max)*100, 100);
  const c = bits >= 192 ? "#34d399" : bits >= 128 ? "#38bdf8" : bits >= 112 ? "#fbbf24" : "#f87171";
  const levelLabel = bits >= 192 ? "high" : bits >= 128 ? "standard" : bits >= 112 ? "moderate" : "low";
  const fullLabel = label === "C" ? "Classical" : label === "PQ" ? "Post-Quantum" : (label || "Security");
  return (
    <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
      {label && <span aria-hidden="true" style={{fontSize:"12px",color:"#7f8ea3",minWidth:"24px",fontWeight:700}}>{label}</span>}
      <div
        role="meter"
        aria-label={`${fullLabel} security: ${bits} bits (${levelLabel})`}
        aria-valuenow={bits}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{flex:1,height:"6px",background:"#141a26",borderRadius:"999px",overflow:"hidden",minWidth:"50px"}}
      >
        <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:"2px",transition:"width 0.4s"}} />
      </div>
      <span aria-hidden="true" style={{color:c,fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,minWidth:"34px"}}>{bits}</span>
    </div>
  );
}

function formatBytes(b) { if(b==null) return "TBD"; if(b>=1024) return `${(b/1024).toFixed(1)} KB`; return `${b} B`; }

function CategoryExplainer({ category, expanded, onToggle }) {
  const info = CAT_INFO[category];
  if (!info) return null;

  return (
    <div
    style={{
      background:"linear-gradient(135deg, #0c1222 0%, #0e1628 100%)",
      border:"1px solid #1a2540",
      borderRadius:"10px",
      padding: expanded ? "20px 22px" : "14px 18px",
      marginBottom:"16px",
      transition:"all 0.2s",
      cursor: expanded ? "default" : "pointer",
    }}
    onClick={() => { if(!expanded) onToggle(); }}
    onKeyDown={(e) => { if(!expanded && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onToggle(); } }}
    role={expanded ? undefined : "button"}
    tabIndex={expanded ? undefined : 0}
    aria-label={expanded ? undefined : `Expand ${info.title} details`}
    >
      {/* Collapsed view */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:"18px",fontWeight:700,color:"#f8fafc",marginBottom:"5px",fontFamily:"'JetBrains Mono',monospace"}}>
            {info.title}
          </div>
          <div style={{fontSize:"15px",color:"#c7d2e1",lineHeight:"1.6",fontStyle:"italic"}}>
            {info.oneLiner}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="focusRing"
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${info.title} details` : `Expand ${info.title} details`}
          style={{
            background: expanded ? "#1a2540" : "#111d33",
            color: expanded ? "#7dd3fc" : "#93a4bb",
            border:`1px solid ${expanded ? "#1e3a5f" : "#1a2540"}`,
            padding:"8px 14px",
            borderRadius:"5px",
            cursor:"pointer",
            fontSize:"13px",
            fontWeight:700,
            fontFamily:"'JetBrains Mono',monospace",
            whiteSpace:"nowrap",
            flexShrink:0,
            transition:"all 0.15s",
          }}
        >
          {expanded ? "▾ Less" : "▸ Learn more"}
        </button>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div style={{marginTop:"18px",display:"flex",flexDirection:"column",gap:"18px"}}>
          {/* What it does */}
          <div>
            <div style={{
              fontSize:"12px",fontWeight:700,color:"#3b82f6",textTransform:"uppercase",
              letterSpacing:"1.2px",marginBottom:"8px",fontFamily:"'JetBrains Mono',monospace"
            }}>
              What it does
            </div>
            <div style={{fontSize:"15px",color:"#d6dfeb",lineHeight:"1.8"}}>
              {info.explanation}
            </div>
          </div>

          {/* Where you see it */}
          <div style={{
            background:"#0a1018",
            borderRadius:"8px",
            padding:"16px 18px",
            borderLeft:"3px solid #3b82f6",
          }}>
            <div style={{
              fontSize:"12px",fontWeight:700,color:"#38bdf8",textTransform:"uppercase",
              letterSpacing:"1.2px",marginBottom:"8px",fontFamily:"'JetBrains Mono',monospace"
            }}>
              Where you see it in the real world
            </div>
            <div style={{fontSize:"15px",color:"#c7d2e1",lineHeight:"1.8"}}>
              {info.realWorld}
            </div>
          </div>

          {/* Why it matters */}
          <div style={{
            background:"linear-gradient(90deg, rgba(59,130,246,0.08) 0%, transparent 100%)",
            borderRadius:"8px",
            padding:"14px 18px",
            borderLeft:"3px solid #f59e0b",
          }}>
            <div style={{
              fontSize:"12px",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",
              letterSpacing:"1.2px",marginBottom:"8px",fontFamily:"'JetBrains Mono',monospace"
            }}>
              Why it matters
            </div>
            <div style={{fontSize:"15px",color:"#f2d38a",lineHeight:"1.8",fontWeight:600}}>
              {info.whyItMatters}
            </div>
          </div>

          {/* Your Projects */}
          <div style={{
            background:"#0a1018",
            borderRadius:"8px",
            padding:"16px 18px",
            borderLeft: info.projects && info.projects.length > 0 ? "3px solid #34d399" : "3px solid #f87171",
          }}>
            <div style={{
              fontSize:"12px",fontWeight:700,
              color: info.projects && info.projects.length > 0 ? "#34d399" : "#f87171",
              textTransform:"uppercase",
              letterSpacing:"1.2px",marginBottom:"10px",fontFamily:"'JetBrains Mono',monospace",
              display:"flex",alignItems:"center",gap:"8px"
            }}>
              {info.projects && info.projects.length > 0 ? "Your projects using this" : "Not yet in your portfolio"}
              {info.projects && info.projects.length > 0 && (
                <span style={{
                  background:"#0d3320", color:"#34d399", border:"1px solid #065f46",
                  padding:"2px 7px", borderRadius:"3px", fontSize:"12px"
                }}>{info.projects.length} {info.projects.length === 1 ? "repo" : "repos"}</span>
              )}
            </div>

            {info.projects && info.projects.length > 0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {info.projects.map((p, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"flex-start", gap:"10px",
                    padding:"8px 10px", background:"#0c1422", borderRadius:"6px",
                    border:"1px solid #141c2b"
                  }}>
                    <div style={{
                      width:"8px", height:"8px", borderRadius:"50%", flexShrink:0, marginTop:"4px",
                      background: p.public ? "#34d399" : "#fbbf24"
                    }} />
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                        {p.public && p.url ? (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
                            color:"#38bdf8", fontSize:"13px", fontWeight:700,
                            fontFamily:"'JetBrains Mono',monospace",
                            textDecoration:"none",
                          }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration="underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration="none"}
                          onClick={e => e.stopPropagation()}
                          >
                            {p.name}
                          </a>
                        ) : (
                          <span style={{
                            color:"#94a3b8", fontSize:"13px", fontWeight:700,
                            fontFamily:"'JetBrains Mono',monospace"
                          }}>
                            {p.name}
                          </span>
                        )}
                        <span style={{
                          background: p.public ? "#0d3320" : "#312e2a",
                          color: p.public ? "#34d399" : "#fbbf24",
                          border:`1px solid ${p.public ? "#065f46" : "#78350f"}`,
                          padding:"2px 6px", borderRadius:"3px", fontSize:"12px", fontWeight:700
                        }}>
                          {p.public ? "PUBLIC" : "PRIVATE"}
                        </span>
                      </div>
                      <div style={{fontSize:"13px",color:"#94a3b8",marginTop:"4px"}}>{p.tech}</div>
                      {p.note && <div style={{fontSize:"12px",color:"#7f8ea3",marginTop:"4px",fontStyle:"italic"}}>{p.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {info.projectIdea && (
                  <div style={{
                    padding:"10px 12px", background:"#0c1422", borderRadius:"6px",
                    border:"1px dashed #2a1a1a"
                  }}>
                    <div style={{fontSize:"12px",color:"#f87171",fontWeight:700,marginBottom:"6px",fontFamily:"'JetBrains Mono',monospace"}}>
                      Project idea
                    </div>
                    <div style={{fontSize:"14px",color:"#d6a0a0",lineHeight:"1.7"}}>
                      {info.projectIdea}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AlgoCard({ algo, advanced, selected, onToggle }) {
  return (
    <div
    onClick={onToggle}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    }}
    role="button"
    tabIndex={0}
    aria-pressed={selected}
    aria-label={`${selected ? "Deselect" : "Select"} ${algo.name} for comparison`}
    className="focusRing algoCard"
    style={{
      background: selected ? "#0e1628" : "#0b0f17",
      border: `1.5px solid ${selected ? "#3b82f6" : "#141c2b"}`,
      borderRadius:"8px", padding:"16px 18px", cursor:"pointer", transition:"all 0.15s", position:"relative",
    }}
    onMouseEnter={e => { if(!selected) e.currentTarget.style.borderColor="#1e2b40"; }}
    onMouseLeave={e => { if(!selected) e.currentTarget.style.borderColor="#141c2b"; }}
    >
      {selected && <div aria-hidden="true" style={{position:"absolute",top:"8px",right:"10px",width:"18px",height:"18px",borderRadius:"50%",background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#fff",fontWeight:700}}>✓</div>}
      <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"4px",flexWrap:"wrap"}}>
        <span style={{fontSize:"16px",fontWeight:700,color:"#f8fafc",fontFamily:"'JetBrains Mono',monospace"}}>{algo.name}</span>
        <Badge status={algo.status} label={algo.statusLabel} />
      </div>
      <div style={{fontSize:"13px",color:"#b1bfd2",marginBottom:"8px"}}>{algo.origin}</div>
      <p style={{fontSize:"14px",color:"#c6d2e0",lineHeight:"1.65",margin:"0 0 10px"}}>{algo.useCases}</p>
      <SecurityMeter bits={algo.securityBits} label="C" />
      <div style={{height:"6px"}} />
      <SecurityMeter bits={algo.pqSecurityBits} label="PQ" />
      {advanced && (
        <div style={{marginTop:"10px",paddingTop:"10px",borderTop:"1px solid #141c2b",fontSize:"12px",color:"#bac6d7",lineHeight:"1.65"}}>
          <div><span style={{color:"#7f8ea3",fontWeight:700}}>Attack:</span> {algo.bestAttack}</div>
          <div style={{marginTop:"4px"}}><span style={{color:"#7f8ea3",fontWeight:700}}>Perf:</span> {algo.performance}</div>
        </div>
      )}
    </div>
  );
}

function buildRows(category, advanced) {
  const rows = [];
  rows.push({ label:"Origin", render: a => a.origin });
  rows.push({ label:"Status", render: a => <Badge status={a.status} label={a.statusLabel} /> });
  rows.push({ label:"Classical", render: a => <SecurityMeter bits={a.securityBits} /> });
  rows.push({ label:"PQ", render: a => <SecurityMeter bits={a.pqSecurityBits} /> });

  if (category === "symmetric") {
    rows.push({ label:"Key", render: a => `${a.keySize} bits` });
    rows.push({ label:"Nonce", render: a => `${a.nonceSize} bits` });
    rows.push({ label:"Tag", render: a => a.tagSize ? `${a.tagSize} bits` : "—" });
    rows.push({ label:"Block", render: a => a.blockSize ? `${a.blockSize} bits` : "Stream" });
  } else if (category === "kem") {
    rows.push({ label:"Public Key", render: a => a.publicKeySize!=null ? formatBytes(a.publicKeySize) : "TBD" });
    rows.push({ label:"Ciphertext", render: a => a.ciphertextSize!=null ? formatBytes(a.ciphertextSize) : "TBD" });
    rows.push({ label:"Secret", render: a => a.sharedSecretSize ? `${a.sharedSecretSize} bits` : "TBD" });
  } else if (category === "signature") {
    rows.push({ label:"Public Key", render: a => a.publicKeySize!=null ? formatBytes(a.publicKeySize) : "TBD" });
    rows.push({ label:"Signature", render: a => a.signatureSize!=null ? formatBytes(a.signatureSize) : "TBD" });
  } else if (category === "hash") {
    rows.push({ label:"Output", render: a => `${a.outputSize} bits` });
    rows.push({ label:"Block", render: a => `${a.blockSize} bits` });
  } else if (category === "kdf") {
    rows.push({ label:"Input Type", render: a => a.inputType || "—" });
    rows.push({ label:"Output", render: a => a.outputType || "—" });
  } else if (category === "mac") {
    rows.push({ label:"Key", render: a => `${a.keySize} bits` });
    rows.push({ label:"Tag", render: a => `${a.tagSize} bits` });
  } else if (category === "password") {
    rows.push({ label:"Memory-Hard", render: a => a.memoryHard ? "✅ Yes" : "❌ No" });
    rows.push({ label:"GPU-Resistant", render: a => a.gpuResistant ? "✅ Yes" : "❌ No" });
    rows.push({ label:"Side-Ch. Safe", render: a => a.sidechannelResistant ? "✅ Yes" : "⚠️ Partial" });
  } else if (category === "sharing") {
    rows.push({ label:"Threshold", render: a => a.threshold ? "✅ t-of-n" : "❌ n-of-n only" });
    rows.push({ label:"Verifiable", render: a => a.verifiable ? "✅ Yes" : "❌ No" });
    rows.push({ label:"IT-Secure", render: a => a.informationTheoretic ? "✅ Yes" : "⚠️ Computational" });
  } else if (category === "he") {
    rows.push({ label:"HE Type", render: a => a.heType || "—" });
    rows.push({ label:"Bootstrap", render: a => a.bootstrappingSpeed || "—" });
  } else if (category === "zkp") {
    rows.push({ label:"Proof Size", render: a => a.proofSize || "—" });
    rows.push({ label:"Verify Time", render: a => a.verificationTime || "—" });
    rows.push({ label:"Trusted Setup", render: a => a.trustedSetup ? "⚠️ Required" : "✅ None (transparent)" });
    rows.push({ label:"PQ-Safe", render: a => a.pqSafe ? "✅ Yes" : "❌ No" });
  } else if (category === "mpc") {
    rows.push({ label:"Adversary", render: a => a.adversaryModel || "—" });
    rows.push({ label:"Parties", render: a => a.numParties || "—" });
    rows.push({ label:"Preprocessing", render: a => a.preprocessingNeeded ? "Required" : "None" });
  } else if (category === "ot_pir") {
    rows.push({ label:"Type", render: a => a.otType || "—" });
    rows.push({ label:"Model", render: a => a.computationalModel || "—" });
  }

  rows.push({ label:"Use Cases", render: a => a.useCases });

  if (advanced) {
    rows.push({ label:"Best Attack", render: a => a.bestAttack });
    rows.push({ label:"Reduction", render: a => a.reductionQuality });
    rows.push({ label:"Performance", render: a => a.performance });
    rows.push({ label:"Notes", render: a => a.notes });
  }
  return rows;
}

function CompTable({ algos, rows }) {
  return (
    <div style={{overflowX:"auto",borderRadius:"8px",border:"1px solid #141c2b"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
        <caption style={{textAlign:"left",padding:"12px 14px",color:"#b7c4d6",fontSize:"14px",captionSide:"top"}}>
          Side-by-side comparison of the selected algorithms.
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{textAlign:"left",padding:"12px 12px",borderBottom:"2px solid #1a2540",color:"#93a4bb",fontWeight:700,position:"sticky",left:0,background:"#070b12",zIndex:2,minWidth:"110px",fontSize:"12px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Metric</th>
            {algos.map(a => (
              <th scope="col" key={a.id} style={{textAlign:"left",padding:"12px 12px",borderBottom:"2px solid #1a2540",color:"#f8fafc",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",fontSize:"15px",minWidth:"190px",background:"#070b12"}}>{a.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i) => (
            <tr key={i}>
              <th scope="row" style={{padding:"10px 12px",borderBottom:"1px solid #0d1320",color:"#93a4bb",fontWeight:700,position:"sticky",left:0,background:i%2===0?"#070b12":"#090e18",zIndex:1,fontSize:"12px",textTransform:"uppercase",letterSpacing:"0.4px",verticalAlign:"top"}}>{row.label}</th>
              {algos.map(a => (
                <td key={a.id} style={{padding:"10px 12px",borderBottom:"1px solid #0d1320",color:"#d4deea",verticalAlign:"top",background:i%2===0?"transparent":"rgba(255,255,255,0.008)",maxWidth:"280px",lineHeight:"1.65"}}>
                  {typeof row.render(a) === "string" ? <span>{row.render(a)}</span> : row.render(a)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CryptoCompare() {
  const [cat, setCat] = useState("symmetric");
  const [adv, setAdv] = useState(false);
  const [sel, setSel] = useState([]);
  const [cmp, setCmp] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(true);

  const filtered = useMemo(() => ALGORITHMS.filter(a => a.category === cat), [cat]);
  const selAlgos = useMemo(() => filtered.filter(a => sel.includes(a.id)), [filtered, sel]);
  const rows = useMemo(() => buildRows(cat, adv), [cat, adv]);

  const toggle = id => { setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]); setCmp(false); };
  const switchCat = c => { setCat(c); setSel([]); setCmp(false); setExplainerOpen(true); };

  return (
    <div style={{background:"#070b12",color:"#e2e8f0",minHeight:"100vh",fontFamily:"'IBM Plex Sans',-apple-system,sans-serif",lineHeight:1.6}}>
      <a href="#main-content" className="skipLink">Skip to main content</a>
      <div className="pageShell">
      <header style={{borderBottom:"1px solid #111827",padding:"22px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
          <div>
            <h1 style={{margin:0,fontSize:"28px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.5px"}}>
              <span style={{color:"#3b82f6"}}>crypto</span>::compare
            </h1>
            <p style={{margin:"6px 0 0",fontSize:"15px",color:"#b4c1d2"}}>International cryptographic algorithm reference across 12 categories.</p>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <span style={{fontSize:"12px",color:"#b4c1d2",fontFamily:"'JetBrains Mono',monospace"}}>C = Classical, PQ = Post-Quantum</span>
            <button onClick={() => setAdv(!adv)} aria-pressed={adv} className="focusRing" style={{
              background:adv?"#11203a":"#0e1420", color:adv?"#7dd3fc":"#c4d1e0",
              border:`1px solid ${adv?"#163052":"#2a3547"}`, padding:"8px 14px", borderRadius:"5px",
              cursor:"pointer", fontSize:"13px", fontWeight:700, fontFamily:"'JetBrains Mono',monospace"
            }}>
              {adv ? "◆ Advanced" : "○ Beginner"}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs — scrollable */}
      <nav aria-label="Cryptography categories" role="tablist" style={{display:"flex",gap:0,borderBottom:"1px solid #111827",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => switchCat(c.id)} role="tab" aria-selected={cat===c.id} className="focusRing" style={{
            background:"transparent", color:cat===c.id?"#f8fafc":"#b1bfd2", border:"none",
            borderBottom:cat===c.id?"2px solid #3b82f6":"2px solid transparent",
            padding:"14px 16px", cursor:"pointer", fontSize:"14px", fontWeight:cat===c.id?700:600, whiteSpace:"nowrap", flexShrink:0
          }}>
            <span aria-hidden="true" style={{marginRight:"4px"}}>{c.icon}</span>{c.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main id="main-content" style={{padding:"20px 0 28px"}}>
        <CategoryExplainer
          category={cat}
          expanded={explainerOpen}
          onToggle={() => setExplainerOpen(!explainerOpen)}
        />

        {!explainerOpen && (
          <p style={{color:"#c7d2e1",fontSize:"14px",margin:"0 0 16px"}}>Select cards to compare algorithms side by side.</p>
        )}

        <section aria-label={`${CATEGORIES.find(c => c.id === cat)?.label || cat} algorithms`} className="algoGrid" style={{marginBottom:"18px"}}>
          {filtered.map(a => <AlgoCard key={a.id} algo={a} advanced={adv} selected={sel.includes(a.id)} onToggle={() => toggle(a.id)} />)}
        </section>

        {selAlgos.length >= 2 && !cmp && (
          <div style={{textAlign:"center",margin:"10px 0"}}>
            <button onClick={() => setCmp(true)} className="focusRing" style={{
              background:"#1d4ed8",color:"#fff",border:"none",padding:"9px 24px",borderRadius:"6px",
              fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"
            }}>Compare {selAlgos.length} →</button>
          </div>
        )}

        {selAlgos.length === 1 && <p style={{textAlign:"center",color:"#b4c1d2",fontSize:"14px"}}>Select one more algorithm to compare.</p>}

        {cmp && selAlgos.length >= 2 && (
          <section aria-label="Comparison table">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
              <h2 style={{margin:0,fontSize:"20px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>Comparison</h2>
              <button onClick={() => {setSel([]);setCmp(false);}} className="focusRing" style={{
                background:"#0e1420",color:"#d1d9e5",border:"1px solid #2a3547",padding:"8px 12px",
                borderRadius:"5px",cursor:"pointer",fontSize:"13px",fontWeight:700
              }}>Clear selection</button>
            </div>
            <CompTable algos={selAlgos} rows={rows} />
          </section>
        )}
      </main>

      <footer style={{borderTop:"1px solid #111827",padding:"16px 0 24px",fontSize:"12px",color:"#8fa0b6",fontFamily:"'JetBrains Mono',monospace"}}>
        Sources: NIST FIPS, IETF RFCs, KPQC, CRYPTREC, GB/T, GOST, DSTU, ISO, Eurocrypt/CRYPTO proceedings. Security estimates reflect known attacks as of 2025. Reference tool — not a certification.
      </footer>
      </div>
      <style jsx>{`
        .pageShell {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .algoGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          align-items: stretch;
        }

        .focusRing:focus-visible {
          outline: 3px solid #60a5fa;
          outline-offset: 3px;
        }

        .algoCard:focus-visible {
          border-color: #60a5fa !important;
        }

        .skipLink {
          position: absolute;
          top: -100px;
          left: 16px;
          background: #1d4ed8;
          color: #fff;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          z-index: 100;
          text-decoration: none;
        }

        .skipLink:focus {
          top: 12px;
        }

        @media (max-width: 900px) {
          .pageShell {
            padding: 0 16px;
          }

          .algoGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .algoCard,
          .focusRing {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
