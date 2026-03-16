import type { Algorithm, ComparisonRow } from "@/types/crypto";

type ComparisonTableProps = {
  algos: Algorithm[];
  rows: ComparisonRow[];
};

export default function ComparisonTable({ algos, rows }: ComparisonTableProps) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #141c2b", position: "relative" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px", minWidth: "760px" }}>
        <caption style={{ textAlign: "left", padding: "14px 16px", color: "#d1dae6", fontSize: "15px", captionSide: "top" }}>
          Side-by-side comparison of the selected algorithms.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              style={{
                textAlign: "left",
                padding: "14px 14px",
                borderBottom: "2px solid #1a2540",
                color: "#b4c1d2",
                fontWeight: 700,
                position: "sticky",
                left: 0,
                background: "#070b12",
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
                  borderBottom: "2px solid #1a2540",
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "16px",
                  minWidth: "220px",
                  background: "#070b12",
                }}
              >
                {a.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label}>
              <th
                scope="row"
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid #0d1320",
                  color: "#b4c1d2",
                  fontWeight: 700,
                  position: "sticky",
                  left: 0,
                  background: i % 2 === 0 ? "#070b12" : "#090e18",
                  zIndex: 1,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  verticalAlign: "top",
                }}
              >
                {row.label}
              </th>
              {algos.map((a) => {
                const value = row.render(a);
                return (
                  <td
                    key={`${a.id}-${row.label}`}
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid #0d1320",
                      color: "#e2e8f0",
                      verticalAlign: "top",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      maxWidth: "320px",
                      lineHeight: "1.7",
                    }}
                  >
                    {typeof value === "string" ? <span>{value}</span> : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
