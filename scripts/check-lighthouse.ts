import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

type LighthouseReport = {
  categories?: Record<string, { score?: number | null } | undefined>;
  audits?: Record<string, {
    numericValue?: number | null;
    displayValue?: string;
    details?: { items?: unknown[] };
  } | undefined>;
};

export const LIGHTHOUSE_BUDGETS = {
  accessibility: 100,
  bestPractices: 100,
  performance: 70,
  maxCumulativeLayoutShift: 0.1,
  maxTransferBytes: 310_000,
  maxRequests: 16,
} as const;

export type LighthouseEvaluation = {
  accessibility: number;
  bestPractices: number;
  performance: number;
  cumulativeLayoutShift: number;
  transferBytes: number;
  requests: number;
  lcp: string;
  tbt: string;
  failures: string[];
};

export function evaluateLighthouse(report: LighthouseReport): LighthouseEvaluation {
  const categories = report.categories ?? {};
  const audits = report.audits ?? {};
  const score = (key: string) => Math.round((categories[key]?.score ?? 0) * 100);
  const accessibility = score("accessibility");
  const performance = score("performance");
  const bestPractices = score("best-practices");
  const cumulativeLayoutShift = audits["cumulative-layout-shift"]?.numericValue ?? Number.POSITIVE_INFINITY;
  const transferBytes = audits["total-byte-weight"]?.numericValue ?? Number.POSITIVE_INFINITY;
  const requestItems = audits["network-requests"]?.details?.items;
  const requests = Array.isArray(requestItems) ? requestItems.length : Number.POSITIVE_INFINITY;
  const displayValue = (key: string) => audits[key]?.displayValue ?? "n/a";

  const checks: Record<string, boolean> = {
    [`accessibility >= ${LIGHTHOUSE_BUDGETS.accessibility}`]: accessibility >= LIGHTHOUSE_BUDGETS.accessibility,
    [`best-practices >= ${LIGHTHOUSE_BUDGETS.bestPractices}`]: bestPractices >= LIGHTHOUSE_BUDGETS.bestPractices,
    [`performance >= ${LIGHTHOUSE_BUDGETS.performance}`]: performance >= LIGHTHOUSE_BUDGETS.performance,
    [`CLS < ${LIGHTHOUSE_BUDGETS.maxCumulativeLayoutShift}`]: cumulativeLayoutShift < LIGHTHOUSE_BUDGETS.maxCumulativeLayoutShift,
    [`transfer <= ${LIGHTHOUSE_BUDGETS.maxTransferBytes} bytes`]: transferBytes <= LIGHTHOUSE_BUDGETS.maxTransferBytes,
    [`requests <= ${LIGHTHOUSE_BUDGETS.maxRequests}`]: requests <= LIGHTHOUSE_BUDGETS.maxRequests,
  };

  return {
    accessibility,
    bestPractices,
    performance,
    cumulativeLayoutShift,
    transferBytes,
    requests,
    lcp: displayValue("largest-contentful-paint"),
    tbt: displayValue("total-blocking-time"),
    failures: Object.entries(checks).filter(([, passed]) => !passed).map(([label]) => label),
  };
}

function run() {
  const reportPath = process.argv[2] ?? "lighthouse-report.json";
  const report = JSON.parse(readFileSync(reportPath, "utf8")) as LighthouseReport;
  const result = evaluateLighthouse(report);

  console.log(`Accessibility ${result.accessibility} | Performance ${result.performance} | Best-practices ${result.bestPractices}`);
  console.log(`LCP ${result.lcp} | CLS ${result.cumulativeLayoutShift.toFixed(3)} | TBT ${result.tbt}`);
  console.log(`Initial transfer ${Math.round(result.transferBytes)} bytes | Requests ${result.requests}`);

  if (result.failures.length > 0) {
    console.error(`::error::Lighthouse gate failed: ${result.failures.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  if (result.performance < 90) {
    console.log(`::warning::Performance ${result.performance} is below the 90 target.`);
  }
  console.log("Lighthouse gates passed.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
