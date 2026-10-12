import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const resolveModule = createRequire(`${process.cwd()}/package.json`);
const axeSource = readFileSync(resolveModule.resolve("axe-core/axe.js"), "utf8");

async function accessibilityViolations(page: Page) {
  // Use the page's own origin so the audit also works with its real CSP.
  const scriptUrl = new URL("/fleet-accessibility-check.js", page.url()).href;
  await page.route(scriptUrl, (route) => route.fulfill({
    contentType: "application/javascript",
    body: axeSource,
  }));
  await page.addScriptTag({ url: scriptUrl });
  return page.evaluate(async () => {
    const axe = (window as unknown as {
      axe: { run: (context: Document, options: object) => Promise<{
        violations: { id: string; nodes: { target: string[] }[] }[];
      }> };
    }).axe;
    const result = await axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
  });
}

for (const width of [1366, 390]) {
  test(`labs remain accessible before and after filtering at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/labs/");
    await expect(page.getByRole("heading", { name: "Interactive Labs" })).toBeVisible();
    const counter = page.getByText(/Showing \d+ of \d+ labs/);
    const total = Number((await counter.textContent())!.match(/of (\d+) labs/)![1]);
    expect(total).toBeGreaterThan(0);
    const labLinks = page.locator("main a[target='_blank']");
    await expect(labLinks).toHaveCount(total);
    const urls = await labLinks.evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    expect(new Set(urls).size).toBe(total);
    expect(await accessibilityViolations(page)).toEqual([]);

    const categories = page.getByRole("group", { name: "Filter labs by category" });
    const signatures = categories.getByRole("button", { name: "Signatures", exact: true });
    await signatures.click();
    await expect(signatures).toHaveAttribute("aria-pressed", "true");
    const filtered = await labLinks.count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(total);
    expect(await accessibilityViolations(page)).toEqual([]);

    await categories.getByRole("button", { name: "All", exact: true }).click();
    await page.getByRole("searchbox", { name: "Search labs" }).fill("no-such-lab-7de4b");
    await expect(labLinks).toHaveCount(0);
    await expect(page.getByText(/No labs match/)).toBeVisible();
    await page.getByRole("searchbox", { name: "Search labs" }).fill("");
    await expect(labLinks).toHaveCount(total);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    expect(errors).toEqual([]);
  });
}
