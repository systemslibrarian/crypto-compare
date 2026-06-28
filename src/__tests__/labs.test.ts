import { describe, expect, it } from "vitest";
import { buildLabIndex, categoryLabel } from "@/lib/labs";
import { ALGORITHM_DEMOS } from "@/data/demoResources";
import { extractLocalSlugs } from "@/lib/demoSync";

describe("lab index", () => {
  const labs = buildLabIndex();

  it("contains one entry per unique mapped crypto-lab slug", () => {
    const uniqueSlugCount = extractLocalSlugs(ALGORITHM_DEMOS).slugs.length;
    expect(labs.length).toBe(uniqueSlugCount);
    expect(new Set(labs.map((lab) => lab.slug)).size).toBe(labs.length);
  });

  it("annotates every lab with at least one algorithm and category", () => {
    for (const lab of labs) {
      expect(lab.algorithms.length).toBeGreaterThan(0);
      expect(lab.categories.length).toBeGreaterThan(0);
      expect(lab.url).toMatch(/^https:\/\/systemslibrarian\.github\.io\/crypto-lab-[a-z0-9-]+\/$/);
      expect(lab.title.length).toBeGreaterThan(0);
      expect(lab.note.length).toBeGreaterThan(0);
    }
  });

  it("is sorted alphabetically by title", () => {
    const titles = labs.map((lab) => lab.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  it("resolves human-readable category labels", () => {
    expect(categoryLabel("symmetric")).toBe("Symmetric");
    expect(categoryLabel("kem")).toBe("KEM");
  });

  it("dedupes labs shared across algorithms (e.g. ChaCha20 Stream)", () => {
    const chacha = labs.find((lab) => lab.slug === "crypto-lab-chacha20-stream");
    expect(chacha).toBeDefined();
    expect(chacha!.algorithms.length).toBeGreaterThan(1);
  });
});
