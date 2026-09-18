import { describe, expect, it } from "vitest";
import { evaluateLighthouse, LIGHTHOUSE_BUDGETS } from "../../scripts/check-lighthouse";

function report({
  accessibility = 1,
  bestPractices = 1,
  performance = 0.9,
  cls = 0,
  transferBytes = 280_000,
  requests = 15,
} = {}) {
  return {
    categories: {
      accessibility: { score: accessibility },
      "best-practices": { score: bestPractices },
      performance: { score: performance },
    },
    audits: {
      "cumulative-layout-shift": { numericValue: cls, displayValue: String(cls) },
      "largest-contentful-paint": { numericValue: 2_500, displayValue: "2.5 s" },
      "total-blocking-time": { numericValue: 200, displayValue: "200 ms" },
      "total-byte-weight": { numericValue: transferBytes },
      "network-requests": { details: { items: Array.from({ length: requests }) } },
    },
  };
}

describe("Lighthouse budget gate", () => {
  it("accepts every metric at the hard budget", () => {
    const result = evaluateLighthouse(report({
      accessibility: LIGHTHOUSE_BUDGETS.accessibility / 100,
      bestPractices: LIGHTHOUSE_BUDGETS.bestPractices / 100,
      performance: LIGHTHOUSE_BUDGETS.performance / 100,
      cls: LIGHTHOUSE_BUDGETS.maxCumulativeLayoutShift - 0.001,
      transferBytes: LIGHTHOUSE_BUDGETS.maxTransferBytes,
      requests: LIGHTHOUSE_BUDGETS.maxRequests,
    }));

    expect(result.failures).toEqual([]);
  });

  it("reports every exceeded quality and payload budget", () => {
    const result = evaluateLighthouse(report({
      accessibility: 0.99,
      bestPractices: 0.99,
      performance: 0.69,
      cls: LIGHTHOUSE_BUDGETS.maxCumulativeLayoutShift,
      transferBytes: LIGHTHOUSE_BUDGETS.maxTransferBytes + 1,
      requests: LIGHTHOUSE_BUDGETS.maxRequests + 1,
    }));

    expect(result.failures).toEqual([
      "accessibility >= 100",
      "best-practices >= 100",
      "performance >= 70",
      "CLS < 0.1",
      "transfer <= 310000 bytes",
      "requests <= 16",
    ]);
  });

  it("fails closed when required Lighthouse measurements are absent", () => {
    expect(evaluateLighthouse({}).failures).toHaveLength(6);
  });
});
