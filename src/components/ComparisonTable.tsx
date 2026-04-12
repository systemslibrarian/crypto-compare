import { RecommendationBadge, ReviewBadge } from "@/components/ui";
import type { Algorithm, ComparisonRow } from "@/types/crypto";

type ComparisonTableProps = {
  algos: Algorithm[];
  rows: ComparisonRow[];
};

function cellsHaveDifferences(algos: Algorithm[], row: ComparisonRow): boolean {
  if (algos.length < 2) return false;
  const values = algos.map((a) => {
    const v = row.render(a);
    return typeof v === "string" ? v : "complex";
  });
  return values.some((v) => v !== values[0]);
}

export default function ComparisonTable({ algos, rows }: ComparisonTableProps) {
  return (
    <>
      {/* Desktop table view */}
      <div className="comparison-desktop" style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid var(--color-border)", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px", minWidth: "760px" }}>
          <caption style={{ textAlign: "left", padding: "14px 16px", color: "var(--color-text-caption)", fontSize: "15px", captionSide: "top" }}>
            Side-by-side comparison of the selected algorithms. Rows with differences are highlighted, and review badges show how fresh the cited entry is.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  textAlign: "left",
                  padding: "14px 14px",
                  borderBottom: "2px solid var(--color-border-header)",
                  color: "var(--color-text-label)",
                  fontWeight: 700,
                  position: "sticky",
                  left: 0,
                  background: "var(--color-bg)",
                  zIndex: 2,
                  minWidth: "120px",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Metric
              </th>
              {algos.map((a) => (
                <th
                  scope="col"
                  key={a.id}
                  style={{
                    textAlign: "left",
                    padding: "14px 14px",
                    borderBottom: "2px solid var(--color-border-header)",
                    color: "var(--color-text-heading)",
                    fontWeight: 700,
                    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    fontSize: "16px",
                    minWidth: "220px",
                    background: "var(--color-bg)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span>{a.name}</span>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <RecommendationBadge level={a.recommendation} />
                      <ReviewBadge iso={a.lastReviewed} />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const hasDiff = cellsHaveDifferences(algos, row);
              return (
              <tr key={row.label}>
                <th
                  scope="row"
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid var(--color-border-row)",
                    color: hasDiff ? "#fbbf24" : "var(--color-text-label)",
                    fontWeight: 700,
                    position: "sticky",
                    left: 0,
                    background: i % 2 === 0 ? "var(--color-bg)" : "var(--color-bg-table-alt)",
                    zIndex: 1,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    verticalAlign: "top",
                    borderLeft: hasDiff ? "3px solid #f59e0b44" : "3px solid transparent",
                  }}
                >
                  {row.label}{hasDiff && <span style={{ marginLeft: "4px", fontSize: "10px", opacity: 0.7 }}>≠</span>}
                </th>
                {algos.map((a) => {
                  const value = row.render(a);
                  return (
                    <td
                      key={`${a.id}-${row.label}`}
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--color-border-row)",
                        color: "var(--color-text)",
                        verticalAlign: "top",
                        background: hasDiff
                          ? (i % 2 === 0 ? "rgba(245,158,11,0.04)" : "rgba(245,158,11,0.06)")
                          : (i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)"),
                        maxWidth: "320px",
                        lineHeight: "1.7",
                      }}
                    >
                      {typeof value === "string" ? <span>{value}</span> : value}
                    </td>
                  );
                })}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked card view */}
      <div className="comparison-mobile" style={{ display: "none" }}>
        {algos.map((algo) => (
          <div
            key={`mobile-${algo.id}`}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "12px",
              background: "var(--color-bg-mobile-card)",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f8fafc",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              {algo.name}
            </h3>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
              <RecommendationBadge level={algo.recommendation} />
              <ReviewBadge iso={algo.lastReviewed} />
            </div>
            {rows.map((row) => {
              const value = row.render(algo);
              return (
                <div
                  key={`mobile-${algo.id}-${row.label}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-label)",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                      flexShrink: 0,
                      maxWidth: "40%",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      color: "var(--color-text)",
                      fontSize: "14px",
                      textAlign: "right",
                      lineHeight: 1.6,
                    }}
                  >
                    {typeof value === "string" ? value : value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .comparison-desktop {
            display: none !important;
          }
          .comparison-mobile {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
