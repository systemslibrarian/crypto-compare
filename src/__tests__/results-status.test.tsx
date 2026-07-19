import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ResultsStatus from "@/components/ResultsStatus";

describe("ResultsStatus", () => {
  afterEach(cleanup);

  it("renders an empty-state message and a live result count", () => {
    render(<ResultsStatus filteredCount={0} />);

    expect(screen.getByRole("status")).toHaveTextContent(/no algorithms match the current filters/i);
    expect(screen.getByText(/0 algorithms shown/i)).toBeInTheDocument();
  });

  it("omits the empty state when results exist", () => {
    render(<ResultsStatus filteredCount={4} />);

    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText(/4 algorithms shown/i)).toBeInTheDocument();
  });
});
