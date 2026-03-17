export type HybridPattern = {
  id: string;
  name: string;
  category: "key-exchange" | "signature" | "encryption" | "hash-and-sign";
  classical: string;
  postQuantum: string;
  combinationMethod: string;
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
    deployedIn: ["Chrome 124+", "Firefox 132+", "Cloudflare", "AWS", "Fastly"],
    rationale: "Industry-standard PQ transition path. Maintains backward compatibility with classical-only servers via TLS negotiation. IETF standardization in progress.",
    limitations: "Increases ClientHello by ~1.2 KB, which may cause fragmentation issues with some middleboxes. Requires both classical and PQ implementations in the TLS stack.",
    recommendation: "recommended",
  },
];
