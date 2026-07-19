import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FooterShell from "@/components/FooterShell";

describe("FooterShell", () => {
  it("renders the latest review date from the trust snapshot", () => {
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

    expect(screen.getByText(/reviewed/i)).toBeInTheDocument();
    expect(screen.getByText(/march 2026/i)).toBeInTheDocument();
  });
});