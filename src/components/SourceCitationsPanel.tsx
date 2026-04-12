import { ReviewBadge, SourceKindBadge } from "@/components/ui";
import type { Algorithm } from "@/types/crypto";

type SourceCitationsPanelProps = {
  algorithms: Algorithm[];
};

export default function SourceCitationsPanel({ algorithms }: SourceCitationsPanelProps) {
  if (algorithms.length === 0) return null;

  return (
    <section className="panel" aria-label="Source citations">
      <h2 className="panel-heading">Source citations</h2>
      {algorithms.map((algo) => (
        <div key={`src-${algo.id}`} style={{ padding: "10px 0", borderTop: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
            <strong>{algo.name}</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {algo.sources && (
                <span style={{ color: "var(--color-text-accent-bright)", fontSize: "13px", fontWeight: 600 }}>
                  {algo.sources.length} source{algo.sources.length !== 1 ? "s" : ""}
                </span>
              )}
              <ReviewBadge iso={algo.lastReviewed} />
            </div>
          </div>
          {algo.sources && algo.sources.length > 0 ? (
            <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "var(--color-text-secondary)", listStyle: "none" }}>
              {algo.sources.map((source) => (
                <li key={`${algo.id}-${source.label}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <SourceKindBadge kind={source.kind} />
                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-accent-bright)" }}>
                    {source.label}
                  </a>
                  <span style={{ color: "var(--color-text-muted)" }}>— {source.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: "8px 0 0", color: "var(--color-text-muted)" }}>Source list pending enrichment for this entry.</p>
          )}
        </div>
      ))}
    </section>
  );
}