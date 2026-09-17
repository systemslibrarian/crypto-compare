import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SafeDefaultsView from "@/components/SafeDefaultsView";

describe("Safe Defaults", () => {
  it("describes the AES-GCM plaintext cap as a per-invocation limit", () => {
    render(<SafeDefaultsView />);

    const heading = screen.getByRole("heading", { name: "Symmetric encryption" });
    const card = heading.parentElement?.parentElement;
    expect(card).not.toBeNull();

    fireEvent.click(within(card as HTMLElement).getByRole("button", { name: /details, pitfalls/i }));

    expect(within(card as HTMLElement).getByText(/per-invocation limit/i)).toBeInTheDocument();
    expect(within(card as HTMLElement).getByText(/per-key invocation and forgery budgets separately/i)).toBeInTheDocument();
    expect(within(card as HTMLElement).queryByText(/under a single key without re-keying/i)).not.toBeInTheDocument();
  });
});
