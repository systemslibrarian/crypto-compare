"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("CryptoCompare error boundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "var(--color-bg)",
            color: "var(--color-text)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              textAlign: "center",
              border: "1px solid var(--color-border-error)",
              borderRadius: "12px",
              padding: "32px",
              background: "var(--color-bg-error)",
            }}
          >
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-badge-red-text)", margin: "0 0 12px" }}>
              Something went wrong
            </h1>
            <p style={{ color: "var(--color-text-body)", lineHeight: 1.7, margin: "0 0 16px" }}>
              The crypto reference tool encountered an unexpected error. Try reloading the page.
            </p>
            <pre
              style={{
                background: "var(--color-bg-elevated)",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "13px",
                color: "var(--color-accent-red-label)",
                overflow: "auto",
                textAlign: "left",
                maxHeight: "120px",
              }}
            >
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "16px",
                background: "var(--color-button-primary)",
                color: "var(--color-button-primary-text)",
                border: "none",
                padding: "10px 24px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
