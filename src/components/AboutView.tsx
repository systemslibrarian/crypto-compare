"use client";

import Link from "next/link";
import { summarizeReviewWindow } from "@/lib/trust";
import { ALGORITHMS } from "@/data/algorithms";
import { withProvenance } from "@/lib/dataset";
import { formatReviewDate } from "@/components/ui";
import { DATASET_VERSION } from "@/lib/datasetVersion";

const snapshot = summarizeReviewWindow(withProvenance(ALGORITHMS));

export default function AboutView() {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        minHeight: "100vh",
        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', -apple-system, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, #3b82f6 0%, #06b6d4 12%, #8b5cf6 24%, #f59e0b 36%, #10b981 48%, #ec4899 60%, #ef4444 72%, #6366f1 84%, #3b82f6 100%)",
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px" }}>
        <header style={{ borderBottom: "1px solid var(--color-border)", padding: "20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  letterSpacing: "-0.5px",
                  color: "var(--color-text)",
                }}
              >
                <span style={{ color: "var(--color-accent-blue)" }}>◈ crypto</span>::compare
              </span>
            </Link>
            <Link
              href="/"
              style={{
                background: "var(--color-bg-control)",
                color: "var(--color-text-body)",
                border: "1px solid var(--color-border-muted)",
                borderRadius: "7px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              ← Algorithm Reference
            </Link>
          </div>
          <div style={{ marginTop: "14px" }}>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "26px",
                fontWeight: 700,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                letterSpacing: "-0.5px",
                color: "var(--color-text-heading)",
              }}
            >
              About &amp; Methodology
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "var(--color-text-muted)" }}>
              What this is, who it&apos;s for, how the data is sourced, and what it is not.
            </p>
          </div>
        </header>

        <main style={{ padding: "32px 0 64px", fontSize: "15px", color: "var(--color-text-body)" }}>
          <Callout>
            <strong>This is an educational reference, not a substitute for a cryptographic review.</strong> Use it to
            shortlist and understand algorithms — then validate any production decision against current standards, your
            own threat model, and, for high-stakes systems, a qualified cryptographer.
          </Callout>

          <Section title="What it is">
            <p>
              crypto::compare is a curated, side-by-side reference for{" "}
              <strong>{ALGORITHMS.length} cryptographic algorithms</strong> across 17 categories — symmetric encryption,
              KEMs, signatures, hashes, KDFs, MACs, threshold and multi-party schemes, and more. Every entry carries
              security estimates, recommendation level, known attacks, deployment notes, and primary-source citations.
              It pairs with companion tools: an algorithm <Link href="/advisor" style={linkStyle}>advisor</Link>,{" "}
              <Link href="/safe-defaults" style={linkStyle}>safe defaults</Link>,{" "}
              <Link href="/migrate" style={linkStyle}>migration guides</Link>,{" "}
              <Link href="/implementations" style={linkStyle}>implementation maps</Link>, and{" "}
              <Link href="/labs" style={linkStyle}>interactive labs</Link>.
            </p>
          </Section>

          <Section title="Who it's for">
            <p>
              Engineers, architects, and students who need to <em>choose</em> cryptography — not implement primitives
              from scratch. If you are deciding &ldquo;which KEM,&rdquo; &ldquo;is PBKDF2 still acceptable,&rdquo; or
              &ldquo;what does a post-quantum migration look like,&rdquo; this is built for you.
            </p>
          </Section>

          <Section title="Threat model &amp; scope">
            <ul style={ulStyle}>
              <li>
                Recommendations assume a <strong>standard adversary</strong>: a well-resourced attacker bounded by
                publicly known cryptanalysis, including a future large-scale quantum computer for post-quantum labels.
                They do not model nation-state implementation backdoors, supply-chain compromise, or physical coercion.
              </li>
              <li>
                Security estimates reflect <strong>known attacks and public literature</strong> at review time. They are
                guidance, not certification, and can change as cryptanalysis advances.
              </li>
              <li>
                Scope is <strong>algorithm selection and tradeoffs</strong> — not protocol design, key management
                operations, or constant-time implementation, each of which can undo a sound algorithm choice.
              </li>
            </ul>
          </Section>

          <Section title="How the data is sourced &amp; verified">
            <p>
              Every algorithm cites <strong>primary sources</strong> — NIST FIPS/SP, IETF RFCs, ISO, CRYPTREC, KPQC,
              GB/T, GOST, DSTU, and peer-reviewed Eurocrypt/CRYPTO proceedings. A build-time check rejects entries
              lacking primary-source citations, and a separate job keeps the linked{" "}
              <Link href="/labs" style={linkStyle}>interactive labs</Link> in sync with the live catalog. The dataset and
              its full provenance are open source.
            </p>
          </Section>

          <Section title="Update cadence &amp; freshness">
            <p>
              Each algorithm&apos;s <code>lastReviewed</code> date records when its claims and citations were last
              re-verified against primary sources. On <strong>{formatReviewDate(snapshot.latest)}</strong> all{" "}
              {snapshot.coverage} entries were re-verified in a single pass (dataset v{DATASET_VERSION}), so they share
              that date — a genuine source-verification stamp, not a claim that each was independently re-derived on a
              different day. That pass confirmed primary-source citations resolve and support each claim, refreshed
              post-quantum standardization status, and corrected stale or broken references.
            </p>
            <p style={{ marginTop: "10px" }}>
              <strong>What that review is and is not:</strong> it is automated primary-source re-verification and a
              cryptanalysis scan — not an expert cryptographer&apos;s sign-off. Automated freshness checks flag entries
              older than 180 days so reviews don&apos;t silently lapse. Treat research-grade entries as a prompt to
              verify more aggressively against your own threat model.
            </p>
          </Section>

          <Section title="What it is not">
            <ul style={ulStyle}>
              <li>Not a crypto library — do not copy parameters into production without verifying against current standards.</li>
              <li>Not a compliance attestation or a security audit of your system.</li>
              <li>Not exhaustive — niche, deprecated, or regional schemes may be missing or summarized.</li>
            </ul>
          </Section>

          <Section title="Source &amp; contributions">
            <p>
              The project is open source. Corrections, citations, and new algorithms are welcome via pull request.
            </p>
            <p style={{ marginTop: "10px" }}>
              <a href="https://github.com/systemslibrarian/crypto-compare" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                Source &amp; dataset on GitHub ↗
              </a>
              {" · "}
              <a href="https://github.com/systemslibrarian/crypto-compare/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                Security policy ↗
              </a>
              {" · "}
              <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                Interactive lab catalog ↗
              </a>
            </p>
          </Section>
        </main>
      </div>
    </div>
  );
}

const linkStyle = { color: "var(--color-text-accent-bright)", textDecoration: "none" } as const;
const ulStyle = { margin: "0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" } as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "28px" }}>
      <h2
        style={{
          margin: "0 0 10px",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--color-text-heading)",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="note"
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border-subtle)",
        borderLeft: "3px solid var(--color-accent-blue)",
        borderRadius: "10px",
        padding: "16px 18px",
        marginBottom: "28px",
        color: "var(--color-text-body)",
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
