"use client";

import Link from "next/link";

type IntentPath = {
  icon: string;
  label: string;
  description: string;
  href: string;
  query?: string;
};

const INTENT_PATHS: IntentPath[] = [
  {
    icon: "🔒",
    label: "Passwords & Auth",
    description: "Protect credentials and sessions",
    href: "/safe-defaults",
    query: "#password-storage",
  },
  {
    icon: "📁",
    label: "File Encryption",
    description: "Encrypt data at rest",
    href: "/safe-defaults",
    query: "#symmetric-encryption",
  },
  {
    icon: "💬",
    label: "Messaging",
    description: "Real-time and async communication",
    href: "/safe-defaults",
    query: "#authenticated-messaging",
  },
  {
    icon: "🌐",
    label: "Web & API",
    description: "Transport and protocol security",
    href: "/safe-defaults",
    query: "#web-api-transport",
  },
  {
    icon: "✍️",
    label: "Digital Signatures",
    description: "Authenticity and non-repudiation",
    href: "/safe-defaults",
    query: "#digital-signatures",
  },
  {
    icon: "🛡️",
    label: "Post-Quantum Planning",
    description: "Future-proofing and migration",
    href: "/safe-defaults",
    query: "#key-exchange",
  },
];

export default function IntentCards() {
  return (
    <section
      aria-label="What are you trying to protect?"
      style={{ marginBottom: "24px" }}
    >
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "22px",
            fontWeight: 700,
            fontFamily:
              "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            color: "var(--color-text-heading)",
          }}
        >
          What are you trying to protect?
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "var(--color-text-muted)",
            lineHeight: 1.6,
          }}
        >
          Choose your use case for safe defaults, or{" "}
          <Link
            href="/advisor"
            style={{
              color: "var(--color-text-link)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            use the decision wizard
          </Link>{" "}
          for a tailored recommendation.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "12px",
        }}
      >
        {INTENT_PATHS.map((path) => (
          <Link
            key={path.label}
            href={`${path.href}${path.query ?? ""}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              padding: "18px 20px",
              background: "var(--color-bg-card)",
              border: "1.5px solid var(--color-border)",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent-blue)";
              e.currentTarget.style.boxShadow =
                "0 0 12px rgba(59, 130, 246, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: "28px",
                lineHeight: 1,
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {path.icon}
            </span>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--color-text-heading)",
                  marginBottom: "4px",
                  fontFamily:
                    "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                }}
              >
                {path.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {path.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
