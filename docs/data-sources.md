# Data Sources

Where the algorithm data in crypto::compare comes from.

## Standards Bodies

| Source | Algorithms Covered |
|--------|-------------------|
| **NIST FIPS 180-4** | SHA-256, SHA-512 |
| **NIST FIPS 198-1** | HMAC |
| **NIST FIPS 202** | SHA-3-256 (Keccak) |
| **NIST FIPS 203** | ML-KEM-768, ML-KEM-1024 (Kyber) |
| **NIST FIPS 204** | ML-DSA-44, ML-DSA-65 (Dilithium) |
| **NIST FIPS 205** | SLH-DSA (SPHINCS+) |
| **NIST SP 800-38B** | CMAC-AES |
| **NIST SP 800-132** | PBKDF2 |
| **NIST SP 800-185** | KMAC256 |
| **NIST SP 800-208** | XMSS |
| **IETF RFC 2104** | HMAC |
| **IETF RFC 5869** | HKDF |
| **IETF RFC 7693** | BLAKE2b |
| **IETF RFC 7914** | scrypt |
| **IETF RFC 8391** | XMSS |
| **IETF RFC 8439** | ChaCha20-Poly1305, Poly1305 |
| **IETF RFC 9106** | Argon2 |

## National Standards

| Source | Country | Algorithms |
|--------|---------|-----------|
| **CRYPTREC** | Japan | Camellia-256 |
| **KS X 1213** | South Korea | ARIA-256 |
| **GB/T 32907-2016** | China | SM4 |
| **GB/T 32905-2016** | China | SM3 |
| **GOST R 34.12-2015** | Russia | Kuznyechik |
| **GOST R 34.11-2012** | Russia | Streebog |
| **DSTU 7564:2014** | Ukraine | Kupyna-256 |
| **ISO/IEC 18033-3** | International | Camellia, SM4 |
| **ISO/IEC 10118-3** | International | SM3 |

## Competition Submissions

| Source | Algorithms |
|--------|-----------|
| **KPQC Round 2** | SMAUG-T, HAETAE |
| **NIST PQC Round 4** | Classic McEliece, BIKE |
| **NIST PQC Selected** | HQC, FALCON |
| **Password Hashing Competition (2015)** | Argon2 |

## Research Papers

| Topic | Key References |
|-------|---------------|
| Homomorphic Encryption (TFHE) | Chillotti et al., "TFHE: Fast Fully Homomorphic Encryption over the Torus" |
| Homomorphic Encryption (BGV) | Brakerski, Gentry, Vaikuntanathan, 2012 |
| Homomorphic Encryption (BFV) | Brakerski; Fan & Vercauteren |
| Homomorphic Encryption (CKKS) | Cheon, Kim, Kim, Song, 2017 |
| zk-SNARKs (Groth16) | Groth, "On the Size of Pairing-Based Non-Interactive Arguments," Eurocrypt 2016 |
| zk-SNARKs (PLONK) | Gabizon, Williamson, Ciobotaru, 2019 |
| zk-STARKs | Ben-Sasson et al., 2018 |
| Bulletproofs | Bünz, Bootle et al., 2018 |
| MPC (SPDZ) | Damgård, Pastro, Smart, Zakarias, 2012 |
| MPC (ABY) | Demmler, Schneider, Zohner, TU Darmstadt, 2015 |
| MPC (Sharemind) | Bogdanov et al., Cybernetica |
| Garbled Circuits | Yao, 1986 |
| Oblivious Transfer | Rabin, 1981; Ishai, Kilian, Nissim, Petrank (IKNP), 2003 |
| Private Information Retrieval | Chor, Goldreich, Kushilevitz, Sudan, 1995 |
| Balloon Hashing | Boneh, Corrigan-Gibbs, Schechter, Stanford |
| SipHash | Aumasson, Bernstein |
| BLAKE3 | O'Connor, Aumasson, Neves, Wilcox-O'Hearn |
| FrodoKEM | Alkim, Bos et al., Microsoft Research / CWI |

## Security Estimates

Bit-security estimates reflect the best publicly known attacks as of early 2025. These are drawn from:

- NIST Post-Quantum Cryptography standardization reports
- The Lattice Estimator (for lattice-based schemes)
- Published cryptanalysis in IACR ePrint, Eurocrypt, CRYPTO, and Asiacrypt proceedings

Estimates for candidate schemes (SMAUG-T, HAETAE, BIKE, etc.) are preliminary and subject to revision as cryptanalysis continues.

## Trust Notes

Two algorithms carry explicit trust caveats in the tool:

- **Kuznyechik** (Russia) — S-box derivation method was not disclosed by the FSB. Perrin & Udovenko (2016) published a decomposition of the S-box structure. No direct break, but the opaque design process is a transparency concern.
- **Streebog** (Russia) — Same S-box transparency concern as Kuznyechik.

These caveats are noted in each algorithm's description within the tool.
