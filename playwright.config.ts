import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the statically exported site. Builds + serves `out/` and runs
 * the core-journey smoke tests against a real browser. Vitest owns unit/component
 * tests under src/__tests__; Playwright owns everything under e2e/.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Build before serving. `serve out` only publishes whatever is already on
    // disk, so without this a failed build leaves the previous good bundle in
    // `out/` and the suite passes green against code that no longer compiles —
    // which silently invalidates mutation checks.
    command: `npm run build && npx serve out -l ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
