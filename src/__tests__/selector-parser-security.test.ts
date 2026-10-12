import { spawnSync } from "node:child_process";
import { expect, test } from "vitest";

// GHSA-rj75-hqrm-r3gf: a flat selector has nesting depth zero but formerly
// triggered quadratic scans. Bound the child so a regression cannot hang CI.
// Ten seconds is a liveness limit, not a performance benchmark.
test("parses a large flat selector without exhausting the build process", () => {
  const result = spawnSync(process.execPath, ["-e", `
    const parser = require('postcss-selector-parser');
    const count = 800000;
    const input = '.a'.repeat(count);
    const root = parser().astSync(input);
    const nodes = root.nodes[0].nodes;
    if (root.nodes.length !== 1 || nodes.length !== count ||
        !nodes.every(node => node.type === 'class' && node.value === 'a') ||
        root.toString() !== input) process.exit(2);
    process.stdout.write('parsed ' + count + ' classes');
  `], { encoding: "utf8", timeout: 10000, maxBuffer: 65536 });
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(0);
  expect(result.stdout).toBe("parsed 800000 classes");
}, 15000);
