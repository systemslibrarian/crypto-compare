import { ECOSYSTEM_LABELS, IMPLEMENTATIONS } from "@/data/implementations";

export default function ImplementationList({ algorithmId }: { algorithmId: string }) {
  const implementations = IMPLEMENTATIONS.filter((entry) => entry.algorithmId === algorithmId);
  if (implementations.length === 0) return null;

  const byEcosystem = implementations.reduce<Record<string, typeof implementations>>((groups, entry) => {
    (groups[entry.ecosystem] ??= []).push(entry);
    return groups;
  }, {});
  const auditColor: Record<string, string> = {
    "evidence-linked": "var(--color-badge-green-text)",
    "not-evidenced": "var(--color-badge-yellow-text)",
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <div className="recordDetailLabel">Implementations</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {Object.entries(byEcosystem).map(([ecosystem, list]) => (
          <div key={ecosystem}>
            <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
              {ECOSYSTEM_LABELS[ecosystem as keyof typeof ECOSYSTEM_LABELS]?.label ?? ecosystem}
            </div>
            {list.map((implementation) => (
              <div key={`${implementation.ecosystem}:${implementation.packageName}`} className="recordSubItem">
                <strong style={{ color: "var(--color-text-heading)" }}>{implementation.library}</strong>
                <span style={{ fontSize: "10.5px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: auditColor[implementation.auditStatus], marginLeft: "8px" }}>{implementation.auditStatus === "evidence-linked" ? "audit evidence linked" : "audit not evidenced"}</span>
                <div style={{ fontSize: "11.5px", marginTop: "2px" }}>
                  <a href={implementation.versionContext.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-link)", textDecoration: "none" }}>
                    {implementation.versionContext.label} ↗
                  </a>
                  <span style={{ color: "var(--color-text-ghost)" }}> · version context</span>
                </div>
                <div style={{ color: "var(--color-text-muted)" }}>{implementation.notes}</div>
                {implementation.warning && <div style={{ color: "var(--color-badge-yellow-text)", fontSize: "11.5px", marginTop: "2px" }}>{implementation.warning}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
