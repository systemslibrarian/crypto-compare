import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuickStartPanel from "@/components/QuickStartPanel";

describe("QuickStartPanel", () => {
  it("wires quick-start actions to the provided callbacks", () => {
    const onToggleMethodology = vi.fn();
    const onShowDefaults = vi.fn();
    const onSearchAll = vi.fn();
    const onShowSafeUsage = vi.fn();

    render(
      <QuickStartPanel
        showMethodology={false}
        onToggleMethodology={onToggleMethodology}
        onShowDefaults={onShowDefaults}
        onSearchAll={onSearchAll}
        onShowSafeUsage={onShowSafeUsage}
      />,
    );

    // Collapsed bar buttons
    fireEvent.click(screen.getByRole("button", { name: /^trust model$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^safe defaults$/i }));

    // Expand to access card buttons
    fireEvent.click(screen.getByRole("button", { name: /^quick start$/i }));

    fireEvent.click(screen.getByRole("button", { name: /search all algorithms/i }));
    fireEvent.click(screen.getByRole("button", { name: /read the safe-usage rules/i }));

    expect(onToggleMethodology).toHaveBeenCalledTimes(1);
    expect(onShowDefaults).toHaveBeenCalledTimes(1);
    expect(onSearchAll).toHaveBeenCalledTimes(1);
    expect(onShowSafeUsage).toHaveBeenCalledTimes(1);
  });
});