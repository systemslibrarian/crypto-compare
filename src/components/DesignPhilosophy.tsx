"use client";

export default function DesignPhilosophy() {
  const sectionStyle = {
    marginBottom: "20px" as const,
    borderTop: "1px solid var(--color-border)",
    paddingTop: "16px",
  };
  const headingStyle = {
    fontSize: "15px" as const,
    fontWeight: 700 as const,
    margin: "0 0 8px" as const,
    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
  };
  const listStyle = {
    margin: 0 as const,
    paddingLeft: "18px",
    color: "var(--color-text-secondary)",
    fontSize: "13px" as const,
    lineHeight: 1.7,
  };

  return (
    <div>
      {/* ── Purpose ── */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ ...headingStyle, color: "var(--color-accent-blue-label)" }}>
          <span aria-hidden="true">🎯</span> Purpose
        </h3>
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: 1.7 }}>
          crypto::compare exists for one reason: to help engineers, architects, and technical decision-makers choose the right cryptographic primitives for their systems — confidently, quickly, and safely.
        </p>
        <p style={{ margin: "8px 0 0", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
          This is a decision-support tool. It presents curated, sourced information about cryptographic algorithms so you can evaluate tradeoffs (security level, performance, post-quantum readiness, ecosystem maturity) and make an informed choice. It does not make security decisions for you — it gives you the information to make good ones.
        </p>
      </div>

      {/* ── What This Tool Does NOT Do ── */}
      <div style={sectionStyle}>
        <h3 style={{ ...headingStyle, color: "var(--color-badge-red-text)" }}>
          <span aria-hidden="true">🚫</span> What This Tool Does NOT Do
        </h3>
        <ul style={listStyle}>
          <li><strong>This is not a cryptographic library.</strong> It does not implement any algorithm. It compares and recommends — it does not encrypt, sign, or hash anything.</li>
          <li><strong>This is not a substitute for security review.</strong> Choosing the right algorithm is necessary but not sufficient. Implementation quality, key management, system architecture, and operational security matter just as much. Engage a professional security review for production systems.</li>
          <li><strong>This is not a certification.</strong> Recommendations reflect published standards and public cryptanalysis. They are not formal security assessments of your specific system.</li>
          <li><strong>This does not cover implementation guidance.</strong> How to correctly use AES-GCM nonces, how to implement constant-time comparison, how to handle key rotation — these are critical but outside scope. Consult your library&apos;s documentation and OWASP guidelines.</li>
        </ul>
      </div>

      {/* ── Data Sources & Methodology ── */}
      <div style={sectionStyle}>
        <h3 style={{ ...headingStyle, color: "var(--color-text-accent-bright)" }}>
          <span aria-hidden="true">📚</span> Data Sources &amp; Methodology
        </h3>
        <p style={{ margin: "0 0 8px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
          Every data point in this tool is derived from published, verifiable sources. No security claim is based on opinion alone.
        </p>
        <ul style={listStyle}>
          <li><strong>Standards bodies:</strong> NIST (FIPS, SP 800-series), IETF (RFCs), ISO/IEC, national standards (KPQC, CRYPTREC, GB/T, GOST, DSTU).</li>
          <li><strong>Academic literature:</strong> Eurocrypt, CRYPTO, ASIACRYPT proceedings, IACR ePrint archive, and peer-reviewed journals. Security proofs and cryptanalysis results are cited per algorithm.</li>
          <li><strong>Deployment evidence:</strong> Official documentation from major implementations (OpenSSL, BoringSSL, libsodium, Go crypto), browser telemetry, protocol specifications (TLS 1.3, Signal, WireGuard).</li>
          <li><strong>Security estimates:</strong> Classical security bits follow NIST SP 800-57. Post-quantum estimates follow NIST PQC security levels and published quantum algorithm analyses (Grover, Shor).</li>
          <li><strong>Each algorithm entry includes source citations</strong> with kind labels (standard, analysis, deployment, benchmark) and direct links to the source material.</li>
        </ul>
      </div>

      {/* ── Recommendation Philosophy ── */}
      <div style={sectionStyle}>
        <h3 style={{ ...headingStyle, color: "var(--color-badge-green-text)" }}>
          <span aria-hidden="true">⚖️</span> Recommendation Philosophy
        </h3>
        <ul style={listStyle}>
          <li><strong>Conservative bias toward safety.</strong> When in doubt, we recommend the algorithm with the strongest security margin and the longest track record of analysis. We prefer battle-tested over cutting-edge.</li>
          <li><strong>Prefer widely deployed, reviewed algorithms.</strong> An algorithm used by TLS 1.3, Signal, and WireGuard has survived more real-world scrutiny than one published last year. Deployment is evidence.</li>
          <li><strong>Post-quantum readiness is a first-class concern.</strong> Algorithms vulnerable to Shor&apos;s algorithm (RSA, ECDSA, ECDH) are flagged. Hybrid PQ recommendations are provided where the transition is actionable today.</li>
          <li><strong>No single recommendation for all contexts.</strong> &quot;What&apos;s the best algorithm?&quot; is always &quot;It depends.&quot; We provide use-case-specific guidance (messaging, file encryption, passwords, etc.) because context determines the right choice.</li>
          <li><strong>Explicit about uncertainty.</strong> When security estimates are speculative (new PQ schemes, candidate algorithms), they are labeled as such. Estimation methodology (exact, conservative, estimated, speculative) is shown per algorithm.</li>
        </ul>
      </div>

      {/* ── Transparency ── */}
      <div style={sectionStyle}>
        <h3 style={{ ...headingStyle, color: "var(--color-badge-yellow-text)" }}>
          <span aria-hidden="true">🔍</span> Transparency
        </h3>
        <p style={{ margin: "0 0 8px", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
          Trust requires transparency. Every algorithm entry includes fields specifically designed to surface tradeoffs honestly:
        </p>
        <ul style={listStyle}>
          <li><strong>&quot;Why not this?&quot;</strong> — Every algorithm explains its own weaknesses, limitations, and scenarios where you should choose something else. No algorithm is presented as universally superior.</li>
          <li><strong>&quot;When this changes&quot;</strong> — Explicit trigger conditions for upgrading or downgrading recommendations. Cryptography is not static — these fields ensure recommendations age transparently.</li>
          <li><strong>&quot;Assumptions&quot;</strong> — The exact mathematical and operational assumptions underlying each security claim. If an assumption is later broken, you know exactly what&apos;s affected.</li>
          <li><strong>&quot;Estimation methodology&quot;</strong> — Whether security bits are exact (from key length), conservative (adjusted for known attacks), estimated (best-effort analysis), or speculative (limited evidence). No false precision.</li>
          <li><strong>Open source.</strong> The entire dataset, validation logic, and UI are open source. The data can be audited, corrected, and extended by anyone.</li>
        </ul>
      </div>

      {/* ── Intended Audience ── */}
      <div style={sectionStyle}>
        <h3 style={{ ...headingStyle, color: "var(--color-badge-purple-text)" }}>
          <span aria-hidden="true">🧠</span> Intended Audience
        </h3>
        <ul style={listStyle}>
          <li><strong>Software engineers</strong> choosing cryptographic primitives for applications — messaging, storage, APIs, authentication.</li>
          <li><strong>Security architects</strong> evaluating algorithm choices for system designs, compliance requirements, or PQ migration planning.</li>
          <li><strong>Technical decision-makers</strong> who need to understand tradeoffs (performance, key size, PQ readiness) without reading 50 papers.</li>
          <li><strong>Students and learners</strong> building intuition about the cryptographic landscape — what exists, why it exists, and how algorithms relate to each other.</li>
          <li><strong>Anyone</strong> who has asked &quot;What encryption should I use?&quot; and deserves a better answer than &quot;It depends&quot; without context.</li>
        </ul>
      </div>
    </div>
  );
}
