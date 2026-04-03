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
        <div key={`src-${algo.id}`} style={{ padding: "10px 0", borderTop: "1px solid #111827" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
            <strong>{algo.name}</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {algo.sources && (
                <span style={{ color: "#7dd3fc", fontSize: "13px", fontWeight: 600 }}>
                  {algo.sources.length} source{algo.sources.length !== 1 ? "s" : ""}
                </span>
              )}
              <ReviewBadge iso={algo.lastReviewed} />
            </div>
          </div>
          {algo.sources && algo.sources.length > 0 ? (
            <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "#c4d1e3", listStyle: "none" }}>
              {algo.sources.map((source) => (
                <li key={`${algo.id}-${source.label}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <SourceKindBadge kind={source.kind} />
                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#7dd3fc" }}>
                    {source.label}
                  </a>
                  <span style={{ color: "#93a4bb" }}>— {source.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: "8px 0 0", color: "#93a4bb" }}>Source list pending enrichment for this entry.</p>
          )}
        </div>
      ))}
    </section>
  );
}