import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewBadge, formatReviewDate } from "@/components/ui";

describe("Trust UI helpers", () => {
  it("formats ISO review dates into Month Year", () => {
    expect(formatReviewDate("2026-04-03")).toBe("April 2026");
    expect(formatReviewDate("2026-03-16")).toBe("March 2026");
  });

  it("returns fallback text when review date is missing", () => {
    expect(formatReviewDate(undefined)).toBe("Review pending");
  });

  it("renders a review badge with formatted date text", () => {
    render(<ReviewBadge iso="2026-04-03" />);
    expect(screen.getByText("April 2026")).toBeInTheDocument();
  });

  it("renders pending state when no review date exists", () => {
    render(<ReviewBadge iso={undefined} />);
    expect(screen.getByText("Review pending")).toBeInTheDocument();
  });
});