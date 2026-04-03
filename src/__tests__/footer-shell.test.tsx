import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FooterShell from "@/components/FooterShell";

describe("FooterShell", () => {
  it("renders the review window using trust snapshot dates", () => {
    render(
      <FooterShell
        trustSnapshot={{
          earliest: "2026-01",
          latest: "2026-03",
          coverage: 85,
          totalSources: 220,
        }}
      />,
    );

    expect(screen.getByText(/latest dataset review:/i)).toBeInTheDocument();
    expect(screen.getByText(/march 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/window starts january 2026/i)).toBeInTheDocument();
  });
});