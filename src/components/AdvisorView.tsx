"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DecisionFlowchart from "@/components/DecisionFlowchart";
import { ALGORITHMS } from "@/data/algorithms";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import type { AlgorithmCategory } from "@/types/crypto";

export default function AdvisorView() {
  const router = useRouter();

  const handleNavigate = (category: AlgorithmCategory, algoId: string) => {
    router.push(`/?cat=${category}&sel=${algoId}`);
  };

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

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
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
                color: "#f8fafc",
              }}
            >
              What should I use?
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#93a4bb", lineHeight: 1.6 }}>
              Answer a few questions to get a specific algorithm recommendation with full sourcing and a downloadable justification report.
            </p>
          </div>
        </header>

        {/* Main content */}
        <main style={{ padding: "28px 0 48px" }}>
          <DecisionFlowchart
            onNavigate={handleNavigate}
            algorithms={ALGORITHMS}
            provenance={ALGORITHM_PROVENANCE}
          />

          {/* Limitations */}
          <section
            aria-label="Important limitations"
            style={{
              background: "#1a1207",
              border: "1px solid #78350f",
              borderRadius: "8px",
              padding: "16px 20px",
              marginTop: "8px",
              fontSize: "13px",
              color: "#fbbf24",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
              ⚠ Limitations
            </strong>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "#e2c97e" }}>
              <li>
                <strong>Not a certification.</strong> Validate all guidance against your specific threat model, compliance requirements, and operational constraints.
              </li>
              <li>
                <strong>Primitive selection is necessary but not sufficient.</strong> Implementation quality, side-channel resistance, key management, and protocol design matter more.
              </li>
              <li>
                <strong>Security estimates reflect current public knowledge</strong> as of March 2026. Cryptanalysis is ongoing; estimates may change as new attacks are discovered.
              </li>
              <li>
                <strong>Performance data is approximate.</strong> Values are from published benchmarks, not your hardware. Production decisions require application-specific measurement.
              </li>
              <li>
                <strong>Post-quantum security estimates are conservative.</strong> Lattice-based estimates rely on BKZ cost models that may shift as quantum algorithms improve.
              </li>
              <li>
                <strong>No &quot;avoid&quot;-rated algorithms are currently listed.</strong> If we add one, it will be clearly labeled with migration guidance.
              </li>
            </ul>
          </section>
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
            borderTop: "none",
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
