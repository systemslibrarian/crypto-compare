export type DemoResource = {
  title: string;
  url: string;
  note: string;
};

export const ALGORITHM_DEMOS: Record<string, DemoResource[]> = {
  aes256gcm: [
    {
      title: "AES Modes",
      url: "https://systemslibrarian.github.io/crypto-lab-aes-modes/",
      note: "Compares ECB, CBC, CTR, GCM, and CCM with attack demos and mode visualizations.",
    },
    {
      title: "Format Ward",
      url: "https://systemslibrarian.github.io/crypto-lab-format-ward/",
      note: "Format-preserving encryption playground for structured fields and tokens.",
    },
    {
      title: "Iron Serpent",
      url: "https://systemslibrarian.github.io/crypto-lab-iron-serpent/",
      note: "Applied symmetric-encryption lab for key/nonce discipline in real workflows.",
    },
    {
      title: "World Ciphers",
      url: "https://systemslibrarian.github.io/crypto-lab-world-ciphers/",
      note: "Cipher family comparison with design and deployment tradeoff context.",
    },
    {
      title: "Biham Lens",
      url: "https://systemslibrarian.github.io/crypto-lab-biham-lens/",
      note: "Classical cryptanalysis intuition builder for block-cipher style systems.",
    },
    {
      title: "Padding Oracle",
      url: "https://systemslibrarian.github.io/crypto-lab-padding-oracle/",
      note: "Shows why authenticated encryption closes oracle-style decryption side channels.",
    },
    {
      title: "Dead Sea Cipher",
      url: "https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/",
      note: "Historical cipher lab for context on modern symmetric design goals.",
    },
  ],
  chacha20poly: [
    {
      title: "ChaCha20 Stream",
      url: "https://systemslibrarian.github.io/crypto-lab-chacha20-stream/",
      note: "Quarter-round stepper, keystream visualizer, nonce-reuse demo, and encrypt/decrypt playground.",
    },
    {
      title: "Nonce Guard",
      url: "https://systemslibrarian.github.io/crypto-lab-nonce-guard/",
      note: "Demonstrates nonce-misuse failures and how modern AEAD usage avoids them.",
    },
  ],
  xchacha20poly: [
    {
      title: "ChaCha20 Stream",
      url: "https://systemslibrarian.github.io/crypto-lab-chacha20-stream/",
      note: "Quarter-round stepper, keystream visualizer, nonce-reuse demo, and encrypt/decrypt playground.",
    },
    {
      title: "Shadow Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-shadow-vault/",
      note: "Applies XChaCha20-Poly1305 in a deniable-encryption workflow.",
    },
  ],
  curve25519: [
    {
      title: "Curve Lens",
      url: "https://systemslibrarian.github.io/crypto-lab-curve-lens/",
      note: "Interactive point addition, scalar multiplication, and ECDH exploration across major curves.",
    },
    {
      title: "X3DH Wire",
      url: "https://systemslibrarian.github.io/crypto-lab-x3dh-wire/",
      note: "Signal-style asynchronous key agreement built on Curve25519.",
    },
    {
      title: "Ratchet Wire",
      url: "https://systemslibrarian.github.io/crypto-lab-ratchet-wire/",
      note: "Double-ratchet style key update and session-forward-secrecy walkthrough.",
    },
    {
      title: "Noise Pipe",
      url: "https://systemslibrarian.github.io/crypto-lab-noise-pipe/",
      note: "Noise-pattern handshake lab for modern transport protocol design.",
    },
    {
      title: "Opaque Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-opaque-gate/",
      note: "Password-authenticated key exchange walkthrough with transcript-hardening patterns.",
    },
    {
      title: "Isogeny Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-isogeny-gate/",
      note: "Post-quantum key-exchange history and assumptions in context with modern curves.",
    },
  ],
  ed25519: [
    {
      title: "Ed25519 Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-ed25519-forge/",
      note: "Key generation, signing, verification, and deterministic nonce handling.",
    },
    {
      title: "FROST Threshold",
      url: "https://systemslibrarian.github.io/crypto-lab-frost-threshold/",
      note: "Threshold signing workflow built on Ed25519.",
    },
    {
      title: "Blind Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-blind-sign/",
      note: "Privacy-preserving signing flow and unlinkability intuition.",
    },
    {
      title: "Ring Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-ring-sign/",
      note: "Signer anonymity and ring-formation tradeoffs in signature protocols.",
    },
    {
      title: "PKI Chain",
      url: "https://systemslibrarian.github.io/crypto-lab-pki-chain/",
      note: "Certificate-chain and trust-anchor mechanics for signature verification workflows.",
    },
  ],
  mlkem768: [
    {
      title: "Kyber Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-kyber-vault/",
      note: "Hands-on ML-KEM / Kyber encapsulation and decapsulation walkthrough.",
    },
    {
      title: "Hybrid Wire",
      url: "https://systemslibrarian.github.io/crypto-lab-hybrid-wire/",
      note: "Shows X25519 plus ML-KEM hybrid key exchange as deployed in modern TLS experiments.",
    },
    {
      title: "Quantum Vault KPQC",
      url: "https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/",
      note: "Interactive post-quantum KEM comparison and security intuition builder.",
    },
    {
      title: "BB84",
      url: "https://systemslibrarian.github.io/crypto-lab-bb84/",
      note: "Quantum key-distribution intuition and where it differs from software KEM deployment.",
    },
    {
      title: "Shor",
      url: "https://systemslibrarian.github.io/crypto-lab-shor/",
      note: "Quantum attack intuition motivating migration from classical public-key systems.",
    },
    {
      title: "Grover",
      url: "https://systemslibrarian.github.io/crypto-lab-grover/",
      note: "Symmetric-key security scaling under quantum search assumptions.",
    },
    {
      title: "Lattice Fault",
      url: "https://systemslibrarian.github.io/crypto-lab-lattice-fault/",
      note: "Implementation-fault and decryption-failure intuition for lattice systems.",
    },
    {
      title: "LLL Break",
      url: "https://systemslibrarian.github.io/crypto-lab-lll-break/",
      note: "Lattice reduction intuition and parameter-safety implications.",
    },
  ],
  mlkem1024: [
    {
      title: "Kyber Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-kyber-vault/",
      note: "Interactive ML-KEM demo useful for comparing higher-security parameter sets.",
    },
  ],
  smaug_t: [
    {
      title: "Quantum Vault KPQC",
      url: "https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/",
      note: "KPQC candidate lab including comparison views for regional post-quantum schemes.",
    },
  ],
  hqc: [
    {
      title: "HQC Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-hqc-vault/",
      note: "Code-based KEM flow and tradeoff walkthrough for HQC.",
    },
  ],
  classic_mceliece: [
    {
      title: "McEliece Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-mceliece-gate/",
      note: "Code-based encryption and key-size tradeoff visualized for Classic McEliece.",
    },
  ],
  frodokem: [
    {
      title: "Frodo Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-frodo-vault/",
      note: "Learning-focused module for FrodoKEM design and deployment tradeoffs.",
    },
  ],
  bike: [
    {
      title: "BIKE Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-bike-vault/",
      note: "Code-based BIKE internals, parameter intuition, and attack surface overview.",
    },
  ],
  mldsa44: [
    {
      title: "Dilithium Seal",
      url: "https://systemslibrarian.github.io/crypto-lab-dilithium-seal/",
      note: "Demonstrates ML-DSA signing and verification flow with lattice-based signatures.",
    },
  ],
  mldsa65: [
    {
      title: "Dilithium Seal",
      url: "https://systemslibrarian.github.io/crypto-lab-dilithium-seal/",
      note: "Hands-on ML-DSA demo for signature generation and verification.",
    },
    {
      title: "MPCitH Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-mpcith-sign/",
      note: "Post-quantum signature design intuition from MPC-in-the-head constructions.",
    },
  ],
  falcon512: [
    {
      title: "Falcon Seal",
      url: "https://systemslibrarian.github.io/crypto-lab-falcon-seal/",
      note: "Lattice signature demo focused on compact signatures and implementation caveats.",
    },
  ],
  slh_dsa: [
    {
      title: "SPHINCS+ Ledger",
      url: "https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/",
      note: "Hash-based signature workflow with larger signatures and conservative assumptions.",
    },
    {
      title: "MPCitH Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-mpcith-sign/",
      note: "Post-quantum signature design intuition from MPC-in-the-head constructions.",
    },
  ],
  lms_hss: [
    {
      title: "LMS Ledger",
      url: "https://systemslibrarian.github.io/crypto-lab-lms-ledger/",
      note: "Stateful hash-based signatures with Merkle authentication path intuition.",
    },
    {
      title: "Merkle Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-merkle-vault/",
      note: "Merkle tree commitments and authentication path mechanics for hash-based signatures.",
    },
  ],
  sha256: [
    {
      title: "Hash Zoo",
      url: "https://systemslibrarian.github.io/crypto-lab-hash-zoo/",
      note: "Comparative hashing lab for collision and preimage intuition.",
    },
    {
      title: "World Hashes",
      url: "https://systemslibrarian.github.io/crypto-lab-world-hashes/",
      note: "Cross-standard hash overview and algorithm family context.",
    },
    {
      title: "Phantom Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-phantom-vault/",
      note: "Hashing and key-derivation pitfalls visualized in a practical data-protection workflow.",
    },
  ],
  sha512: [
    {
      title: "Hash Zoo",
      url: "https://systemslibrarian.github.io/crypto-lab-hash-zoo/",
      note: "Comparative hashing lab for collision and preimage intuition.",
    },
  ],
  sha3_256: [
    {
      title: "Babel Hash",
      url: "https://systemslibrarian.github.io/crypto-lab-babel-hash/",
      note: "Hash family explorer with sponge-vs-Merkle-Damgard mental models.",
    },
  ],
  blake2b: [
    {
      title: "World Hashes",
      url: "https://systemslibrarian.github.io/crypto-lab-world-hashes/",
      note: "Cross-standard hash overview and algorithm family context.",
    },
  ],
  blake3: [
    {
      title: "World Hashes",
      url: "https://systemslibrarian.github.io/crypto-lab-world-hashes/",
      note: "Cross-standard hash overview and algorithm family context.",
    },
  ],
  hkdf: [
    {
      title: "KDF Chain",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-chain/",
      note: "Derivation-chain demo for context binding, domain separation, and key expansion.",
    },
  ],
  argon2_kdf: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Memory-hard tuning lab for practical parameter choices.",
    },
  ],
  scrypt_kdf: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Memory-hard tuning lab for practical parameter choices.",
    },
  ],
  pbkdf2: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Iteration-cost and migration tradeoff explorer for password-derived keys.",
    },
  ],
  balloon: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Memory-hard tuning lab for practical parameter choices.",
    },
  ],
  hmac_sha256: [
    {
      title: "MAC Race",
      url: "https://systemslibrarian.github.io/crypto-lab-mac-race/",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
    {
      title: "Timing Oracle",
      url: "https://systemslibrarian.github.io/crypto-lab-timing-oracle/",
      note: "Side-channel timing intuition and constant-time verification discipline.",
    },
  ],
  cmac_aes: [
    {
      title: "MAC Race",
      url: "https://systemslibrarian.github.io/crypto-lab-mac-race/",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
  ],
  poly1305: [
    {
      title: "Poly1305 MAC",
      url: "https://systemslibrarian.github.io/crypto-lab-poly1305-mac/",
      note: "One-time authenticator intuition and key/nonce handling discipline.",
    },
    {
      title: "MAC Race",
      url: "https://systemslibrarian.github.io/crypto-lab-mac-race/",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
  ],
  argon2id: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Memory-hard parameter tuning for modern password hashing.",
    },
  ],
  bcrypt: [
    {
      title: "bcrypt Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/",
      note: "Work-factor and migration walkthrough for legacy-compatible password hashing.",
    },
  ],
  scrypt_pw: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Memory-hard parameter tuning for password storage and verification.",
    },
  ],
  pbkdf2_pw: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Iteration-cost and migration tradeoff explorer for password hashing.",
    },
  ],
  balloon_pw: [
    {
      title: "KDF Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-kdf-arena/",
      note: "Memory-hard parameter tuning for password storage and verification.",
    },
  ],
  shamir: [
    {
      title: "Shamir Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-shamir-gate/",
      note: "Threshold splitting and reconstruction flow with share-loss failure modes.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/",
      note: "Distributed decryption workflow with quorum requirements and availability tradeoffs.",
    },
  ],
  feldman_vss: [
    {
      title: "VSS Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-vss-gate/",
      note: "Verifiable sharing workflow with commitments and complaint handling.",
    },
  ],
  pedersen_vss: [
    {
      title: "VSS Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-vss-gate/",
      note: "Verifiable sharing workflow with commitments and complaint handling.",
    },
  ],
  tfhe: [
    {
      title: "Blind Oracle",
      url: "https://systemslibrarian.github.io/crypto-lab-blind-oracle/",
      note: "Browser-to-server demo for encrypted computation with TFHE-style operations.",
    },
    {
      title: "FHE Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
    {
      title: "Model Breach",
      url: "https://systemslibrarian.github.io/crypto-lab-model-breach/",
      note: "Leakage and inference-risk demonstration motivating encrypted-compute designs.",
    },
    {
      title: "Patron Shield",
      url: "https://systemslibrarian.github.io/crypto-lab-patron-shield/",
      note: "Privacy-preserving analytics and encrypted processing intuition.",
    },
    {
      title: "Harvest Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-harvest-vault/",
      note: "Data minimization and encrypted retention patterns for privacy-sensitive workloads.",
    },
  ],
  bgv: [
    {
      title: "FHE Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
  ],
  bfv: [
    {
      title: "FHE Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
  ],
  ckks: [
    {
      title: "CKKS Lab",
      url: "https://systemslibrarian.github.io/crypto-lab-ckks-lab/",
      note: "Approximate arithmetic under encryption with scale/noise budgeting intuition.",
    },
    {
      title: "FHE Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
  ],
  groth16: [
    {
      title: "SNARK Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-snark-arena/",
      note: "Groth16 and PLONK trusted-setup workflow, proof generation, and verification comparison.",
    },
  ],
  plonk: [
    {
      title: "SNARK Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-snark-arena/",
      note: "Universal setup and proof system comparison centered on PLONK and Groth16.",
    },
  ],
  zk_stark: [
    {
      title: "STARK Tower",
      url: "https://systemslibrarian.github.io/crypto-lab-stark-tower/",
      note: "Transparent zk-STARK proving flow with AIR and FRI components explained.",
    },
  ],
  bulletproofs: [
    {
      title: "ZK Proof Lab",
      url: "https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/",
      note: "Zero-knowledge construction walkthrough spanning commitments and proof mechanics.",
    },
    {
      title: "Commit Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-commit-gate/",
      note: "Commitment scheme semantics and binding/hiding tradeoffs in protocol design.",
    },
  ],
  garbled_circuits: [
    {
      title: "Garbled Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-garbled-gate/",
      note: "Yao-style garbled circuit construction and secure evaluation walk-through.",
    },
    {
      title: "Protocol Compose",
      url: "https://systemslibrarian.github.io/crypto-lab-protocol-compose/",
      note: "Composability failure modes and safe protocol-combination patterns.",
    },
  ],
  ot_base: [
    {
      title: "OT Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-ot-gate/",
      note: "Oblivious transfer foundations used in private protocols and MPC.",
    },
  ],
  ot_extension: [
    {
      title: "OT Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-ot-gate/",
      note: "Oblivious transfer foundations used in private protocols and MPC.",
    },
  ],
  cpir: [
    {
      title: "Oblivious Shelf",
      url: "https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/",
      note: "Private retrieval and access-pattern leakage intuition.",
    },
  ],
  it_pir: [
    {
      title: "Oblivious Shelf",
      url: "https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/",
      note: "Private retrieval and access-pattern leakage intuition.",
    },
  ],
  rsa_oaep_2048: [
    {
      title: "RSA Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-rsa-forge/",
      note: "RSA encryption/signature behavior, padding pitfalls, and parameter intuition.",
    },
    {
      title: "Iron Letter",
      url: "https://systemslibrarian.github.io/crypto-lab-iron-letter/",
      note: "Applied public-key encryption workflow and envelope-encryption intuition.",
    },
    {
      title: "Padding Oracle",
      url: "https://systemslibrarian.github.io/crypto-lab-padding-oracle/",
      note: "Oracle-attack walkthrough showing why modern authenticated schemes are required.",
    },
  ],
  rsa_oaep_4096: [
    {
      title: "RSA Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-rsa-forge/",
      note: "RSA encryption/signature behavior, padding pitfalls, and parameter intuition.",
    },
  ],
  lsb_stego: [
    {
      title: "Stego Suite",
      url: "https://systemslibrarian.github.io/crypto-lab-stego-suite/",
      note: "Steganography tradeoffs, payload limits, and detection-risk intuition.",
    },
  ],
  dct_f5: [
    {
      title: "J-UNIWARD",
      url: "https://systemslibrarian.github.io/crypto-lab-j-uniward/",
      note: "JPEG-domain steganography lab with distortion-aware embedding intuition.",
    },
  ],
  wow_stego: [
    {
      title: "J-UNIWARD",
      url: "https://systemslibrarian.github.io/crypto-lab-j-uniward/",
      note: "Adaptive-cost embedding behavior and steganalysis pressure points.",
    },
  ],
  frost: [
    {
      title: "FROST Threshold",
      url: "https://systemslibrarian.github.io/crypto-lab-frost-threshold/",
      note: "Threshold signing workflow and signer-coordination model for Schnorr systems.",
    },
  ],
  gg20: [
    {
      title: "GG20 Wallet",
      url: "https://systemslibrarian.github.io/crypto-lab-gg20-wallet/",
      note: "Threshold ECDSA signing with coordinator flow and abort handling.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/",
      note: "Multi-party threshold workflow intuition for distributed wallet operations.",
    },
  ],
  hmac_drbg: [
    {
      title: "DRBG Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
    {
      title: "VRF Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-vrf-gate/",
      note: "Verifiable randomness and unpredictability guarantees in distributed systems.",
    },
    {
      title: "Corrupted Oracle",
      url: "https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/",
      note: "Entropy failure scenarios and state compromise impact in randomness pipelines.",
    },
  ],
  ctr_drbg: [
    {
      title: "DRBG Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  hash_drbg: [
    {
      title: "DRBG Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  chacha20_drbg: [
    {
      title: "DRBG Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  fortuna: [
    {
      title: "DRBG Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  spdz: [
    {
      title: "Silent Tally",
      url: "https://systemslibrarian.github.io/crypto-lab-silent-tally/",
      note: "Secure tallying flow and privacy-preserving aggregation intuition.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/",
      note: "Distributed decryption and share-combination mechanics for MPC systems.",
    },
  ],
  bls12_381_curve: [
    {
      title: "Pairing Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-pairing-gate/",
      note: "Pairing-friendly curve intuition and protocol use in advanced signatures.",
    },
  ],
  bls_threshold: [
    {
      title: "Pairing Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-pairing-gate/",
      note: "Pairing-based threshold signature mechanics and aggregation concepts.",
    },
  ],
};