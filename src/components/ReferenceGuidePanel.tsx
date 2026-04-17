import { ALGORITHM_DEMOS } from "@/data/demoResources";
import type { Algorithm, AlgorithmSource } from "@/types/crypto";

type ReferenceGuidePanelProps = {
  algorithms: Algorithm[];
};

const GLOSSARY = [
  {
    term: "Classical security",
    definition: "Estimated resistance against the best known non-quantum attacks, usually expressed in bits of work.",
  },
  {
    term: "PQ security",
    definition: "Expected security if a cryptographically relevant quantum computer exists. Zero means Shor's algorithm breaks it outright.",
  },
  {
    term: "KEM",
    definition: "A key encapsulation mechanism: public-key crypto used to establish a shared secret for later symmetric encryption.",
  },
  {
    term: "AEAD",
    definition: "Authenticated encryption with associated data. It encrypts data and detects tampering in one construction.",
  },
  {
    term: "MAC",
    definition: "A message authentication code. It proves integrity and key possession, but not public verifiability like a signature.",
  },
  {
    term: "KDF",
    definition: "A key derivation function. It turns existing secret material into new, purpose-separated keys.",
  },
  {
    term: "Forward secrecy",
    definition: "Past sessions stay confidential even if a long-term private key is later compromised.",
  },
  {
    term: "Trusted setup",
    definition: "A setup ceremony some proof systems require. If it is compromised, proofs may be forgeable.",
  },
  {
    term: "Threshold",
    definition: "A scheme where some minimum number of parties or shares is required before a secret or signature can be reconstructed.",
  },
  {
    term: "Constant-time",
    definition: "Implementation discipline that avoids data-dependent timing differences which could leak secrets.",
  },
] as const;

type AggregatedSource = {
  source: AlgorithmSource;
  algorithms: string[];
};

type DemoEntry = {
  title: string;
  url: string;
  note: string;
  algorithmName: string;
};

function collectSources(algorithms: Algorithm[]): AggregatedSource[] {
  const byUrl = new Map<string, AggregatedSource>();

  for (const algorithm of algorithms) {
    for (const source of algorithm.sources ?? []) {
      const current = byUrl.get(source.url);
      if (current) {
        if (!current.algorithms.includes(algorithm.name)) {
          current.algorithms.push(algorithm.name);
        }
        continue;
      }

      byUrl.set(source.url, {
        source,
        algorithms: [algorithm.name],
      });
    }
  }

  return Array.from(byUrl.values()).sort((left, right) => left.source.label.localeCompare(right.source.label));
}

function collectDemos(algorithms: Algorithm[]): DemoEntry[] {
  const seen = new Set<string>();
  const demos: DemoEntry[] = [];

  for (const algorithm of algorithms) {
    for (const demo of ALGORITHM_DEMOS[algorithm.id] ?? []) {
      const key = `${algorithm.id}:${demo.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      demos.push({ ...demo, algorithmName: algorithm.name });
    }
  }

  return demos.sort((left, right) => left.title.localeCompare(right.title));
}

export default function ReferenceGuidePanel({ algorithms }: ReferenceGuidePanelProps) {
  const sources = collectSources(algorithms);
  const demos = collectDemos(algorithms);
  const visibleSourceCount = Math.min(sources.length, 24);

  return (
    <section className="panel" aria-label="References and terminology" style={{ marginBottom: "18px" }}>
      <h2 className="panel-heading">References &amp; terminology</h2>
      <p style={{ color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 12px" }}>
        Source links and definitions for the algorithms currently visible in the results grid.
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        <StatPill label="Visible results" value={String(algorithms.length)} />
        <StatPill label="Unique sources" value={String(sources.length)} />
        <StatPill label="Curated demos" value={String(demos.length)} />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>
          Terminology guide
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          {GLOSSARY.map((entry) => (
            <div key={entry.term} style={{ border: "1px solid var(--color-border-subtle)", borderRadius: "8px", padding: "10px 12px", background: "var(--color-bg-card)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-heading)", marginBottom: "4px" }}>{entry.term}</div>
              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{entry.definition}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>
            Demo links
          </div>
          {demos.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {demos.map((demo) => (
                <a
                  key={`${demo.algorithmName}-${demo.url}`}
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ border: "1px solid var(--color-border-subtle)", borderRadius: "8px", padding: "10px 12px", background: "var(--color-bg-card)", textDecoration: "none" }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-link)" }}>{demo.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-accent-bright)", marginTop: "3px" }}>{demo.algorithmName}</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.6, marginTop: "4px" }}>{demo.note}</div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "12px", lineHeight: 1.6 }}>
              No curated demos are attached to the currently visible algorithms yet.
            </p>
          )}
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>
            Source references
          </div>
          {sources.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sources.slice(0, visibleSourceCount).map(({ source, algorithms: algorithmNames }) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ border: "1px solid var(--color-border-subtle)", borderRadius: "8px", padding: "10px 12px", background: "var(--color-bg-card)", textDecoration: "none" }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-link)" }}>{source.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.6, marginTop: "4px" }}>{source.note}</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "5px" }}>
                    Used by {algorithmNames.slice(0, 3).join(", ")}{algorithmNames.length > 3 ? ` and ${algorithmNames.length - 3} more` : ""}
                  </div>
                </a>
              ))}
              {sources.length > visibleSourceCount && (
                <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "12px" }}>
                  Showing the first {visibleSourceCount} unique references for the current result set.
                </p>
              )}
            </div>
          ) : (
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "12px", lineHeight: 1.6 }}>
              Source references will appear here as the current result set includes traced entries.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ border: "1px solid var(--color-border-muted)", borderRadius: "999px", padding: "6px 10px", background: "var(--color-bg-control)", fontSize: "12px", color: "var(--color-text-secondary)" }}>
      <strong style={{ color: "var(--color-text-heading)" }}>{value}</strong> {label}
    </span>
  );
}