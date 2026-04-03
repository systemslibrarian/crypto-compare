import type { ReactNode } from "react";

type CollapsibleSectionProps = {
  isOpen: boolean;
  onToggle: () => void;
  buttonLabel: string;
  sectionLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export default function CollapsibleSection({
  isOpen,
  onToggle,
  buttonLabel,
  sectionLabel,
  title,
  description,
  children,
}: CollapsibleSectionProps) {
  return (
    <>
      <button
        className="focusRing controlBtn"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Hide" : "Show"} ${buttonLabel}`}
        style={{ marginBottom: isOpen ? "0" : "12px" }}
      >
        {isOpen ? "▾" : "▸"} {buttonLabel}
      </button>
      {isOpen && (
        <section className="panel" aria-label={sectionLabel} style={{ marginBottom: "18px" }}>
          <h2 className="panel-heading">{title}</h2>
          {description && (
            <p style={{ color: "#93a4bb", fontSize: "13px", lineHeight: 1.6, margin: "0 0 8px" }}>
              {description}
            </p>
          )}
          {children}
        </section>
      )}
    </>
  );
}