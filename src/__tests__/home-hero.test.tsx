import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomeHero from "@/components/HomeHero";

describe("HomeHero", () => {
  it("provides the page heading and describes the evidence without claiming vetting", () => {
    render(<HomeHero datasetSize={100} categoryCount={17} totalCitations={150} uniqueSources={90} />);

    expect(screen.getByRole("heading", { level: 1, name: /choose the right cryptography/i })).toBeInTheDocument();
    expect(screen.getByText(/evidence-linked recommendations/i)).toBeInTheDocument();
    expect(screen.queryByText(/vetted recommendations/i)).not.toBeInTheDocument();
  });
});
