import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import { ALGORITHM_DEMOS } from "@/data/demoResources";

const LIVE_DEMO_URL_PATTERN = /^https:\/\/systemslibrarian\.github\.io\/crypto-lab-[a-z0-9-]+\/$/;

describe("demo resource dataset", () => {
  it("only uses live crypto-lab URLs", () => {
    for (const demos of Object.values(ALGORITHM_DEMOS)) {
      for (const demo of demos) {
        expect(demo.url).toMatch(LIVE_DEMO_URL_PATTERN);
      }
    }
  });

  it("does not keep legacy GitHub repo demo links", () => {
    for (const demos of Object.values(ALGORITHM_DEMOS)) {
      for (const demo of demos) {
        expect(demo.url).not.toContain("github.com/systemslibrarian/crypto-lab");
      }
    }
  });

  it("uses only known algorithm ids", () => {
    const knownIds = new Set(ALGORITHMS.map((algorithm) => algorithm.id));

    for (const algorithmId of Object.keys(ALGORITHM_DEMOS)) {
      expect(knownIds.has(algorithmId)).toBe(true);
    }
  });

  it("avoids duplicate demo URLs for each algorithm", () => {
    for (const [algorithmId, demos] of Object.entries(ALGORITHM_DEMOS)) {
      const urls = demos.map((demo) => demo.url);
      expect(new Set(urls).size).toBe(urls.length);
      expect(Array.isArray(demos)).toBe(true);
      expect(typeof algorithmId).toBe("string");
    }
  });
});
