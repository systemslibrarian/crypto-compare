import type { AlgorithmSource } from "@/types/crypto";

// `lastReviewed` records the last date each algorithm's claims and citations
// were re-verified against primary sources (standards bodies + peer-reviewed
// literature). On 2026-09-17 all 100 entries were re-verified in a single pass,
// so they share that date — a genuine source-verification stamp, not an expert
// cryptographic sign-off (see the /about page). The data-freshness workflow
// flags the date once it is older than 120 days.
export const ALGORITHM_PROVENANCE: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }> = {
  // ─── Symmetric ───────────────────────────────────────────────────
  aes256gcm: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 197", url: "https://csrc.nist.gov/pubs/fips/197/final", note: "AES block cipher specification.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-38D", url: "https://csrc.nist.gov/pubs/sp/800/38/d/final", note: "GCM construction, authenticated-encryption limits, and IV requirements.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 5–8" },
    ],
  },
  chacha20poly: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8439", url: "https://www.rfc-editor.org/rfc/rfc8439", note: "Specifies the ChaCha20-Poly1305 AEAD construction, nonce requirements, and security considerations.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 2.8 and 4" },
    ],
  },
  xchacha20poly: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "libsodium docs", url: "https://doc.libsodium.org/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction", note: "Nonce-extension construction used in major implementations.", kind: "deployment", supports: ["deployment", "implementation"] },
      { label: "Expired IRTF draft", url: "https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha", note: "The archived draft specifies XChaCha20-Poly1305 but is explicitly expired, has no formal IETF standing, and is classified by the Datatracker as a dead IRTF document.", kind: "analysis", supports: ["specification", "standardization"] },
    ],
  },
  ascon_aead128: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-232", url: "https://csrc.nist.gov/pubs/sp/800/232/final", note: "Final August 2025 standard defining Ascon-AEAD128, its requirements, and its security properties for constrained devices.", kind: "standard", supports: ["specification", "standardization", "security", "implementation"], locator: "Sections 1 and 4; Appendix A" },
    ],
  },
  camellia256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 3713", url: "https://www.rfc-editor.org/rfc/rfc3713", note: "Camellia cipher specification.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "CRYPTREC", url: "https://www.cryptrec.go.jp/en/method.html", note: "Recommended by Japanese government cryptographic evaluation.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  aria256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 5794", url: "https://www.rfc-editor.org/rfc/rfc5794", note: "ARIA cipher specification.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "KS X 1213", url: "https://www.kats.go.kr/", note: "Korean national standard for block cipher.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  sm4: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "GB/T 32907-2016", url: "https://www.oscca.gov.cn/", note: "Chinese national standard for SM4 block cipher.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 8998", url: "https://www.rfc-editor.org/rfc/rfc8998", note: "ShangMi cipher suites for TLS 1.3.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  kuznyechik: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "GOST R 34.12-2015", url: "https://tc26.ru/", note: "Russian national standard defining Kuznyechik block cipher.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 7801", url: "https://www.rfc-editor.org/rfc/rfc7801", note: "GOST R 34.12-2015 block cipher (Kuznyechik).", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  snow_v: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "ISO/IEC 18033-4", url: "https://www.iso.org/standard/54531.html", note: "Family context only: this international standard covers SNOW 2.0, not SNOW-V.", kind: "standard", supports: ["deployment"] },
      { label: "SNOW-V specification", url: "https://eprint.iacr.org/2018/1143", note: "Johansson & Yang's SNOW-V design paper and specification.", kind: "analysis", supports: ["specification", "security"] },
      { label: "3GPP specifications", url: "https://www.3gpp.org/specifications", note: "Family context only: 3GPP standardized SNOW 3G. SNOW-V is a separate design and is not represented here as a 3GPP standard.", kind: "standard", supports: ["deployment"] },
    ],
  },
  aes256gcmsiv: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8452", url: "https://www.rfc-editor.org/rfc/rfc8452", note: "Defines AES-GCM-SIV and its nonce-misuse-resistant security properties and limits.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 3–8" },
      { label: "Gueron & Lindell 2015", url: "https://eprint.iacr.org/2015/102", note: "AES-GCM-SIV construction and security analysis.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Elliptic Curves ────────────────────────────────────────────
  curve25519: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 7748", url: "https://www.rfc-editor.org/rfc/rfc7748", note: "Defines X25519 and X448, including functions, test vectors, and security considerations.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 5–7" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Curve25519 is one of the SafeCurves project's canonical modern curve designs.", kind: "analysis", supports: ["security"] },
    ],
  },
  ed25519: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8032", url: "https://www.rfc-editor.org/rfc/rfc8032", note: "Defines Ed25519 and Ed448, including algorithms, test vectors, and security considerations.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 5, 7, and 8" },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Edwards25519 is covered in the SafeCurves project discussion of safer modern curves.", kind: "analysis", supports: ["security"] },
    ],
  },
  p256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-186", url: "https://csrc.nist.gov/pubs/sp/800/186/final", note: "NIST elliptic-curve domain parameters including P-256.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-57 Part 1 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Security-strength mapping assigning 128-bit strength to 256-bit ECC.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes NIST P-256 in the SafeCurves comparison framework.", kind: "analysis", supports: ["security"] },
    ],
  },
  p384: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-186", url: "https://csrc.nist.gov/pubs/sp/800/186/final", note: "NIST elliptic-curve domain parameters including P-384.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-57 Part 1 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Security-strength mapping assigning 192-bit strength to 384-bit ECC.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes NIST P-384 in the SafeCurves comparison framework.", kind: "analysis", supports: ["security"] },
    ],
  },
  p521: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-186", url: "https://csrc.nist.gov/pubs/sp/800/186/final", note: "NIST elliptic-curve domain parameters including P-521.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-57 Part 1 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Security-strength mapping assigning 256-bit strength to 512-bit-and-above ECC.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes NIST P-521 in the SafeCurves comparison framework.", kind: "analysis", supports: ["security"] },
    ],
  },
  secp256k1: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "SEC 2 v2.0", url: "https://www.secg.org/sec2-v2.pdf", note: "SECG domain parameters for secp256k1.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "SafeCurves", url: "https://safecurves.cr.yp.to/", note: "Includes secp256k1 in the SafeCurves comparison framework.", kind: "analysis", supports: ["security"] },
    ],
  },
  curve448_ed448: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 7748", url: "https://www.rfc-editor.org/rfc/rfc7748", note: "Defines X448 and positions the 448-bit family as roughly 224-bit classical security.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 8032", url: "https://www.rfc-editor.org/rfc/rfc8032", note: "Defines Ed448 in the EdDSA family.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  bls12_381_curve: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Pairing-Friendly Curves draft", url: "https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves", note: "CFRG draft describing BLS12-381 as a pairing-friendly curve designed for approximately 128-bit security.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 9380", url: "https://www.rfc-editor.org/rfc/rfc9380", note: "Hashing to elliptic curves, including BLS12-381 suites used in deployed systems.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  bn254: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Kim & Barbulescu 2016", url: "https://doi.org/10.1007/978-3-662-53018-4_20", note: "Extended Tower Number Field Sieve, CRYPTO 2016. Basis for the reduced (~100-bit) security estimate applied to BN254/alt_bn128.", kind: "analysis", supports: ["security"] },
    ],
  },
  brainpool_p256r1: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 5639", url: "https://www.rfc-editor.org/rfc/rfc5639", note: "Elliptic Curve Cryptography (ECC) Brainpool Standard Curves and Curve Generation.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  // ─── KEM ─────────────────────────────────────────────────────────
  mlkem512: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 203", url: "https://csrc.nist.gov/pubs/fips/203/final", note: "Defines ML-KEM-512 at NIST security category 1 with an 800-byte encapsulation key and 768-byte ciphertext.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 7 and 8" },
    ],
  },
  mlkem768: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 203", url: "https://csrc.nist.gov/pubs/fips/203/final", note: "Defines ML-KEM parameter sets, including ML-KEM-768 at NIST security category 3.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 7 and 8" },
      { label: "NIST PQC Project", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "Selection and deployment context for PQ KEM transition.", kind: "analysis", supports: ["security"] },
    ],
  },
  mlkem1024: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 203", url: "https://csrc.nist.gov/pubs/fips/203/final", note: "Defines ML-KEM-1024 at NIST security category 5; the category is not an exact PQ bit-strength claim.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 7 and 8" },
    ],
  },
  smaug_t: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "KpqC selection (SMAUG-T)", url: "https://kpqc.cryptolab.co.kr/smaug-t", note: "SMAUG-T selected as a KpqC KEM winner (Jan 2025); security based on Module-LWE + Module-LWR with sparse secrets. Korean draft standard expected 2026.", kind: "analysis", supports: ["security"] },
    ],
  },
  hqc: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST IR 8545 (HQC selection)", url: "https://csrc.nist.gov/pubs/ir/8545/final", note: "NIST selected HQC (March 2025) as its code-based KEM; draft FIPS expected 2026, final ~2027 (no FIPS number assigned yet).", kind: "standard", supports: ["specification", "standardization"] },
      { label: "HQC Specification", url: "https://pqc-hqc.org/", note: "Official HQC submission documentation.", kind: "analysis", supports: ["security"] },
    ],
  },
  classic_mceliece: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST IR 8545 (4th round report)", url: "https://csrc.nist.gov/pubs/ir/8545/final", note: "NIST 4th round concluded (2025): Classic McEliece not selected; NIST pointed to the ISO/IEC 18033-2 standardization track instead.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "Classic McEliece site", url: "https://classic.mceliece.org/", note: "Specification and reference implementation.", kind: "analysis", supports: ["security"] },
    ],
  },
  frodokem: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "FrodoKEM specification", url: "https://frodokem.org/", note: "Conservative lattice-based KEM using standard LWE.", kind: "analysis", supports: ["security"] },
      { label: "ISO/IEC 18033-2 (Amd. 2)", url: "https://www.iso.org/standard/37971.html", note: "FrodoKEM being added to ISO/IEC 18033-2 (asymmetric ciphers) as Amendment 2.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  bike: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST IR 8545 (4th round report)", url: "https://csrc.nist.gov/pubs/ir/8545/final", note: "NIST's final fourth-round report documents BIKE's construction and security analysis and records that only HQC was selected for standardization.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 3 and 5" },
    ],
  },
  // ─── Signature ───────────────────────────────────────────────────
  mldsa44: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 204", url: "https://csrc.nist.gov/pubs/fips/204/final", note: "Defines ML-DSA-44 at NIST security category 2; the category is not an exact PQ bit-strength claim.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 5–7" },
    ],
  },
  mldsa65: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 204", url: "https://csrc.nist.gov/pubs/fips/204/final", note: "Defines ML-DSA parameter sets, security categories, and signature sizes.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 5–7" },
    ],
  },
  mldsa87: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 204", url: "https://csrc.nist.gov/pubs/fips/204/final", note: "Defines ML-DSA-87 at NIST security category 5 with a 2,592-byte public key and 4,627-byte signature.", kind: "standard", supports: ["specification", "standardization", "security"], locator: "Sections 5–7" },
    ],
  },
  haetae: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "KpqC selection (HAETAE)", url: "https://kpqc.cryptolab.co.kr/", note: "HAETAE selected as a KpqC signature winner (Jan 2025); on the Korean Industrial Standard track.", kind: "analysis", supports: ["security"] },
    ],
  },
  falcon512: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 206 (draft)", url: "https://csrc.nist.gov/projects/post-quantum-cryptography", note: "FALCON selected for NIST standardization (compact signatures).", kind: "standard", supports: ["specification", "standardization"] },
      { label: "FALCON specification", url: "https://falcon-sign.info/", note: "Official specification and analysis.", kind: "analysis", supports: ["security"] },
    ],
  },
  slh_dsa: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 205", url: "https://csrc.nist.gov/pubs/fips/205/final", note: "Stateless hash-based signature standard (SPHINCS+ based).", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  xmss: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8391", url: "https://www.rfc-editor.org/rfc/rfc8391", note: "XMSS: eXtended Merkle Signature Scheme.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-208", url: "https://csrc.nist.gov/pubs/sp/800/208/final", note: "Recommendation for stateful hash-based signature schemes.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  lms_hss: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8554", url: "https://www.rfc-editor.org/rfc/rfc8554", note: "Leighton-Micali Hash-Based Signatures (LMS) specification.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-208", url: "https://csrc.nist.gov/pubs/sp/800/208/final", note: "Recommendation for stateful hash-based signature schemes (LMS and XMSS).", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NSA CNSA 2.0 announcement", url: "https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/3148990/announcing-the-commercial-national-security-algorithm-suite-20/", note: "NSA's CNSA 2.0 announcement provides policy context for LMS in software and firmware signing. It does not imply that every HSS profile is approved; current NSA policy must be checked for the deployment at issue.", kind: "standard", supports: ["standardization", "deployment"] },
    ],
  },
  // ─── Hash ────────────────────────────────────────────────────────
  sha256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 180-4", url: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", note: "SHA-2 family specification.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  sha512: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 180-4", url: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", note: "SHA-512 from the SHA-2 family.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  sha3_256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST FIPS 202", url: "https://csrc.nist.gov/pubs/fips/202/final", note: "SHA-3 standard based on Keccak sponge construction.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  blake2b: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 7693", url: "https://www.rfc-editor.org/rfc/rfc7693", note: "BLAKE2 cryptographic hash and MAC.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  blake3: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "BLAKE3 specification", url: "https://github.com/BLAKE3-team/BLAKE3-specs/blob/master/blake3.pdf", note: "BLAKE3 paper and specification.", kind: "analysis", supports: ["security"] },
    ],
  },
  sm3: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "GB/T 32905-2016", url: "https://www.oscca.gov.cn/", note: "Chinese national standard for SM3 hash function.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 8998", url: "https://www.rfc-editor.org/rfc/rfc8998", note: "SM3 usage in TLS 1.3 cipher suites.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  streebog: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "GOST R 34.11-2012", url: "https://tc26.ru/", note: "Russian national standard defining Streebog hash function.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 6986", url: "https://www.rfc-editor.org/rfc/rfc6986", note: "GOST R 34.11-2012 hash function.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  kupyna: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Kupyna (DSTU 7564:2014)", url: "https://eprint.iacr.org/2015/956", note: "Oliynykov et al. — specification and analysis of the Kupyna hash function, the Ukrainian national standard DSTU 7564:2014.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── KDF ─────────────────────────────────────────────────────────
  hkdf: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 5869", url: "https://www.rfc-editor.org/rfc/rfc5869", note: "HMAC-based Extract-and-Expand Key Derivation Function.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  argon2_kdf: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 9106", url: "https://www.rfc-editor.org/rfc/rfc9106", note: "Defines Argon2 and its memory-hard parameter and variant guidance.", kind: "standard", supports: ["specification", "standardization", "security", "performance"], locator: "Sections 3, 4, and 7" },
    ],
  },
  scrypt_kdf: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 7914", url: "https://www.rfc-editor.org/rfc/rfc7914", note: "scrypt password-based key derivation function.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  pbkdf2: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8018", url: "https://www.rfc-editor.org/rfc/rfc8018", note: "PKCS #5 v2.1 — PBKDF2 specification.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST SP 800-132", url: "https://csrc.nist.gov/pubs/sp/800/132/final", note: "Recommendation for password-based key derivation.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  balloon: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Boneh et al. 2016", url: "https://eprint.iacr.org/2016/027", note: "Balloon Hashing: provably memory-hard password hashing.", kind: "analysis", supports: ["security"] },
      { label: "NIST SP 800-63B-4", url: "https://pages.nist.gov/800-63-4/sp800-63b.html", note: "Current digital-identity guidance for password-verifier storage. It supplies password-hashing context, not a Balloon Hashing standardization claim.", kind: "standard", supports: ["deployment"] },
    ],
  },
  // ─── MAC ─────────────────────────────────────────────────────────
  hmac_sha256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 2104", url: "https://www.rfc-editor.org/rfc/rfc2104", note: "HMAC: Keyed-Hashing for Message Authentication.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "NIST FIPS 198-1", url: "https://csrc.nist.gov/pubs/fips/198-1/final", note: "The Keyed-Hash Message Authentication Code.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  cmac_aes: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-38B", url: "https://csrc.nist.gov/pubs/sp/800/38/b/upd1/final", note: "Recommendation for block cipher modes — CMAC.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  kmac256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-185", url: "https://csrc.nist.gov/pubs/sp/800/185/final", note: "SHA-3 derived functions: cSHAKE, KMAC, TupleHash, ParallelHash.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  poly1305: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8439", url: "https://www.rfc-editor.org/rfc/rfc8439", note: "Poly1305 as part of ChaCha20-Poly1305 AEAD.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "Bernstein 2005", url: "https://cr.yp.to/mac/poly1305-20050329.pdf", note: "Original Poly1305-AES paper.", kind: "analysis", supports: ["security"] },
    ],
  },
  siphash: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Aumasson & Bernstein 2012", url: "https://www.aumasson.jp/siphash/siphash.pdf", note: "SipHash: a fast short-input PRF.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Password Hashing ───────────────────────────────────────────
  argon2id: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 9106", url: "https://www.rfc-editor.org/rfc/rfc9106", note: "Primary specification and parameter guidance for Argon2id.", kind: "standard", supports: ["specification", "standardization", "security", "performance"], locator: "Sections 3, 4, and 7" },
      { label: "OWASP Password Storage", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", note: "Deployment-focused tuning recommendations.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  bcrypt: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Provos & Mazières 1999", url: "https://www.usenix.org/legacy/events/usenix99/provos/provos.pdf", note: "Original bcrypt paper from OpenBSD.", kind: "analysis", supports: ["security"] },
    ],
  },
  scrypt_pw: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 7914", url: "https://www.rfc-editor.org/rfc/rfc7914", note: "scrypt password-based key derivation.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  pbkdf2_pw: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8018", url: "https://www.rfc-editor.org/rfc/rfc8018", note: "PKCS #5 v2.1 — PBKDF2 for password storage.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  balloon_pw: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Boneh et al. 2016", url: "https://eprint.iacr.org/2016/027", note: "Balloon Hashing: provably memory-hard.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Secret Sharing ─────────────────────────────────────────────
  shamir: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Shamir 1979", url: "https://dl.acm.org/doi/10.1145/359168.359176", note: "How to Share a Secret — original paper.", kind: "analysis", supports: ["security"] },
    ],
  },
  blakley: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Blakley 1979", url: "https://doi.org/10.1109/AFIPS.1979.98", note: "Safeguarding cryptographic keys (geometric scheme).", kind: "analysis", supports: ["security"] },
    ],
  },
  feldman_vss: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Feldman 1987", url: "https://doi.org/10.1109/SFCS.1987.4", note: "A practical scheme for non-interactive verifiable secret sharing.", kind: "analysis", supports: ["security"] },
    ],
  },
  pedersen_vss: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Pedersen 1991", url: "https://doi.org/10.1007/3-540-46766-1_9", note: "Non-interactive and information-theoretic secure verifiable secret sharing.", kind: "analysis", supports: ["security"] },
    ],
  },
  additive_sharing: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Cramer et al. 2015", url: "https://doi.org/10.1017/CBO9781107337756", note: "Secure Multiparty Computation textbook covering additive sharing.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Homomorphic Encryption ─────────────────────────────────────
  tfhe: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Chillotti et al. 2020", url: "https://doi.org/10.1007/s00145-019-09319-x", note: "TFHE: Fast Fully Homomorphic Encryption over the Torus.", kind: "analysis", supports: ["security"] },
      { label: "Zama TFHE-rs", url: "https://github.com/zama-ai/tfhe-rs", note: "Production Rust implementation by Zama.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  bgv: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Brakerski et al. 2014", url: "https://doi.org/10.1145/2633600", note: "Leveled FHE without bootstrapping (BGV scheme).", kind: "analysis", supports: ["security"] },
      { label: "HElib", url: "https://github.com/homenc/HElib", note: "IBM's open-source BGV/CKKS implementation.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  bfv: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Fan & Vercauteren 2012", url: "https://eprint.iacr.org/2012/144", note: "Somewhat practical FHE (BFV scheme).", kind: "analysis", supports: ["security"] },
      { label: "Microsoft SEAL", url: "https://github.com/microsoft/SEAL", note: "Microsoft's BFV/CKKS implementation.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  ckks: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Cheon et al. 2017", url: "https://doi.org/10.1007/978-3-319-70694-8_15", note: "Homomorphic encryption for arithmetic of approximate numbers.", kind: "analysis", supports: ["security"] },
      { label: "Li & Micciancio 2021", url: "https://eprint.iacr.org/2020/1533", note: "IND-CPA-D key-recovery attack on approximate-number FHE (CKKS) when decryption results are shared; motivates noise-flooding mitigations.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Zero-Knowledge Proofs ──────────────────────────────────────
  groth16: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Groth 2016", url: "https://doi.org/10.1007/978-3-662-49896-5_11", note: "On the Size of Pairing-based Non-interactive Arguments.", kind: "analysis", supports: ["security"] },
    ],
  },
  plonk: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Gabizon et al. 2019", url: "https://eprint.iacr.org/2019/953", note: "PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge.", kind: "analysis", supports: ["security"] },
    ],
  },
  zk_stark: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Ben-Sasson et al. 2018", url: "https://eprint.iacr.org/2018/046", note: "Scalable, transparent, and post-quantum secure computational integrity.", kind: "analysis", supports: ["security"] },
      { label: "StarkWare", url: "https://starkware.co/", note: "Production deployment of STARK technology.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  bulletproofs: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Bünz et al. 2018", url: "https://doi.org/10.1109/SP.2018.00020", note: "Bulletproofs: Short Proofs for Confidential Transactions.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── MPC ─────────────────────────────────────────────────────────
  spdz: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Damgård et al. 2012", url: "https://doi.org/10.1007/978-3-642-32009-5_38", note: "Multiparty Computation from Somewhat Homomorphic Encryption.", kind: "analysis", supports: ["security"] },
      { label: "MP-SPDZ", url: "https://github.com/data61/MP-SPDZ", note: "Multi-protocol framework implementing SPDZ and variants.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  aby: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Demmler et al. 2015", url: "https://doi.org/10.14722/ndss.2015.23113", note: "ABY — A Framework for Efficient Mixed-Protocol Secure Two-Party Computation.", kind: "analysis", supports: ["security"] },
    ],
  },
  garbled_circuits: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Yao 1986", url: "https://doi.org/10.1109/SFCS.1986.25", note: "How to generate and exchange secrets (garbled circuits).", kind: "analysis", supports: ["security"] },
      { label: "Bellare et al. 2012", url: "https://doi.org/10.1145/2382196.2382279", note: "Foundations of garbled circuits.", kind: "analysis", supports: ["security"] },
    ],
  },
  sharemind: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Bogdanov et al. 2008", url: "https://doi.org/10.1007/978-3-540-88313-5_13", note: "Sharemind: A Framework for Fast Privacy-Preserving Computations.", kind: "analysis", supports: ["security"] },
      { label: "Cybernetica", url: "https://sharemind.cyber.ee/", note: "Commercial deployment by Cybernetica.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  // ─── OT & PIR ───────────────────────────────────────────────────
  ot_base: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Rabin 1981", url: "https://eprint.iacr.org/2005/187", note: "How to exchange secrets with oblivious transfer.", kind: "analysis", supports: ["security"] },
      { label: "Naor & Pinkas 2001", url: "https://dl.acm.org/doi/10.5555/365411.365502", note: "Efficient Oblivious Transfer Protocols, SODA 2001.", kind: "analysis", supports: ["security"] },
    ],
  },
  ot_extension: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Ishai et al. 2003", url: "https://doi.org/10.1007/978-3-540-45146-4_9", note: "Extending oblivious transfers efficiently.", kind: "analysis", supports: ["security"] },
    ],
  },
  cpir: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Kushilevitz & Ostrovsky 1997", url: "https://doi.org/10.1109/SFCS.1997.646125", note: "Replication is not needed: Single database, computationally-private information retrieval.", kind: "analysis", supports: ["security"] },
    ],
  },
  it_pir: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Chor et al. 1998", url: "https://doi.org/10.1145/293347.293350", note: "Private information retrieval (information-theoretic).", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Asymmetric ──────────────────────────────────────────────────
  rsa_oaep_2048: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-56B Rev 2", url: "https://csrc.nist.gov/pubs/sp/800/56/b/r2/final", note: "Recommendation for Pair-Wise Key-Establishment Schemes Using Integer Factorization Cryptography. Defines RSA security levels.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 8017 (PKCS#1 v2.2)", url: "https://www.rfc-editor.org/rfc/rfc8017", note: "RSA Cryptography Specifications including OAEP padding construction.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  rsa_oaep_4096: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-56B Rev 2", url: "https://csrc.nist.gov/pubs/sp/800/56/b/r2/final", note: "RSA key size security levels. 4096-bit RSA provides ~140-bit classical security per Table 2.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "RFC 8017 (PKCS#1 v2.2)", url: "https://www.rfc-editor.org/rfc/rfc8017", note: "RSA OAEP padding specification.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  elgamal: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "ElGamal 1985", url: "https://doi.org/10.1109/TIT.1985.1057074", note: "A Public-Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms. IEEE Trans. Inf. Theory, vol. 31, no. 4, pp. 469–472.", kind: "analysis", supports: ["security"] },
    ],
  },
  ecies_p256: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "ISO/IEC 18033-2", url: "https://www.iso.org/standard/37971.html", note: "Information technology — Security techniques — Encryption algorithms — Part 2: Asymmetric ciphers. Defines ECIES.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "ANSI X9.63", url: "https://webstore.ansi.org/Standards/ANSI/ANSIX9632001", note: "Public Key Cryptography for the Financial Services Industry: Key Agreement and Key Transport Using Elliptic Curve Cryptography.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  sm2_enc: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "GB/T 32918.4-2016", url: "https://www.oscca.gov.cn/", note: "SM2 elliptic curve public key encryption algorithm (Chinese national standard).", kind: "standard", supports: ["specification", "standardization"] },
      { label: "ISO/IEC 14888-3 Amd.1", url: "https://www.iso.org/standard/76382.html", note: "Registers the SM2 *signature* algorithm with ISO/IEC. The SM2 public-key encryption scheme here is standardized by GB/T 32918.4, not ISO/IEC 14888-3.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  // ─── Steganography ───────────────────────────────────────────────
  lsb_stego: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Fridrich, Goljan & Du 2001", url: "https://dl.acm.org/doi/10.1145/1232454.1232466", note: "Reliable Detection of LSB Steganography in Color and Grayscale Images. ACM Workshop on Multimedia and Security 2001.", kind: "analysis", supports: ["security"] },
    ],
  },
  dct_f5: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Westfeld 2001", url: "https://doi.org/10.1007/3-540-45496-9_21", note: "F5 — A Steganographic Algorithm. Information Hiding 4th International Workshop, LNCS 2137, Springer.", kind: "analysis", supports: ["security"] },
    ],
  },
  bpcs: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Kawaguchi & Eason 1998", url: "https://doi.org/10.1117/12.337436", note: "Principles and Applications of BPCS-Steganography. SPIE Photonics East, Proc. 3528.", kind: "analysis", supports: ["security"] },
    ],
  },
  spread_spectrum_stego: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Cox et al. 1997", url: "https://doi.org/10.1109/83.650120", note: "Secure Spread Spectrum Watermarking for Multimedia. IEEE Transactions on Image Processing, vol. 6, no. 12.", kind: "analysis", supports: ["security"] },
    ],
  },
  wow_stego: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Holub & Fridrich 2012", url: "https://doi.org/10.1109/WIFS.2012.6412655", note: "Designing Steganographic Distortion Using Directional Filters. IEEE Workshop on Information Forensics and Security (WIFS).", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── Threshold Signatures ────────────────────────────────────────
  frost: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 9591", url: "https://www.rfc-editor.org/rfc/rfc9591", note: "The Flexible Round-Optimized Schnorr Threshold (FROST) Protocol. IETF standard, June 2024.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "Komlo & Goldberg 2020", url: "https://eprint.iacr.org/2020/852", note: "FROST: Flexible Round-Optimized Schnorr Threshold Signatures. Original academic paper.", kind: "analysis", supports: ["security"] },
    ],
  },
  gg20: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Gennaro & Goldfeder 2020", url: "https://eprint.iacr.org/2020/540", note: "One Round Threshold ECDSA with Identifiable Abort. ACM CCS 2020.", kind: "analysis", supports: ["security"] },
    ],
  },
  bls_threshold: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Boneh, Lynn & Shacham 2004", url: "https://doi.org/10.1007/s00145-004-0314-9", note: "Short Signatures from the Weil Pairing. Journal of Cryptology vol. 17, pp. 297–319.", kind: "analysis", supports: ["security"] },
      { label: "IETF BLS Signature draft", url: "https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bls-signature", note: "BLS Signatures specification on BLS12-381 curve.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  shamir_schnorr: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Stinson & Strobl 2001", url: "https://doi.org/10.1007/3-540-45682-1_30", note: "Provably Secure Distributed Schnorr Signatures and a (t,n) Threshold Scheme for Implicit Certificates. ACISP 2001, LNCS 2119.", kind: "analysis", supports: ["security"] },
    ],
  },
  dkls23: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Doerner, Kondi, Lee & Shelat 2023", url: "https://eprint.iacr.org/2023/765", note: "Threshold ECDSA in Three Rounds. ePrint 2023/765. IEEE Security & Privacy 2024.", kind: "analysis", supports: ["security"] },
    ],
  },
  // ─── CSPRNG ──────────────────────────────────────────────────────
  hmac_drbg: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-90A Rev 1", url: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "Recommendation for Random Number Generation Using Deterministic Random Bit Generators. HMAC_DRBG construction.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  ctr_drbg: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-90A Rev 1", url: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "CTR_DRBG using AES-256. Performance-optimized NIST-approved DRBG construction.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  hash_drbg: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "NIST SP 800-90A Rev 1", url: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "Hash_DRBG construction using SHA-256 or SHA-512 as the underlying hash.", kind: "standard", supports: ["specification", "standardization"] },
    ],
  },
  chacha20_drbg: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "RFC 8439", url: "https://www.rfc-editor.org/rfc/rfc8439", note: "ChaCha20 and Poly1305 for IETF Protocols (obsoletes RFC 7539). Underlying cipher specification for ChaCha20-DRBG.", kind: "standard", supports: ["specification", "standardization"] },
      { label: "Linux random(7)", url: "https://man7.org/linux/man-pages/man7/random.7.html", note: "Linux CSPRNG overview; /dev/urandom output generation uses a ChaCha20-based construction.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
  fortuna: {
    lastReviewed: "2026-09-17",
    sources: [
      { label: "Ferguson & Schneier 2003", url: "https://www.schneier.com/books/practical-cryptography/", note: "Practical Cryptography (Wiley). Chapters 9–10 specify the Fortuna PRNG design with 32 entropy pools.", kind: "analysis", supports: ["security"] },
      { label: "FreeBSD arc4random / Fortuna", url: "https://man.freebsd.org/cgi/man.cgi?query=random&sektion=4", note: "FreeBSD kernel Fortuna-based CSPRNG implementation documentation.", kind: "deployment", supports: ["deployment", "implementation"] },
    ],
  },
};
