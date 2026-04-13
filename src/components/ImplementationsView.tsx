"use client";

import { useState } from "react";
import Link from "next/link";
import { IMPLEMENTATIONS, ECOSYSTEM_LABELS, type Ecosystem, type ImplementationEntry } from "@/data/implementations";

const ALL_ECOSYSTEMS: Ecosystem[] = ["rust", "python", "typescript", "go", "dotnet", "java"];

const ALGO_NAMES: Record<string, string> = {};
for (const impl of IMPLEMENTATIONS) {
  if (!ALGO_NAMES[impl.algorithmId]) {
    ALGO_NAMES[impl.algorithmId] = impl.algorithmId;
  }
}
// Friendly display names
const ALGO_DISPLAY: Record<string, string> = {
  aes256gcm: "AES-256-GCM",
  xchacha20poly: "XChaCha20-Poly1305",
  argon2id: "Argon2id",
  ed25519: "Ed25519",
  curve25519: "X25519",
  hkdf: "HKDF",
  hmac_sha256: "HMAC-SHA-256",
  mlkem768: "ML-KEM-768",
  mldsa65: "ML-DSA-65",
};

const UNIQUE_ALGOS = Array.from(new Set(IMPLEMENTATIONS.map((i) => i.algorithmId)));

function auditBadge(status: ImplementationEntry["auditStatus"]) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    audited: { bg: "var(--color-badge-green-bg, #143d1a)", text: "var(--color-badge-green-text, #5ce65c)", border: "var(--color-badge-green-border, #2a7d2a)" },
    unaudited: { bg: "var(--color-badge-red-bg, #3d1414)", text: "var(--color-badge-red-text, #ff6b6b)", border: "var(--color-badge-red-border, #7d2a2a)" },
    unknown: { bg: "var(--color-badge-yellow-bg, #3d3414)", text: "var(--color-badge-yellow-text, #e6c85c)", border: "var(--color-badge-yellow-border, #7d6e2a)" },
  };
  const c = colors[status];
  return (
    <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "2px 8px", borderRadius: "4px", background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {status}
    </span>
  );
}

export default function ImplementationsView() {
  const [selectedEcosystem, setSelectedEcosystem] = useState<Ecosystem | "all">("all");
  const [selectedAlgo, setSelectedAlgo] = useState<string | "all">("all");

  const filtered = IMPLEMENTATIONS.filter((impl) => {
    if (selectedEcosystem !== "all" && impl.ecosystem !== selectedEcosystem) return false;
    if (selectedAlgo !== "all" && impl.algorithmId !== selectedAlgo) return false;
    return true;
  });

  // Group by algorithm
  const grouped: Record<string, ImplementationEntry[]> = {};
  for (const impl of filtered) {
    if (!grouped[impl.algorithmId]) grouped[impl.algorithmId] = [];
    grouped[impl.algorithmId].push(impl);
  }

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 20px 64px" }}>
      <Link href="/" style={{ fontSize: "14px", color: "var(--color-text-link)", textDecoration: "none", marginBottom: "16px", display: "inline-block" }}>
        ← Back to crypto::compare
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", margin: "0 0 8px" }}>
        Implementation Map
      </h1>
      <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 12px" }}>
        Verified libraries for recommended algorithms across 6 ecosystems. Filter by language or algorithm.
      </p>

      {/* Disclaimer */}
      <div style={{
        padding: "14px 16px",
        borderRadius: "8px",
        background: "var(--color-bg-warning)",
        border: "1px solid var(--color-badge-yellow-border)",
        fontSize: "13px",
        lineHeight: 1.6,
        marginBottom: "28px",
      }}>
        <strong style={{ color: "var(--color-badge-yellow-text)", display: "block", marginBottom: "4px" }}>
          ⚠ Disclaimer
        </strong>
        <span style={{ color: "var(--color-text-warning, var(--color-text-body))" }}>
          Library audit status may change. Always verify the latest status before deploying to production.
          Entries marked &quot;unknown&quot; have not been independently confirmed by this project.
          Last bulk verification: 2024-12.
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
        <div>
          <label htmlFor="eco-filter" style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--color-text-sublabel)", marginBottom: "4px" }}>Ecosystem</label>
          <select
            id="eco-filter"
            value={selectedEcosystem}
            onChange={(e) => setSelectedEcosystem(e.target.value as Ecosystem | "all")}
            style={{
              background: "var(--color-bg-control)",
              color: "var(--color-text-body)",
              border: "1px solid var(--color-border-muted)",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "14px",
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            }}
          >
            <option value="all">All ecosystems</option>
            {ALL_ECOSYSTEMS.map((eco) => (
              <option key={eco} value={eco}>{ECOSYSTEM_LABELS[eco].icon} {ECOSYSTEM_LABELS[eco].label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="algo-filter" style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--color-text-sublabel)", marginBottom: "4px" }}>Algorithm</label>
          <select
            id="algo-filter"
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value)}
            style={{
              background: "var(--color-bg-control)",
              color: "var(--color-text-body)",
              border: "1px solid var(--color-border-muted)",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "14px",
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            }}
          >
            <option value="all">All algorithms</option>
            {UNIQUE_ALGOS.map((id) => (
              <option key={id} value={id}>{ALGO_DISPLAY[id] ?? id}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <span style={{ fontSize: "13px", color: "var(--color-text-ghost)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grouped cards */}
      {Object.keys(grouped).length === 0 ? (
        <p style={{ color: "var(--color-text-muted)", fontSize: "15px" }}>No implementations match current filters.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {Object.entries(grouped).map(([algoId, impls]) => (
            <section key={algoId}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", margin: "0 0 12px", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "8px" }}>
                {ALGO_DISPLAY[algoId] ?? algoId}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                {impls.map((impl, idx) => (
                  <div key={idx} style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "16px" }}>{ECOSYSTEM_LABELS[impl.ecosystem].icon}</span>
                      <span style={{ fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>{impl.library}</span>
                      {auditBadge(impl.auditStatus)}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                      {impl.packageName === "built-in" || impl.packageName === "stdlib" ? impl.packageName : <code>{impl.packageName}</code>}
                    </div>
                    <p style={{ margin: "0 0 8px", color: "var(--color-text-body)" }}>{impl.notes}</p>
                    {impl.warning && (
                      <div style={{ padding: "6px 10px", borderRadius: "4px", background: "var(--color-bg-warning)", border: "1px solid var(--color-badge-yellow-border)", fontSize: "12px", color: "var(--color-text-warning, var(--color-text-body))", marginBottom: "8px" }}>
                        ⚠ {impl.warning}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <a href={impl.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-link)", fontSize: "12px", textDecoration: "none" }}>
                        View library →
                      </a>
                      <span style={{ fontSize: "11px", color: "var(--color-text-ghost)" }}>
                        Verified {impl.lastVerified}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
