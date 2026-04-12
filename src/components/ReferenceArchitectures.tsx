"use client";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Architecture = {
  icon: string;
  title: string;
  flow: string;
  stack: { label: string; value: string }[];
  explanation: string[];
  properties: string[];
  algoIds: string[];
};

const ARCHITECTURES: Architecture[] = [
  {
    icon: "💬",
    title: "Secure Messaging System",
    flow: "Sender → Key Exchange → Session Keys → Encrypt Message → Authenticate → Transmit → Decrypt → Verify",
    stack: [
      { label: "Identity Keys", value: "ML-DSA-65 (long-lived signing key per user)" },
      { label: "Key Exchange", value: "X25519 + ML-KEM-768 hybrid (ephemeral per session)" },
      { label: "Key Derivation", value: "HKDF-SHA-256 (Double Ratchet for per-message keys)" },
      { label: "Message Encryption", value: "XChaCha20-Poly1305 (AEAD, 192-bit nonce)" },
      { label: "Hash Chain", value: "SHA-256 (conversation transcript binding)" },
    ],
    explanation: [
      "Each user generates a long-lived ML-DSA identity key pair. Public keys are uploaded to a server or distributed out-of-band.",
      "When Alice messages Bob, they perform a hybrid key exchange: X25519 for classical security + ML-KEM-768 for post-quantum safety. This produces a shared root secret.",
      "HKDF derives a chain of per-message keys from the root secret (Double Ratchet pattern). Each message uses a unique key — compromising one key doesn't reveal others.",
      "Each message is encrypted with XChaCha20-Poly1305 using a fresh key. The 192-bit nonce eliminates birthday collision risk even with random generation.",
      "Identity signatures authenticate the key exchange, preventing a man-in-the-middle from substituting their own keys.",
    ],
    properties: [
      "Confidentiality — only sender and recipient can decrypt messages",
      "Forward secrecy — compromising long-term keys doesn't expose past messages",
      "Post-compromise security — new ratchet steps restore security after temporary key compromise",
      "Post-quantum safety — ML-KEM-768 protects against future quantum computers",
      "Authentication — ML-DSA identity keys prevent impersonation",
    ],
    algoIds: ["mldsa65", "mlkem768", "hkdf", "xchacha20poly", "sha256"],
  },
  {
    icon: "🌐",
    title: "Web API / TLS-Like Transport",
    flow: "Client → ClientHello → Server Certificate → Hybrid Key Exchange → Derive Session Keys → Encrypted Application Data ↔ Server",
    stack: [
      { label: "Key Exchange", value: "X25519 + ML-KEM-768 (hybrid, ephemeral)" },
      { label: "Server Auth", value: "ECDSA P-256 certificate (ML-DSA transition planned)" },
      { label: "Record Encryption", value: "AES-256-GCM (with AES-NI) or ChaCha20-Poly1305 (fallback)" },
      { label: "Key Derivation", value: "HKDF-SHA-256 (TLS 1.3 key schedule)" },
      { label: "CSPRNG", value: "CTR-DRBG or ChaCha20-DRBG (session randomness)" },
    ],
    explanation: [
      "Client sends supported cipher suites and a hybrid key share (X25519 + ML-KEM-768 public values) in one round trip.",
      "Server responds with its certificate (ECDSA P-256 today, ML-DSA in future) and its half of the hybrid key share.",
      "Both sides independently derive the same session keys using HKDF over the combined shared secret. No party ever transmits the session key.",
      "All subsequent application data is encrypted with AES-256-GCM (if AES-NI available) or ChaCha20-Poly1305, using per-record sequence numbers as nonces.",
      "Ephemeral key exchange means each session uses fresh keys — even if the server's long-term certificate key is compromised, past sessions remain protected.",
    ],
    properties: [
      "Confidentiality — all application data encrypted with AEAD",
      "Server authentication — certificate chain verifies server identity",
      "Forward secrecy — ephemeral DH/KEM keys per session",
      "Replay protection — sequence numbers prevent message replay",
      "Post-quantum safety — hybrid KEM protects against harvest-now-decrypt-later",
    ],
    algoIds: ["mlkem768", "aes256gcm", "chacha20poly", "hkdf", "ctr_drbg"],
  },
  {
    icon: "📁",
    title: "File Encryption System",
    flow: "Passphrase → Argon2id → Master Key → HKDF → Per-File Key → AES-256-GCM Encrypt → Store (Ciphertext + Nonce + Salt + Tag)",
    stack: [
      { label: "Key Derivation (passphrase)", value: "Argon2id (memory-hard, ≥19 MiB, ≥2 iterations)" },
      { label: "Key Derivation (per-file)", value: "HKDF-SHA-256 (derive unique file key from master key + file ID)" },
      { label: "File Encryption", value: "AES-256-GCM or XChaCha20-Poly1305" },
      { label: "Nonce/IV Generation", value: "CSPRNG (random nonce per file — XChaCha20 preferred for random nonces)" },
      { label: "Integrity", value: "AEAD tag (GCM/Poly1305 — built into encryption)" },
    ],
    explanation: [
      "User provides a passphrase. Argon2id derives a master key using a random salt, high memory cost, and multiple iterations — this makes brute-force infeasible even with GPUs.",
      "Each file gets a unique encryption key via HKDF: master_key + file_identifier → file_key. This limits blast radius — compromising one file key doesn't expose others.",
      "The file is encrypted with AES-256-GCM (hardware-accelerated) or XChaCha20-Poly1305 (safe random nonces). The AEAD tag authenticates the ciphertext.",
      "Salt, nonce, and authentication tag are stored alongside the ciphertext (they are not secret). Only the passphrase-derived master key is secret.",
      "To decrypt: re-derive master key from passphrase + salt → derive file key → verify AEAD tag → decrypt. Tampered files fail tag verification.",
    ],
    properties: [
      "Confidentiality — AES-256 / ChaCha20 provides 256-bit symmetric encryption",
      "Integrity — AEAD tag detects any modification to ciphertext or associated data",
      "Brute-force resistance — Argon2id makes passphrase guessing prohibitively expensive",
      "Key isolation — per-file keys limit damage from individual key compromise",
      "Portability — standard formats (salt + nonce + ciphertext + tag) are self-contained",
    ],
    algoIds: ["argon2id", "hkdf", "aes256gcm", "xchacha20poly", "hmac_drbg"],
  },
  {
    icon: "🔑",
    title: "Password Authentication System",
    flow: "Registration: Password → Argon2id(salt) → Hash → Store(hash, salt, params)  ·  Login: Password → Argon2id(stored salt) → Compare Hash",
    stack: [
      { label: "Password Hashing", value: "Argon2id (time=2, memory=19456 KiB, parallelism=1)" },
      { label: "Salt Generation", value: "CSPRNG — 16 bytes random per user, stored with hash" },
      { label: "Transport Security", value: "TLS 1.3 (password never sent in plaintext)" },
      { label: "Session Token", value: "HMAC-SHA-256 or CSPRNG-generated opaque token" },
      { label: "Rate Limiting", value: "Application-level throttle (not crypto, but essential)" },
    ],
    explanation: [
      "On registration, generate a 16-byte random salt using a CSPRNG. Hash the password with Argon2id using the salt and configured cost parameters. Store only the hash, salt, and parameters — never the password.",
      "On login, retrieve the stored salt and parameters for the user. Re-hash the submitted password with identical Argon2id parameters and compare the result in constant time.",
      "Argon2id's memory-hardness means an attacker who steals the database must spend ≥19 MiB of RAM per guess — making GPU/ASIC parallel cracking infeasible at scale.",
      "The password is transmitted over TLS 1.3. After successful authentication, issue an HMAC-signed session token or a CSPRNG-generated opaque token. The password is never stored or logged.",
      "Constant-time comparison of hash values prevents timing side-channels that could reveal partial hash matches.",
    ],
    properties: [
      "Brute-force resistance — Argon2id memory-hardness defeats GPU/ASIC attacks",
      "Rainbow table resistance — unique per-user salt prevents precomputation",
      "Credential isolation — database breach exposes only hashes, not passwords",
      "Transport confidentiality — TLS 1.3 protects password in transit",
      "Timing-safe — constant-time comparison prevents side-channel leakage",
    ],
    algoIds: ["argon2id", "hmac_sha256", "chacha20_drbg", "aes256gcm"],
  },
  {
    icon: "✍️",
    title: "Document Signing & Verification",
    flow: "Document → SHA-256 Hash → Sign(private key) → Distribute(document + signature + certificate)  ·  Verify: Hash → Check Signature(public key) → Validate Certificate Chain",
    stack: [
      { label: "Hash", value: "SHA-256 or SHA-3-256 (document digest)" },
      { label: "Signature", value: "ML-DSA-65 (PQ-safe) or Ed25519 (classical)" },
      { label: "Certificate", value: "X.509 with CA chain (identity binding)" },
      { label: "Timestamping", value: "RFC 3161 TSA (prove signature existed at time T)" },
      { label: "Archival", value: "SLH-DSA / XMSS (hash-based, longest-lived PQ confidence)" },
    ],
    explanation: [
      "The document is hashed with SHA-256 to produce a fixed-size digest. The signer never signs the raw document — always the hash.",
      "The signer's private key (ML-DSA-65 for PQ safety, or Ed25519 for classical deployments) signs the hash. The signature is attached to the document along with the signer's certificate.",
      "The verifier independently hashes the document, then checks the signature against the signer's public key from the certificate. If the hash or signature doesn't match, the document has been tampered with.",
      "An RFC 3161 timestamp from a trusted authority proves the signature existed before a certain time — critical for legal documents and non-repudiation.",
      "For documents requiring validity over 20+ years, use SLH-DSA (SPHINCS+) — a hash-based scheme whose security depends only on hash function properties, the most conservative PQ assumption.",
    ],
    properties: [
      "Authenticity — signature proves the signer's identity via certificate chain",
      "Integrity — any modification to the document invalidates the signature",
      "Non-repudiation — signer cannot deny signing (with timestamping for temporal proof)",
      "Post-quantum safety — ML-DSA-65 protects against future quantum forgery",
      "Archival safety — SLH-DSA provides maximum long-term confidence",
    ],
    algoIds: ["sha256", "sha3_256", "mldsa65", "slh_dsa", "xmss"],
  },
];

function algoLink(id: string): string {
  return `${BASE_PATH}/?algo=${id}`;
}

export default function ReferenceArchitectures() {
  return (
    <div>
      {ARCHITECTURES.map((arch, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border)", padding: "20px 0" }}>
          <h3 style={{
            fontSize: "17px", fontWeight: 700, color: "var(--color-text-heading)", margin: "0 0 10px",
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span aria-hidden="true">{arch.icon}</span>
            {arch.title}
          </h3>

          {/* Flow diagram */}
          <div style={{
            background: "var(--color-bg-code)", border: "1px solid var(--color-border)", borderRadius: "8px",
            padding: "12px 16px", marginBottom: "14px", overflowX: "auto",
          }}>
            <div style={{
              fontSize: "12px", fontWeight: 700, color: "var(--color-text-dim)", textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: "6px",
            }}>Data Flow</div>
            <div style={{
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              fontSize: "13px", color: "var(--color-text-link)", lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>
              {arch.flow}
            </div>
          </div>

          {/* Stack */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-badge-green-text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              Cryptographic Stack
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              {arch.stack.map((s, j) => (
                <div key={j} style={{
                  display: "flex", gap: "8px", fontSize: "13px", lineHeight: 1.5,
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    color: "var(--color-text-dim)", fontWeight: 700, minWidth: "140px", flexShrink: 0,
                    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    fontSize: "12px",
                  }}>{s.label}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-accent-blue-label)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              How It Works
            </div>
            <ol style={{ margin: 0, paddingLeft: "20px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
              {arch.explanation.map((step, j) => <li key={j} style={{ marginBottom: "4px" }}>{step}</li>)}
            </ol>
          </div>

          {/* Security Properties */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-badge-yellow-text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              Security Properties
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7, listStyleType: "'✓ '" }}>
              {arch.properties.map((prop, j) => <li key={j}>{prop}</li>)}
            </ul>
          </div>

          {/* Algorithm links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
            {arch.algoIds.map((id) => (
              <a
                key={id}
                href={algoLink(id)}
                style={{
                  fontSize: "11px", fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  color: "var(--color-text-accent-bright)", background: "var(--color-bg-advisor)", border: "1px solid var(--color-border-accent)",
                  borderRadius: "4px", padding: "3px 8px", textDecoration: "none",
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
