import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import AppHeaderNav from "@/components/AppHeaderNav";

describe("AppHeaderNav", () => {
  it("forwards reset, advanced toggle, and category selection", () => {
    const onReset = vi.fn();
    const onToggleAdvanced = vi.fn();
    const onSelectCategory = vi.fn();

    render(
      <AppHeaderNav
        categories={[
          { id: "symmetric", label: "Symmetric", icon: "🔐" },
          { id: "kem", label: "KEM", icon: "🤝" },
        ]}
        categoryAccent={{ symmetric: "#3b82f6", kem: "#06b6d4" } as never}
        selectedCategory="symmetric"
        advanced={false}
        mobileNavOpen={false}
        mobileNavRef={createRef<HTMLElement>()}
        onReset={onReset}
        onToggleAdvanced={onToggleAdvanced}
        onToggleMobileNav={vi.fn()}
        onCloseMobileNav={vi.fn()}
        onSelectCategory={onSelectCategory}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /back to main menu/i }));
    fireEvent.click(screen.getByRole("button", { name: /beginner/i }));
    fireEvent.click(screen.getByRole("tab", { name: /kem/i }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onToggleAdvanced).toHaveBeenCalledTimes(1);
    expect(onSelectCategory).toHaveBeenCalledWith("kem");
  });
});