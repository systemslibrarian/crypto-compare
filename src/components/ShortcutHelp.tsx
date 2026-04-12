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
        background: "var(--color-overlay-backdrop)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-bg-modal)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          padding: "28px 32px",
          maxWidth: "440px",
          width: "90vw",
          boxShadow: "0 20px 60px var(--color-shadow-overlay)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", color: "var(--color-text-heading)" }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="focusRing"
            aria-label="Close shortcuts panel"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-sublabel)",
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
              <span style={{ color: "var(--color-text-body)", fontSize: "14px" }}>{s.description}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="kbd"
                    style={{ fontSize: "13px", padding: "4px 10px", borderRadius: "6px", background: "var(--color-bg-kbd)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "18px", fontSize: "12px", color: "var(--color-text-sublabel)", textAlign: "center" }}>
          Press <kbd className="kbd" style={{ fontSize: "11px", padding: "2px 6px" }}>Esc</kbd> or click outside to close
        </p>
      </div>
    </div>
  );
}
