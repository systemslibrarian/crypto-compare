import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import { formatAssuranceForExport, getAssuranceProfile } from "@/lib/assurance";

function algorithm(id: string) {
  const match = ALGORITHMS.find((entry) => entry.id === id);
  if (!match) throw new Error(`Missing test algorithm: ${id}`);
  return match;
}

describe("category-specific assurance profiles", () => {
  it("separates SHA-256 preimage, collision, and quantum bounds", () => {
    const profile = getAssuranceProfile(algorithm("sha256"));

    expect(profile.kind).toBe("hash");
    expect(profile.metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Preimage", value: expect.stringContaining("256-bit ideal classical") }),
      expect.objectContaining({ label: "Collision", value: expect.stringContaining("128-bit ideal birthday") }),
      expect.objectContaining({ label: "Collision", value: expect.stringContaining("≈85-bit BHT") }),
    ]));
  });

  it("shows ML-KEM-768 as NIST category 3 rather than exact PQ bits", () => {
    const profile = getAssuranceProfile(algorithm("mlkem768"));
    const exported = formatAssuranceForExport(algorithm("mlkem768"));

    expect(profile.headline).toContain("NIST category 3");
    expect(exported).not.toContain("192-bit PQ security");
    expect(profile.caveat).toContain("not exact security-bit measurements");
  });

  it("covers every FIPS 203 ML-KEM parameter set by NIST category", () => {
    expect(getAssuranceProfile(algorithm("mlkem512")).headline).toContain("NIST category 1");
    expect(getAssuranceProfile(algorithm("mlkem768")).headline).toContain("NIST category 3");
    expect(getAssuranceProfile(algorithm("mlkem1024")).headline).toContain("NIST category 5");
  });

  it("describes password hashing through entropy and cost parameters", () => {
    const profile = getAssuranceProfile(algorithm("argon2id"));

    expect(profile.kind).toBe("password-hashing");
    expect(profile.headline).toMatch(/password entropy and configured attacker cost/i);
    expect(profile.caveat).toMatch(/output length is not password strength/i);
  });

  it("separates AEAD confidentiality, authentication, and nonce requirements", () => {
    const profile = getAssuranceProfile(algorithm("aes256gcm"));

    expect(profile.kind).toBe("aead");
    expect(profile.metrics.map((metric) => metric.label)).toEqual([
      "Key-search estimate",
      "Authentication",
      "Nonce / IV",
    ]);
    expect(profile.metrics[1].value).toContain("128-bit tag");
  });

  it("does not describe steganography with cryptographic bit strength", () => {
    const profile = getAssuranceProfile(algorithm("wow_stego"));

    expect(profile.kind).toBe("steganography");
    expect(profile.headline).toMatch(/detectability risk, not cryptographic bit strength/i);
  });
});
