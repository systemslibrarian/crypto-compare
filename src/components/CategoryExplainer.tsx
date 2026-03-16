import { CATEGORY_INFO } from "@/data/categories";
import type { AlgorithmCategory } from "@/types/crypto";

type CategoryExplainerProps = {
  category: AlgorithmCategory;
  expanded: boolean;
  onToggle: () => void;
};

export default function CategoryExplainer({ category, expanded, onToggle }: CategoryExplainerProps) {
  const info = CATEGORY_INFO[category];
  if (!info) {
    return null;
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0c1222 0%, #0e1628 100%)",
        border: "1px solid #1a2540",
        borderRadius: "10px",
        padding: expanded ? "24px 28px" : "18px 22px",
        marginBottom: "16px",
        transition: "all 0.2s",
        cursor: expanded ? "default" : "pointer",
      }}
      onClick={() => {
        if (!expanded) {
          onToggle();
        }
      }}
      onKeyDown={(e) => {
        if (!expanded && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle();
        }
      }}
      role={expanded ? undefined : "button"}
      tabIndex={expanded ? undefined : 0}
      aria-label={expanded ? undefined : `Expand ${info.title} details`}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginBottom: "6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
            {info.title}
          </div>
          <div style={{ fontSize: "16px", color: "#d1dae6", lineHeight: "1.7", fontStyle: "italic" }}>{info.oneLiner}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="focusRing"
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${info.title} details` : `Expand ${info.title} details`}
          style={{
            background: expanded ? "#1a2540" : "#111d33",
            color: expanded ? "#7dd3fc" : "#93a4bb",
            border: `1px solid ${expanded ? "#1e3a5f" : "#1a2540"}`,
            padding: "10px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          {expanded ? "v Less" : "> Learn more"}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#60a5fa",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              What it does
            </div>
            <div style={{ fontSize: "16px", color: "#e2e8f0", lineHeight: "1.85" }}>{info.explanation}</div>
          </div>

          <div style={{ background: "#0a1018", borderRadius: "8px", padding: "16px 18px", borderLeft: "3px solid #3b82f6" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#7dd3fc",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Where you see it in the real world
            </div>
            <div style={{ fontSize: "16px", color: "#d1dae6", lineHeight: "1.85" }}>{info.realWorld}</div>
          </div>

          <div
            style={{
              background: "linear-gradient(90deg, rgba(59,130,246,0.08) 0%, transparent 100%)",
              borderRadius: "8px",
              padding: "14px 18px",
              borderLeft: "3px solid #f59e0b",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#fcd34d",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Why it matters
            </div>
            <div style={{ fontSize: "16px", color: "#fde68a", lineHeight: "1.85", fontWeight: 600 }}>{info.whyItMatters}</div>
          </div>

          <div
            style={{
              background: "#0a1018",
              borderRadius: "8px",
              padding: "16px 18px",
              borderLeft: info.projects.length > 0 ? "3px solid #34d399" : "3px solid #f87171",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: info.projects.length > 0 ? "#6ee7b7" : "#fca5a5",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: "10px",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {info.projects.length > 0 ? "Your projects using this" : "Not yet in your portfolio"}
            </div>

            {info.projects.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {info.projects.map((project) => (
                  <div
                    key={`${project.name}-${project.tech}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "8px 10px",
                      background: "#0c1422",
                      borderRadius: "6px",
                      border: "1px solid #141c2b",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: "4px",
                        background: project.public ? "#34d399" : "#fbbf24",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        {project.public && project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#38bdf8", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", textDecoration: "none" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.textDecoration = "none";
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {project.name}
                          </a>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                            {project.name}
                          </span>
                        )}
                        <span
                          style={{
                            background: project.public ? "#0d3320" : "#312e2a",
                            color: project.public ? "#34d399" : "#fbbf24",
                            border: `1px solid ${project.public ? "#065f46" : "#78350f"}`,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          {project.public ? "PUBLIC" : "PRIVATE"}
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", color: "#b4c1d2", marginTop: "4px" }}>{project.tech}</div>
                      {project.note && <div style={{ fontSize: "13px", color: "#93a4bb", marginTop: "4px", fontStyle: "italic" }}>{project.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {info.projectIdea && (
                  <div style={{ padding: "10px 12px", background: "#0c1422", borderRadius: "6px", border: "1px dashed #2a1a1a" }}>
                    <div style={{ fontSize: "13px", color: "#fca5a5", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
                      Project idea
                    </div>
                    <div style={{ fontSize: "15px", color: "#e8b4b4", lineHeight: "1.75" }}>{info.projectIdea}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
