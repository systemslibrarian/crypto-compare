import { test, expect } from "@playwright/test";

test.describe("crypto::compare core journeys", () => {
  test("does not preload guide routes before the visitor chooses one", async ({ page }) => {
    const speculativeRoutes: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.searchParams.has("_rsc")) {
        speculativeRoutes.push(url.pathname);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(speculativeRoutes).toEqual([]);
  });

  test("loads deep knowledge sections only when the visitor approaches them", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hybridPatterns = page.getByRole("button", { name: /show hybrid cryptography patterns/i });
    await expect(hybridPatterns).toHaveCount(0);

    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(hybridPatterns).toBeVisible();
  });

  test("loads the comparison workspace only after an algorithm is selected", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Select one more algorithm to compare.")).toHaveCount(0);

    await page.getByRole("button", { name: "Compare — add AES-256-GCM to comparison" }).click();
    await expect(page.getByText("Select one more algorithm to compare.")).toBeVisible();

    await page.getByRole("button", { name: "Compare — add ChaCha20-Poly1305 to comparison" }).click();
    await expect(page.getByRole("button", { name: "Compare 2 selected algorithms" })).toBeVisible();
  });

  test("loads without Content Security Policy browser issues", async ({ page, context }) => {
    const devtools = await context.newCDPSession(page);
    const issues: unknown[] = [];

    devtools.on("Audits.issueAdded", ({ issue }) => {
      if (issue.code === "ContentSecurityPolicyIssue") {
        issues.push(issue.details.contentSecurityPolicyIssueDetails);
      }
    });
    await devtools.send("Audits.enable");

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(issues).toEqual([]);
  });

  test("home loads, search filters the algorithm grid", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /crypto::compare.*back to main menu/i })).toBeVisible();

    // Grid loads with the default category; the first card should be present.
    await expect(page.getByText("AES-256-GCM").first()).toBeVisible();

    // Default category is "symmetric"; search is scoped to it. Filter to ChaCha
    // and assert the grid narrows (AES drops out, ChaCha remains).
    const search = page.getByRole("textbox", { name: "Search algorithms" });
    await search.fill("chacha");

    await expect(page.getByText("ChaCha20-Poly1305").first()).toBeVisible();
    await expect(page.getByText("AES-256-GCM")).toHaveCount(0);
  });

  test("labs index renders and filters", async ({ page }) => {
    await page.goto("/labs/");

    await expect(page.getByRole("heading", { name: "Interactive Labs" })).toBeVisible();
    await expect(page.getByText(/Showing \d+ of \d+ labs/)).toBeVisible();

    await page.getByRole("searchbox", { name: "Search labs" }).fill("kyber");
    await expect(page.getByRole("link", { name: /Kyber Vault/ }).first()).toBeVisible();
  });

  test("about page states the educational disclaimer", async ({ page }) => {
    await page.goto("/about/");

    await expect(page.getByRole("heading", { name: "About & Methodology" })).toBeVisible();
    await expect(
      page.getByText(/educational reference, not a substitute for a cryptographic review/i),
    ).toBeVisible();
  });

  // The shipped-HTML half of the frozen-snapshot guard. src/__tests__/site-stats.test.ts
  // proves the sources all read one constant; this proves the exported page a
  // crawler sees does not contradict itself. It shipped saying "123 hands-on
  // crypto-lab demos" in <meta name="description"> and "192 hands-on crypto-lab
  // demos" in the body of the very same document, 69 apart.
  test("labs head and body state the same demo count", async ({ page }) => {
    await page.goto("/labs/");

    const count = (text: string | null, pattern: RegExp) => {
      const match = text?.match(pattern);
      expect(match, `expected ${pattern} in: ${text}`).not.toBeNull();
      return Number.parseInt(match![1], 10);
    };

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const alt = await page.locator('meta[property="og:image:alt"]').getAttribute("content");
    const body = await page.getByText(/hands-on crypto-lab demos linked/).first().textContent();

    const rendered = count(body, /(\d+) hands-on/);
    expect(rendered).toBeGreaterThan(0);
    expect(count(description, /(\d+) hands-on/)).toBe(rendered);
    expect(count(alt, /(\d+) linked labs/)).toBe(rendered);
  });

  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("/labs/");
  });
});
