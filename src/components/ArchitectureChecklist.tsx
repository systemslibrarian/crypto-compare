"use client";

import { useState } from "react";
import Link from "next/link";

type CheckItem = {
  id: string;
  label: string;
  detail: string;
};

type CheckSection = {
  title: string;
  icon: string;
  items: CheckItem[];
};

const SECTIONS: CheckSection[] = [
  {
    title: "Key Management",
    icon: "🔑",
    items: [
      { id: "km-1", label: "Keys are generated from a CSPRNG (not Math.random or similar)", detail: "Use os.urandom, crypto.getRandomValues, or /dev/urandom. Never seed from time or PID." },
      { id: "km-2", label: "Key material is stored in a KMS, HSM, or encrypted keystore — not in source code", detail: "Secrets in code are extractable from version control. Use environment variables as a minimum; hardware-backed storage for production." },
      { id: "km-3", label: "Key rotation schedule is defined and documented", detail: "Define maximum key lifetime. Automate rotation where possible. Document the rollover procedure." },
      { id: "km-4", label: "Separate keys for separate purposes (encryption vs. signing vs. MAC)", detail: "Key separation prevents cross-protocol attacks. Derive purpose-specific keys using HKDF with distinct info labels." },
      { id: "km-5", label: "Key destruction procedure exists for decommissioned keys", detail: "Zeroing memory, secure deletion from storage, and revocation of public keys." },
    ],
  },
  {
    title: "Algorithm Selection",
    icon: "🧮",
    items: [
      { id: "as-1", label: "All algorithms are 'recommended' or 'acceptable' — no 'legacy' or 'avoid'", detail: "Use crypto::compare recommendation levels as a starting point. Legacy algorithms require a documented migration plan." },
      { id: "as-2", label: "Symmetric encryption uses authenticated encryption (AEAD)", detail: "AES-256-GCM or XChaCha20-Poly1305. Never use ECB, CBC without MAC, or unauthenticated modes." },
      { id: "as-3", label: "Password storage uses memory-hard hashing (Argon2id, bcrypt, scrypt)", detail: "Never use SHA-256, MD5, or fast hashes for passwords. Tune cost parameters to ≥100ms per hash." },
      { id: "as-4", label: "Post-quantum migration path is identified for public-key cryptography", detail: "Document which components use RSA/ECDSA/ECDH and plan hybrid or full PQ migration (ML-KEM, ML-DSA)." },
      { id: "as-5", label: "Hash functions used for authentication use HMAC construction", detail: "Raw SHA-256 is vulnerable to length extension. Use HMAC-SHA-256 or KMAC256 for keyed authentication." },
    ],
  },
  {
    title: "Protocol Design",
    icon: "📐",
    items: [
      { id: "pd-1", label: "Nonces are never reused with the same key", detail: "AES-GCM nonce reuse is catastrophic. Use random nonces with XChaCha20 or counter-based nonces with strict monotonicity." },
      { id: "pd-2", label: "All ciphertext is authenticated before processing (encrypt-then-MAC or AEAD)", detail: "Decrypt-then-verify enables padding oracle attacks. AEAD modes handle this correctly by construction." },
      { id: "pd-3", label: "TLS 1.3 is the minimum for transport security", detail: "TLS 1.0/1.1 are deprecated. TLS 1.2 is acceptable with proper cipher suite selection. TLS 1.3 removes legacy modes." },
      { id: "pd-4", label: "Certificate validation is enforced — no disabled hostname checks or self-signed exceptions in production", detail: "Disabling certificate validation defeats the purpose of TLS. Pin certificates or use CT logs for high-value connections." },
      { id: "pd-5", label: "Timing-safe comparison is used for MAC verification and authentication tokens", detail: "Use constant-time comparison (e.g., hmac.compare_digest, crypto.timingSafeEqual). Variable-time comparison leaks secrets." },
    ],
  },
  {
    title: "Implementation Safety",
    icon: "🛡️",
    items: [
      { id: "is-1", label: "Cryptographic libraries are audited and actively maintained", detail: "Use libraries with published audit reports. Check the Implementation Map for verified options per ecosystem." },
      { id: "is-2", label: "No custom cryptographic primitives — only standard, peer-reviewed algorithms", detail: "Rolling your own crypto is the #1 cause of cryptographic failures. Use established libraries and standard algorithms." },
      { id: "is-3", label: "Sensitive data is zeroed from memory after use", detail: "Use secure memory wiping APIs (e.g., sodium_memzero). Compiler optimizations may remove naive zeroing." },
      { id: "is-4", label: "Error messages do not leak cryptographic details (padding validity, MAC status, etc.)", detail: "Padding oracle and bleichenbacher attacks exploit detailed error messages. Return generic errors for crypto failures." },
      { id: "is-5", label: "Side-channel resistance is verified for the deployment environment", detail: "Constant-time implementations for secrets processing. No secret-dependent branches or memory access patterns." },
    ],
  },
  {
    title: "Operational Security",
    icon: "🔒",
    items: [
      { id: "os-1", label: "Entropy sources are validated at startup", detail: "Check that /dev/urandom or equivalent is functional. Fail closed if entropy is insufficient." },
      { id: "os-2", label: "Cryptographic operations are logged (without logging sensitive material)", detail: "Log algorithm choices, key IDs, operation timestamps. Never log plaintext, keys, or raw nonces." },
      { id: "os-3", label: "Incident response plan includes cryptographic compromise scenarios", detail: "Document steps for: key compromise, algorithm break announcement, certificate revocation, mass re-encryption." },
      { id: "os-4", label: "Regular dependency updates include cryptographic library patches", detail: "Subscribe to security advisories for all crypto dependencies. Automate vulnerability scanning." },
      { id: "os-5", label: "Backup encryption keys are tested for recovery", detail: "Encrypted backups are useless if the decryption key is lost. Test key recovery procedure regularly." },
    ],
  },
  {
    title: "Compliance & Documentation",
    icon: "📋",
    items: [
      { id: "cd-1", label: "Cryptographic inventory lists all algorithms, key sizes, and libraries in use", detail: "Maintain a living document. Include algorithm, key size, library, version, and purpose for each crypto operation." },
      { id: "cd-2", label: "Compliance requirements are mapped to algorithm choices (FIPS, PCI, HIPAA, etc.)", detail: "FIPS 140-2/3 mandates specific NIST algorithms. PCI DSS requires strong cryptography. Document the mapping." },
      { id: "cd-3", label: "Migration plan exists for deprecated algorithms", detail: "Before an algorithm reaches 'legacy' status, have a tested migration path. Include timeline, testing plan, and rollback procedure." },
      { id: "cd-4", label: "Third-party integrations use secure cryptographic configurations", detail: "Verify that APIs, SDKs, and partner connections enforce strong TLS, proper authentication, and current algorithms." },
      { id: "cd-5", label: "Cryptographic design decisions are documented with rationale", detail: "Record why each algorithm was chosen, what alternatives were considered, and when the decision should be revisited." },
    ],
  },
];

export default function ArchitectureChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const totalItems = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function toggleCheck(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleSection(title: string) {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  function exportMarkdown(): string {
    const lines: string[] = [];
    lines.push("# Cryptographic Architecture Checklist");
    lines.push(`\nGenerated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
    lines.push(`Progress: ${checkedCount}/${totalItems} items checked\n`);
    for (const section of SECTIONS) {
      lines.push(`## ${section.icon} ${section.title}\n`);
      for (const item of section.items) {
        const mark = checked[item.id] ? "x" : " ";
        lines.push(`- [${mark}] **${item.label}**`);
        lines.push(`  - ${item.detail}`);
      }
      lines.push("");
    }
    lines.push("---");
    lines.push("Source: crypto::compare Architecture Checklist");
    return lines.join("\n");
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(exportMarkdown()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }, () => {});
  }

  function downloadMarkdown() {
    const blob = new Blob([exportMarkdown()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crypto-architecture-checklist.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 20px 64px" }}>
      <Link href="/" style={{ fontSize: "14px", color: "var(--color-text-link)", textDecoration: "none", marginBottom: "16px", display: "inline-block" }}>
        ← Back to crypto::compare
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", margin: "0 0 8px" }}>
        Architecture Checklist
      </h1>
      <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 16px" }}>
        Pre-deployment cryptographic architecture review. Check items as you verify them, then export the checklist for your records.
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-body)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
            {checkedCount}/{totalItems} verified
          </span>
          <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
            {totalItems - checkedCount === 0 ? "✓ All items verified" : `${totalItems - checkedCount} remaining`}
          </span>
        </div>
        <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-bg-control)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "4px", background: checkedCount === totalItems ? "var(--color-badge-green-text, #5ce65c)" : "var(--color-accent-blue, #4a9eff)", width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%`, transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <button onClick={copyToClipboard} className="focusRing" style={{ background: "var(--color-bg-control)", color: "var(--color-text-body)", border: "1px solid var(--color-border-muted)", borderRadius: "6px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          {copied ? "✓ Copied" : "📋 Copy as Markdown"}
        </button>
        <button onClick={downloadMarkdown} className="focusRing" style={{ background: "var(--color-bg-control)", color: "var(--color-text-body)", border: "1px solid var(--color-border-muted)", borderRadius: "6px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          ↓ Download .md
        </button>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {SECTIONS.map((section) => {
          const sectionChecked = section.items.filter((item) => checked[item.id]).length;
          const isExpanded = expandedSections[section.title] !== false; // default open
          return (
            <section key={section.title} style={{ border: "1px solid var(--color-border)", borderRadius: "10px", overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                aria-expanded={isExpanded}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "var(--color-bg-card)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  {section.icon} {section.title}
                </span>
                <span style={{ fontSize: "13px", color: sectionChecked === section.items.length ? "var(--color-badge-green-text)" : "var(--color-text-muted)", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                  {sectionChecked}/{section.items.length} {isExpanded ? "▾" : "▸"}
                </span>
              </button>
              {isExpanded && (
                <div style={{ padding: "0 18px 14px" }}>
                  {section.items.map((item) => (
                    <label
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "12px 0",
                        borderBottom: "1px solid var(--color-border-subtle)",
                        cursor: "pointer",
                        alignItems: "flex-start",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!checked[item.id]}
                        onChange={() => toggleCheck(item.id)}
                        style={{ marginTop: "3px", width: "18px", height: "18px", accentColor: "var(--color-accent-blue)", flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: checked[item.id] ? "var(--color-badge-green-text)" : "var(--color-text-body)", lineHeight: 1.5, textDecoration: checked[item.id] ? "line-through" : "none", opacity: checked[item.id] ? 0.7 : 1 }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5, marginTop: "4px" }}>
                          {item.detail}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
