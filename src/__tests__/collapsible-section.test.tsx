import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CollapsibleSection from "@/components/CollapsibleSection";

describe("CollapsibleSection", () => {
  it("shows the button label and calls toggle when clicked", () => {
    const onToggle = vi.fn();

    render(
      <CollapsibleSection
        isOpen={false}
        onToggle={onToggle}
        buttonLabel="Reference Architectures"
        sectionLabel="Reference architectures"
        title="Reference Architectures"
      >
        <div>Child content</div>
      </CollapsibleSection>,
    );

    fireEvent.click(screen.getByRole("button", { name: /show reference architectures/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });
});