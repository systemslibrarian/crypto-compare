import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import axe from "axe-core";
import AlgoCard from "@/components/AlgoCard";
import CategoryStrip from "@/components/CategoryStrip";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";

async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: {
      // JSDOM does not perform layout or compute rendered color contrast.
      "color-contrast": { enabled: false },
    },
  });
  expect(results.violations.map((violation) => ({
    id: violation.id,
    targets: violation.nodes.map((node) => node.target),
  }))).toEqual([]);
}

describe("accessibility regressions", () => {
  afterEach(cleanup);

  it("keeps algorithm cards free of automated semantic violations", async () => {
    const { container } = render(
      <AlgoCard algo={ALGORITHMS[0]} selected={false} onToggle={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });

  it("uses navigation controls without unsupported tab semantics", async () => {
    const counts = Object.fromEntries(CATEGORIES.map((category) => [category.id, 1]));
    const { container } = render(
      <CategoryStrip
        categories={CATEGORIES}
        counts={counts}
        selectedCategory="symmetric"
        globalSearch={false}
        datasetSize={ALGORITHMS.length}
        onSelectCategory={() => {}}
        onSelectAll={() => {}}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
