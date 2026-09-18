import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CounselButton } from "@/components/CounselButton";

describe("CounselButton", () => {
  it("uses an accessible background in both floating states", () => {
    render(<CounselButton variant="floating" />);

    const link = screen.getByRole("link", { name: /ask the counsel/i });
    expect(link).toHaveClass("bg-emerald-700", "hover:bg-emerald-800", "text-white");
    expect(link).not.toHaveClass("bg-emerald-600", "hover:bg-emerald-500");
  });
});
