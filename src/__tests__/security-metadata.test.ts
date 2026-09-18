import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => {
  const loader = () => ({ className: "font-stub", variable: "--font-stub", style: { fontFamily: "stub" } });
  return { DM_Mono: loader, Fraunces: loader };
});

describe("document security metadata", () => {
  it("limits static-export resource loading and dangerous embedding surfaces", async () => {
    const { CONTENT_SECURITY_POLICY } = await import("@/app/layout");
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'");
    expect(CONTENT_SECURITY_POLICY).toContain("frame-src 'none'");
    expect(CONTENT_SECURITY_POLICY).toContain("base-uri 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("upgrade-insecure-requests");
    expect(CONTENT_SECURITY_POLICY).not.toContain("https:");
    expect(CONTENT_SECURITY_POLICY).not.toContain("script-src data:");
  });

  it("does not leak full paths in cross-origin referrers or trigger contact detection", async () => {
    const { metadata } = await import("@/app/layout");
    expect(metadata.referrer).toBe("strict-origin-when-cross-origin");
    expect(metadata.formatDetection).toEqual({
      email: false,
      address: false,
      telephone: false,
    });
  });

  it("keeps client-side schema validation compatible with the production CSP", async () => {
    const { z } = await import("zod");
    await import("@/lib/validation");

    expect(z.config()).toMatchObject({ jitless: true });
  });
});
