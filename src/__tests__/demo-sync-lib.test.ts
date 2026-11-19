import { describe, expect, it } from "vitest";
import { diffDemoSlugs, extractLiveSlugsFromHtml, extractLocalSlugs } from "@/lib/demoSync";

describe("demoSync helpers", () => {
  it("extracts unique live slugs from html", () => {
    const html = `
      <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab-aes-modes/">AES</a>
      <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab-aes-modes/">AES duplicate</a>
      <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab-kyber-vault/">Kyber</a>
      <a href="https://systemslibrarian.github.io/crypto-lab-vrf-gate/">VRF</a>
      <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab-shadow-vault">No trailing slash</a>
      <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab-stark-tower?x=1">With query</a>
      <a href="https://crypto-lab.systemslibrarian.dev/crypto-lab-snark-arena#overview">With hash</a>
    `;

    expect(extractLiveSlugsFromHtml(html)).toEqual([
      "crypto-lab-aes-modes",
      "crypto-lab-kyber-vault",
      "crypto-lab-shadow-vault",
      "crypto-lab-snark-arena",
      "crypto-lab-stark-tower",
      "crypto-lab-vrf-gate",
    ]);
  });

  it("extracts local slugs and tracks invalid local urls", () => {
    const result = extractLocalSlugs({
      aes256gcm: [
        { title: "AES Modes", url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-aes-modes/", note: "ok" },
        { title: "Bad", url: "https://github.com/systemslibrarian/crypto-lab-aes-modes", note: "legacy" },
      ],
      mlkem768: [
        { title: "Kyber", url: "https://crypto-lab.systemslibrarian.dev/crypto-lab-kyber-vault/", note: "ok" },
      ],
      vrf: [
        { title: "VRF", url: "https://systemslibrarian.github.io/crypto-lab-vrf-gate/", note: "ok" },
      ],
    });

    expect(result.slugs).toEqual([
      "crypto-lab-aes-modes",
      "crypto-lab-kyber-vault",
      "crypto-lab-vrf-gate",
    ]);
    expect(result.invalidLocalUrls).toEqual([
      {
        algorithmId: "aes256gcm",
        url: "https://github.com/systemslibrarian/crypto-lab-aes-modes",
      },
    ]);
  });

  it("diffs live and local slugs", () => {
    const result = diffDemoSlugs(
      ["crypto-lab-aes-modes", "crypto-lab-kyber-vault"],
      ["crypto-lab-aes-modes", "crypto-lab-shadow-vault"],
    );

    expect(result).toEqual({
      missingFromLocal: ["crypto-lab-kyber-vault"],
      onlyInLocal: ["crypto-lab-shadow-vault"],
      excluded: [],
      staleExclusions: [],
      contradictoryExclusions: [],
    });
  });

  // The exclusion list exists so a live demo this dataset holds no algorithm
  // record for can be named and reasoned about instead of failing the check
  // forever. These four cases are the whole contract, and three of them are
  // FAILURES: a list that could only ever silence things would rot into a set
  // of problems nobody can see.
  it("subtracts a reviewed exclusion from missing, and nothing else", () => {
    const result = diffDemoSlugs(
      ["crypto-lab-aes-modes", "crypto-lab-noisy-parity"],
      ["crypto-lab-aes-modes"],
      { "crypto-lab-noisy-parity": "no LPN algorithm entry in this dataset" },
    );

    expect(result.missingFromLocal).toEqual([]);
    expect(result.excluded).toEqual(["crypto-lab-noisy-parity"]);
    expect(result.staleExclusions).toEqual([]);
    expect(result.contradictoryExclusions).toEqual([]);
  });

  it("still reports a live slug that is neither attached nor excluded", () => {
    const result = diffDemoSlugs(
      ["crypto-lab-aes-modes", "crypto-lab-noisy-parity", "crypto-lab-brand-new"],
      ["crypto-lab-aes-modes"],
      { "crypto-lab-noisy-parity": "no LPN algorithm entry in this dataset" },
    );

    expect(result.missingFromLocal).toEqual(["crypto-lab-brand-new"]);
  });

  it("reports an exclusion for a demo that is no longer live", () => {
    const result = diffDemoSlugs(
      ["crypto-lab-aes-modes"],
      ["crypto-lab-aes-modes"],
      { "crypto-lab-retired": "it was excluded while it existed" },
    );

    expect(result.staleExclusions).toEqual(["crypto-lab-retired"]);
    expect(result.excluded).toEqual([]);
  });

  it("reports a slug that is both excluded and attached", () => {
    const result = diffDemoSlugs(
      ["crypto-lab-aes-modes"],
      ["crypto-lab-aes-modes"],
      { "crypto-lab-aes-modes": "two answers for one slug" },
    );

    expect(result.contradictoryExclusions).toEqual(["crypto-lab-aes-modes"]);
  });
});
