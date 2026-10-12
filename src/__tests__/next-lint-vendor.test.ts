import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import fixtures from "./fixtures/next-root-directory-compatibility.json";
import lintBaseline from "./fixtures/next-lint-baseline-rules.json";

const require = createRequire(import.meta.url);
const root = process.cwd();
const vendor = path.join(root, "vendor/eslint-plugin-next");
const upstream = JSON.parse(fs.readFileSync(path.join(vendor, "UPSTREAM.json"), "utf8"));
const sha = (data: Buffer) => createHash("sha256").update(data).digest("hex");
const { getRootDirs } = require(path.join(vendor, "dist/utils/get-root-dirs.js"));
const rule = require(path.join(vendor, "dist/rules/no-html-link-for-pages.js")).default;
const { Linter } = require("eslint");

const EXPECTED_ADDITIONAL_RULES: Record<string, unknown[]> = {
  "@next/next/no-location-assign-relative-destination": [1],
  "react-hooks/config": [2],
  "react-hooks/error-boundaries": [2],
  "react-hooks/gating": [2],
  "react-hooks/globals": [2],
  "react-hooks/immutability": [2],
  "react-hooks/incompatible-library": [1],
  "react-hooks/preserve-manual-memoization": [2],
  "react-hooks/purity": [2],
  "react-hooks/refs": [2],
  "react-hooks/set-state-in-effect": [2],
  "react-hooks/set-state-in-render": [2],
  "react-hooks/static-components": [2],
  "react-hooks/unsupported-syntax": [1],
  "react-hooks/use-memo": [2],
};

function normalizeRule(ruleConfig: unknown[]) {
  const severity = { off: 0, warn: 1, error: 2 }[String(ruleConfig[0])];
  return [severity ?? ruleConfig[0], ...ruleConfig.slice(1)];
}

// Frozen results were rechecked against the actual unmodified16.4.0 consumer,
// not inferred from this replacement. Both valid and forbidden links are
// exercised by the rule itself.
describe("integrity-pinned Next lint package", () => {
  it("retains every upstream rule and accounts for every modified package file", () => {
    const changed = Object.keys(upstream.changes);
    expect(changed.sort()).toEqual(["dist/utils/get-root-dirs.js", "package.json"]);
    expect(upstream.files.filter((row: {path: string}) => row.path.startsWith("dist/rules/"))).toHaveLength(44);
    for (const file of upstream.files) {
      expect(sha(fs.readFileSync(path.join(vendor, file.path))), file.path).toBe(
        changed.includes(file.path) ? upstream.patchedHashes[file.path] : file.sha256,
      );
    }
    const plugin = require("@next/eslint-plugin-next");
    const originalIndex = require(path.join(vendor, "dist/index.js"));
    const eslintConfigNextPackage = JSON.parse(
      fs.readFileSync(path.join(path.dirname(require.resolve("eslint-config-next")), "../package.json"), "utf8"),
    );
    const pluginPackage = JSON.parse(fs.readFileSync(path.join(vendor, "package.json"), "utf8"));
    expect(Object.keys(plugin.rules)).toHaveLength(22);
    expect(plugin.rules).toEqual(originalIndex.rules);
    expect(eslintConfigNextPackage.version).toBe(upstream.version);
    expect(pluginPackage.version).toBe(upstream.version);
    expect(pluginPackage.dependencies).toEqual({
      "@eslint-community/eslint-utils": "4.9.1",
      glob: "13.0.6",
    });
  });

  it("retains every prior lint rule and enables only the reviewed Next 16 additions", async () => {
    const { ESLint } = require("eslint");
    const eslint = new ESLint({cwd:root});
    for (const entry of lintBaseline.records) {
      const configuration = await eslint.calculateConfigForFile(path.join(root,entry.file));
      for (const [ruleName, ruleConfig] of Object.entries(entry.allRules)) {
        expect(configuration.rules[ruleName], `${entry.file}: ${ruleName}`).toEqual(
          normalizeRule(ruleConfig as unknown[]),
        );
      }
      const previousRules = new Set(Object.keys(entry.allRules));
      const addedRules = Object.fromEntries(
        Object.entries(configuration.rules).filter(([ruleName]) => !previousRules.has(ruleName)),
      );
      expect(addedRules, entry.file).toEqual(EXPECTED_ADDITIONAL_RULES);
    }
  });

  for (const entry of fixtures.cases) {
    it(`preserves upstream root-directory and navigation-rule results: ${JSON.stringify(entry.rootDir)}`, () => {
      const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "next-rule-contract-"));
      const prior = process.cwd();
      try {
        for (const dir of ["apps/site/pages", "apps/admin/src/app", "apps/nested/site/pages", "apps/.hidden/pages"]) {
          fs.mkdirSync(path.join(scratch, dir), {recursive:true});
          for (const file of ["index.js", "about.js"]) fs.writeFileSync(path.join(scratch, dir, file), "export default ()=>null;\n");
        }
        fs.writeFileSync(path.join(scratch, "apps/plain-file"), "not a directory");
        fs.symlinkSync("site", path.join(scratch,"apps/symlink"), "dir");
        fs.symlinkSync("does-not-exist", path.join(scratch,"apps/broken"), "dir");
        process.chdir(scratch);
        const dir = entry.rootDir === null ? null : JSON.parse(JSON.stringify(entry.rootDir).replaceAll("<ROOT>",scratch));
        const settings = dir === null ? {} : {next:{rootDir:dir}};
        expect(getRootDirs({cwd:scratch,settings}).map((p: string)=>p.replaceAll(scratch,"<ROOT>")).sort()).toEqual(entry.expectedDirectories);
        const linter = new Linter({ configType: "eslintrc" });
        expect(typeof rule.create).toBe("function");
        linter.defineRule("next-page",rule);
        const text = '<><a href="/about">about</a><a href="https://outside.test/about">out</a><a href="/about" target="_blank">new</a><a href="/about" download>download</a></>';
        const messages = linter.verify(text,{parserOptions:{ecmaVersion:2020,sourceType:"module",ecmaFeatures:{jsx:true}},settings,rules:{"next-page":"error"}},{filename:path.join(scratch,"test.jsx")});
        expect(messages.map(({ruleId,severity,message,line,column}: {ruleId:string;severity:number;message:string;line:number;column:number})=>({ruleId,severity,message,line,column}))).toEqual(entry.expectedMessages);
      } finally {
        process.chdir(prior);
        fs.rmSync(scratch,{recursive:true,force:true});
      }
    });
  }
});
