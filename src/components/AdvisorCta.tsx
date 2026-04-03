import Link from "next/link";

export default function AdvisorCta() {
  return (
    <div style={{ margin: "0 0 18px" }}>
      <Link
        href="/advisor"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          background: "linear-gradient(135deg, #0c1222 0%, #0e1628 100%)",
          border: "1px solid #1e293b",
          borderRadius: "10px",
          padding: "20px 24px",
          textDecoration: "none",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              fontSize: "19px",
              fontWeight: 700,
              color: "#f8fafc",
              marginBottom: "6px",
            }}
          >
            What should I use?
          </div>
          <div style={{ fontSize: "14px", color: "#93a4bb", lineHeight: 1.5 }}>
            Answer a few questions to get a specific algorithm recommendation with a downloadable justification report.
          </div>
        </div>
        <span
          className="advisorCta"
          style={{
            background: "#1d4ed8",
            color: "#fff",
            borderRadius: "7px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "center",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Open advisor →
        </span>
      </Link>
    </div>
  );
}