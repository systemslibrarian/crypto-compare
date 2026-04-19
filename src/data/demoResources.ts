export type DemoResource = {
  title: string;
  url: string;
  note: string;
};

export const ALGORITHM_DEMOS: Record<string, DemoResource[]> = {
  aes256gcm: [
    {
      title: "AES Modes",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-aes-modes/",
      note: "Compares ECB, CBC, CTR, GCM, and CCM with attack demos and mode visualizations.",
    },
    {
      title: "AEGIS Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-aegis-gate/",
      note: "AEAD walkthrough comparing nonce handling and throughput tradeoffs in modern authenticated encryption.",
    },
    {
      title: "Format Ward",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-format-ward/",
      note: "Format-preserving encryption playground for structured fields and tokens.",
    },
    {
      title: "Iron Serpent",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-iron-serpent/",
      note: "Applied symmetric-encryption lab for key/nonce discipline in real workflows.",
    },
    {
      title: "World Ciphers",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-world-ciphers/",
      note: "Cipher family comparison with design and deployment tradeoff context.",
    },
    {
      title: "Biham Lens",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-biham-lens/",
      note: "Classical cryptanalysis intuition builder for block-cipher style systems.",
    },
    {
      title: "Padding Oracle",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-padding-oracle/",
      note: "Shows why authenticated encryption closes oracle-style decryption side channels.",
    },
    {
      title: "Dead Sea Cipher",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-dead-sea-cipher/",
      note: "Historical cipher lab for context on modern symmetric design goals.",
    },
  ],
  chacha20poly: [
    {
      title: "ChaCha20 Stream",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-chacha20-stream/",
      note: "Quarter-round stepper, keystream visualizer, nonce-reuse demo, and encrypt/decrypt playground.",
    },
    {
      title: "Ascon",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ascon/",
      note: "Lightweight cryptography lab covering AEAD, hashing, and constrained-device design tradeoffs.",
    },
    {
      title: "Nonce Guard",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-nonce-guard/",
      note: "Demonstrates nonce-misuse failures and how modern AEAD usage avoids them.",
    },
  ],
  xchacha20poly: [
    {
      title: "ChaCha20 Stream",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-chacha20-stream/",
      note: "Quarter-round stepper, keystream visualizer, nonce-reuse demo, and encrypt/decrypt playground.",
    },
    {
      title: "Shadow Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-shadow-vault/",
      note: "Applies XChaCha20-Poly1305 in a deniable-encryption workflow.",
    },
  ],
  curve25519: [
    {
      title: "Curve Lens",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-curve-lens/",
      note: "Interactive point addition, scalar multiplication, and ECDH exploration across major curves.",
    },
    {
      title: "X3DH Wire",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-x3dh-wire/",
      note: "Signal-style asynchronous key agreement built on Curve25519.",
    },
    {
      title: "Ratchet Wire",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ratchet-wire/",
      note: "Double-ratchet style key update and session-forward-secrecy walkthrough.",
    },
    {
      title: "Noise Pipe",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-noise-pipe/",
      note: "Noise-pattern handshake lab for modern transport protocol design.",
    },
    {
      title: "Opaque Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-opaque-gate/",
      note: "Password-authenticated key exchange walkthrough with transcript-hardening patterns.",
    },
    {
      title: "Isogeny Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-isogeny-gate/",
      note: "Post-quantum key-exchange history and assumptions in context with modern curves.",
    },
  ],
  ed25519: [
    {
      title: "Ed25519 Forge",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ed25519-forge/",
      note: "Key generation, signing, verification, and deterministic nonce handling.",
    },
    {
      title: "FROST Threshold",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-frost-threshold/",
      note: "Threshold signing workflow built on Ed25519.",
    },
    {
      title: "Blind Sign",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-blind-sign/",
      note: "Privacy-preserving signing flow and unlinkability intuition.",
    },
    {
      title: "Ring Sign",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ring-sign/",
      note: "Signer anonymity and ring-formation tradeoffs in signature protocols.",
    },
    {
      title: "PKI Chain",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-pki-chain/",
      note: "Certificate-chain and trust-anchor mechanics for signature verification workflows.",
    },
  ],
  p256: [
    {
      title: "ECDSA Forge",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ecdsa-forge/",
      note: "ECDSA signing and verification flow with nonce-discipline and verification-failure intuition.",
    },
  ],
  secp256k1: [
    {
      title: "ECDSA Forge",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ecdsa-forge/",
      note: "ECDSA workflow and nonce-misuse intuition in the curve family used by blockchain wallets and custody systems.",
    },
  ],
  curve448_ed448: [
    {
      title: "Curve448",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-curve448/",
      note: "High-security curve walkthrough for X448 and Ed448 style key agreement and signatures.",
    },
  ],
  mlkem768: [
    {
      title: "Kyber Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kyber-vault/",
      note: "Hands-on ML-KEM / Kyber encapsulation and decapsulation walkthrough.",
    },
    {
      title: "Hybrid Wire",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hybrid-wire/",
      note: "Shows X25519 plus ML-KEM hybrid key exchange as deployed in modern TLS experiments.",
    },
    {
      title: "Quantum Vault KPQC",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-quantum-vault-kpqc/",
      note: "Interactive post-quantum KEM comparison and security intuition builder.",
    },
    {
      title: "BB84",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-bb84/",
      note: "Quantum key-distribution intuition and where it differs from software KEM deployment.",
    },
    {
      title: "Shor",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-shor/",
      note: "Quantum attack intuition motivating migration from classical public-key systems.",
    },
    {
      title: "Grover",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-grover/",
      note: "Symmetric-key security scaling under quantum search assumptions.",
    },
    {
      title: "Lattice Fault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-lattice-fault/",
      note: "Implementation-fault and decryption-failure intuition for lattice systems.",
    },
    {
      title: "KyberSlash",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kyberslash/",
      note: "Side-channel walkthrough showing why constant-time ML-KEM implementations matter.",
    },
    {
      title: "LLL Break",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-lll-break/",
      note: "Lattice reduction intuition and parameter-safety implications.",
    },
    {
      title: "Harvest Timeline",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-harvest-timeline/",
      note: "Migration-planning view for harvest-now decrypt-later risk and post-quantum rollout timing.",
    },
    {
      title: "PQ Rotation",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-pq-rotation/",
      note: "Operational rotation planning for moving production key exchange and data protection to PQ-safe systems.",
    },
    {
      title: "PQ TLS Handshake",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-pq-tls-handshake/",
      note: "Hybrid TLS handshake walkthrough showing where ML-KEM fits into post-quantum transport migration.",
    },
  ],
  mlkem1024: [
    {
      title: "Kyber Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kyber-vault/",
      note: "Interactive ML-KEM demo useful for comparing higher-security parameter sets.",
    },
    {
      title: "S-Cloud+ Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-scloud-vault/",
      note: "Post-quantum KEM workflow for long-lived cloud storage and envelope-encryption planning.",
    },
  ],
  smaug_t: [
    {
      title: "Quantum Vault KPQC",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-quantum-vault-kpqc/",
      note: "KPQC candidate lab including comparison views for regional post-quantum schemes.",
    },
    {
      title: "NTRU Classic",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ntru-classic/",
      note: "Lattice-encryption intuition builder for NTRU-style designs and their deployment tradeoffs.",
    },
  ],
  hqc: [
    {
      title: "HQC Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hqc-vault/",
      note: "Code-based KEM flow and tradeoff walkthrough for HQC.",
    },
    {
      title: "HQC Timing Break",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hqc-timing-break/",
      note: "Side-channel demo showing timing-sensitive failure modes in post-quantum KEM implementations.",
    },
  ],
  classic_mceliece: [
    {
      title: "McEliece Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-mceliece-gate/",
      note: "Code-based encryption and key-size tradeoff visualized for Classic McEliece.",
    },
  ],
  frodokem: [
    {
      title: "Frodo Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-frodo-vault/",
      note: "Learning-focused module for FrodoKEM design and deployment tradeoffs.",
    },
  ],
  bike: [
    {
      title: "BIKE Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-bike-vault/",
      note: "Code-based BIKE internals, parameter intuition, and attack surface overview.",
    },
  ],
  mldsa44: [
    {
      title: "Dilithium Seal",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-dilithium-seal/",
      note: "Demonstrates ML-DSA signing and verification flow with lattice-based signatures.",
    },
    {
      title: "Dilithium Reject",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-dilithium-reject/",
      note: "ML-DSA internals lab focused on rejection sampling and signing-loop behavior.",
    },
    {
      title: "Hybrid Sign",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hybrid-sign/",
      note: "Composite-signature workflow combining classical and post-quantum authenticity guarantees.",
    },
    {
      title: "Threshold ML-DSA",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-threshold-mldsa/",
      note: "Threshold post-quantum signing walkthrough for distributed ML-DSA key ownership.",
    },
  ],
  mldsa65: [
    {
      title: "Dilithium Seal",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-dilithium-seal/",
      note: "Hands-on ML-DSA demo for signature generation and verification.",
    },
    {
      title: "Dilithium Reject",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-dilithium-reject/",
      note: "ML-DSA internals lab focused on rejection sampling and signing-loop behavior.",
    },
    {
      title: "Hybrid Sign",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hybrid-sign/",
      note: "Composite-signature workflow for pairing PQ signatures with a classical signature during migration.",
    },
    {
      title: "MPCitH Sign",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-mpcith-sign/",
      note: "Post-quantum signature design intuition from MPC-in-the-head constructions.",
    },
    {
      title: "Threshold ML-DSA",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-threshold-mldsa/",
      note: "Threshold post-quantum signing workflow for higher-assurance distributed signature deployments.",
    },
  ],
  falcon512: [
    {
      title: "Falcon Seal",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-falcon-seal/",
      note: "Lattice signature demo focused on compact signatures and implementation caveats.",
    },
    {
      title: "HAWK",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hawk/",
      note: "Alternative post-quantum signature lab for compact-signature tradeoffs and deployment comparisons.",
    },
  ],
  slh_dsa: [
    {
      title: "SPHINCS+ Ledger",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-sphincs-ledger/",
      note: "Hash-based signature workflow with larger signatures and conservative assumptions.",
    },
    {
      title: "MPCitH Sign",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-mpcith-sign/",
      note: "Post-quantum signature design intuition from MPC-in-the-head constructions.",
    },
  ],
  xmss: [
    {
      title: "LMS/XMSS",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-lms-xmss/",
      note: "Stateful hash-based signature comparison centered on XMSS and LMS lifecycle management.",
    },
  ],
  lms_hss: [
    {
      title: "LMS Ledger",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-lms-ledger/",
      note: "Stateful hash-based signatures with Merkle authentication path intuition.",
    },
    {
      title: "LMS/XMSS",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-lms-xmss/",
      note: "Compares stateful hash-based signature families and the operational risks of one-time key reuse.",
    },
    {
      title: "Merkle Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-merkle-vault/",
      note: "Merkle tree commitments and authentication path mechanics for hash-based signatures.",
    },
  ],
  sha256: [
    {
      title: "Hash Zoo",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hash-zoo/",
      note: "Comparative hashing lab for collision and preimage intuition.",
    },
    {
      title: "World Hashes",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-world-hashes/",
      note: "Cross-standard hash overview and algorithm family context.",
    },
    {
      title: "Phantom Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-phantom-vault/",
      note: "Hashing and key-derivation pitfalls visualized in a practical data-protection workflow.",
    },
  ],
  sha512: [
    {
      title: "Hash Zoo",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-hash-zoo/",
      note: "Comparative hashing lab for collision and preimage intuition.",
    },
  ],
  sha3_256: [
    {
      title: "Babel Hash",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-babel-hash/",
      note: "Hash family explorer with sponge-vs-Merkle-Damgard mental models.",
    },
  ],
  blake2b: [
    {
      title: "World Hashes",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-world-hashes/",
      note: "Cross-standard hash overview and algorithm family context.",
    },
  ],
  blake3: [
    {
      title: "World Hashes",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-world-hashes/",
      note: "Cross-standard hash overview and algorithm family context.",
    },
  ],
  hkdf: [
    {
      title: "KDF Chain",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-chain/",
      note: "Derivation-chain demo for context binding, domain separation, and key expansion.",
    },
  ],
  argon2_kdf: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Memory-hard tuning lab for practical parameter choices.",
    },
  ],
  scrypt_kdf: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Memory-hard tuning lab for practical parameter choices.",
    },
  ],
  pbkdf2: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Iteration-cost and migration tradeoff explorer for password-derived keys.",
    },
  ],
  balloon: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Memory-hard tuning lab for practical parameter choices.",
    },
  ],
  hmac_sha256: [
    {
      title: "MAC Race",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-mac-race/",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
    {
      title: "Timing Oracle",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-timing-oracle/",
      note: "Side-channel timing intuition and constant-time verification discipline.",
    },
  ],
  cmac_aes: [
    {
      title: "MAC Race",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-mac-race/",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
  ],
  poly1305: [
    {
      title: "Poly1305 MAC",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-poly1305-mac/",
      note: "One-time authenticator intuition and key/nonce handling discipline.",
    },
    {
      title: "MAC Race",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-mac-race/",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
  ],
  argon2id: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Memory-hard parameter tuning for modern password hashing.",
    },
  ],
  bcrypt: [
    {
      title: "bcrypt Forge",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-bcrypt-forge/",
      note: "Work-factor and migration walkthrough for legacy-compatible password hashing.",
    },
  ],
  scrypt_pw: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Memory-hard parameter tuning for password storage and verification.",
    },
  ],
  pbkdf2_pw: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Iteration-cost and migration tradeoff explorer for password hashing.",
    },
  ],
  balloon_pw: [
    {
      title: "KDF Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kdf-arena/",
      note: "Memory-hard parameter tuning for password storage and verification.",
    },
  ],
  shamir: [
    {
      title: "Shamir Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-shamir-gate/",
      note: "Threshold splitting and reconstruction flow with share-loss failure modes.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-threshold-decrypt/",
      note: "Distributed decryption workflow with quorum requirements and availability tradeoffs.",
    },
  ],
  feldman_vss: [
    {
      title: "VSS Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-vss-gate/",
      note: "Verifiable sharing workflow with commitments and complaint handling.",
    },
  ],
  pedersen_vss: [
    {
      title: "VSS Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-vss-gate/",
      note: "Verifiable sharing workflow with commitments and complaint handling.",
    },
  ],
  tfhe: [
    {
      title: "Blind Oracle",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-blind-oracle/",
      note: "Browser-to-server demo for encrypted computation with TFHE-style operations.",
    },
    {
      title: "FHE Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
    {
      title: "Model Breach",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-model-breach/",
      note: "Leakage and inference-risk demonstration motivating encrypted-compute designs.",
    },
    {
      title: "Patron Shield",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-patron-shield/",
      note: "Privacy-preserving analytics and encrypted processing intuition.",
    },
    {
      title: "Harvest Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-harvest-vault/",
      note: "Data minimization and encrypted retention patterns for privacy-sensitive workloads.",
    },
  ],
  bgv: [
    {
      title: "FHE Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
  ],
  bfv: [
    {
      title: "FHE Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
  ],
  ckks: [
    {
      title: "CKKS Lab",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ckks-lab/",
      note: "Approximate arithmetic under encryption with scale/noise budgeting intuition.",
    },
    {
      title: "FHE Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-fhe-arena/",
      note: "Compares bootstrapping-heavy and leveled FHE workflows on practical tasks.",
    },
  ],
  groth16: [
    {
      title: "SNARK Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-snark-arena/",
      note: "Groth16 and PLONK trusted-setup workflow, proof generation, and verification comparison.",
    },
  ],
  plonk: [
    {
      title: "SNARK Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-snark-arena/",
      note: "Universal setup and proof system comparison centered on PLONK and Groth16.",
    },
  ],
  zk_stark: [
    {
      title: "STARK Tower",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-stark-tower/",
      note: "Transparent zk-STARK proving flow with AIR and FRI components explained.",
    },
  ],
  bulletproofs: [
    {
      title: "ZK Proof Lab",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-zk-proof-lab/",
      note: "Zero-knowledge construction walkthrough spanning commitments and proof mechanics.",
    },
    {
      title: "Commit Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-commit-gate/",
      note: "Commitment scheme semantics and binding/hiding tradeoffs in protocol design.",
    },
  ],
  garbled_circuits: [
    {
      title: "Garbled Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-garbled-gate/",
      note: "Yao-style garbled circuit construction and secure evaluation walk-through.",
    },
    {
      title: "Protocol Compose",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-protocol-compose/",
      note: "Composability failure modes and safe protocol-combination patterns.",
    },
  ],
  ot_base: [
    {
      title: "OT Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ot-gate/",
      note: "Oblivious transfer foundations used in private protocols and MPC.",
    },
  ],
  ot_extension: [
    {
      title: "OT Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ot-gate/",
      note: "Oblivious transfer foundations used in private protocols and MPC.",
    },
  ],
  cpir: [
    {
      title: "Oblivious Shelf",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-oblivious-shelf/",
      note: "Private retrieval and access-pattern leakage intuition.",
    },
    {
      title: "ORAM Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-oram-vault/",
      note: "Access-pattern privacy walkthrough showing where PIR and ORAM solve different leakage problems.",
    },
  ],
  it_pir: [
    {
      title: "Oblivious Shelf",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-oblivious-shelf/",
      note: "Private retrieval and access-pattern leakage intuition.",
    },
    {
      title: "ORAM Vault",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-oram-vault/",
      note: "Access-pattern privacy walkthrough for stronger hiding guarantees in repeated query settings.",
    },
  ],
  aby: [
    {
      title: "PSI Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-psi-gate/",
      note: "Private set intersection workflow built from practical two-party secure computation patterns.",
    },
  ],
  elgamal: [
    {
      title: "ElGamal Plain",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-elgamal-plain/",
      note: "Public-key encryption walkthrough for multiplicative homomorphism and ciphertext expansion tradeoffs.",
    },
  ],
  rsa_oaep_2048: [
    {
      title: "RSA Forge",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-rsa-forge/",
      note: "RSA encryption/signature behavior, padding pitfalls, and parameter intuition.",
    },
    {
      title: "Iron Letter",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-iron-letter/",
      note: "Applied public-key encryption workflow and envelope-encryption intuition.",
    },
    {
      title: "Padding Oracle",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-padding-oracle/",
      note: "Oracle-attack walkthrough showing why modern authenticated schemes are required.",
    },
  ],
  rsa_oaep_4096: [
    {
      title: "RSA Forge",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-rsa-forge/",
      note: "RSA encryption/signature behavior, padding pitfalls, and parameter intuition.",
    },
  ],
  lsb_stego: [
    {
      title: "Stego Suite",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-stego-suite/",
      note: "Steganography tradeoffs, payload limits, and detection-risk intuition.",
    },
  ],
  dct_f5: [
    {
      title: "J-UNIWARD",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-j-uniward/",
      note: "JPEG-domain steganography lab with distortion-aware embedding intuition.",
    },
  ],
  wow_stego: [
    {
      title: "J-UNIWARD",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-j-uniward/",
      note: "Adaptive-cost embedding behavior and steganalysis pressure points.",
    },
  ],
  frost: [
    {
      title: "FROST Threshold",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-frost-threshold/",
      note: "Threshold signing workflow and signer-coordination model for Schnorr systems.",
    },
  ],
  gg20: [
    {
      title: "GG20 Wallet",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-gg20-wallet/",
      note: "Threshold ECDSA signing with coordinator flow and abort handling.",
    },
    {
      title: "Paillier Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-paillier-gate/",
      note: "Additive homomorphic encryption walkthrough for the Paillier building blocks used in threshold ECDSA systems.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-threshold-decrypt/",
      note: "Multi-party threshold workflow intuition for distributed wallet operations.",
    },
  ],
  dkls23: [
    {
      title: "Paillier Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-paillier-gate/",
      note: "Additive homomorphic encryption context for the arithmetic and proof machinery behind modern threshold ECDSA.",
    },
  ],
  hmac_drbg: [
    {
      title: "DRBG Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
    {
      title: "VRF Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-vrf-gate/",
      note: "Verifiable randomness and unpredictability guarantees in distributed systems.",
    },
    {
      title: "Corrupted Oracle",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-corrupted-oracle/",
      note: "Entropy failure scenarios and state compromise impact in randomness pipelines.",
    },
  ],
  ctr_drbg: [
    {
      title: "DRBG Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  hash_drbg: [
    {
      title: "DRBG Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  chacha20_drbg: [
    {
      title: "DRBG Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  fortuna: [
    {
      title: "DRBG Arena",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-drbg-arena/",
      note: "State evolution, reseeding, and backtracking-resistance comparison across DRBGs.",
    },
  ],
  spdz: [
    {
      title: "Silent Tally",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-silent-tally/",
      note: "Secure tallying flow and privacy-preserving aggregation intuition.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-threshold-decrypt/",
      note: "Distributed decryption and share-combination mechanics for MPC systems.",
    },
  ],
  bls12_381_curve: [
    {
      title: "Pairing Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-pairing-gate/",
      note: "Pairing-friendly curve intuition and protocol use in advanced signatures.",
    },
    {
      title: "IBE Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-ibe-gate/",
      note: "Identity-based encryption walkthrough rooted in pairing-based public-key constructions.",
    },
  ],
  bls_threshold: [
    {
      title: "Pairing Gate",
      url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-pairing-gate/",
      note: "Pairing-based threshold signature mechanics and aggregation concepts.",
    },
  ],
};