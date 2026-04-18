import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { ALGORITHM_DEMOS } from "@/data/demoResources";
import { extractLocalSlugs } from "@/lib/demoSync";

function runDemoSync(args: string[]) {
  const tsxBin = join(process.cwd(), "node_modules", ".bin", "tsx");
  const scriptPath = join(process.cwd(), "scripts", "check-demo-sync.ts");
  return spawnSync(tsxBin, [scriptPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

function htmlForSlugs(slugs: string[]) {
  const links = slugs
    .map((slug) => `<a href="https://systemslibrarian.github.io/${slug}/">${slug}</a>`)
    .join("\n");
  return `<!doctype html><html><body>${links}</body></html>`;
}

describe("check-demo-sync script", () => {
  it("passes in strict mode when html snapshot matches local slugs", () => {
    const localSlugs = extractLocalSlugs(ALGORITHM_DEMOS).slugs;
    const dir = mkdtempSync(join(tmpdir(), "demo-sync-pass-"));
    const htmlPath = join(dir, "live.html");

    try {
      writeFileSync(htmlPath, htmlForSlugs(localSlugs));
      const result = runDemoSync([`--live-html-path=${htmlPath}`, "--strict"]);

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("All demo slugs are in sync");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails in strict mode when live html includes extra slug", () => {
    const localSlugs = extractLocalSlugs(ALGORITHM_DEMOS).slugs;
    const dir = mkdtempSync(join(tmpdir(), "demo-sync-fail-"));
    const htmlPath = join(dir, "live.html");

    try {
      const slugsWithExtra = [...localSlugs, "crypto-lab-nonexistent-test"];
      writeFileSync(htmlPath, htmlForSlugs(slugsWithExtra));
      const result = runDemoSync([`--live-html-path=${htmlPath}`, "--strict"]);

      expect(result.status).not.toBe(0);
      expect(result.stdout).toContain("Missing from local");
      expect(result.stdout).toContain("crypto-lab-nonexistent-test");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("writes report file with metadata fields", () => {
    const localSlugs = extractLocalSlugs(ALGORITHM_DEMOS).slugs;
    const dir = mkdtempSync(join(tmpdir(), "demo-sync-report-"));
    const htmlPath = join(dir, "live.html");
    const reportPath = join(dir, "report.json");

    try {
      writeFileSync(htmlPath, htmlForSlugs(localSlugs));
      const result = runDemoSync([
        `--live-html-path=${htmlPath}`,
        "--json",
        `--report-path=${reportPath}`,
      ]);

      expect(result.status).toBe(0);

      const report = JSON.parse(readFileSync(reportPath, "utf8")) as {
        generatedAt?: string;
        hasIssues?: boolean;
        liveSlugs?: string[];
        localSlugs?: string[];
      };

      expect(typeof report.generatedAt).toBe("string");
      expect(report.hasIssues).toBe(false);
      expect(report.liveSlugs?.length).toBe(localSlugs.length);
      expect(report.localSlugs?.length).toBe(localSlugs.length);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("accepts custom timeout and retry flags", () => {
    const localSlugs = extractLocalSlugs(ALGORITHM_DEMOS).slugs;
    const dir = mkdtempSync(join(tmpdir(), "demo-sync-flags-"));
    const htmlPath = join(dir, "live.html");

    try {
      writeFileSync(htmlPath, htmlForSlugs(localSlugs));
      const result = runDemoSync([
        `--live-html-path=${htmlPath}`,
        "--strict",
        "--timeout-ms=5000",
        "--max-retries=2",
      ]);

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("All demo slugs are in sync");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails with invalid numeric flag values", () => {
    const result = runDemoSync(["--max-retries=0"]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Invalid --max-retries");
  });

  it("shows help and exits successfully", () => {
    const result = runDemoSync(["--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage:");
    expect(result.stdout).toContain("--strict");
  });

  it("fails cleanly on unknown options", () => {
    const result = runDemoSync(["--wat"]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown option: --wat");
  });
});
