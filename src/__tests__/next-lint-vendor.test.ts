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
const rule = require(path.join(vendor, "dist/rules/no-html-link-for-pages.js"));
const { Linter } = require("eslint");

// Frozen results come from the actual unmodified 15.5.27 consumer, not this
// replacement. Both valid and forbidden links are exercised by the rule itself.
describe("integrity-pinned Next lint package", () => {
  it("retains every upstream rule and accounts for every modified package file", () => {
    const changed = Object.keys(upstream.changes);
    expect(changed.sort()).toEqual(["dist/utils/get-root-dirs.js", "package.json"]);
    expect(upstream.files.filter((row: {path: string}) => row.path.startsWith("dist/rules/"))).toHaveLength(42);
    for (const file of upstream.files) {
      expect(sha(fs.readFileSync(path.join(vendor, file.path))), file.path).toBe(
        changed.includes(file.path) ? upstream.patchedHashes[file.path] : file.sha256,
      );
    }
    const plugin = require("@next/eslint-plugin-next");
    const originalIndex = require(path.join(vendor, "dist/index.js"));
    expect(Object.keys(plugin.rules)).toHaveLength(21);
    expect(plugin.rules).toEqual(originalIndex.rules);
    expect(require("eslint-config-next/package.json").version).toBe(upstream.version);
    expect(require("@next/eslint-plugin-next/package.json").version).toBe(upstream.version);
    expect(require("@next/eslint-plugin-next/package.json").dependencies).toEqual({glob:"13.0.6"});
  });

  it("keeps every resolved application and script lint rule configuration unchanged", async () => {
    const { ESLint } = require("eslint");
    const eslint = new ESLint({cwd:root});
    for (const entry of lintBaseline.records) {
      const configuration = await eslint.calculateConfigForFile(path.join(root,entry.file));
      expect(configuration.rules,entry.file).toEqual(entry.allRules);
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
        const linter = new Linter();
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
