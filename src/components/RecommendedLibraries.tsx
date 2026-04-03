"use client";

interface LibEntry {
  name: string;
  note: string;
}

interface CategorySection {
  icon: string;
  title: string;
  color: string;
  libs: LibEntry[];
  notes: string[];
}

const CATEGORIES: CategorySection[] = [
  {
    icon: "🔐",
    title: "Symmetric Encryption",
    color: "#60a5fa",
    libs: [
      { name: "libsodium / NaCl", note: "Misuse-resistant AEAD (XChaCha20-Poly1305) by default. Bindings for every major language. Used in Minisign, age, and many modern tools." },
      { name: "BoringSSL", note: "Google's hardened OpenSSL fork. Powers Chrome, Android, Cloudflare, and AWS-LC. Includes AES-GCM with hardware acceleration." },
      { name: "Go crypto/cipher", note: "Standard library AES-GCM and ChaCha20-Poly1305. Constant-time, well-reviewed, used by the entire Go ecosystem." },
      { name: "ring (Rust)", note: "Minimal, correctness-focused. Backs rustls (the Rust TLS library). AES-GCM and ChaCha20-Poly1305." },
      { name: "Web Crypto API", note: "Built into all modern browsers. Provides AES-GCM and AES-CBC. No external dependency needed for client-side web apps." },
      { name: "OpenSSL 3.x", note: "Widely deployed, FIPS 140-2/3 validated. Supports AES-GCM, AES-CCM, ChaCha20-Poly1305. Use the EVP interface, never low-level calls." },
    ],
    notes: [
      "Prefer AEAD modes (AES-GCM, ChaCha20-Poly1305, XChaCha20-Poly1305). Never use unauthenticated modes (ECB, CBC alone, CTR alone) without a separate MAC.",
      "ChaCha20-Poly1305 is the safer default when hardware AES-NI is not available (mobile, IoT, embedded).",
      "For large files or streaming, prefer XChaCha20-Poly1305 (extended nonce) or use AES-GCM with a nonce-misuse-resistant construction (AES-GCM-SIV).",
    ],
  },
  {
    icon: "🔑",
    title: "Key Exchange / KEM",
    color: "#a78bfa",
    libs: [
      { name: "libsodium", note: "X25519 key exchange out of the box. Used by WireGuard, Signal, and age. Simple API, hard to misuse." },
      { name: "BoringSSL / AWS-LC", note: "X25519, P-256 ECDH, and ML-KEM (Kyber) for post-quantum hybrid key exchange. Used in Chrome's TLS 1.3 PQ experiments." },
      { name: "liboqs (Open Quantum Safe)", note: "Reference C implementations of ML-KEM (Kyber), BIKE, HQC, and other NIST PQC finalists. Designed for research and early integration." },
      { name: "pqcrypto (Rust)", note: "Rust bindings around PQClean's verified post-quantum implementations. Suitable for Rust-native PQ integration." },
      { name: "Go crypto/ecdh + mlkem768", note: "Standard library X25519/P-256 ECDH. Go 1.23+ includes crypto/mlkem for ML-KEM-768." },
    ],
    notes: [
      "For classical key exchange, X25519 is the recommended default — it is faster, simpler, and harder to misuse than ECDH over NIST curves.",
      "For post-quantum readiness, use hybrid key exchange: X25519 + ML-KEM-768. This is what Chrome and Cloudflare deploy today.",
      "PQClean provides clean, portable C reference implementations of all NIST PQC finalists. Use it when language-specific libraries aren't available.",
    ],
  },
  {
    icon: "✍️",
    title: "Digital Signatures",
    color: "#34d399",
    libs: [
      { name: "libsodium", note: "Ed25519 signatures. Deterministic, fast, constant-time. Used by SSH, WireGuard, Minisign, and most modern signing systems." },
      { name: "BoringSSL", note: "Ed25519, ECDSA (P-256, P-384), RSA. Battle-tested in Chrome and Android's code signing." },
      { name: "ring (Rust)", note: "Ed25519 and ECDSA. Minimal surface area, correctness-focused. Powers rustls." },
      { name: "Go crypto/ed25519", note: "Standard library Ed25519. Constant-time, well-reviewed." },
      { name: "liboqs", note: "ML-DSA (Dilithium), SLH-DSA (SPHINCS+), FN-DSA (Falcon) for post-quantum signatures. Early-stage but tracks NIST standards." },
      { name: "Bouncy Castle (Java / C#)", note: "Broad signature algorithm support including Ed25519, EdDSA, ECDSA, RSA-PSS, and post-quantum candidates." },
    ],
    notes: [
      "Ed25519 is the recommended default for new systems. It is deterministic (no nonce to misuse), fast, and has a 128-bit security level.",
      "For FIPS compliance, use ECDSA with P-256 or P-384, or RSA-PSS with 3072+ bit keys.",
      "For post-quantum, ML-DSA (Dilithium) is the NIST primary standard. SLH-DSA (SPHINCS+) is hash-based and conservative but has larger signatures.",
    ],
  },
  {
    icon: "#️⃣",
    title: "Hashing",
    color: "#fbbf24",
    libs: [
      { name: "libsodium", note: "BLAKE2b by default — faster than SHA-256 on all platforms, with a 256-bit security level." },
      { name: "OpenSSL / BoringSSL", note: "SHA-256, SHA-384, SHA-512, SHA-3. Hardware-accelerated on modern CPUs (SHA-NI extension)." },
      { name: "Go crypto/sha256, crypto/sha3", note: "Standard library SHA-2 and SHA-3 families. Constant-time, hardware-accelerated where available." },
      { name: "ring (Rust)", note: "SHA-256, SHA-384, SHA-512. Correctness-focused, suitable for TLS and certificate verification." },
      { name: "Web Crypto API", note: "SHA-256, SHA-384, SHA-512 in the browser. No external dependency required." },
    ],
    notes: [
      "SHA-256 is the safe default for general-purpose hashing (integrity checks, commitments, Merkle trees).",
      "BLAKE2b and BLAKE3 are faster alternatives with equivalent or better security margins. Prefer them when standards compliance is not required.",
      "SHA-3 (Keccak) is a backup standard with a completely different internal design from SHA-2. Use it when algorithm diversity is required.",
      "Never use MD5 or SHA-1 for security purposes. They are broken for collision resistance.",
    ],
  },
  {
    icon: "🔒",
    title: "Password Hashing",
    color: "#f87171",
    libs: [
      { name: "libsodium (crypto_pwhash)", note: "Argon2id — the OWASP recommended default. Memory-hard, resistant to GPU and ASIC attacks. libsodium provides safe parameter presets." },
      { name: "argon2 (reference C impl)", note: "The official Argon2 reference implementation from the PHC winners. Bindings available for most languages." },
      { name: "bcrypt (language-native)", note: "Available natively in Go (golang.org/x/crypto/bcrypt), Python (bcrypt), Ruby, PHP. Battle-tested for 25+ years. Good fallback when Argon2 is unavailable." },
      { name: "Go golang.org/x/crypto/argon2", note: "Official Go extended library. Argon2id with configurable memory/time/threads parameters." },
      { name: "Bouncy Castle", note: "Argon2, bcrypt, and scrypt for Java and C# environments." },
    ],
    notes: [
      "Argon2id is the recommended default (OWASP 2023). Minimum parameters: 64 MiB memory, 3 iterations, 1 degree of parallelism.",
      "bcrypt remains acceptable with a work factor of 12+. It has a 72-byte input limit — truncate or pre-hash long passwords with SHA-256.",
      "scrypt is acceptable but harder to tune correctly than Argon2id. Prefer Argon2id for new systems.",
      "Never use PBKDF2 with fewer than 600,000 iterations (OWASP 2023). It lacks memory-hardness and is vulnerable to GPU attacks.",
    ],
  },
  {
    icon: "🧪",
    title: "Key Derivation (KDF)",
    color: "#7dd3fc",
    libs: [
      { name: "libsodium (crypto_kdf)", note: "BLAKE2b-based KDF. Simple API for deriving subkeys from a master key. Ideal for key separation and domain separation." },
      { name: "OpenSSL / BoringSSL", note: "HKDF (RFC 5869) using HMAC-SHA-256 or HMAC-SHA-512. The standard KDF for protocol key derivation (TLS 1.3, Signal, Noise)." },
      { name: "Go golang.org/x/crypto/hkdf", note: "Standard HKDF implementation. Used extensively in Go TLS and secure protocol implementations." },
      { name: "ring (Rust)", note: "HKDF with HMAC-SHA-256/512. Used by rustls for TLS key derivation." },
      { name: "Web Crypto API", note: "HKDF and PBKDF2 available natively in browsers for deriving encryption keys from shared secrets." },
    ],
    notes: [
      "HKDF (extract-then-expand) is the standard KDF for protocol design. Use it to derive multiple keys from a shared secret.",
      "For password-based key derivation, use Argon2id or scrypt — not HKDF. HKDF assumes high-entropy input.",
      "Always include context/info strings in HKDF derivation to prevent cross-protocol key reuse.",
    ],
  },
  {
    icon: "🛡️",
    title: "MACs (Message Authentication Codes)",
    color: "#c084fc",
    libs: [
      { name: "libsodium", note: "Poly1305 (with ChaCha20 as AEAD) and HMAC-SHA-512-256. Poly1305 is a one-time authenticator — always used within an AEAD construction." },
      { name: "OpenSSL / BoringSSL", note: "HMAC-SHA-256, HMAC-SHA-384, HMAC-SHA-512, KMAC (SHA-3-based). HMAC is the workhorse MAC for most protocols." },
      { name: "Go crypto/hmac", note: "Standard library HMAC with any hash function. Includes constant-time comparison via crypto/subtle." },
      { name: "ring (Rust)", note: "HMAC-SHA-256/384/512. Used in rustls and other Rust crypto infrastructure." },
    ],
    notes: [
      "HMAC-SHA-256 is the safe default for message authentication, API signature verification, and integrity checking.",
      "Poly1305 is designed for single-use with a unique key per message — never use it standalone. It is always paired with ChaCha20 or XSalsa20 in an AEAD.",
      "Always use constant-time comparison when verifying MACs. Never compare MACs with == or memcmp.",
      "KMAC (Keccak-based MAC) is a SHA-3 MAC that does not need the HMAC construction. Use it when SHA-3 is already in your stack.",
    ],
  },
  {
    icon: "🎲",
    title: "CSPRNG (Cryptographically Secure Random)",
    color: "#fb923c",
    libs: [
      { name: "OS-provided (recommended)", note: "/dev/urandom (Linux), getentropy() (modern Linux/BSD), BCryptGenRandom (Windows), SecRandomCopyBytes (macOS/iOS). These are the ultimate trust anchors — use them." },
      { name: "libsodium (randombytes_buf)", note: "Wraps the OS CSPRNG with a simple, portable API. Consistent behavior across all platforms." },
      { name: "Web Crypto API (crypto.getRandomValues)", note: "Browser-native CSPRNG. Uses the OS entropy source. Available in all modern browsers and Node.js." },
      { name: "Go crypto/rand", note: "Standard library CSPRNG. Uses /dev/urandom on Unix, CryptGenRandom on Windows. The only correct source of randomness in Go." },
      { name: "Python secrets module", note: "Wraps os.urandom(). The recommended module for generating tokens, passwords, and keys in Python. Never use random.random() for security." },
      { name: "OpenSSL (RAND_bytes)", note: "NIST SP 800-90A compliant DRBG, seeded from the OS. FIPS-validated when running in FIPS mode." },
    ],
    notes: [
      "Always seed from the OS entropy source. Never use Math.random(), random.random(), rand(), or any non-cryptographic PRNG for security-sensitive operations.",
      "For token generation, use the highest-level API available: Python's secrets.token_hex(), Go's crypto/rand.Read(), Node's crypto.randomBytes().",
      "In virtualized or containerized environments, ensure the entropy pool is adequately seeded at boot. Consider virtio-rng or haveged for VMs.",
    ],
  },
];

const S = {
  text: "13px" as const,
  textColor: "#c4d1e3",
  mutedColor: "#93a4bb",
  lineHeight: 1.7,
  listPad: "18px",
  code: { background: "#0c1422", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" } as const,
};

export default function RecommendedLibraries() {
  return (
    <div>
      <p style={{ margin: "0 0 16px", color: S.mutedColor, fontSize: S.text, lineHeight: S.lineHeight }}>
        Algorithms are public standards — their security comes from mathematical proofs and decades of analysis, not from keeping the design secret.
        But a perfect algorithm becomes a vulnerability the moment it is implemented incorrectly: a leaked timing signal, a reused nonce, a mishandled buffer.{" "}
        <strong style={{ color: "#f87171" }}>Never write your own cryptographic primitives.</strong>{" "}
        Use the audited, battle-tested libraries listed below — they exist so you don&apos;t have to solve problems that took world-class cryptographers years to get right.
      </p>

      {CATEGORIES.map((cat, i) => (
        <div
          key={cat.title}
          style={{
            marginBottom: "20px",
            ...(i > 0 ? { borderTop: "1px solid #1e293b", paddingTop: "16px" } : {}),
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: cat.color,
              margin: "0 0 10px",
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span aria-hidden="true">{cat.icon}</span> {cat.title}
          </h3>

          {/* Libraries */}
          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#e2e8f0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Recommended Libraries
            </div>
            <ul style={{ margin: 0, paddingLeft: S.listPad, color: S.textColor, fontSize: S.text, lineHeight: S.lineHeight }}>
              {cat.libs.map((lib) => (
                <li key={lib.name} style={{ marginBottom: "4px" }}>
                  <strong style={{ color: "#e2e8f0" }}>{lib.name}</strong>
                  {" — "}
                  {lib.note}
                </li>
              ))}
            </ul>
          </div>

          {/* Notes */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Notes
            </div>
            <ul style={{ margin: 0, paddingLeft: S.listPad, color: S.mutedColor, fontSize: S.text, lineHeight: S.lineHeight }}>
              {cat.notes.map((note, j) => (
                <li key={j} style={{ marginBottom: "3px" }}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <p style={{
        margin: "16px 0 0",
        padding: "12px 14px",
        background: "#0c1422",
        border: "1px solid #1e293b",
        borderLeft: "3px solid #f87171",
        borderRadius: "6px",
        color: "#f87171",
        fontSize: "13px",
        fontWeight: 600,
        lineHeight: 1.6,
      }}>
        If your codebase contains a hand-written implementation of any cryptographic primitive — a custom AES, a homegrown ECDSA, a DIY key exchange — stop and replace it with a library call.
        Custom crypto implementations are the single most common source of real-world cryptographic vulnerabilities.
      </p>
    </div>
  );
}
