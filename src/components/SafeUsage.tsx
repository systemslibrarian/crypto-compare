"use client";

const SECTION = {
  heading: "12px" as const,
  headingColor: "var(--color-accent-blue-label)",
  text: "13px" as const,
  textColor: "var(--color-text-secondary)",
  mutedColor: "var(--color-text-muted)",
  lineHeight: 1.7,
  listPad: "18px",
};

export default function SafeUsage() {
  return (
    <div>
      {/* ── Critical Rules ── */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{
          fontSize: "15px", fontWeight: 700, color: "var(--color-badge-red-text)", margin: "0 0 8px",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span aria-hidden="true">⚠️</span> Critical Rules (Never Break These)
        </h3>
        <ul style={{ margin: 0, paddingLeft: SECTION.listPad, color: SECTION.textColor, fontSize: SECTION.text, lineHeight: SECTION.lineHeight }}>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never reuse a nonce</strong> with AES-GCM or ChaCha20-Poly1305. A single nonce reuse is a catastrophic failure — it leaks the authentication key and allows forgery.</li>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never encrypt without authentication.</strong> Use AEAD modes only (GCM, Poly1305, CCM). Unauthenticated encryption (CBC, CTR alone) enables padding oracles and ciphertext manipulation.</li>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never use MD5, SHA-1, or plain SHA-256 for passwords.</strong> Fast hashes let attackers try billions of guesses per second. Use Argon2id, bcrypt, or scrypt — they are intentionally slow.</li>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never use ECB mode.</strong> ECB preserves plaintext patterns in ciphertext. The &quot;ECB penguin&quot; is a famous visual demonstration of why this is broken.</li>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never hard-code keys or secrets in source code.</strong> Keys in code end up in version control, CI logs, container images, and eventually in attacker hands. Use a secrets manager.</li>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never roll your own crypto primitives.</strong> Custom ciphers, custom ECDSA implementations, custom key exchange protocols — these always have fatal bugs. Use audited libraries.</li>
          <li><strong style={{ color: "var(--color-badge-red-text)" }}>Never skip certificate/key verification.</strong> Setting <code style={{ background: "var(--color-bg-inset)", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" }}>verify=False</code> or accepting all certificates defeats the entire security model of TLS.</li>
        </ul>
      </div>

      {/* ── Key Management Basics ── */}
      <div style={{ marginBottom: "20px", borderTop: "1px solid var(--color-border)", paddingTop: "16px" }}>
        <h3 style={{
          fontSize: "15px", fontWeight: 700, color: "var(--color-badge-green-text)", margin: "0 0 8px",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span aria-hidden="true">🔐</span> Key Management Basics
        </h3>
        <ul style={{ margin: 0, paddingLeft: SECTION.listPad, color: SECTION.textColor, fontSize: SECTION.text, lineHeight: SECTION.lineHeight }}>
          <li><strong>Generate keys with a CSPRNG.</strong> Use <code style={{ background: "var(--color-bg-inset)", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" }}>crypto.getRandomValues()</code>, <code style={{ background: "var(--color-bg-inset)", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" }}>/dev/urandom</code>, or your platform&apos;s secure random API. Never use <code style={{ background: "var(--color-bg-inset)", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" }}>Math.random()</code> or unseeded PRNGs for cryptographic material.</li>
          <li><strong>Separate keys by purpose.</strong> Encryption keys, signing keys, and MAC keys must be different. Reusing a key across operations creates cross-protocol attacks.</li>
          <li><strong>Rotate keys on a schedule.</strong> Long-lived keys accumulate risk. TLS uses ephemeral session keys. Symmetric keys protecting active data should rotate at least annually.</li>
          <li><strong>Store keys in hardware or a secrets manager.</strong> HSMs, AWS KMS, Azure Key Vault, HashiCorp Vault, or OS keychains. Never store keys in environment variables, config files, or databases alongside the data they protect.</li>
          <li><strong>Apply least privilege.</strong> Applications should access only the specific keys they need. Separate encryption from decryption access where possible (envelope encryption).</li>
          <li><strong>Zeroize keys after use.</strong> Overwrite key material in memory when no longer needed. Many crypto libraries provide secure memory wiping functions — use them.</li>
        </ul>
      </div>

      {/* ── Library Guidance ── */}
      <div style={{ marginBottom: "20px", borderTop: "1px solid var(--color-border)", paddingTop: "16px" }}>
        <h3 style={{
          fontSize: "15px", fontWeight: 700, color: "var(--color-text-accent-bright)", margin: "0 0 8px",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span aria-hidden="true">📦</span> Library Guidance
        </h3>
        <p style={{ margin: "0 0 8px", color: SECTION.mutedColor, fontSize: SECTION.text, lineHeight: SECTION.lineHeight }}>
          Use high-level, audited cryptographic libraries. The implementations below have been reviewed by professional cryptographers and are maintained by teams with security-focused processes.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px", marginBottom: "10px" }}>
          {[
            { name: "libsodium / NaCl", lang: "C, bindings for all languages", note: "Misuse-resistant API by design" },
            { name: "BoringSSL", lang: "C (Google fork of OpenSSL)", note: "Powers Chrome, Android, Cloudflare" },
            { name: "ring", lang: "Rust", note: "Minimal, correctness-focused" },
            { name: "Web Crypto API", lang: "Browser JavaScript", note: "Built into all modern browsers" },
            { name: "Go crypto/*", lang: "Go", note: "Standard library, constant-time" },
            { name: "OpenSSL 3.x", lang: "C", note: "Widely deployed, FIPS-validated" },
            { name: "Bouncy Castle", lang: "Java / C#", note: "Broad algorithm coverage" },
            { name: "liboqs", lang: "C", note: "Post-quantum algorithms (Open Quantum Safe)" },
          ].map((lib) => (
            <div key={lib.name} style={{
              background: "var(--color-bg-inset)", border: "1px solid var(--color-border)", borderRadius: "6px",
              padding: "10px 12px", fontSize: "13px",
            }}>
              <div style={{ color: "var(--color-text)", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", fontSize: "12px" }}>{lib.name}</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "11px", marginTop: "2px" }}>{lib.lang}</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "12px", marginTop: "4px" }}>{lib.note}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, color: "var(--color-badge-red-text)", fontSize: "13px", fontWeight: 600, lineHeight: 1.6 }}>
          If the phrase &quot;I wrote my own AES implementation&quot; appears in your codebase, stop and replace it with a library call. Custom implementations are the #1 source of real-world crypto vulnerabilities.
        </p>
      </div>

      {/* ── What This Tool Does NOT Protect You From ── */}
      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "16px" }}>
        <h3 style={{
          fontSize: "15px", fontWeight: 700, color: "var(--color-badge-yellow-text)", margin: "0 0 8px",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span aria-hidden="true">🚫</span> What This Tool Does NOT Protect You From
        </h3>
        <ul style={{ margin: 0, paddingLeft: SECTION.listPad, color: SECTION.mutedColor, fontSize: SECTION.text, lineHeight: SECTION.lineHeight }}>
          <li><strong>Misuse of correct algorithms.</strong> AES-256-GCM is unbreakable — until you reuse a nonce or leak the key. Choosing the right algorithm is 10% of the battle. Using it correctly is the other 90%.</li>
          <li><strong>Implementation bugs.</strong> Timing side-channels, buffer overflows, memory leaks of key material, incorrect padding — these are implementation failures, not algorithm failures. Use audited libraries.</li>
          <li><strong>Side-channel attacks.</strong> Power analysis, electromagnetic emanation, cache-timing, and speculative execution attacks bypass the mathematical model entirely. Hardware countermeasures and constant-time code are required.</li>
          <li><strong>Key management failures.</strong> The most common real-world crypto failures are: key stored next to encrypted data, key never rotated, key logged in plaintext, key committed to Git. No algorithm can fix operational negligence.</li>
          <li><strong>System design flaws.</strong> Encrypting without authenticating, using signatures without verifying freshness, trusting client-side validation — these are architecture mistakes that render correct crypto useless.</li>
        </ul>
      </div>
    </div>
  );
}
