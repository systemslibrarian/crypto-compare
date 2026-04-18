import { describe, expect, it } from "vitest";
import { diffDemoSlugs, extractLiveSlugsFromHtml, extractLocalSlugs } from "@/lib/demoSync";

describe("demoSync helpers", () => {
  it("extracts unique live slugs from html", () => {
    const html = `
      <a href="https://systemslibrarian.github.io/crypto-lab-aes-modes/">AES</a>
      <a href="https://systemslibrarian.github.io/crypto-lab-aes-modes/">AES duplicate</a>
      <a href="https://systemslibrarian.github.io/crypto-lab-kyber-vault/">Kyber</a>
    `;

    expect(extractLiveSlugsFromHtml(html)).toEqual([
      "crypto-lab-aes-modes",
      "crypto-lab-kyber-vault",
    ]);
  });

  it("extracts local slugs and tracks invalid local urls", () => {
    const result = extractLocalSlugs({
      aes256gcm: [
        { title: "AES Modes", url: "https://systemslibrarian.github.io/crypto-lab-aes-modes/", note: "ok" },
        { title: "Bad", url: "https://github.com/systemslibrarian/crypto-lab-aes-modes", note: "legacy" },
      ],
      mlkem768: [
        { title: "Kyber", url: "https://systemslibrarian.github.io/crypto-lab-kyber-vault/", note: "ok" },
      ],
    });

    expect(result.slugs).toEqual([
      "crypto-lab-aes-modes",
      "crypto-lab-kyber-vault",
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
    });
  });
});
