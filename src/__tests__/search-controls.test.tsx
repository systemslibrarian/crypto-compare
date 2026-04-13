import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import SearchControls from "@/components/SearchControls";

describe("SearchControls", () => {
  it("shows active filters and forwards user actions", () => {
    const onToggleFilters = vi.fn();
    const onActivateSearchAll = vi.fn();

    render(
      <SearchControls
        searchRef={createRef<HTMLInputElement>()}
        search=""
        selectedCategoryLabel="Symmetric"
        globalSearch={false}
        sortBy="name"
        sortOptions={[{ id: "name", label: "Name" }]}
        showFilters={false}
        showMethodology={false}
        pqOnly={true}
        standardOnly={false}
        nistOnly={false}
        deployedOnly={false}
        showDefaults={false}
        favOnly={false}
        favoritesCount={2}
        country="all"
        countryOptions={["all"]}
        datasetSize={85}
        categoryCount={16}
        onSearchChange={vi.fn()}
        onToggleGlobalSearch={vi.fn()}
        onSortChange={vi.fn()}
        onToggleFilters={onToggleFilters}
        onToggleMethodology={vi.fn()}
        onCountryChange={vi.fn()}
        onTogglePqOnly={vi.fn()}
        onToggleStandardOnly={vi.fn()}
        onToggleNistOnly={vi.fn()}
        onToggleDeployedOnly={vi.fn()}
        onToggleDefaults={vi.fn()}
        onToggleFavorites={vi.fn()}
        onActivateSearchAll={onActivateSearchAll}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /show filter options \(active\)/i }));

    expect(onToggleFilters).toHaveBeenCalledTimes(1);
  });

  it("marks the matching preset as active", () => {
    render(
      <SearchControls
        searchRef={createRef<HTMLInputElement>()}
        search=""
        selectedCategoryLabel="Symmetric"
        globalSearch={true}
        sortBy="pq"
        sortOptions={[{ id: "name", label: "Name" }, { id: "pq", label: "PQ readiness" }]}
        showFilters={true}
        showMethodology={false}
        pqOnly={true}
        standardOnly={false}
        nistOnly={false}
        deployedOnly={false}
        showDefaults={false}
        favOnly={false}
        favoritesCount={0}
        country="all"
        countryOptions={["all"]}
        datasetSize={85}
        categoryCount={16}
        onSearchChange={vi.fn()}
        onToggleGlobalSearch={vi.fn()}
        onSortChange={vi.fn()}
        onToggleFilters={vi.fn()}
        onToggleMethodology={vi.fn()}
        onCountryChange={vi.fn()}
        onTogglePqOnly={vi.fn()}
        onToggleStandardOnly={vi.fn()}
        onToggleNistOnly={vi.fn()}
        onToggleDeployedOnly={vi.fn()}
        onToggleDefaults={vi.fn()}
        onToggleFavorites={vi.fn()}
        onActivateSearchAll={vi.fn()}
        onApplyPreset={vi.fn()}
      />,
    );

    for (const button of screen.getAllByRole("button", { name: /apply preset: post-quantum ready/i })) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }

    for (const button of screen.getAllByRole("button", { name: /apply preset: web crypto api/i })) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });
});