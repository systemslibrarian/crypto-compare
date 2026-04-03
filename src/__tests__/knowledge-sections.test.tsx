import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import KnowledgeSections from "@/components/KnowledgeSections";

describe("KnowledgeSections", () => {
  it("renders the expected section entry points", () => {
    render(
      <KnowledgeSections
        showHybrid={false}
        showGuide={false}
        showSafeUsage={false}
        showArchitectures={false}
        showLibraries={false}
        showPhilosophy={false}
        onToggleHybrid={vi.fn()}
        onToggleGuide={vi.fn()}
        onToggleSafeUsage={vi.fn()}
        onToggleArchitectures={vi.fn()}
        onToggleLibraries={vi.fn()}
        onTogglePhilosophy={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /show hybrid cryptography patterns/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show if you're building x/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show common pitfalls/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show reference architectures/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show recommended libraries/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show design philosophy/i })).toBeInTheDocument();
  });
});