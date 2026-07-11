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
      title: "AEGIS Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-aegis-gate/",
      note: "AEAD walkthrough comparing nonce handling and throughput tradeoffs in modern authenticated encryption.",
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
    {
      title: "Envelope KMS",
      url: "https://systemslibrarian.github.io/crypto-lab-envelope-kms/",
      note: "RFC 3394/5649 AES key wrap with DEK/KEK hierarchy, KMS-style rotation, and a hash-chained audit log.",
    },
    {
      title: "Kerberos v5",
      url: "https://systemslibrarian.github.io/crypto-lab-kerberos/",
      note: "RFC 4120 AS/TGS/AP exchange walkthrough with AES-256-CTS-HMAC-SHA1-96 ticket encryption and the Lowe attack.",
    },
    {
      title: "Enigma Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-enigma-forge/",
      note: "Full mechanical Enigma with rotors, plugboard, and reflector, plus the crib-based Bombe break exploiting the no-letter-maps-to-itself flaw.",
    },
    {
      title: "Vigenère Break",
      url: "https://systemslibrarian.github.io/crypto-lab-vigenere-break/",
      note: "Recovers a repeating-key Vigenère cipher with Kasiski examination, the index of coincidence, and per-column frequency analysis.",
    },
  ],
  chacha20poly: [
    {
      title: "ChaCha20 Stream",
      url: "https://systemslibrarian.github.io/crypto-lab-chacha20-stream/",
      note: "Quarter-round stepper, keystream visualizer, nonce-reuse demo, and encrypt/decrypt playground.",
    },
    {
      title: "Ascon",
      url: "https://systemslibrarian.github.io/crypto-lab-ascon/",
      note: "Lightweight cryptography lab covering AEAD, hashing, and constrained-device design tradeoffs.",
    },
    {
      title: "Nonce Guard",
      url: "https://systemslibrarian.github.io/crypto-lab-nonce-guard/",
      note: "Demonstrates nonce-misuse failures and how modern AEAD usage avoids them.",
    },
    {
      title: "OTP Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-otp-vault/",
      note: "One-time pad with provable perfect secrecy, then the two-time-pad break recovering both plaintexts from a reused keystream.",
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
    {
      title: "MLS Group",
      url: "https://systemslibrarian.github.io/crypto-lab-mls-group/",
      note: "RFC 9420 Messaging Layer Security with TreeKEM ratchet tree, epoch key schedule, and group forward secrecy.",
    },
    {
      title: "Key Exchange",
      url: "https://systemslibrarian.github.io/crypto-lab-key-exchange/",
      note: "Walkthrough of key exchange from Diffie-Hellman to modern hybrid post-quantum handshakes, with assumptions and threat models per era.",
    },
    {
      title: "SSH Handshake",
      url: "https://systemslibrarian.github.io/crypto-lab-ssh-handshake/",
      note: "SSH transport handshake with ephemeral X25519/ECDH, Ed25519 signatures over the exchange hash, and TOFU host-key pinning.",
    },
    {
      title: "Point Arithmetic",
      url: "https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/",
      note: "Interactive elliptic-curve point addition and scalar multiplication over both the reals and a finite field, building the ECDLP intuition beneath ECDH and ECDSA.",
    },
    {
      title: "DH MITM",
      url: "https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/",
      note: "Classic Diffie-Hellman key exchange with a live man-in-the-middle attack on the unauthenticated channel, and an ECDSA-signed fix that fails closed.",
    },
    {
      title: "PAKE Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-pake-gate/",
      note: "Side-by-side tour of the SRP-6a, J-PAKE, CPace, and Dragonfly PAKEs, deriving a strong shared key from a low-entropy password that never crosses the wire.",
    },
    {
      title: "TLS Handshake",
      url: "https://systemslibrarian.github.io/crypto-lab-tls-handshake/",
      note: "Full TLS 1.3 handshake with X25519 key exchange, Ed25519 authentication, the HKDF key schedule, and AES-GCM records, including a blocked man-in-the-middle.",
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
    {
      title: "Web of Trust",
      url: "https://systemslibrarian.github.io/crypto-lab-web-of-trust/",
      note: "PGP-style trust graph for signing keys and walking introduction chains, showing how trust flows without a central authority.",
    },
    {
      title: "SSH Handshake",
      url: "https://systemslibrarian.github.io/crypto-lab-ssh-handshake/",
      note: "SSH transport handshake using Ed25519 host-key signatures over the exchange hash with TOFU known_hosts pinning.",
    },
  ],
  p256: [
    {
      title: "ECDSA Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/",
      note: "ECDSA signing and verification flow with nonce-discipline and verification-failure intuition.",
    },
    {
      title: "Nonce Lattice",
      url: "https://systemslibrarian.github.io/crypto-lab-nonce-lattice/",
      note: "ECDSA nonce-bias lattice attack on P-256 — Hidden Number Problem, in-browser LLL reduction, private-key recovery.",
    },
    {
      title: "WebAuthn",
      url: "https://systemslibrarian.github.io/crypto-lab-webauthn/",
      note: "Passwordless FIDO2/WebAuthn authentication with ES256 (P-256) keys, covering attestation, assertion, and platform vs cross-platform authenticators.",
    },
  ],
  secp256k1: [
    {
      title: "ECDSA Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/",
      note: "ECDSA workflow and nonce-misuse intuition in the curve family used by blockchain wallets and custody systems.",
    },
    {
      title: "Nonce Lattice",
      url: "https://systemslibrarian.github.io/crypto-lab-nonce-lattice/",
      note: "ECDSA nonce-bias lattice attack on secp256k1 — Hidden Number Problem and LLL reduction recovering the private key.",
    },
    {
      title: "Bitcoin Wallet",
      url: "https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/",
      note: "secp256k1 key derivation to P2PKH and P2WPKH addresses via HASH160, with BIP-39 mnemonics, PBKDF2 seed stretching, and BIP-32 hardened child derivation.",
    },
    {
      title: "Bitcoin Script",
      url: "https://systemslibrarian.github.io/crypto-lab-bitcoin-script/",
      note: "Steps a real P2PKH spend through the Bitcoin Script stack machine with secp256k1 ECDSA and HASH160, covering wrong-key, forged-signature, and tampered scenarios.",
    },
  ],
  curve448_ed448: [
    {
      title: "Curve448",
      url: "https://systemslibrarian.github.io/crypto-lab-curve448/",
      note: "High-security curve walkthrough for X448 and Ed448 style key agreement and signatures.",
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
      title: "KyberSlash",
      url: "https://systemslibrarian.github.io/crypto-lab-kyberslash/",
      note: "Side-channel walkthrough showing why constant-time ML-KEM implementations matter.",
    },
    {
      title: "LLL Break",
      url: "https://systemslibrarian.github.io/crypto-lab-lll-break/",
      note: "Lattice reduction intuition and parameter-safety implications.",
    },
    {
      title: "Harvest Timeline",
      url: "https://systemslibrarian.github.io/crypto-lab-harvest-timeline/",
      note: "Migration-planning view for harvest-now decrypt-later risk and post-quantum rollout timing.",
    },
    {
      title: "PQ Rotation",
      url: "https://systemslibrarian.github.io/crypto-lab-pq-rotation/",
      note: "Operational rotation planning for moving production key exchange and data protection to PQ-safe systems.",
    },
    {
      title: "PQ TLS Handshake",
      url: "https://systemslibrarian.github.io/crypto-lab-pq-tls-handshake/",
      note: "Hybrid TLS handshake walkthrough showing where ML-KEM fits into post-quantum transport migration.",
    },
    {
      title: "Ciphertext Mirror",
      url: "https://systemslibrarian.github.io/crypto-lab-ciphertext-mirror/",
      note: "ML-KEM side-channel walkthrough across the Fujisaki-Okamoto transform, LDPC decoder behavior, and NTT blinding countermeasures.",
    },
    {
      title: "Hybrid Guide",
      url: "https://systemslibrarian.github.io/crypto-lab-hybrid-guide/",
      note: "Guide to hybrid post-quantum key exchange where a KEM combiner pairs X25519 with ML-KEM-768 so the session key holds if either half survives.",
    },
    {
      title: "LWE Hints",
      url: "https://systemslibrarian.github.io/crypto-lab-lwe-hints/",
      note: "Approximate-hint LWE secret recovery on sparse ternary secrets, counting how many hints collapse the underlying lattice problem.",
    },
    {
      title: "PQ Families",
      url: "https://systemslibrarian.github.io/crypto-lab-pq-families/",
      note: "Guided tour of the five post-quantum families — lattice, code-based, hash-based, multivariate, and isogeny — with assumptions and standardization status.",
    },
    {
      title: "E91",
      url: "https://systemslibrarian.github.io/crypto-lab-e91/",
      note: "Entanglement-based quantum key distribution using the CHSH Bell test, where an eavesdropper is caught by collapsing the Bell inequality.",
    },
    {
      title: "Hybrid PQC",
      url: "https://systemslibrarian.github.io/crypto-lab-hybrid-pqc/",
      note: "Compares classical, post-quantum, and hybrid key exchange with X25519 and ML-KEM-768 behind an HKDF combiner, breaking one half to show the hybrid survive.",
    },
  ],
  mlkem1024: [
    {
      title: "Kyber Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-kyber-vault/",
      note: "Interactive ML-KEM demo useful for comparing higher-security parameter sets.",
    },
    {
      title: "S-Cloud+ Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-scloud-vault/",
      note: "Post-quantum KEM workflow for long-lived cloud storage and envelope-encryption planning.",
    },
    {
      title: "Ciphertext Mirror",
      url: "https://systemslibrarian.github.io/crypto-lab-ciphertext-mirror/",
      note: "ML-KEM side-channel walkthrough across the Fujisaki-Okamoto transform, decoder behavior, and NTT blinding countermeasures.",
    },
  ],
  smaug_t: [
    {
      title: "Quantum Vault KPQC",
      url: "https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/",
      note: "KPQC candidate lab including comparison views for regional post-quantum schemes.",
    },
    {
      title: "NTRU Classic",
      url: "https://systemslibrarian.github.io/crypto-lab-ntru-classic/",
      note: "Lattice-encryption intuition builder for NTRU-style designs and their deployment tradeoffs.",
    },
  ],
  hqc: [
    {
      title: "HQC Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-hqc-vault/",
      note: "Code-based KEM flow and tradeoff walkthrough for HQC.",
    },
    {
      title: "HQC Timing Break",
      url: "https://systemslibrarian.github.io/crypto-lab-hqc-timing-break/",
      note: "Side-channel demo showing timing-sensitive failure modes in post-quantum KEM implementations.",
    },
    {
      title: "HQC Timing",
      url: "https://systemslibrarian.github.io/crypto-lab-hqc-timing/",
      note: "Timing leak in HQC's BCH decoder and how constant-time mitigations reshape the attack surface against the code-based KEM.",
    },
    {
      title: "Syndrome Drain",
      url: "https://systemslibrarian.github.io/crypto-lab-syndrome-drain/",
      note: "How code-based KEMs erode below NIST Level 1 when one key derives many session keys, with DOOM decoding one of D syndromes √D faster.",
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
    {
      title: "Syndrome Drain",
      url: "https://systemslibrarian.github.io/crypto-lab-syndrome-drain/",
      note: "Multi-instance degradation of code-based KEMs, where DOOM lets an attacker decode one of D syndromes √D faster as one key derives many sessions.",
    },
  ],
  mldsa44: [
    {
      title: "Dilithium Seal",
      url: "https://systemslibrarian.github.io/crypto-lab-dilithium-seal/",
      note: "Demonstrates ML-DSA signing and verification flow with lattice-based signatures.",
    },
    {
      title: "Dilithium Reject",
      url: "https://systemslibrarian.github.io/crypto-lab-dilithium-reject/",
      note: "ML-DSA internals lab focused on rejection sampling and signing-loop behavior.",
    },
    {
      title: "Hybrid Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-hybrid-sign/",
      note: "Composite-signature workflow combining classical and post-quantum authenticity guarantees.",
    },
    {
      title: "Threshold ML-DSA",
      url: "https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/",
      note: "Threshold post-quantum signing walkthrough for distributed ML-DSA key ownership.",
    },
    {
      title: "Broken Trust",
      url: "https://systemslibrarian.github.io/crypto-lab-broken-trust/",
      note: "Shows how leaking one bit of ML-DSA's per-signature masking randomness enables hill-climbing secret-key recovery without lattice reduction.",
    },
  ],
  mldsa65: [
    {
      title: "Dilithium Seal",
      url: "https://systemslibrarian.github.io/crypto-lab-dilithium-seal/",
      note: "Hands-on ML-DSA demo for signature generation and verification.",
    },
    {
      title: "Dilithium Reject",
      url: "https://systemslibrarian.github.io/crypto-lab-dilithium-reject/",
      note: "ML-DSA internals lab focused on rejection sampling and signing-loop behavior.",
    },
    {
      title: "Hybrid Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-hybrid-sign/",
      note: "Composite-signature workflow for pairing PQ signatures with a classical signature during migration.",
    },
    {
      title: "MPCitH Sign",
      url: "https://systemslibrarian.github.io/crypto-lab-mpcith-sign/",
      note: "Post-quantum signature design intuition from MPC-in-the-head constructions.",
    },
    {
      title: "Threshold ML-DSA",
      url: "https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/",
      note: "Threshold post-quantum signing workflow for higher-assurance distributed signature deployments.",
    },
    {
      title: "Broken Trust",
      url: "https://systemslibrarian.github.io/crypto-lab-broken-trust/",
      note: "Leakage-cryptanalysis lab recovering an ML-DSA secret subkey by hill-climbing on a single leaked bit of per-signature masking randomness.",
    },
    {
      title: "Multivariate UOV",
      url: "https://systemslibrarian.github.io/crypto-lab-multivariate/",
      note: "Real Unbalanced Oil-and-Vinegar signatures over GF(256), showing the MQ trapdoor and the 2022 Beullens attack that broke Rainbow.",
    },
    {
      title: "Hybrid PQC",
      url: "https://systemslibrarian.github.io/crypto-lab-hybrid-pqc/",
      note: "Composite Ed25519 + ML-DSA-65 signatures verified with AND, shown alongside classical and post-quantum signing so a single broken assumption still verifies.",
    },
  ],
  falcon512: [
    {
      title: "Falcon Seal",
      url: "https://systemslibrarian.github.io/crypto-lab-falcon-seal/",
      note: "Lattice signature demo focused on compact signatures and implementation caveats.",
    },
    {
      title: "HAWK",
      url: "https://systemslibrarian.github.io/crypto-lab-hawk/",
      note: "Alternative post-quantum signature lab for compact-signature tradeoffs and deployment comparisons.",
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
    {
      title: "Jevil",
      url: "https://systemslibrarian.github.io/crypto-lab-jevil/",
      note: "Hash-based few-time signature scheme over the Goldilocks field using Lagrange interpolation for bounded-use signing with reusable verification keys.",
    },
  ],
  xmss: [
    {
      title: "LMS/XMSS",
      url: "https://systemslibrarian.github.io/crypto-lab-lms-xmss/",
      note: "Stateful hash-based signature comparison centered on XMSS and LMS lifecycle management.",
    },
  ],
  lms_hss: [
    {
      title: "LMS Ledger",
      url: "https://systemslibrarian.github.io/crypto-lab-lms-ledger/",
      note: "Stateful hash-based signatures with Merkle authentication path intuition.",
    },
    {
      title: "LMS/XMSS",
      url: "https://systemslibrarian.github.io/crypto-lab-lms-xmss/",
      note: "Compares stateful hash-based signature families and the operational risks of one-time key reuse.",
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
    {
      title: "Collision Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-collision-vault/",
      note: "Verifies real published MD5 and SHA-1 collision pairs (SHAttered, chosen-prefix) in-browser and shows SHA-256 resisting the same attack.",
    },
    {
      title: "Merkle Proofs",
      url: "https://systemslibrarian.github.io/crypto-lab-merkle-proofs/",
      note: "Builds Merkle trees on SHA-256, generates inclusion proofs, and replays the RFC 6962 second-preimage and CVE-2012-2459 attacks with domain-separation defenses.",
    },
  ],
  sha512: [
    {
      title: "Hash Zoo",
      url: "https://systemslibrarian.github.io/crypto-lab-hash-zoo/",
      note: "Comparative hashing lab for collision and preimage intuition.",
    },
    {
      title: "Collision Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-collision-vault/",
      note: "Replays known MD5 and SHA-1 collisions and contrasts them with the collision resistance of the SHA-2 family.",
    },
  ],
  sha3_256: [
    {
      title: "Babel Hash",
      url: "https://systemslibrarian.github.io/crypto-lab-babel-hash/",
      note: "Hash family explorer with sponge-vs-Merkle-Damgard mental models.",
    },
    {
      title: "Collision Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-collision-vault/",
      note: "Demonstrates MD5/SHA-1 collision pairs and shows the SHA-3 sponge construction resisting the same identical- and chosen-prefix attacks.",
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
    {
      title: "JWT Forge",
      url: "https://systemslibrarian.github.io/crypto-lab-jwt-forge/",
      note: "Tamper with JWT claims and swap algorithms to watch alg:none and HS/RS key-confusion attacks succeed against a vulnerable verifier and fail against a correct one.",
    },
    {
      title: "Timing Side-Channel",
      url: "https://systemslibrarian.github.io/crypto-lab-timing-sidechannel/",
      note: "Recovers a secret one byte at a time from an early-exit comparison, then flattens the leak with a constant-time compare — the discipline behind MAC verification.",
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
    {
      title: "Shamir vs FROST",
      url: "https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/",
      note: "Contrasts Shamir secret-sharing reconstruction, which forms the key in memory, against FROST threshold signing, which never reconstructs it.",
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
    {
      title: "ZK Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-zk-arena/",
      note: "Side-by-side comparison of zk-SNARK and zk-STARK proof systems across setup phases, proving overhead, and verification cost.",
    },
  ],
  plonk: [
    {
      title: "SNARK Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-snark-arena/",
      note: "Universal setup and proof system comparison centered on PLONK and Groth16.",
    },
    {
      title: "ZK Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-zk-arena/",
      note: "Side-by-side comparison of zk-SNARK and zk-STARK proof systems, contrasting PLONK's universal setup with transparent STARKs.",
    },
  ],
  zk_stark: [
    {
      title: "STARK Tower",
      url: "https://systemslibrarian.github.io/crypto-lab-stark-tower/",
      note: "Transparent zk-STARK proving flow with AIR and FRI components explained.",
    },
    {
      title: "ZK Arena",
      url: "https://systemslibrarian.github.io/crypto-lab-zk-arena/",
      note: "Side-by-side comparison of zk-SNARK and zk-STARK proof systems, weighing transparent STARKs against trusted-setup SNARKs.",
    },
  ],
  bulletproofs: [
    {
      title: "Bulletproofs",
      url: "https://systemslibrarian.github.io/crypto-lab-bulletproofs/",
      note: "ZK range proofs on ristretto255 — 64-bit Pedersen commitments, aggregate proofs, and the inner-product argument.",
    },
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
    {
      title: "ORAM Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-oram-vault/",
      note: "Access-pattern privacy walkthrough showing where PIR and ORAM solve different leakage problems.",
    },
  ],
  it_pir: [
    {
      title: "Oblivious Shelf",
      url: "https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/",
      note: "Private retrieval and access-pattern leakage intuition.",
    },
    {
      title: "ORAM Vault",
      url: "https://systemslibrarian.github.io/crypto-lab-oram-vault/",
      note: "Access-pattern privacy walkthrough for stronger hiding guarantees in repeated query settings.",
    },
  ],
  aby: [
    {
      title: "PSI Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-psi-gate/",
      note: "Private set intersection workflow built from practical two-party secure computation patterns.",
    },
  ],
  elgamal: [
    {
      title: "ElGamal Plain",
      url: "https://systemslibrarian.github.io/crypto-lab-elgamal-plain/",
      note: "Public-key encryption walkthrough for multiplicative homomorphism and ciphertext expansion tradeoffs.",
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
    {
      title: "Educational RSA",
      url: "https://systemslibrarian.github.io/crypto-lab-rsa-educational/",
      note: "Textbook RSA key generation, encryption, and signatures on small numbers, factoring a weak key and contrasting deterministic textbook ciphertext with RSA-OAEP.",
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
    {
      title: "Shamir vs FROST",
      url: "https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/",
      note: "Compares FROST threshold Schnorr signing against Shamir secret sharing, showing the signing key never exists on any single machine.",
    },
  ],
  gg20: [
    {
      title: "GG20 Wallet",
      url: "https://systemslibrarian.github.io/crypto-lab-gg20-wallet/",
      note: "Threshold ECDSA signing with coordinator flow and abort handling.",
    },
    {
      title: "Paillier Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-paillier-gate/",
      note: "Additive homomorphic encryption walkthrough for the Paillier building blocks used in threshold ECDSA systems.",
    },
    {
      title: "Threshold Decrypt",
      url: "https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/",
      note: "Multi-party threshold workflow intuition for distributed wallet operations.",
    },
  ],
  dkls23: [
    {
      title: "Paillier Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-paillier-gate/",
      note: "Additive homomorphic encryption context for the arithmetic and proof machinery behind modern threshold ECDSA.",
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
    {
      title: "VDF",
      url: "https://systemslibrarian.github.io/crypto-lab-vdf/",
      note: "Verifiable Delay Function via repeated modular squaring with a Wesolowski proof — slow sequential evaluation, instant verification, for randomness beacons.",
    },
    {
      title: "Time-Lock Puzzle",
      url: "https://systemslibrarian.github.io/crypto-lab-time-lock-puzzle/",
      note: "RSW time-lock puzzle sealing a message behind fixed sequential squaring work, with a fail-closed cheat check and the creator's instant factorization trapdoor.",
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
    {
      title: "IBE Gate",
      url: "https://systemslibrarian.github.io/crypto-lab-ibe-gate/",
      note: "Identity-based encryption walkthrough rooted in pairing-based public-key constructions.",
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