type ShortcutHelpProps = {
  open: boolean;
  onClose: () => void;
};

const SHORTCUTS = [
  { keys: ["/", "Ctrl+K"], description: "Focus search" },
  { keys: ["Shift+?"], description: "Toggle keyboard shortcuts" },
  { keys: ["Esc"], description: "Close panels, clear comparison" },
  { keys: ["→"], description: "Next category" },
  { keys: ["←"], description: "Previous category" },
] as const;

export default function ShortcutHelp({ open, onClose }: ShortcutHelpProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Keyboard shortcuts"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0b1120",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "28px 32px",
          maxWidth: "440px",
          width: "90vw",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", color: "#f8fafc" }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="focusRing"
            aria-label="Close shortcuts panel"
            style={{
              background: "transparent",
              border: "none",
              color: "#7d8a9e",
              fontSize: "20px",
              cursor: "pointer",
              padding: "8px",
              minWidth: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {SHORTCUTS.map((s) => (
            <div key={s.description} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#d4deea", fontSize: "14px" }}>{s.description}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="kbd"
                    style={{ fontSize: "13px", padding: "4px 10px", borderRadius: "6px", background: "#11182b", border: "1px solid #1e293b", color: "#93a4bb", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "18px", fontSize: "12px", color: "#7d8a9e", textAlign: "center" }}>
          Press <kbd className="kbd" style={{ fontSize: "11px", padding: "2px 6px" }}>Esc</kbd> or click outside to close
        </p>
      </div>
    </div>
  );
}
