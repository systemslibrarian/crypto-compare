import { test, expect } from "@playwright/test";

test.describe("crypto::compare core journeys", () => {
  test("home loads, search filters the algorithm grid", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Back to main menu" })).toBeVisible();

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

  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("/labs/");
  });
});
