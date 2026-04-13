"use client";

import Link from "next/link";
import { useState } from "react";

type SafeDefault = {
  id: string;
  useCase: string;
  recommendation: string;
  secondary: string;
  algorithmId: string;
  secondaryAlgorithmId?: string;
  why: string;
  whenNotAppropriate: string;
  commonMistakes: string[];
  wrongChoiceConsequence: string;
};

const SAFE_DEFAULTS: SafeDefault[] = [
  {
    id: "password-storage",
    useCase: "Password storage",
    recommendation: "Argon2id",
    secondary: "scrypt as fallback",
    algorithmId: "argon2id",
    secondaryAlgorithmId: "scrypt_pw",
    why: "Memory-hard password hashing raises attacker cost materially after database compromise. Argon2id combines memory hardness with GPU and side-channel resistance, making brute-force attacks orders of magnitude more expensive than hash-only or iteration-only approaches.",
    whenNotAppropriate: "When the target platform cannot allocate the required memory (e.g., extremely constrained embedded devices). When FIPS 140-2/3 compliance is mandatory and Argon2 is not yet in the approved list — bcrypt or PBKDF2 may be the only compliant options.",
    commonMistakes: [
      "Setting memory cost too low — defeats the purpose of memory hardness. OWASP recommends at least 19 MiB for Argon2id.",
      "Using Argon2d instead of Argon2id — Argon2d is vulnerable to side-channel attacks in multi-tenant environments.",
      "Storing the raw hash without the algorithm parameters — makes future cost tuning impossible without forcing all users to reset passwords.",
    ],
    wrongChoiceConsequence: "Using SHA-256 or MD5 for password storage allows attackers with GPU farms to crack millions of hashes per second after a database breach. A single commodity GPU can test billions of SHA-256 hashes/second.",
  },
  {
    id: "symmetric-encryption",
    useCase: "Symmetric encryption",
    recommendation: "AES-256-GCM",
    secondary: "XChaCha20-Poly1305 if nonce management is hard",
    algorithmId: "aes256gcm",
    secondaryAlgorithmId: "xchacha20poly",
    why: "AES-256-GCM provides authenticated encryption (AEAD) — confidentiality and integrity in a single operation. Hardware acceleration (AES-NI) makes it extremely fast on modern processors. NIST standardized and universally supported.",
    whenNotAppropriate: "When hardware AES acceleration is unavailable and constant-time software implementation is critical. When random nonce generation at high message volume risks nonce collision (the 96-bit GCM nonce limits safe random usage to ~2³² messages per key).",
    commonMistakes: [
      "Reusing a nonce with the same key — completely destroys GCM's authentication and can leak the authentication key (GHASH key), allowing forgery.",
      "Using AES-GCM without verifying the authentication tag before processing plaintext — enables chosen-ciphertext attacks.",
      "Encrypting more than ~64 GiB under a single key without re-keying — GCM's counter wraps and security degrades.",
    ],
    wrongChoiceConsequence: "Using AES-CBC without authentication allows padding oracle attacks that recover full plaintext. Using ECB mode leaks structural patterns in the data.",
  },
  {
    id: "authenticated-messaging",
    useCase: "Authenticated messaging",
    recommendation: "XChaCha20-Poly1305 + X25519 + HKDF",
    secondary: "—",
    algorithmId: "xchacha20poly",
    why: "The 192-bit nonce of XChaCha20-Poly1305 makes random nonce generation safe even at extremely high message volumes, eliminating the most common AEAD failure mode. Combined with X25519 key agreement and HKDF key derivation, this forms the basis of modern secure messaging stacks like libsodium's sealed box construction.",
    whenNotAppropriate: "When regulatory requirements mandate NIST-approved algorithms exclusively. When hardware AES acceleration is available and the nonce management discipline is strong — AES-256-GCM may be faster.",
    commonMistakes: [
      "Using the same key pair for both encryption and signing — key separation is essential.",
      "Skipping HKDF and using the raw X25519 shared secret directly as the encryption key — the shared secret is not uniformly distributed.",
      "Not implementing a ratcheting mechanism for ongoing conversations — a single compromised key exposes the entire message history.",
    ],
    wrongChoiceConsequence: "Using static RSA encryption without forward secrecy means a single key compromise decrypts all past messages. Using unauthenticated encryption allows an attacker to modify messages undetected.",
  },
  {
    id: "web-api-transport",
    useCase: "Web / API transport",
    recommendation: "TLS 1.3",
    secondary: "—",
    algorithmId: "chacha20poly",
    why: "TLS 1.3 eliminates legacy negotiation weaknesses, mandates forward secrecy, removes all known-weak cipher suites, and reduces handshake latency to a single round trip. It is the only version of TLS that should be deployed for new systems.",
    whenNotAppropriate: "When communicating with legacy systems that genuinely cannot upgrade beyond TLS 1.2 — but this should be treated as technical debt, not a design choice.",
    commonMistakes: [
      "Disabling certificate validation in development and forgetting to re-enable it — turns TLS into theater.",
      "Allowing TLS 1.0/1.1 fallback for 'compatibility' — this reopens downgrade attacks that TLS 1.3 was designed to eliminate.",
      "Using self-signed certificates in production without certificate pinning — enables trivial MITM attacks.",
    ],
    wrongChoiceConsequence: "Using TLS 1.0/1.1 exposes connections to BEAST, POODLE, and Lucky13 attacks. Using no transport encryption at all exposes every byte to any network observer.",
  },
  {
    id: "digital-signatures",
    useCase: "Digital signatures",
    recommendation: "Ed25519",
    secondary: "ML-DSA-65 for PQ planning",
    algorithmId: "ed25519",
    secondaryAlgorithmId: "mldsa65",
    why: "Ed25519 provides strong signatures with deterministic nonce generation (eliminating the most dangerous class of ECDSA bugs), compact 64-byte signatures, and a mature ecosystem. For post-quantum planning, ML-DSA-65 (NIST FIPS 204) provides 192-bit PQ security with reasonable signature sizes.",
    whenNotAppropriate: "When NIST P-256 ECDSA is mandated by regulatory compliance (FIPS 186-5). When signature size is the absolute priority and the system can handle the complexity of FALCON.",
    commonMistakes: [
      "Using ECDSA with a random nonce generator instead of deterministic nonces (RFC 6979) — a single weak nonce leaks the private key.",
      "Verifying signatures without checking the public key is from a trusted source — signatures prove the signer had the key, not that the signer is who you think.",
      "Mixing Ed25519 and Ed25519ph (prehashed) contexts — they produce different signatures for the same message.",
    ],
    wrongChoiceConsequence: "Using RSA-1024 for signatures provides only ~80 bits of security, which is below modern minimums. Using ECDSA with poor nonce generation has led to real-world private key recovery (PlayStation 3 hack, Bitcoin wallet thefts).",
  },
  {
    id: "key-exchange",
    useCase: "Key exchange",
    recommendation: "X25519",
    secondary: "ML-KEM-768 hybrid for PQ planning",
    algorithmId: "curve25519",
    secondaryAlgorithmId: "mlkem768",
    why: "X25519 is a safe-by-default Diffie-Hellman function on Curve25519, designed to resist implementation errors. For post-quantum readiness, ML-KEM-768 (NIST FIPS 203) can be combined in a hybrid scheme where the shared secrets are concatenated and fed through HKDF — already deployed in Chrome and Firefox TLS 1.3.",
    whenNotAppropriate: "When the system must interoperate with infrastructure that only supports P-256 ECDH. When NIST curve compliance is a hard requirement.",
    commonMistakes: [
      "Using the raw X25519 shared secret without running it through a KDF like HKDF — the output is not uniformly distributed.",
      "Implementing hybrid key exchange by XORing shared secrets instead of using a proper KDF combiner — XOR does not provide the required security reduction.",
      "Not validating the received public key (though X25519 is designed to be safe against most invalid-point attacks, this matters for other curves).",
    ],
    wrongChoiceConsequence: "Using static RSA key exchange provides no forward secrecy — a server key compromise decrypts all past sessions. Every classical-only key exchange is vulnerable to future quantum attack via Shor's algorithm.",
  },
  {
    id: "general-hash",
    useCase: "General-purpose hash",
    recommendation: "SHA-256",
    secondary: "BLAKE3 for performance-sensitive paths",
    algorithmId: "sha256",
    secondaryAlgorithmId: "blake3",
    why: "SHA-256 is the universal interoperability default: NIST standardized, hardware-accelerated on most modern processors, and the foundation of HMAC-SHA-256, HKDF, and certificate infrastructure. BLAKE3 offers massively parallel hashing at ~0.3 cycles/byte when raw throughput matters more than ecosystem compatibility.",
    whenNotAppropriate: "Never use SHA-256 for password hashing — it is too fast. When SHA-2 family diversity is a concern (SHA-3 provides a completely different construction). When the application requires variable-length output (SHA-3's SHAKE variants or BLAKE3 in XOF mode are better).",
    commonMistakes: [
      "Using SHA-256 directly for password storage — fast hashes enable brute force at billions of attempts per second.",
      "Assuming SHA-256 provides authentication — hashes do not authenticate. Use HMAC-SHA-256 for message authentication.",
      "Using length-extension attacks against bare SHA-256 — SHA-256 is vulnerable to length extension. Use HMAC or SHA-3 when this matters.",
    ],
    wrongChoiceConsequence: "Using MD5 for integrity checking is broken — practical collision attacks exist since 2004 (Xiaoyun Wang). Using SHA-1 is also collision-broken since 2017 (SHAttered attack). Both allow an attacker to create different files with the same hash.",
  },
  {
    id: "mac-integrity",
    useCase: "MAC / message integrity",
    recommendation: "HMAC-SHA-256",
    secondary: "—",
    algorithmId: "hmac_sha256",
    why: "HMAC-SHA-256 is the universal standard for keyed message authentication: NIST FIPS 198-1, used in TLS 1.3, IPsec, and JWT. It is PQ-safe (quantum attacks only halve the security to 128 bits via Grover's algorithm, which remains sufficient). Works with any hash function and has a clean security proof under the PRF assumption.",
    whenNotAppropriate: "When only a block cipher (AES) is available and no hash function is in the system — use CMAC-AES instead. When the Keccak/SHA-3 ecosystem is already in use — KMAC256 is a native alternative that avoids the HMAC wrapper.",
    commonMistakes: [
      "Comparing MACs using a non-constant-time comparison function — timing differences leak information about which bytes are correct.",
      "Using the same key for both encryption and MAC — key separation is a fundamental security principle.",
      "Truncating the MAC tag below 128 bits without understanding the collision risk — shorter tags reduce forgery resistance.",
    ],
    wrongChoiceConsequence: "Using a plain hash (SHA-256) instead of HMAC allows anyone to compute valid hashes without the key. Using CRC32 or similar checksums for integrity provides zero cryptographic security — CRCs are designed for error detection, not adversarial resistance.",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="focusRing controlBtn"
      style={{ fontSize: "12px", padding: "6px 12px" }}
      aria-label="Copy recommendation to clipboard"
    >
      {copied ? "✓ Copied" : "📋 Copy"}
    </button>
  );
}

function DefaultCard({ item }: { item: SafeDefault }) {
  const [expanded, setExpanded] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const markdownSummary = [
    `## ${item.useCase}`,
    `**Recommendation**: ${item.recommendation}`,
    item.secondary !== "—" ? `**Secondary**: ${item.secondary}` : "",
    "",
    `**Why**: ${item.why}`,
    "",
    `**When NOT appropriate**: ${item.whenNotAppropriate}`,
    "",
    "**Common mistakes**:",
    ...item.commonMistakes.map((m) => `- ${m}`),
    "",
    `**Wrong choice consequence**: ${item.wrongChoiceConsequence}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div
      id={item.id}
      style={{
        background: "var(--color-bg-card)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "10px",
        padding: "22px 24px",
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            fontFamily:
              "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            color: "var(--color-text-heading)",
          }}
        >
          {item.useCase}
        </h3>
        <CopyButton text={markdownSummary} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "14px",
        }}
      >
        <Link
          href={`${basePath}/?sel=${item.algorithmId}&from=advisor`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "var(--color-badge-green-bg)",
            color: "var(--color-badge-green-text)",
            border: "1px solid var(--color-badge-green-border)",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily:
              "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            textDecoration: "none",
          }}
        >
          ✅ {item.recommendation}
        </Link>
        {item.secondary !== "—" && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--color-badge-yellow-bg)",
              color: "var(--color-badge-yellow-text)",
              border: "1px solid var(--color-badge-yellow-border)",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {item.secondary}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "var(--color-text-body)",
          lineHeight: 1.7,
          marginBottom: "14px",
        }}
      >
        <strong style={{ color: "var(--color-text-accent-bright)" }}>
          Why:{" "}
        </strong>
        {item.why}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="focusRing"
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-link)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 700,
          padding: "4px 0",
          marginBottom: expanded ? "12px" : "0",
          fontFamily:
            "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: "12px",
            display: "inline-block",
            transition: "transform 0.15s",
            transform: expanded ? "rotate(90deg)" : "none",
            marginRight: "6px",
          }}
        >
          ▶
        </span>
        {expanded ? "Hide details" : "Details, pitfalls & consequences"}
      </button>

      {expanded && (
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid var(--color-border)",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-badge-orange-text)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              When NOT appropriate
            </div>
            <div style={{ color: "var(--color-text-body)" }}>
              {item.whenNotAppropriate}
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-badge-yellow-text)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              Common mistakes
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "var(--color-text-body)",
              }}
            >
              {item.commonMistakes.map((m) => (
                <li key={m} style={{ marginBottom: "6px" }}>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "6px",
              background: "var(--color-badge-red-bg)",
              border: "1px solid var(--color-badge-red-border)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-badge-red-text)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "6px",
              }}
            >
              Wrong choice consequence
            </div>
            <div style={{ color: "var(--color-accent-red-body)" }}>
              {item.wrongChoiceConsequence}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SafeDefaultsView() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="cryptoCompareRoot">
      <div className="headerGradientBar" aria-hidden="true" />
      <div className="pageShell">
        <header
          className="headerShell"
          style={{
            borderBottom: "1px solid var(--color-border-subtle)",
            padding: "22px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 700,
                  fontFamily:
                    "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  letterSpacing: "-0.5px",
                }}
              >
                <Link
                  href={basePath || "/"}
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span className="brandMark" aria-hidden="true">
                    ◈
                  </span>
                  <span>
                    <span style={{ color: "var(--color-accent-blue)" }}>
                      crypto
                    </span>
                    ::compare
                  </span>
                </Link>
              </h1>
            </div>
            <nav
              style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
              aria-label="Page navigation"
            >
              <Link
                href={basePath || "/"}
                className="focusRing controlBtn"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "13px",
                  padding: "8px 14px",
                }}
              >
                ← Algorithm Browser
              </Link>
              <Link
                href="/advisor"
                className="focusRing controlBtn"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "13px",
                  padding: "8px 14px",
                }}
              >
                Decision Wizard
              </Link>
            </nav>
          </div>
        </header>

        <main
          id="main-content"
          style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 0" }}
        >
          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "32px",
                fontWeight: 700,
                fontFamily:
                  "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                color: "var(--color-text-heading)",
                lineHeight: 1.3,
              }}
            >
              Safe Defaults
            </h2>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "17px",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              Conservative recommendations for the most common cryptographic
              decisions. Send this page to any engineer.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              Each recommendation links to its full entry in the algorithm
              browser. Click any algorithm badge for details, sources, and
              comparisons.
            </p>
          </section>

          <section
            aria-label="Safe default recommendations"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "48px",
            }}
          >
            {SAFE_DEFAULTS.map((item) => (
              <DefaultCard key={item.id} item={item} />
            ))}
          </section>

          <section
            style={{
              background:
                "linear-gradient(135deg, var(--color-bg-panel-gradient-from) 0%, var(--color-bg-panel-gradient-to) 100%)",
              border: "1px solid var(--color-bg-panel-border)",
              borderRadius: "10px",
              padding: "28px 32px",
              marginBottom: "48px",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "22px",
                fontWeight: 700,
                fontFamily:
                  "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                color: "var(--color-text-heading)",
              }}
            >
              Choosing the right algorithm is 20% of security.
            </h2>
            <div
              style={{
                fontSize: "15px",
                color: "var(--color-text-body)",
                lineHeight: 1.8,
              }}
            >
              <p style={{ margin: "0 0 14px" }}>
                The distinction between a <em>primitive</em> and a{" "}
                <em>protocol</em> is where most teams stumble. AES-256-GCM is a
                primitive — it encrypts a block of data with a key and a nonce.
                TLS 1.3 is a protocol — it negotiates keys, authenticates
                peers, handles session resumption, and defends against replay
                and downgrade. Choosing AES-256-GCM does not mean you have a
                secure transport layer any more than choosing good lumber means
                you have a house.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                Key generation, storage, and rotation are at least as critical
                as algorithm selection. A perfectly chosen cipher is worthless
                if the key is generated from a weak PRNG, stored in plaintext
                in a config file, or shared across environments. Keys should be
                generated from a CSPRNG, separated by purpose (never reuse an
                encryption key for authentication), and rotated on an explicit
                schedule rather than when someone remembers.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                Implementation risk is the silent killer. Misuse-resistant APIs
                (like libsodium&apos;s secretbox) exist because even expert
                developers make mistakes with low-level primitives. A nonce
                reused in AES-GCM does not produce a helpful error message — it
                silently destroys your authentication guarantees and can leak
                the GHASH key. Choose libraries that make the safe path the
                default path, not libraries that give you maximum rope.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                Deployment and key management infrastructure determine whether
                your cryptographic choices survive contact with reality. HSMs,
                secret managers, certificate authorities, rotation automation,
                and incident-response plans for key compromise are all part of
                the system. The algorithm is one parameter in a much larger
                security function.
              </p>
              <p style={{ margin: 0 }}>
                Correct crypto ≠ secure system. A system can use every
                recommended algorithm on this page and still be vulnerable to
                timing leaks, memory-safety bugs, insecure deserialization,
                broken access control, or a misconfigured reverse proxy that
                terminates TLS at the wrong boundary. Cryptography solves
                specific, well-defined problems. It does not solve the general
                problem of building secure software.
              </p>
            </div>
          </section>

          <footer
            style={{
              textAlign: "center",
              padding: "24px 0",
              borderTop: "1px solid var(--color-border-subtle)",
              fontSize: "14px",
              color: "var(--color-text-muted)",
            }}
          >
            <p style={{ margin: "0 0 8px" }}>
              <Link
                href={basePath || "/"}
                style={{
                  color: "var(--color-text-link)",
                  textDecoration: "none",
                }}
              >
                ← Back to algorithm browser
              </Link>
            </p>
            <p style={{ margin: 0, fontStyle: "italic" }}>
              <em>
                So whether you eat or drink or whatever you do, do it all for
                the glory of God.
              </em>{" "}
              — 1 Corinthians 10:31
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
