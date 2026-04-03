import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResultsStatus from "@/components/ResultsStatus";

describe("ResultsStatus", () => {
  it("renders comparison guidance and an empty-state message when needed", () => {
    render(<ResultsStatus explainerOpen={false} filteredCount={0} />);

    expect(screen.getByText(/select cards to compare algorithms side by side/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/no algorithms match the current filters/i);
    expect(screen.getByText(/0 algorithms shown/i)).toBeInTheDocument();
  });
});