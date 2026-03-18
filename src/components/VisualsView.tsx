"use client";

import Link from "next/link";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const VISUALS = [
  {
    src: `${BASE_PATH}/images/encryption-performance-comparison.png`,
    alt: "Performance comparison of symmetric and asymmetric encryption algorithms across speed, key size, and security tradeoffs",
    heading: "Encryption Performance Comparison",
    desc: "Speed, key size, and security tradeoffs across the major algorithm families.",
  },
  {
    src: `${BASE_PATH}/images/hashing-vs-encryption-vs-encoding.png`,
    alt: "Side-by-side comparison of hashing, encryption, and encoding: their properties, reversibility, and use cases",
    heading: "Hashing vs Encryption vs Encoding",
    desc: "Three concepts that are frequently confused — each serves a distinct purpose in modern systems.",
  },
  {
    src: `${BASE_PATH}/images/tls-https-data-flow.png`,
    alt: "Diagram of TLS handshake and HTTPS data flow showing key exchange, authentication, and symmetric encryption in sequence",
    heading: "How TLS & HTTPS Work",
    desc: "Cryptography in action — how the algorithms on this site combine to secure every HTTPS connection.",
  },
  {
    src: `${BASE_PATH}/images/crypto-timeline.png`,
    alt: "Timeline of major cryptographic milestones from classical ciphers to post-quantum algorithms",
    heading: "Evolution of Cryptography",
    desc: "From Caesar ciphers to post-quantum standards — the history of the field at a glance.",
  },
];

export default function VisualsView() {
  return (
    <div
      style={{
        background: "#070b12",
        color: "#e2e8f0",
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

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <header style={{ borderBottom: "1px solid #111827", padding: "20px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <Link
              href="/"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  letterSpacing: "-0.5px",
                  color: "#e2e8f0",
                }}
              >
                <span style={{ color: "#3b82f6" }}>◈ crypto</span>::compare
              </span>
            </Link>
            <Link
              href="/"
              style={{
                background: "#0e1420",
                color: "#d4deea",
                border: "1px solid #334155",
                borderRadius: "7px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
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
                color: "#f8fafc",
              }}
            >
              Visual Guide
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#93a4bb", lineHeight: 1.6 }}>
              Infographics and diagrams to help understand modern cryptography concepts.
            </p>
          </div>
        </header>

        {/* Images */}
        <main style={{ padding: "40px 0 64px" }}>
          {VISUALS.map((v) => (
            <section
              key={v.heading}
              style={{
                marginBottom: "72px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "21px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  color: "#f8fafc",
                  letterSpacing: "-0.3px",
                }}
              >
                {v.heading}
              </h2>
              <p
                style={{
                  margin: "0 auto 24px",
                  maxWidth: "640px",
                  fontSize: "15px",
                  color: "#93a4bb",
                  lineHeight: 1.7,
                }}
              >
                {v.desc}
              </p>
              <img
                src={v.src}
                alt={v.alt}
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "960px",
                  height: "auto",
                  margin: "0 auto",
                  borderRadius: "10px",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.55), 0 1px 6px rgba(0,0,0,0.35)",
                }}
              />
            </section>
          ))}
        </main>

        {/* Footer */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, #3b82f640 20%, #8b5cf640 50%, #06b6d440 80%, transparent 100%)",
            marginBottom: "20px",
          }}
          aria-hidden="true"
        />
        <footer
          style={{
            paddingBottom: "28px",
            fontSize: "13px",
            color: "#b4c1d2",
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            lineHeight: 1.7,
          }}
        >
          <div style={{ marginBottom: "6px" }}>
            <span style={{ color: "#60a5fa", fontWeight: 700 }}>Dataset reviewed:</span>{" "}
            <time dateTime="2026-03-16">March 16, 2026</time>
          </div>
          Sources: NIST FIPS, IETF RFCs, KPQC, CRYPTREC, GB/T, GOST, DSTU, ISO, Eurocrypt/CRYPTO proceedings.
        </footer>
      </div>
    </div>
  );
}
