import type { AlgorithmSource } from "@/types/crypto";

export const ALGORITHM_PROVENANCE: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }> = {
  // ─── Symmetric ───────────────────────────────────────────────────
  aes256gcm: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 197", url: "https://csrc.nist.gov/pubs/fips/197/final", note: "AES block cipher specification.", kind: "standard" },
      { label: "NIST SP 800-38D", url: "https://csrc.nist.gov/pubs/sp/800/38/d/final", note: "GCM mode of operation specification.", kind: "standard" },
    ],
  },
  chacha20poly: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 8439", url: "https://www.rfc-editor.org/rfc/rfc8439", note: "Specifies ChaCha20-Poly1305 construction and limits.", kind: "standard" },
    ],
  },
  xchacha20poly: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "libsodium docs", url: "https://doc.libsodium.org/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction", note: "Nonce-extension construction used in major implementations.", kind: "deployment" },
      { label: "IETF Draft", url: "https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha", note: "IRTF draft for XChaCha20-Poly1305.", kind: "standard" },
    ],
  },
  camellia256: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 3713", url: "https://www.rfc-editor.org/rfc/rfc3713", note: "Camellia cipher specification.", kind: "standard" },
      { label: "CRYPTREC", url: "https://www.cryptrec.go.jp/en/method.html", note: "Recommended by Japanese government cryptographic evaluation.", kind: "standard" },
    ],
  },
  aria256: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 5794", url: "https://www.rfc-editor.org/rfc/rfc5794", note: "ARIA cipher specification.", kind: "standard" },
      { label: "KS X 1213", url: "https://www.kats.go.kr/", note: "Korean national standard for block cipher.", kind: "standard" },
    ],
  },
  sm4: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "GB/T 32907-2016", url: "https://www.oscca.gov.cn/", note: "Chinese national standard for SM4 block cipher.", kind: "standard" },
      { label: "RFC 8998", url: "https://www.rfc-editor.org/rfc/rfc8998", note: "ShangMi cipher suites for TLS 1.3.", kind: "standard" },
    ],
  },
  kuznyechik: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "GOST R 34.12-2015", url: "https://tc26.ru/", note: "Russian national standard defining Kuznyechik block cipher.", kind: "standard" },
      { label: "RFC 7801", url: "https://www.rfc-editor.org/rfc/rfc7801", note: "GOST R 34.12-2015 block cipher (Kuznyechik).", kind: "standard" },
    ],
  },
  snow_v: {
    lastReviewed: "2026-04-02",
    sources: [
      { label: "ISO/IEC 18033-4", url: "https://www.iso.org/standard/54531.html", note: "International standard for stream ciphers including SNOW 2.0.", kind: "standard" },
      { label: "SNOW-V specification", url: "https://eprint.iacr.org/2018/1143", note: "Johansson & Yang, 2021. SNOW-V design for 5G.", kind: "analysis" },
      { label: "3GPP TS 35.216", url: "https://www.3gpp.org/specifications", note: "SNOW 3G specification for 4G/LTE confidentiality.", kind: "standard" },
      { label: "snow2 (demo)", url: "https://github.com/systemslibrarian/snow2", note: "Modern Rust steganography tool using SNOW-inspired naming with XChaCha20-Poly1305.", kind: "deployment" },
    ],
  },
  // ─── Elliptic Curves ────────────────────────────────────────────
  curve25519: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "RFC 7748", url: "https://www.rfc-editor.org/rfc/rfc7748", note: "Elliptic Curves for Security. Defines X25519 and X448.", kind: "standard" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Curve25519 is one of the SafeCurves project's canonical modern curve designs.", kind: "analysis" },
    ],
  },
  ed25519: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "RFC 8032", url: "https://www.rfc-editor.org/rfc/rfc8032", note: "Edwards-Curve Digital Signature Algorithm (EdDSA). Defines Ed25519 and Ed448.", kind: "standard" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Edwards25519 is covered in the SafeCurves project discussion of safer modern curves.", kind: "analysis" },
    ],
  },
  p256: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "NIST SP 800-186", url: "https://csrc.nist.gov/pubs/sp/800/186/final", note: "NIST elliptic-curve domain parameters including P-256.", kind: "standard" },
      { label: "NIST SP 800-57 Part 1 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Security-strength mapping assigning 128-bit strength to 256-bit ECC.", kind: "standard" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes NIST P-256 in the SafeCurves comparison framework.", kind: "analysis" },
    ],
  },
  p384: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "NIST SP 800-186", url: "https://csrc.nist.gov/pubs/sp/800/186/final", note: "NIST elliptic-curve domain parameters including P-384.", kind: "standard" },
      { label: "NIST SP 800-57 Part 1 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Security-strength mapping assigning 192-bit strength to 384-bit ECC.", kind: "standard" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes NIST P-384 in the SafeCurves comparison framework.", kind: "analysis" },
    ],
  },
  p521: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "NIST SP 800-186", url: "https://csrc.nist.gov/pubs/sp/800/186/final", note: "NIST elliptic-curve domain parameters including P-521.", kind: "standard" },
      { label: "NIST SP 800-57 Part 1 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Security-strength mapping assigning 256-bit strength to 512-bit-and-above ECC.", kind: "standard" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes NIST P-521 in the SafeCurves comparison framework.", kind: "analysis" },
    ],
  },
  secp256k1: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "SEC 2 v2.0", url: "https://www.secg.org/sec2-v2.pdf", note: "SECG domain parameters for secp256k1.", kind: "standard" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes secp256k1 in the SafeCurves comparison framework.", kind: "analysis" },
    ],
  },
  curve448_ed448: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "RFC 7748", url: "https://www.rfc-editor.org/rfc/rfc7748", note: "Defines X448 and positions the 448-bit family as roughly 224-bit classical security.", kind: "standard" },
      { label: "RFC 8032", url: "https://www.rfc-editor.org/rfc/rfc8032", note: "Defines Ed448 in the EdDSA family.", kind: "standard" },
    ],
  },
  bls12_381_curve: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "Pairing-Friendly Curves draft", url: "https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves", note: "CFRG draft describing BLS12-381 as a pairing-friendly curve designed for approximately 128-bit security.", kind: "standard" },
      { label: "RFC 9380", url: "https://www.rfc-editor.org/rfc/rfc9380", note: "Hashing to elliptic curves, including BLS12-381 suites used in deployed systems.", kind: "standard" },
    ],
  },
  bn254: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "Kim & Barbulescu 2016", url: "https://doi.org/10.1007/978-3-662-53887-6_11", note: "The Extended Tower Number Field Sieve. ASIACRYPT 2016. Basis for the reduced security estimates applied to BN254/alt_bn128.", kind: "analysis" },
    ],
  },
  brainpool_p256r1: {
    lastReviewed: "2026-04-07",
    sources: [
      { label: "RFC 5639", url: "https://www.rfc-editor.org/rfc/rfc5639", note: "Elliptic Curve Cryptography (ECC) Brainpool Standard Curves and Curve Generation.", kind: "standard" },
    ],
  },
  // ─── KEM ─────────────────────────────────────────────────────────
  mlkem768: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 203", url: "https://csrc.nist.gov/pubs/fips/203/final", note: "Defines ML-KEM parameter sets including ML-KEM-768.", kind: "standard" },
      { label: "NIST PQC Project", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "Selection and deployment context for PQ KEM transition.", kind: "analysis" },
    ],
  },
  mlkem1024: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 203", url: "https://csrc.nist.gov/pubs/fips/203/final", note: "Defines ML-KEM-1024 parameter set (256-bit PQ security).", kind: "standard" },
    ],
  },
  smaug_t: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "KPQC Competition", url: "https://kpqc.or.kr/competition.html", note: "Korean PQC competition where SMAUG-T was submitted.", kind: "analysis" },
    ],
  },
  hqc: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST PQC Round 4", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "Selected as NIST PQC standard (code-based KEM).", kind: "standard" },
      { label: "HQC Specification", url: "https://pqc-hqc.org/", note: "Official HQC submission documentation.", kind: "analysis" },
    ],
  },
  classic_mceliece: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST PQC Round 4", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "Longest-studied PQC KEM; advanced to NIST Round 4.", kind: "standard" },
      { label: "Classic McEliece site", url: "https://classic.mceliece.org/", note: "Specification and reference implementation.", kind: "analysis" },
    ],
  },
  frodokem: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "FrodoKEM specification", url: "https://frodokem.org/", note: "Conservative lattice-based KEM using standard LWE.", kind: "analysis" },
      { label: "ISO/IEC 18033-KEM", url: "https://www.iso.org/standard/37971.html", note: "Being evaluated for ISO standardization.", kind: "standard" },
    ],
  },
  bike: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST PQC Round 4", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "BIKE is a NIST Round 4 candidate (code-based KEM).", kind: "analysis" },
      { label: "BIKE specification", url: "https://bikesuite.org/", note: "Official specification and implementation.", kind: "analysis" },
    ],
  },
  // ─── Signature ───────────────────────────────────────────────────
  mldsa44: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 204", url: "https://csrc.nist.gov/pubs/fips/204/final", note: "Defines ML-DSA-44 (128-bit PQ security).", kind: "standard" },
    ],
  },
  mldsa65: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 204", url: "https://csrc.nist.gov/pubs/fips/204/final", note: "Defines ML-DSA parameter sets and signature sizes.", kind: "standard" },
    ],
  },
  haetae: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "KPQC Competition", url: "https://kpqc.or.kr/competition.html", note: "Korean PQC lattice-based signature scheme.", kind: "analysis" },
    ],
  },
  falcon512: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 206 (draft)", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "FALCON selected for NIST standardization (compact signatures).", kind: "standard" },
      { label: "FALCON specification", url: "https://falcon-sign.info/", note: "Official specification and analysis.", kind: "analysis" },
    ],
  },
  slh_dsa: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 205", url: "https://csrc.nist.gov/pubs/fips/205/final", note: "Stateless hash-based signature standard (SPHINCS+ based).", kind: "standard" },
    ],
  },
  xmss: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 8391", url: "https://www.rfc-editor.org/rfc/rfc8391", note: "XMSS: eXtended Merkle Signature Scheme.", kind: "standard" },
      { label: "NIST SP 800-208", url: "https://csrc.nist.gov/pubs/sp/800/208/final", note: "Recommendation for stateful hash-based signature schemes.", kind: "standard" },
    ],
  },
  // ─── Hash ────────────────────────────────────────────────────────
  sha256: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 180-4", url: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", note: "SHA-2 family specification.", kind: "standard" },
    ],
  },
  sha512: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 180-4", url: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", note: "SHA-512 from the SHA-2 family.", kind: "standard" },
    ],
  },
  sha3_256: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST FIPS 202", url: "https://csrc.nist.gov/pubs/fips/202/final", note: "SHA-3 standard based on Keccak sponge construction.", kind: "standard" },
    ],
  },
  blake2b: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 7693", url: "https://www.rfc-editor.org/rfc/rfc7693", note: "BLAKE2 cryptographic hash and MAC.", kind: "standard" },
    ],
  },
  blake3: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "BLAKE3 specification", url: "https://github.com/BLAKE3-team/BLAKE3-specs/blob/master/blake3.pdf", note: "BLAKE3 paper and specification.", kind: "analysis" },
    ],
  },
  sm3: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "GB/T 32905-2016", url: "https://www.oscca.gov.cn/", note: "Chinese national standard for SM3 hash function.", kind: "standard" },
      { label: "RFC 8998", url: "https://www.rfc-editor.org/rfc/rfc8998", note: "SM3 usage in TLS 1.3 cipher suites.", kind: "standard" },
    ],
  },
  streebog: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "GOST R 34.11-2012", url: "https://tc26.ru/", note: "Russian national standard defining Streebog hash function.", kind: "standard" },
      { label: "RFC 6986", url: "https://www.rfc-editor.org/rfc/rfc6986", note: "GOST R 34.11-2012 hash function.", kind: "standard" },
    ],
  },
  kupyna: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "DSTU 7564:2014", url: "https://zakon.rada.gov.ua/", note: "Ukrainian national standard for Kupyna hash function.", kind: "standard" },
    ],
  },
  // ─── KDF ─────────────────────────────────────────────────────────
  hkdf: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 5869", url: "https://www.rfc-editor.org/rfc/rfc5869", note: "HMAC-based Extract-and-Expand Key Derivation Function.", kind: "standard" },
    ],
  },
  argon2_kdf: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 9106", url: "https://www.rfc-editor.org/rfc/rfc9106", note: "Argon2 memory-hard function (KDF mode).", kind: "standard" },
    ],
  },
  scrypt_kdf: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 7914", url: "https://www.rfc-editor.org/rfc/rfc7914", note: "scrypt password-based key derivation function.", kind: "standard" },
    ],
  },
  pbkdf2: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 8018", url: "https://www.rfc-editor.org/rfc/rfc8018", note: "PKCS #5 v2.1 — PBKDF2 specification.", kind: "standard" },
      { label: "NIST SP 800-132", url: "https://csrc.nist.gov/pubs/sp/800/132/final", note: "Recommendation for password-based key derivation.", kind: "standard" },
    ],
  },
  balloon: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Boneh et al. 2016", url: "https://eprint.iacr.org/2016/027", note: "Balloon Hashing: provably memory-hard password hashing.", kind: "analysis" },
      { label: "NIST SP 800-63B", url: "https://pages.nist.gov/800-63-3/sp800-63b.html", note: "Digital identity guidelines referencing password hashing.", kind: "standard" },
    ],
  },
  // ─── MAC ─────────────────────────────────────────────────────────
  hmac_sha256: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 2104", url: "https://www.rfc-editor.org/rfc/rfc2104", note: "HMAC: Keyed-Hashing for Message Authentication.", kind: "standard" },
      { label: "NIST FIPS 198-1", url: "https://csrc.nist.gov/pubs/fips/198-1/final", note: "The Keyed-Hash Message Authentication Code.", kind: "standard" },
    ],
  },
  cmac_aes: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST SP 800-38B", url: "https://csrc.nist.gov/pubs/sp/800/38/b/upd1/final", note: "Recommendation for block cipher modes — CMAC.", kind: "standard" },
    ],
  },
  kmac256: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "NIST SP 800-185", url: "https://csrc.nist.gov/pubs/sp/800/185/final", note: "SHA-3 derived functions: cSHAKE, KMAC, TupleHash, ParallelHash.", kind: "standard" },
    ],
  },
  poly1305: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 8439", url: "https://www.rfc-editor.org/rfc/rfc8439", note: "Poly1305 as part of ChaCha20-Poly1305 AEAD.", kind: "standard" },
      { label: "Bernstein 2005", url: "https://cr.yp.to/mac/poly1305-20050329.pdf", note: "Original Poly1305-AES paper.", kind: "analysis" },
    ],
  },
  siphash: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Aumasson & Bernstein 2012", url: "https://www.aumasson.jp/siphash/siphash.pdf", note: "SipHash: a fast short-input PRF.", kind: "analysis" },
    ],
  },
  // ─── Password Hashing ───────────────────────────────────────────
  argon2id: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 9106", url: "https://www.rfc-editor.org/rfc/rfc9106", note: "Primary specification and recommended Argon2id guidance.", kind: "standard" },
      { label: "OWASP Password Storage", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", note: "Deployment-focused tuning recommendations.", kind: "deployment" },
    ],
  },
  bcrypt: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Provos & Mazières 1999", url: "https://www.usenix.org/legacy/events/usenix99/provos/provos.pdf", note: "Original bcrypt paper from OpenBSD.", kind: "analysis" },
    ],
  },
  scrypt_pw: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 7914", url: "https://www.rfc-editor.org/rfc/rfc7914", note: "scrypt password-based key derivation.", kind: "standard" },
    ],
  },
  pbkdf2_pw: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "RFC 8018", url: "https://www.rfc-editor.org/rfc/rfc8018", note: "PKCS #5 v2.1 — PBKDF2 for password storage.", kind: "standard" },
    ],
  },
  balloon_pw: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Boneh et al. 2016", url: "https://eprint.iacr.org/2016/027", note: "Balloon Hashing: provably memory-hard.", kind: "analysis" },
    ],
  },
  // ─── Secret Sharing ─────────────────────────────────────────────
  shamir: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Shamir 1979", url: "https://dl.acm.org/doi/10.1145/359168.359176", note: "How to Share a Secret — original paper.", kind: "analysis" },
    ],
  },
  blakley: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Blakley 1979", url: "https://doi.org/10.1109/AFIPS.1979.98", note: "Safeguarding cryptographic keys (geometric scheme).", kind: "analysis" },
    ],
  },
  feldman_vss: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Feldman 1987", url: "https://doi.org/10.1109/SFCS.1987.4", note: "A practical scheme for non-interactive verifiable secret sharing.", kind: "analysis" },
    ],
  },
  pedersen_vss: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Pedersen 1991", url: "https://doi.org/10.1007/3-540-46766-1_9", note: "Non-interactive and information-theoretic secure verifiable secret sharing.", kind: "analysis" },
    ],
  },
  additive_sharing: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Cramer et al. 2015", url: "https://doi.org/10.1017/CBO9781107337756", note: "Secure Multiparty Computation textbook covering additive sharing.", kind: "analysis" },
    ],
  },
  // ─── Homomorphic Encryption ─────────────────────────────────────
  tfhe: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Chillotti et al. 2020", url: "https://doi.org/10.1007/s00145-019-09319-x", note: "TFHE: Fast Fully Homomorphic Encryption over the Torus.", kind: "analysis" },
      { label: "Zama TFHE-rs", url: "https://github.com/zama-ai/tfhe-rs", note: "Production Rust implementation by Zama.", kind: "deployment" },
    ],
  },
  bgv: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Brakerski et al. 2014", url: "https://doi.org/10.1145/2633600", note: "Leveled FHE without bootstrapping (BGV scheme).", kind: "analysis" },
      { label: "HElib", url: "https://github.com/homenc/HElib", note: "IBM's open-source BGV/CKKS implementation.", kind: "deployment" },
    ],
  },
  bfv: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Fan & Vercauteren 2012", url: "https://eprint.iacr.org/2012/144", note: "Somewhat practical FHE (BFV scheme).", kind: "analysis" },
      { label: "Microsoft SEAL", url: "https://github.com/microsoft/SEAL", note: "Microsoft's BFV/CKKS implementation.", kind: "deployment" },
    ],
  },
  ckks: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Cheon et al. 2017", url: "https://doi.org/10.1007/978-3-319-70694-8_15", note: "Homomorphic encryption for arithmetic of approximate numbers.", kind: "analysis" },
    ],
  },
  // ─── Zero-Knowledge Proofs ──────────────────────────────────────
  groth16: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Groth 2016", url: "https://doi.org/10.1007/978-3-662-49896-5_11", note: "On the Size of Pairing-based Non-interactive Arguments.", kind: "analysis" },
    ],
  },
  plonk: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Gabizon et al. 2019", url: "https://eprint.iacr.org/2019/953", note: "PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge.", kind: "analysis" },
    ],
  },
  zk_stark: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Ben-Sasson et al. 2018", url: "https://eprint.iacr.org/2018/046", note: "Scalable, transparent, and post-quantum secure computational integrity.", kind: "analysis" },
      { label: "StarkWare", url: "https://starkware.co/", note: "Production deployment of STARK technology.", kind: "deployment" },
    ],
  },
  bulletproofs: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Bünz et al. 2018", url: "https://doi.org/10.1109/SP.2018.00020", note: "Bulletproofs: Short Proofs for Confidential Transactions.", kind: "analysis" },
    ],
  },
  // ─── MPC ─────────────────────────────────────────────────────────
  spdz: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Damgård et al. 2012", url: "https://doi.org/10.1007/978-3-642-32009-5_38", note: "Multiparty Computation from Somewhat Homomorphic Encryption.", kind: "analysis" },
      { label: "MP-SPDZ", url: "https://github.com/data61/MP-SPDZ", note: "Multi-protocol framework implementing SPDZ and variants.", kind: "deployment" },
    ],
  },
  aby: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Demmler et al. 2015", url: "https://doi.org/10.14722/ndss.2015.23113", note: "ABY — A Framework for Efficient Mixed-Protocol Secure Two-Party Computation.", kind: "analysis" },
    ],
  },
  garbled_circuits: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Yao 1986", url: "https://doi.org/10.1109/SFCS.1986.25", note: "How to generate and exchange secrets (garbled circuits).", kind: "analysis" },
      { label: "Bellare et al. 2012", url: "https://doi.org/10.1145/2382196.2382279", note: "Foundations of garbled circuits.", kind: "analysis" },
    ],
  },
  sharemind: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Bogdanov et al. 2008", url: "https://doi.org/10.1007/978-3-540-88313-5_13", note: "Sharemind: A Framework for Fast Privacy-Preserving Computations.", kind: "analysis" },
      { label: "Cybernetica", url: "https://sharemind.cyber.ee/", note: "Commercial deployment by Cybernetica.", kind: "deployment" },
    ],
  },
  // ─── OT & PIR ───────────────────────────────────────────────────
  ot_base: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Rabin 1981", url: "https://eprint.iacr.org/2005/187", note: "How to exchange secrets with oblivious transfer.", kind: "analysis" },
      { label: "Naor & Pinkas 2001", url: "https://doi.org/10.1137/S0097539701393835", note: "Efficient oblivious transfer protocols.", kind: "analysis" },
    ],
  },
  ot_extension: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Ishai et al. 2003", url: "https://doi.org/10.1007/978-3-540-45146-4_9", note: "Extending oblivious transfers efficiently.", kind: "analysis" },
    ],
  },
  cpir: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Kushilevitz & Ostrovsky 1997", url: "https://doi.org/10.1109/SFCS.1997.646125", note: "Replication is not needed: Single database, computationally-private information retrieval.", kind: "analysis" },
    ],
  },
  it_pir: {
    lastReviewed: "2026-03-16",
    sources: [
      { label: "Chor et al. 1998", url: "https://doi.org/10.1145/293347.293350", note: "Private information retrieval (information-theoretic).", kind: "analysis" },
    ],
  },
  // ─── Asymmetric ──────────────────────────────────────────────────
  rsa_oaep_2048: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "NIST SP 800-56B Rev 2", url: "https://csrc.nist.gov/pubs/sp/800/56/b/r2/final", note: "Recommendation for Pair-Wise Key-Establishment Schemes Using Integer Factorization Cryptography. Defines RSA security levels.", kind: "standard" },
      { label: "RFC 8017 (PKCS#1 v2.2)", url: "https://www.rfc-editor.org/rfc/rfc8017", note: "RSA Cryptography Specifications including OAEP padding construction.", kind: "standard" },
    ],
  },
  rsa_oaep_4096: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "NIST SP 800-56B Rev 2", url: "https://csrc.nist.gov/pubs/sp/800/56/b/r2/final", note: "RSA key size security levels. 4096-bit RSA provides ~140-bit classical security per Table 2.", kind: "standard" },
      { label: "RFC 8017 (PKCS#1 v2.2)", url: "https://www.rfc-editor.org/rfc/rfc8017", note: "RSA OAEP padding specification.", kind: "standard" },
    ],
  },
  elgamal: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "ElGamal 1985", url: "https://doi.org/10.1109/TIT.1985.1057074", note: "A Public-Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms. IEEE Trans. Inf. Theory, vol. 31, no. 4, pp. 469–472.", kind: "analysis" },
    ],
  },
  ecies_p256: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "ISO/IEC 18033-2", url: "https://www.iso.org/standard/37971.html", note: "Information technology — Security techniques — Encryption algorithms — Part 2: Asymmetric ciphers. Defines ECIES.", kind: "standard" },
      { label: "ANSI X9.63", url: "https://webstore.ansi.org/Standards/ANSI/ANSIX9632001", note: "Public Key Cryptography for the Financial Services Industry: Key Agreement and Key Transport Using Elliptic Curve Cryptography.", kind: "standard" },
    ],
  },
  sm2_enc: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "GB/T 32918.4-2016", url: "https://www.oscca.gov.cn/", note: "SM2 elliptic curve public key encryption algorithm (Chinese national standard).", kind: "standard" },
      { label: "ISO/IEC 14888-3 Amd.1", url: "https://www.iso.org/standard/76382.html", note: "SM2 digital signature algorithm registered with ISO/IEC.", kind: "standard" },
    ],
  },
  // ─── Steganography ───────────────────────────────────────────────
  lsb_stego: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Fridrich, Goljan & Du 2001", url: "https://www.ws.binghamton.edu/fridrich/Research/acm_si.pdf", note: "Reliable Detection of LSB Steganography in Grayscale and Color Images. ACM Workshop on Multimedia and Security 2001.", kind: "analysis" },
    ],
  },
  dct_f5: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Westfeld 2001", url: "https://doi.org/10.1007/3-540-45496-9_21", note: "F5 — A Steganographic Algorithm. Information Hiding 4th International Workshop, LNCS 2137, Springer.", kind: "analysis" },
    ],
  },
  bpcs: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Kawaguchi & Eason 1998", url: "https://doi.org/10.1117/12.335472", note: "Principles and Applications of BPCS-Steganography. SPIE Photonics East, Proc. 3528.", kind: "analysis" },
    ],
  },
  spread_spectrum_stego: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Cox et al. 1997", url: "https://doi.org/10.1109/83.650120", note: "Secure Spread Spectrum Watermarking for Multimedia. IEEE Transactions on Image Processing, vol. 6, no. 12.", kind: "analysis" },
    ],
  },
  wow_stego: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Holub & Fridrich 2012", url: "https://doi.org/10.1109/WIFS.2012.6412576", note: "Designing Steganographic Distortion Using Directional Filters. IEEE Workshop on Information Forensics and Security (WIFS).", kind: "analysis" },
    ],
  },
  // ─── Threshold Signatures ────────────────────────────────────────
  frost: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "RFC 9591", url: "https://www.rfc-editor.org/rfc/rfc9591", note: "The Flexible Round-Optimized Schnorr Threshold (FROST) Protocol. IETF standard, June 2024.", kind: "standard" },
      { label: "Komlo & Goldberg 2020", url: "https://eprint.iacr.org/2020/852", note: "FROST: Flexible Round-Optimized Schnorr Threshold Signatures. Original academic paper.", kind: "analysis" },
    ],
  },
  gg20: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Gennaro & Goldfeder 2020", url: "https://eprint.iacr.org/2020/540", note: "One Round Threshold ECDSA with Identifiable Abort. ACM CCS 2020.", kind: "analysis" },
    ],
  },
  bls_threshold: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Boneh, Lynn & Shacham 2004", url: "https://doi.org/10.1007/s00145-004-0314-9", note: "Short Signatures from the Weil Pairing. Journal of Cryptology vol. 17, pp. 297–319.", kind: "analysis" },
      { label: "IETF BLS Signature draft", url: "https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bls-signature", note: "BLS Signatures specification on BLS12-381 curve.", kind: "standard" },
    ],
  },
  shamir_schnorr: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Stinson & Strobl 2001", url: "https://doi.org/10.1007/3-540-45682-1_30", note: "Provably Secure Distributed Schnorr Signatures and a (t,n) Threshold Scheme for Implicit Certificates. ACISP 2001, LNCS 2119.", kind: "analysis" },
    ],
  },
  dkls23: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Doerner, Kondi, Lee & Shelat 2023", url: "https://eprint.iacr.org/2023/765", note: "Threshold ECDSA in Three Rounds. ePrint 2023/765. IEEE Security & Privacy 2024.", kind: "analysis" },
    ],
  },
  // ─── CSPRNG ──────────────────────────────────────────────────────
  hmac_drbg: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "NIST SP 800-90A Rev 1", url: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "Recommendation for Random Number Generation Using Deterministic Random Bit Generators. HMAC_DRBG construction.", kind: "standard" },
    ],
  },
  ctr_drbg: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "NIST SP 800-90A Rev 1", url: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "CTR_DRBG using AES-256. Performance-optimized NIST-approved DRBG construction.", kind: "standard" },
    ],
  },
  hash_drbg: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "NIST SP 800-90A Rev 1", url: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "Hash_DRBG construction using SHA-256 or SHA-512 as the underlying hash.", kind: "standard" },
    ],
  },
  chacha20_drbg: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "RFC 7539", url: "https://www.rfc-editor.org/rfc/rfc7539", note: "ChaCha20 and Poly1305 for IETF Protocols. Underlying cipher specification for ChaCha20-DRBG.", kind: "standard" },
      { label: "Linux kernel CSPRNG docs", url: "https://www.kernel.org/doc/html/latest/driver-api/random.html", note: "Linux ≥ 5.17 uses ChaCha20-based DRBG as primary kernel CSPRNG.", kind: "deployment" },
    ],
  },
  fortuna: {
    lastReviewed: "2026-04-03",
    sources: [
      { label: "Ferguson & Schneier 2003", url: "https://www.schneier.com/books/practical-cryptography/", note: "Practical Cryptography (Wiley). Chapters 9–10 specify the Fortuna PRNG design with 32 entropy pools.", kind: "analysis" },
      { label: "FreeBSD arc4random / Fortuna", url: "https://man.freebsd.org/cgi/man.cgi?query=random&sektion=4", note: "FreeBSD kernel Fortuna-based CSPRNG implementation documentation.", kind: "deployment" },
    ],
  },
};
