import { describe, expect, it } from "vitest";
import { placeCspMetaFirst } from "../../scripts/finalize-static-html";

const policy = `<meta http-equiv="Content-Security-Policy" content="default-src &#x27;self&#x27;"/>`;

describe("static HTML CSP finalization", () => {
  it("places the policy before preload and script requests", () => {
    const html = `<html><head><meta charSet="utf-8"/><link rel="preload" href="font.woff2"/><script src="app.js"></script>${policy}<title>Test</title></head></html>`;
    const finalized = placeCspMetaFirst(html);

    expect(finalized.indexOf(policy)).toBe(finalized.indexOf("<head>") + "<head>".length);
    expect(finalized.indexOf(policy)).toBeLessThan(finalized.indexOf("<link"));
    expect(finalized.indexOf(policy)).toBeLessThan(finalized.indexOf("<script"));
    expect(finalized.match(/Content-Security-Policy/g)).toHaveLength(1);
  });

  it("fails closed when the export has no policy", () => {
    expect(() => placeCspMetaFirst("<html><head></head></html>"))
      .toThrow("Expected exactly one CSP meta element; found 0");
  });

  it("fails closed when the export contains duplicate policies", () => {
    expect(() => placeCspMetaFirst(`<html><head>${policy}${policy}</head></html>`))
      .toThrow("Expected exactly one CSP meta element; found 2");
  });
});
