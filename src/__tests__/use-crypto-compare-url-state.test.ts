import { describe, expect, it } from "vitest";
import { buildCryptoCompareQueryString, parseCryptoCompareQueryState } from "@/lib/useCryptoCompareUrlState";
import type { Algorithm } from "@/types/crypto";

const algorithms: Algorithm[] = [
  {
    id: "aes256gcm",
    name: "AES-256-GCM",
    category: "symmetric",
    family: "AES",
    origin: "USA",
    originDetail: "NIST",
    useCases: "TLS",
    status: "standard",
    statusLabel: "NIST standard",
    recommendation: "recommended",
    recommendationRationale: "Default choice",
    recommendationChangesWhen: "Constraints change",
    whyNotThis: "None",
    assumptions: "Trusted implementation",
    securityBits: 256,
    pqSecurityBits: 128,
    bestAttack: "Brute force",
    reductionQuality: "Conservative",
    performance: "Fast",
    notes: "Widely deployed",
    estimationMethodology: {
      classicalBasis: "exact",
      quantumBasis: "conservative",
      classicalNote: "Exact",
      quantumNote: "Grover bound",
    },
    keySize: 32,
    nonceSize: 12,
    tagSize: 16,
    blockSize: 16,
  },
];

describe("useCryptoCompareUrlState helpers", () => {
  it("parses supported query params", () => {
    const parsed = parseCryptoCompareQueryState("?cat=hash&adv=1&q=sha&pq=1&country=Japan&sort=security&defaults=1&fav=1&algo=aes256gcm", {
      categoryOptions: ["symmetric", "hash"],
      countryOptions: ["all", "Japan"],
      sortOptions: ["name", "security"],
      algorithms,
    });

    expect(parsed.cat).toBe("hash");
    expect(parsed.adv).toBe(true);
    expect(parsed.search).toBe("sha");
    expect(parsed.pqOnly).toBe(true);
    expect(parsed.country).toBe("Japan");
    expect(parsed.sortBy).toBe("security");
    expect(parsed.showDefaults).toBe(true);
    expect(parsed.favOnly).toBe(true);
    expect(parsed.algoId).toBe("aes256gcm");
  });

  it("builds a stable query string from state", () => {
    const queryString = buildCryptoCompareQueryString({
      cat: "symmetric",
      adv: true,
      cmp: true,
      sel: ["aes256gcm", "xchacha20poly"],
      search: "chacha",
      pqOnly: true,
      standardOnly: false,
      nistOnly: true,
      deployedOnly: false,
      country: "Japan",
      sortBy: "security",
      showDefaults: true,
      favOnly: true,
    });

    expect(queryString).toBe("cat=symmetric&adv=1&cmp=1&sel=aes256gcm%2Cxchacha20poly&q=chacha&pq=1&nist=1&country=Japan&sort=security&defaults=1&fav=1");
  });
});