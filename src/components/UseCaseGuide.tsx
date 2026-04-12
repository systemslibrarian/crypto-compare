"use client";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Scenario = {
  icon: string;
  title: string;
  goal: string;
  stack: string[];
  why: string[];
  realWorld: string[];
  avoid: string[];
  whenChanges: string;
  /** Algorithm IDs for linking */
  algoIds: string[];
};

const SCENARIOS: Scenario[] = [
  {
    icon: "💬",
    title: "Secure Messaging App",
    goal: "End-to-end encrypted messaging where only sender and recipient can read messages. Forward secrecy so past messages stay safe even if keys are compromised later.",
    stack: [
      "Encryption → XChaCha20-Poly1305 (message payload)",
      "Key exchange → ML-KEM-768 hybrid with X25519 (session key agreement)",
      "Signatures → ML-DSA-65 (identity verification)",
      "KDF → HKDF (ratchet key derivation)",
      "Hash → SHA-256 or SHA-3-256 (message chain hashing)",
    ],
    why: [
      "XChaCha20-Poly1305 provides authenticated encryption with a 192-bit nonce, making random nonce generation safe for high-volume messaging — no nonce reuse catastrophe.",
      "Hybrid KEM (ML-KEM + X25519) gives forward secrecy AND post-quantum safety. If either primitive holds, the key exchange is secure.",
      "HKDF-based key ratcheting ensures compromise of one message key doesn't expose past or future messages (Double Ratchet pattern).",
      "ML-DSA-65 provides quantum-resistant identity binding for long-lived signing keys.",
    ],
    realWorld: [
      "Signal Protocol (X25519 + AES-256-GCM + HKDF ratchet — PQ upgrade planned with PQXDH)",
      "WhatsApp, Google Messages RCS (Signal Protocol derivatives)",
      "Apple iMessage (transitioning to PQ3 with ML-KEM)",
      "Matrix/Element (Olm/Megolm — X25519 + AES-256)",
    ],
    avoid: [
      "Don't use RSA for key exchange — too slow, not forward-secret, broken by quantum.",
      "Don't use AES-GCM with random nonces in high-volume messaging — 96-bit nonce birthday limit means collision risk after ~2³² messages per key.",
      "Don't skip the key ratchet — without forward secrecy, one key compromise exposes the entire conversation history.",
    ],
    whenChanges: "Once ML-KEM is universally deployed, drop the X25519 classical side of the hybrid. If XChaCha20 gets an IETF RFC, it becomes even more strongly recommended.",
    algoIds: ["xchacha20poly", "mlkem768", "mldsa65", "hkdf", "sha256"],
  },
  {
    icon: "🔑",
    title: "Password Storage / Authentication",
    goal: "Store user passwords so that even if the database is stolen, attackers cannot recover plaintext passwords. Resist GPU, ASIC, and brute-force attacks.",
    stack: [
      "Password hashing → Argon2id (primary choice)",
      "Fallback → bcrypt (if Argon2 unavailable)",
      "CSPRNG → ChaCha20-DRBG or HMAC-DRBG (salt generation)",
    ],
    why: [
      "Argon2id is memory-hard AND GPU/ASIC-resistant — it forces attackers to use large amounts of RAM per guess, making parallel cracking prohibitively expensive.",
      "Argon2id combines Argon2i (side-channel resistant) and Argon2d (data-dependent hardness) — best of both.",
      "Memory hardness is the critical property: bcrypt and PBKDF2 can be parallelized on GPUs. Argon2id cannot without matching memory per core.",
      "OWASP recommends Argon2id with ≥19 MiB memory, ≥2 iterations, 1 degree of parallelism as the minimum configuration.",
    ],
    realWorld: [
      "1Password (Argon2id for master password derivation)",
      "Bitwarden (Argon2id, migrated from PBKDF2)",
      "PHP password_hash() default (bcrypt, Argon2id option)",
      "Linux /etc/shadow (supports Argon2id via libcrypt2)",
    ],
    avoid: [
      "Never use MD5, SHA-1, or SHA-256 alone for passwords — they are fast hashes, not password hashes. An attacker with a GPU can try billions per second.",
      "Don't use PBKDF2 for new systems — it lacks memory hardness and can be massively parallelized on GPUs and ASICs.",
      "Don't use a fixed salt or no salt — every password must have a unique random salt to prevent rainbow table attacks.",
    ],
    whenChanges: "No foreseeable change. Argon2id won the Password Hashing Competition and remains the best choice. Tune memory/iteration parameters upward as hardware improves.",
    algoIds: ["argon2id", "bcrypt", "chacha20_drbg", "hmac_drbg"],
  },
  {
    icon: "📁",
    title: "Encrypting Files at Rest",
    goal: "Protect files stored on disk, in cloud storage, or in backups. Ensure confidentiality and integrity so tampered files are detected.",
    stack: [
      "Encryption → AES-256-GCM (with AES-NI) or XChaCha20-Poly1305 (without hardware acceleration)",
      "Key derivation → HKDF (from a master key) or Argon2id (from a passphrase)",
      "CSPRNG → HMAC-DRBG or CTR-DRBG (IV/nonce generation)",
    ],
    why: [
      "AES-256-GCM provides authenticated encryption with hardware acceleration (AES-NI) — encrypts at ~1 cycle/byte on modern CPUs.",
      "XChaCha20-Poly1305's 192-bit nonce is ideal for at-rest encryption where nonces are generated randomly rather than counted — no birthday collision risk.",
      "Authenticated encryption (GCM/Poly1305) detects tampering automatically. Never encrypt without authentication.",
      "HKDF derives per-file keys from a single master key, limiting blast radius if one file key is exposed.",
    ],
    realWorld: [
      "BitLocker (AES-256 in XTS mode for full-disk encryption)",
      "FileVault (AES-256-XTS)",
      "age encryption tool (XChaCha20-Poly1305 + X25519)",
      "Rclone crypt (XChaCha20-Poly1305 for cloud file encryption)",
    ],
    avoid: [
      "Never use ECB mode — it leaks patterns in plaintext. The ECB penguin is a famous demonstration.",
      "Don't use AES-CBC without a separate MAC — CBC alone provides no integrity protection and is vulnerable to padding oracle attacks.",
      "Don't reuse nonces/IVs with AES-GCM — a single nonce reuse is a catastrophic failure that leaks the authentication key.",
    ],
    whenChanges: "If post-quantum data confidentiality is required (e.g., classified data that must be secret for 30+ years), wrap the file key with ML-KEM in addition to classical key exchange.",
    algoIds: ["aes256gcm", "xchacha20poly", "hkdf", "argon2_kdf", "hmac_drbg", "ctr_drbg"],
  },
  {
    icon: "🌐",
    title: "Encrypting Data in Transit (API / Web)",
    goal: "Protect data moving between clients and servers over networks. Provide confidentiality, integrity, authentication, and forward secrecy.",
    stack: [
      "Protocol → TLS 1.3 (mandatory — do not use TLS 1.2 for new systems)",
      "Cipher suite → AES-256-GCM or ChaCha20-Poly1305",
      "Key exchange → X25519 + ML-KEM-768 (hybrid PQ)",
      "Signatures → ML-DSA-65 or ECDSA P-256 (server certificate)",
      "MAC → Provided by AEAD cipher (GCM/Poly1305)",
    ],
    why: [
      "TLS 1.3 removes all legacy negotiation — no CBC, no RSA key exchange, no SHA-1. Every connection gets forward secrecy by default.",
      "AES-256-GCM is the performance leader with AES-NI; ChaCha20-Poly1305 is the fallback for devices without hardware AES acceleration.",
      "Hybrid PQ key exchange (X25519 + ML-KEM) protects against \"harvest now, decrypt later\" attacks where adversaries record encrypted traffic to break it with future quantum computers.",
      "Forward secrecy means each session uses ephemeral keys — compromising the server's long-term key doesn't compromise past sessions.",
    ],
    realWorld: [
      "Every HTTPS website (TLS 1.3 is the default in all major browsers since 2020)",
      "Cloudflare, AWS, Google Cloud (all support hybrid PQ key exchange since 2024)",
      "WireGuard VPN (ChaCha20-Poly1305 + Curve25519 + BLAKE2s)",
      "gRPC, GraphQL over HTTPS — all inherit TLS transport security",
    ],
    avoid: [
      "Don't use TLS 1.0/1.1 — deprecated by IETF (RFC 8996). Don't allow TLS 1.2 fallback to CBC cipher suites.",
      "Don't use RSA key exchange (static RSA) — it provides no forward secrecy. TLS 1.3 removed it for this reason.",
      "Don't disable certificate validation or pin certificates without a robust rotation strategy.",
    ],
    whenChanges: "Hybrid PQ key exchange is already recommended. Once ML-KEM certificates are standardized, switch server certificates from ECDSA to ML-DSA.",
    algoIds: ["aes256gcm", "chacha20poly", "mlkem768", "mldsa65"],
  },
  {
    icon: "🛡️",
    title: "Long-Term Sensitive Data (Post-Quantum)",
    goal: "Protect data that must remain confidential for 20–50+ years — classified information, medical records, financial archives, legal documents — against future quantum computers.",
    stack: [
      "KEM → ML-KEM-1024 (NIST FIPS 203, highest security level)",
      "Encryption → AES-256-GCM (256-bit key, 128-bit PQ security via Grover)",
      "Signatures → SLH-DSA / SPHINCS+ (hash-based, zero reliance on lattice assumptions)",
      "Hash → SHA-3-256 or SHA-512 (quantum-resistant hash functions)",
      "Key derivation → HKDF with SHA-3",
    ],
    why: [
      "ML-KEM-1024 provides NIST Security Level 5 — the highest standardized post-quantum security. Uses module-lattice assumptions with the strongest parameters.",
      "AES-256 retains 128-bit security against Grover's quantum search — adequate for all foreseeable quantum computers.",
      "SLH-DSA (SPHINCS+) is hash-based, requiring ONLY hash function security — no lattice, no number theory. It survives even if lattice problems are broken.",
      "\"Harvest now, decrypt later\" is a real threat: nation-state adversaries are believed to be storing encrypted traffic today to decrypt with future quantum computers.",
    ],
    realWorld: [
      "NSA CNSA 2.0 Suite (mandates ML-KEM, ML-DSA for national security systems by 2030)",
      "Chrome/Firefox hybrid PQ key exchange (X25519 + ML-KEM-768, active since 2024)",
      "Signal PQXDH protocol (X25519 + ML-KEM hybrid for message key agreement)",
      "NIST PQC Migration Timeline: hybrid deployment by 2027, full PQ by 2035",
    ],
    avoid: [
      "Don't rely solely on RSA or ECDSA for long-term secrets — Shor's algorithm breaks them completely.",
      "Don't wait to start migration — the transition to PQ crypto takes years of testing, deployment, and interoperability work.",
      "Don't assume only KEM needs PQ upgrade — signatures for long-lived certificates and code signing must also be PQ-safe.",
    ],
    whenChanges: "This IS the change. If lattice assumptions are weakened, fall back to hash-based signatures (SLH-DSA/XMSS) and code-based KEMs (Classic McEliece or HQC).",
    algoIds: ["mlkem1024", "aes256gcm", "slh_dsa", "sha3_256", "hkdf", "classic_mceliece", "hqc"],
  },
  {
    icon: "✍️",
    title: "Digital Signatures (Documents / APIs)",
    goal: "Digitally sign documents, API requests, software packages, or JWTs so that recipients can verify the signer's identity and detect any tampering.",
    stack: [
      "Signatures → ML-DSA-65 (post-quantum, NIST FIPS 204)",
      "Classical fallback → ECDSA P-256 or Ed25519 (if PQ is not yet required)",
      "Hash → SHA-256 or SHA-3-256 (document hashing before signing)",
      "Timestamping → RFC 3161 TSA (prove when a signature was created)",
    ],
    why: [
      "ML-DSA-65 is NIST FIPS 204 standardized, PQ-safe, and offers a good balance between signature size (~3.3 KB) and security level.",
      "Ed25519 provides unique deterministic signing — no randomness needed per signature, eliminating a class of implementation bugs that have caused real-world key leakage (Sony PS3 ECDSA fail).",
      "For hybrid deployments, sign with BOTH ML-DSA and ECDSA — security holds if either primitive is unbroken.",
      "Signature verification is fast for all recommended schemes — sub-millisecond for classical, low milliseconds for PQ.",
    ],
    realWorld: [
      "Git commit/tag signing (GPG/SSH signatures using Ed25519)",
      "AWS API Signature v4 (HMAC-SHA-256 for API request signing)",
      "Sigstore/cosign (code signing for containers and software supply chains)",
      "PDF document signing (ECDSA P-256 or RSA-2048 via Adobe Acrobat)",
    ],
    avoid: [
      "Don't use RSA-1024 or DSA — deprecated key sizes with known weaknesses.",
      "Don't use ECDSA without careful nonce management — nonce reuse or bias leaks the private key. Use deterministic ECDSA (RFC 6979) or Ed25519.",
      "Don't sign data directly — always hash with SHA-256/SHA-3 first, then sign the hash.",
    ],
    whenChanges: "Once ML-DSA is universally supported in toolchains and certificate authorities, it should replace Ed25519/ECDSA as the primary signing algorithm.",
    algoIds: ["mldsa65", "mldsa44", "slh_dsa", "sha256", "sha3_256"],
  },
  {
    icon: "🤝",
    title: "Key Exchange Between Two Systems",
    goal: "Establish a shared secret between two parties over an untrusted network, with forward secrecy, so that a compromised long-term key doesn't expose past sessions.",
    stack: [
      "KEM → ML-KEM-768 (NIST FIPS 203) in hybrid with X25519",
      "KDF → HKDF-SHA-256 (derive symmetric keys from shared secret)",
      "Authentication → Mutual ML-DSA or ECDSA certificate verification",
    ],
    why: [
      "ML-KEM-768 + X25519 hybrid gives forward secrecy with post-quantum safety — security holds if either assumption is valid.",
      "ML-KEM encapsulation/decapsulation is very fast (~0.1ms) — negligible overhead versus classical-only key exchange.",
      "HKDF extracts a uniform key from the KEM shared secret, then expands it into application-specific symmetric keys.",
      "Ephemeral KEM keys per session provide forward secrecy — compromise of long-term signing keys doesn't reveal past session keys.",
    ],
    realWorld: [
      "TLS 1.3 hybrid key exchange (X25519 + ML-KEM-768 — deployed in Chrome, Firefox, Cloudflare)",
      "Signal PQXDH (X25519 + ML-KEM for asynchronous key agreement)",
      "WireGuard (Curve25519 ECDH — PQ hybrid extensions in development)",
      "SSH (X25519 key exchange, PQ hybrid extensions in OpenSSH 9.x)",
    ],
    avoid: [
      "Don't use static RSA key exchange — no forward secrecy, broken by Shor's.",
      "Don't use raw Diffie-Hellman in small groups (1024-bit) — deprecated by NIST, only 80-bit classical security.",
      "Don't skip KDF — raw shared secrets from DH/KEM are not uniformly random and must be processed through HKDF before use as symmetric keys.",
    ],
    whenChanges: "Once all endpoints support ML-KEM natively with NIST certification, drop the X25519 classical component. Monitor NIST for potential parameter adjustments.",
    algoIds: ["mlkem768", "hkdf", "mldsa65"],
  },
  {
    icon: "📱",
    title: "Low-Power / Mobile Devices",
    goal: "Provide strong encryption on devices with limited battery, CPU, and memory — phones, IoT sensors, wearables, embedded systems.",
    stack: [
      "Encryption → ChaCha20-Poly1305 (constant-time, no AES-NI needed)",
      "KEM → ML-KEM-768 (small ciphertexts, fast on ARM)",
      "Signatures → ML-DSA-44 (smallest PQ signature parameter set)",
      "Hash → BLAKE3 or SHA-256 (fast on ARM)",
      "MAC → Poly1305 or SipHash (fast, constant-time)",
    ],
    why: [
      "ChaCha20-Poly1305 outperforms AES on devices without AES-NI hardware — constant-time by construction with no lookup tables, immune to cache-timing side-channels.",
      "ML-KEM-768 ciphertexts are only ~1088 bytes — much smaller than Classic McEliece, practical for bandwidth-constrained IoT.",
      "BLAKE3 is extremely fast in software on ARM processors — 2–4× faster than SHA-256 without hardware acceleration.",
      "All recommended primitives here are constant-time, avoiding timing side-channels that are especially dangerous on shared-hardware IoT platforms.",
    ],
    realWorld: [
      "WireGuard on iOS/Android (ChaCha20-Poly1305 + Curve25519)",
      "Signal on mobile (ChaCha20-Poly1305 for message encryption)",
      "ARM TrustZone / Apple Secure Enclave (hardware crypto acceleration)",
      "Matter smart home protocol (uses NIST P-256 + AES-CCM for IoT device auth)",
    ],
    avoid: [
      "Don't use software AES without AES-NI — it's slower AND leaks timing information through cache access patterns.",
      "Don't use Classic McEliece on constrained devices — public keys are 200+ KB, impractical for IoT.",
      "Don't use RSA on embedded systems — key generation is slow and keys are large.",
    ],
    whenChanges: "If the target device has AES-NI or ARM AES extensions (most modern phones do), AES-256-GCM is equally good. Check your target hardware.",
    algoIds: ["chacha20poly", "mlkem768", "mldsa44", "blake3", "poly1305", "siphash"],
  },
  {
    icon: "⚡",
    title: "High-Performance Systems (Throughput Critical)",
    goal: "Maximize encryption throughput for high-bandwidth applications — CDNs, database encryption, video streaming, financial trading systems.",
    stack: [
      "Encryption → AES-256-GCM with AES-NI (~1 cycle/byte, ~10+ GB/s on modern CPUs)",
      "CSPRNG → CTR-DRBG (AES-256) (fastest NIST-approved DRBG with AES-NI, ~1–2 GB/s)",
      "Hash → SHA-256 with SHA-NI or BLAKE3 (parallelizable, ~GB/s throughput)",
      "MAC → CMAC-AES-256 (hardware accelerated) or KMAC256",
    ],
    why: [
      "AES-256-GCM with AES-NI achieves ~1 cycle/byte — encrypting 10+ GB/s on a single core. No software cipher comes close.",
      "CTR-DRBG with AES-NI provides the fastest NIST-approved random number generation — critical for TLS session key generation at scale.",
      "SHA-256 with Intel SHA Extensions (SHA-NI) achieves hardware-accelerated hashing. BLAKE3 achieves comparable throughput through parallelism.",
      "Hardware acceleration is the critical difference — all recommendations assume AES-NI and SHA-NI are available on the target platform.",
    ],
    realWorld: [
      "Cloudflare (AES-256-GCM for TLS termination on millions of connections simultaneously)",
      "Netflix (AES for DRM and content encryption in transit)",
      "Database TDE (Transparent Data Encryption — AES-256 in SQL Server, PostgreSQL, Oracle)",
      "NVMe self-encrypting drives (AES-256-XTS at hardware line speed)",
    ],
    avoid: [
      "Don't use ChaCha20 when AES-NI is available — it's 2–4× slower than hardware AES.",
      "Don't use RSA for per-request operations — it's orders of magnitude slower than symmetric crypto.",
      "Don't encrypt without authentication (use AEAD modes only) — the performance cost of authentication is negligible compared to debugging integrity failures.",
    ],
    whenChanges: "If PQ key exchange overhead becomes a bottleneck, evaluate ML-KEM-512 (NIST Level 1) for reduced latency at slightly lower security margin.",
    algoIds: ["aes256gcm", "ctr_drbg", "sha256", "blake3", "cmac_aes", "kmac256"],
  },
  {
    icon: "🎭",
    title: "Zero-Knowledge / Privacy-Preserving Systems",
    goal: "Prove something is true without revealing the underlying data — e.g., prove you're over 18 without revealing your birthday, or prove a transaction is valid without revealing the amount.",
    stack: [
      "General-purpose ZKP → Groth16 (if trusted setup is acceptable, smallest proofs)",
      "Transparent ZKP → PLONK (universal trusted setup, reusable across circuits)",
      "No trusted setup → zk-STARKs (transparent, post-quantum safe, larger proofs)",
      "Range proofs → Bulletproofs (no trusted setup, logarithmic proof size)",
      "Supporting hash → SHA-256 or Poseidon (ZK-friendly)",
    ],
    why: [
      "Groth16 produces the smallest proofs (~128 bytes) with the fastest verification (~milliseconds) — ideal for on-chain verification where gas costs depend on proof size.",
      "PLONK's universal setup means one ceremony works for all circuits — deploy new programs without new trusted setups.",
      "zk-STARKs are transparent (no trusted setup) and post-quantum safe, but produce larger proofs (~50–200 KB). Preferred for systems requiring long-term security.",
      "Bulletproofs are ideal for range proofs (e.g., \"this value is between 0 and 2⁶⁴\") without any trusted setup — used in confidential transactions.",
    ],
    realWorld: [
      "Zcash (Groth16 for shielded transactions — proof of valid transaction without revealing sender, receiver, or amount)",
      "zkSync, Polygon zkEVM, Scroll (PLONK/Groth16 variants for Ethereum L2 rollups)",
      "StarkNet (zk-STARKs for transparent, PQ-safe L2 scaling)",
      "Monero (Bulletproofs for confidential transaction amounts)",
    ],
    avoid: [
      "Don't use Groth16 where the trusted setup cannot be properly executed — a compromised setup allows proof forgery.",
      "Don't use ZKPs where a simpler construction (e.g., hash commitment) suffices — ZK proof systems add substantial complexity.",
      "Don't assume ZKPs automatically provide anonymity — they prove computational statements. Privacy depends on what the circuit is designed to hide.",
    ],
    whenChanges: "As zk-STARK proof sizes decrease and verifiers become cheaper, they may replace Groth16/PLONK as the default due to transparency and PQ safety.",
    algoIds: ["groth16", "plonk", "zk_stark", "bulletproofs", "sha256"],
  },
];

function algoLink(id: string): string {
  return `${BASE_PATH}/?algo=${id}`;
}

export default function UseCaseGuide() {
  return (
    <div>
      {SCENARIOS.map((s, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border)", padding: "20px 0" }}>
          <h3 style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--color-text-heading)",
            margin: "0 0 10px",
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span aria-hidden="true">{s.icon}</span>
            Use Case: {s.title}
          </h3>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Goal</div>
            <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>{s.goal}</p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Recommended Stack</div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: 1.8, listStyleType: "'▸ '" }}>
              {s.stack.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Why This Works</div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
              {s.why.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Real-World Examples</div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
              {s.realWorld.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Avoid This</div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
              {s.avoid.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>When This Changes</div>
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.6 }}>{s.whenChanges}</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
            {s.algoIds.map((id) => (
              <a
                key={id}
                href={algoLink(id)}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  color: "var(--color-text-accent-bright)",
                  background: "var(--color-bg-advisor)",
                  border: "1px solid #1e3a5f",
                  borderRadius: "4px",
                  padding: "3px 8px",
                  textDecoration: "none",
                }}
              >
                {id}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
