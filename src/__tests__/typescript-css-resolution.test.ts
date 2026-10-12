import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function fixture() {
  const scratch = mkdtempSync(path.join(tmpdir(), "compare-css-resolution-"));
  mkdirSync(path.join(scratch, "scripts"));
  mkdirSync(path.join(scratch, "src/app"), { recursive: true });
  copyFileSync(
    path.join(root, "scripts/check-typescript-tooling.mjs"),
    path.join(scratch, "scripts/check-typescript-tooling.mjs"),
  );
  for (const file of ["globals.css", "globals.d.css.ts"]) {
    copyFileSync(path.join(root, "src/app", file), path.join(scratch, "src/app", file));
  }
  symlinkSync(path.join(root, "node_modules"), path.join(scratch, "node_modules"), "dir");
  writeFileSync(path.join(scratch, "package.json"), "{}\n");
  writeFileSync(path.join(scratch, "index.ts"), 'import "./src/app/globals.css";\n');
  writeFileSync(path.join(scratch, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      noEmit: true,
      skipLibCheck: true,
      module: "esnext",
      moduleResolution: "bundler",
      allowArbitraryExtensions: true,
      noUncheckedSideEffectImports: true,
      types: [],
    },
    files: ["index.ts"],
  }));
  return scratch;
}

function compile(scratch: string) {
  return spawnSync(path.join(scratch, "node_modules/.bin/tsc"), ["--noEmit"], {
    cwd: scratch,
    encoding: "utf8",
  });
}

function toolingGuard(scratch: string) {
  return spawnSync(process.execPath, ["scripts/check-typescript-tooling.mjs"], {
    cwd: scratch,
    encoding: "utf8",
  });
}

describe("native TypeScript CSS source resolution", () => {
  it("accepts the actual stylesheet and its exact declaration with the real compiler and guard", () => {
    const scratch = fixture();
    try {
      const result = compile(scratch);
      expect(result.status, result.stdout + result.stderr).toBe(0);
      const guard = toolingGuard(scratch);
      expect(guard.status, guard.stdout + guard.stderr).toBe(0);
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });

  it("rejects a nonexistent CSS import instead of recognizing every CSS filename", () => {
    const scratch = fixture();
    try {
      writeFileSync(path.join(scratch, "index.ts"), 'import "./src/app/missing-stylesheet.css";\n');
      const result = compile(scratch);
      expect(result.status).toBe(1);
      expect(result.stdout).toContain("TS2882");
      expect(result.stdout).toContain("missing-stylesheet.css");
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });

  it("rejects a missing paired source even when its declaration lets the compiler pass", () => {
    const scratch = fixture();
    try {
      unlinkSync(path.join(scratch, "src/app/globals.css"));
      const compiler = compile(scratch);
      expect(compiler.status, compiler.stdout + compiler.stderr).toBe(0);
      const guard = toolingGuard(scratch);
      expect(guard.status).toBe(1);
      expect(guard.stderr).toContain("ENOENT");
      expect(guard.stderr).toContain("globals.css");
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });

  it("rejects a missing declaration while leaving the actual stylesheet intact", () => {
    const scratch = fixture();
    try {
      unlinkSync(path.join(scratch, "src/app/globals.d.css.ts"));
      const result = compile(scratch);
      expect(result.status).toBe(1);
      expect(result.stdout).toContain("TS2882");
      expect(result.stdout).toContain("globals.css");
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });
});
