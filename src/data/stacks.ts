export type CryptoStack = {
  id: string;
  name: string;
  icon: string;
  description: string;
  primitives: {
    algorithmId: string;
    name: string;
    role: string;
    protectsAgainst: string;
  }[];
  tradeoffs: string;
  alternativeWhen: string;
  hybridPatternIds?: string[];
};

export const CRYPTO_STACKS: CryptoStack[] = [
  {
    id: "secure-messaging",
    name: "Secure Messaging",
    icon: "💬",
    description:
      "End-to-end encrypted messaging with forward secrecy, post-quantum readiness, and per-message key isolation. Reference: Signal Protocol with PQXDH.",
    primitives: [
      {
        algorithmId: "curve25519",
        name: "X25519",
        role: "Classical key agreement",
        protectsAgainst:
          "Passive eavesdropping. Provides ephemeral shared secrets for the DH ratchet.",
      },
      {
        algorithmId: "mlkem768",
        name: "ML-KEM-768",
        role: "Post-quantum key encapsulation (hybrid)",
        protectsAgainst:
          "Harvest-now-decrypt-later attacks by future quantum computers.",
      },
      {
        algorithmId: "xchacha20poly",
        name: "XChaCha20-Poly1305",
        role: "Message encryption (AEAD)",
        protectsAgainst:
          "Confidentiality and integrity of message content. 192-bit nonce eliminates collision risk in high-volume messaging.",
      },
      {
        algorithmId: "hkdf",
        name: "HKDF",
        role: "Key derivation and ratcheting",
        protectsAgainst:
          "Key reuse and compromise propagation. Derives per-message keys from chain keys, providing forward secrecy.",
      },
    ],
    tradeoffs:
      "Hybrid key exchange adds ~1.2 KB to initial handshake. Double Ratchet requires persistent session state on both sides. XChaCha20-Poly1305 lacks NIST FIPS approval — use AES-256-GCM if FIPS compliance is mandatory.",
    alternativeWhen:
      "Use AES-256-GCM instead of XChaCha20-Poly1305 when FIPS compliance is required and nonce discipline is guaranteed. Use Noise Protocol Framework for simpler two-party transport without full Double Ratchet complexity.",
    hybridPatternIds: ["x25519-mlkem768", "hybrid-tls13"],
  },
  {
    id: "password-storage",
    name: "Password Storage",
    icon: "🔒",
    description:
      "Memory-hard password hashing with tunable cost and key stretching for derived encryption keys. Designed to maximize attacker cost after database breach.",
    primitives: [
      {
        algorithmId: "argon2id",
        name: "Argon2id",
        role: "Password hashing",
        protectsAgainst:
          "Brute-force attacks after database compromise. Memory hardness defeats GPU and ASIC acceleration.",
      },
      {
        algorithmId: "hkdf",
        name: "HKDF",
        role: "Key stretching from password-derived material",
        protectsAgainst:
          "Key reuse across contexts. Derives separate encryption and authentication keys from the Argon2id output.",
      },
    ],
    tradeoffs:
      "Argon2id requires significant server memory per concurrent authentication. High memory cost settings can become a DoS vector if not rate-limited. Tuning parameters must balance security against user-facing latency.",
    alternativeWhen:
      "Use bcrypt when Argon2 library support is unavailable and the platform is memory-constrained. Use PBKDF2 only when FIPS 140-2/3 compliance mandates it and Argon2 is not yet in the approved list.",
  },
  {
    id: "file-encryption",
    name: "File Encryption",
    icon: "📁",
    description:
      "Authenticated encryption at rest with per-file key derivation and optional manifest signing. Protects stored data against unauthorized access and silent tampering.",
    primitives: [
      {
        algorithmId: "aes256gcm",
        name: "AES-256-GCM",
        role: "File content encryption (AEAD)",
        protectsAgainst:
          "Unauthorized read access and content tampering. Hardware-accelerated via AES-NI on most platforms.",
      },
      {
        algorithmId: "xchacha20poly",
        name: "XChaCha20-Poly1305",
        role: "Alternative AEAD (when AES-NI is unavailable)",
        protectsAgainst:
          "Same confidentiality and integrity guarantees. 192-bit nonce is safe for random generation per file.",
      },
      {
        algorithmId: "ed25519",
        name: "Ed25519",
        role: "Manifest signing",
        protectsAgainst:
          "Tampering with file metadata, directory structure, or encrypted blob references.",
      },
    ],
    tradeoffs:
      "AES-256-GCM requires unique nonces per file per key — sequential counters work but must never repeat. Ed25519 manifest signing adds complexity but prevents metadata manipulation. Neither provides post-quantum confidentiality without an additional ML-KEM wrapping layer.",
    alternativeWhen:
      "Use XChaCha20-Poly1305 exclusively when constant-time software implementation matters more than hardware acceleration. Add ML-KEM-768 hybrid key wrapping when long-term confidentiality against quantum adversaries is required.",
  },
  {
    id: "code-signing",
    name: "Code Signing / Software Supply Chain",
    icon: "📦",
    description:
      "Signature-based integrity for software artifacts, build manifests, and CI/CD pipelines. Ensures authenticity and non-repudiation of released code.",
    primitives: [
      {
        algorithmId: "ed25519",
        name: "Ed25519",
        role: "Artifact and manifest signing",
        protectsAgainst:
          "Unauthorized code modification, supply chain injection, and build tampering.",
      },
      {
        algorithmId: "mldsa65",
        name: "ML-DSA-65",
        role: "Post-quantum signature (future-proofing)",
        protectsAgainst:
          "Quantum attacks on classical signature schemes. Provides long-term non-repudiation assurance.",
      },
      {
        algorithmId: "sha256",
        name: "SHA-256",
        role: "Manifest hashing",
        protectsAgainst:
          "Collision attacks on file digests. Ensures each artifact has a unique, verifiable fingerprint.",
      },
    ],
    tradeoffs:
      "Ed25519 signatures are compact (64 bytes) but not post-quantum safe. ML-DSA-65 signatures are ~3.3 KB — significantly larger. Dual-signing (classical + PQ) doubles verification cost but hedges against both failure modes. SHA-256 manifest hashes are collision-resistant but not quantum-resistant for preimage attacks (128-bit PQ security via Grover).",
    alternativeWhen:
      "Use ECDSA P-256 when ecosystem tooling (e.g., existing PKI, npm, Docker Content Trust) does not yet support Ed25519. Use SLH-DSA when maximum PQ confidence is needed and signature size is acceptable (~7 KB).",
    hybridPatternIds: ["ed25519-slhdsa"],
  },
  {
    id: "tls-transport",
    name: "TLS / Web Transport",
    icon: "🌐",
    description:
      "Modern transport security with forward secrecy, hybrid post-quantum key exchange, and authenticated encryption. The foundation of all web and API security.",
    primitives: [
      {
        algorithmId: "curve25519",
        name: "X25519",
        role: "Classical ephemeral key agreement",
        protectsAgainst:
          "Passive eavesdropping. Ephemeral keys provide forward secrecy — past sessions remain secure if the server's long-term key is compromised.",
      },
      {
        algorithmId: "mlkem768",
        name: "ML-KEM-768",
        role: "Post-quantum key encapsulation (hybrid with X25519)",
        protectsAgainst:
          "Harvest-now-decrypt-later attacks. Already deployed in Chrome 124+ and Firefox 132+ TLS 1.3.",
      },
      {
        algorithmId: "aes256gcm",
        name: "AES-256-GCM",
        role: "Record-layer encryption (AEAD)",
        protectsAgainst:
          "Confidentiality and integrity of all data in transit.",
      },
    ],
    tradeoffs:
      "Hybrid key exchange adds ~1.2 KB to TLS ClientHello, which may cause fragmentation with some middleboxes. Both classical and PQ implementations must be maintained in the TLS stack. Prefer X25519 over P-256 for key agreement — simpler, fewer implementation pitfalls.",
    alternativeWhen:
      "Use P-256 ECDHE when regulatory compliance specifically requires NIST curves. Use ML-KEM-1024 instead of ML-KEM-768 for maximum PQ security margin in government or long-term-secret contexts.",
    hybridPatternIds: ["x25519-mlkem768", "hybrid-tls13"],
  },
  {
    id: "pq-migration",
    name: "Post-Quantum Migration",
    icon: "🛡️",
    description:
      "Layered hybrid approach to post-quantum transition. Combines classical algorithms with PQ algorithms so that security holds if either assumption survives. The migration strategy, not a replacement.",
    primitives: [
      {
        algorithmId: "mlkem768",
        name: "ML-KEM-768",
        role: "Post-quantum key encapsulation",
        protectsAgainst:
          "Shor's algorithm applied to classical Diffie-Hellman and RSA key exchange. Provides 192-bit PQ security.",
      },
      {
        algorithmId: "curve25519",
        name: "X25519",
        role: "Classical key agreement (hybrid partner)",
        protectsAgainst:
          "Acts as a safety net — if ML-KEM's lattice assumptions break, X25519 still provides 128-bit classical security.",
      },
      {
        algorithmId: "mldsa65",
        name: "ML-DSA-65",
        role: "Post-quantum digital signatures",
        protectsAgainst:
          "Quantum attacks on Ed25519/ECDSA signatures. Provides 192-bit PQ security for long-lived signing keys.",
      },
    ],
    tradeoffs:
      "Hybrid schemes double the cryptographic surface area — both algorithms must be correctly implemented and combined. ML-KEM and ML-DSA are lattice-based — a breakthrough in lattice cryptanalysis would affect both. For diversification, pair with code-based (HQC) or hash-based (SLH-DSA) alternatives. Migration is additive — layer PQ on top of classical, do not replace classical yet.",
    alternativeWhen:
      "Use ML-KEM-1024 + P-384 for maximum security margin. Use SLH-DSA instead of ML-DSA when hash-only security assumptions are preferred over lattice assumptions. Use Classic McEliece hybrid when extreme conservatism justifies the 261 KB public key.",
    hybridPatternIds: [
      "x25519-mlkem768",
      "ecdsa-mldsa44",
      "hybrid-tls13",
      "ed25519-slhdsa",
    ],
  },
];
