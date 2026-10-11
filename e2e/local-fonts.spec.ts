import { test, expect } from "@playwright/test";

test("loads the real site fonts without Google access", async ({ page }) => {
  const externalFontRequests: string[] = [];
  const failedFontRequests: string[] = [];
  page.on("request", (request) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFontRequests.push(request.url());
  });
  page.on("requestfailed", (request) => {
    if (request.resourceType() === "font") failedFontRequests.push(request.url());
  });
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.goto("/");
  const loaded = await page.evaluate(async () => {
    const descriptions = ['400 16px "DM Mono"', '500 16px "DM Mono"', '400 16px "Fraunces"', '500 16px "Fraunces"', '600 16px "Fraunces"'];
    const faces = await Promise.all(descriptions.map((description) => document.fonts.load(description, "Crypto compare")));
    return faces.map((group) => group.map((face) => ({ family: face.family, weight: face.weight, status: face.status })));
  });
  for (const [i, faces] of loaded.entries()) {
    expect(faces.length).toBeGreaterThan(0);
    expect(faces.every((face) => face.status === "loaded" && face.family === (i < 2 ? "DM Mono" : "Fraunces"))).toBe(true);
    expect(faces.some((face) => face.weight === ["400", "500", "400", "500", "600"][i])).toBe(true);
  }
  expect(externalFontRequests).toEqual([]);
  expect(failedFontRequests).toEqual([]);
});
