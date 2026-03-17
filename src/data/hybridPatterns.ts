export type HybridPattern = {
  id: string;
  name: string;
  category: "key-exchange" | "signature" | "encryption" | "hash-and-sign";
  classical: string;
  postQuantum: string;
  combinationMethod: string;
  diagram: string;
  deployedIn: string[];
  rationale: string;
  limitations: string;
  recommendation: "recommended" | "acceptable" | "research";
};

export const HYBRID_PATTERNS: HybridPattern[] = [
  {
    id: "x25519-mlkem768",
    name: "X25519 + ML-KEM-768",
    category: "key-exchange",
    classical: "X25519 (Curve25519 ECDH)",
    postQuantum: "ML-KEM-768 (FIPS 203)",
    combinationMethod: "Concatenate shared secrets then derive via HKDF: key = HKDF(X25519_ss || ML-KEM_ss)",
    diagram: "Client ──┬── X25519 ────→ ss₁ ──┐\n         │                       ├─→ HKDF(ss₁ ‖ ss₂) → shared key\n         └── ML-KEM-768 ─→ ss₂ ──┘",
    deployedIn: ["Chrome (TLS 1.3)", "Firefox (TLS 1.3)", "Cloudflare", "AWS KMS"],
    rationale: "If either assumption holds, the derived key is secure. X25519 provides well-understood classical security; ML-KEM-768 provides post-quantum security. Both are fast enough for interactive protocols.",
    limitations: "Hybrid handshake adds ~1.2 KB to TLS ClientHello. Both algorithms must be implemented and maintained. Combiner must be a secure KDF (not XOR).",
    recommendation: "recommended",
  },
  {
    id: "ecdsa-mldsa44",
    name: "ECDSA P-256 + ML-DSA-44",
    category: "signature",
    classical: "ECDSA P-256 (NIST FIPS 186-5)",
    postQuantum: "ML-DSA-44 (NIST FIPS 204)",
    combinationMethod: "Dual signatures: both signatures must verify. Certificate contains both public keys and signatures.",
    diagram: "Message ──┬── ECDSA P-256 ──→ sig₁ ──┐\n          │                          ├─→ cert = (pk₁, pk₂, sig₁, sig₂)\n          └── ML-DSA-44 ───→ sig₂ ──┘\n\nVerifier: accept iff BOTH sig₁ and sig₂ verify",
    deployedIn: ["IETF composite signatures draft", "Google internal PKI experiments"],
    rationale: "Certificate chains remain valid if either assumption holds. ECDSA provides backward compatibility with existing TLS infrastructure; ML-DSA provides PQ security.",
    limitations: "Dual signatures roughly double certificate size. Verification requires both algorithms. Composite certificate standards are still in draft (IETF).",
    recommendation: "acceptable",
  },
  {
    id: "x25519-classic-mceliece",
    name: "X25519 + Classic McEliece",
    category: "key-exchange",
    classical: "X25519 (Curve25519 ECDH)",
    postQuantum: "Classic McEliece (code-based)",
    combinationMethod: "Concatenate shared secrets then derive via HKDF. McEliece public key transmitted out-of-band or cached.",
    diagram: "Client ──┬── X25519 ───────────→ ss₁ ──┐\n         │                                ├─→ HKDF(ss₁ ‖ ss₂) → shared key\n         └── Classic McEliece ──→ ss₂ ──┘\n\n⚠ McEliece pk (~261 KB) sent out-of-band or cached",
    deployedIn: ["Mullvad VPN (experimental)", "Academic prototypes"],
    rationale: "Maximum PQ confidence: McEliece has 45+ years of cryptanalysis. X25519 provides classical fallback. Suitable when key size is not a constraint.",
    limitations: "McEliece public key is ~261 KB, impractical for inline TLS. Requires out-of-band key distribution or caching. Limited tooling.",
    recommendation: "research",
  },
  {
    id: "aes256-chacha20",
    name: "AES-256-GCM then ChaCha20-Poly1305",
    category: "encryption",
    classical: "AES-256-GCM",
    postQuantum: "ChaCha20-Poly1305 (not PQ-specific, but algorithmic diversity)",
    combinationMethod: "Encrypt-then-encrypt: first encrypt with AES-256-GCM, then encrypt the ciphertext with ChaCha20-Poly1305 using an independent key.",
    diagram: "Plaintext ──→ AES-256-GCM(k₁) ──→ ct₁ ──→ ChaCha20-Poly1305(k₂) ──→ ct₂\n\nDecrypt: ct₂ ──→ ChaCha20⁻¹(k₂) ──→ ct₁ ──→ AES-GCM⁻¹(k₁) ──→ plaintext\n\nk₁ ≠ k₂ (independent keys required)",
    deployedIn: ["Theoretical / defense-in-depth architectures"],
    rationale: "If either cipher is broken, the other provides confidentiality. Orthogonal implementations (hardware AES-NI vs software ChaCha) also provide side-channel diversity.",
    limitations: "Doubles encryption cost. Two independent keys must be managed. Rarely justified outside ultra-high-assurance contexts.",
    recommendation: "research",
  },
  {
    id: "ed25519-slhdsa",
    name: "Ed25519 + SLH-DSA-128s",
    category: "hash-and-sign",
    classical: "Ed25519 (RFC 8032)",
    postQuantum: "SLH-DSA-128s (NIST FIPS 205, hash-based)",
    combinationMethod: "Dual signatures with independent key pairs. Both must verify for acceptance.",
    diagram: "Message ──┬── Ed25519 ──────→ sig₁ (64 B) ───┐\n          │                                     ├─→ accept iff BOTH verify\n          └── SLH-DSA-128s ──→ sig₂ (~7 KB) ──┘",
    deployedIn: ["IETF composite signatures draft", "Signal (exploring PQ transition)"],
    rationale: "SLH-DSA relies only on hash function security (maximum PQ confidence). Ed25519 provides compact classical signatures. Together, they hedge against both lattice breaks and hash function breaks.",
    limitations: "SLH-DSA-128s signatures are ~7 KB, significantly increasing message size. Slower signing than ML-DSA. Only justified when lattice assumption diversity is critical.",
    recommendation: "acceptable",
  },
  {
    id: "hybrid-tls13",
    name: "Hybrid TLS 1.3 Key Exchange",
    category: "key-exchange",
    classical: "ECDHE (P-256 or X25519)",
    postQuantum: "ML-KEM-768 (FIPS 203)",
    combinationMethod: "TLS 1.3 key_share extension carries both ECDHE and ML-KEM shares. Shared secrets are concatenated and fed into the TLS key schedule.",
    diagram: "ClientHello ──→ key_share: [X25519_pk, ML-KEM_pk]\n                              ↓\nServerHello ──→ key_share: [X25519_ct, ML-KEM_ct]\n                              ↓\nBoth sides:  HKDF(X25519_ss ‖ ML-KEM_ss) → TLS master secret",
    deployedIn: ["Chrome 124+", "Firefox 132+", "Cloudflare", "AWS", "Fastly"],
    rationale: "Industry-standard PQ transition path. Maintains backward compatibility with classical-only servers via TLS negotiation. IETF standardization in progress.",
    limitations: "Increases ClientHello by ~1.2 KB, which may cause fragmentation issues with some middleboxes. Requires both classical and PQ implementations in the TLS stack.",
    recommendation: "recommended",
  },
  {
    id: "p256-mlkem1024",
    name: "P-256 + ML-KEM-1024 (High-Security KEM)",
    category: "key-exchange",
    classical: "ECDH P-256 (NIST FIPS 186-5)",
    postQuantum: "ML-KEM-1024 (FIPS 203, 256-bit PQ security)",
    combinationMethod: "Concatenate shared secrets and derive via HKDF. Uses ML-KEM-1024 for maximum PQ security margin.",
    diagram: "Client ──┬── ECDH P-256 ────→ ss₁ ──┐\n         │                            ├─→ HKDF(ss₁ ‖ ss₂) → shared key\n         └── ML-KEM-1024 ───→ ss₂ ──┘\n\nML-KEM-1024: 1,568 B pk • 1,568 B ct • 256-bit PQ security",
    deployedIn: ["AWS KMS (FIPS mode)", "Government/classified hybrid proposals", "CNSA 2.0 transition guidance"],
    rationale: "Maximum standardized PQ security margin (256-bit). P-256 provides FIPS-compliant classical component. Suitable for long-term secrets, government, and high-assurance environments where conservative margins are required.",
    limitations: "ML-KEM-1024 has larger keys/ciphertexts than ML-KEM-768 (~50% larger). P-256 is slower than X25519. Only justified when 256-bit PQ security margin is required.",
    recommendation: "acceptable",
  },
  {
    id: "ml-dsa65-falcon512",
    name: "ML-DSA-65 + FALCON-512 (Diverse PQ Signatures)",
    category: "signature",
    classical: "ML-DSA-65 (NIST FIPS 204, lattice-based)",
    postQuantum: "FALCON-512 (NTRU lattice, compact signatures)",
    combinationMethod: "Dual PQ signatures from different lattice families. Both must verify. Hedges against a structural break in one lattice construction.",
    diagram: "Message ──┬── ML-DSA-65 ───→ sig₁ (3,309 B) ──┐\n          │                                        ├─→ accept iff BOTH verify\n          └── FALCON-512 ──→ sig₂ (~666 B) ───────┘\n\nDiversity: Module-LWE (ML-DSA) vs NTRU lattice (FALCON)",
    deployedIn: ["Academic PQ diversity proposals", "IETF composite signatures draft"],
    rationale: "Both are PQ-safe but rely on different lattice assumptions (Module-LWE vs NTRU). If one lattice construction suffers a structural break, the other still provides PQ security. Useful when hedging within the lattice family itself.",
    limitations: "Both signatures are PQ-only — no classical fallback. Combined signature size is ~4 KB. FALCON requires careful constant-time implementation for signing. Research-stage combination.",
    recommendation: "research",
  },
];
