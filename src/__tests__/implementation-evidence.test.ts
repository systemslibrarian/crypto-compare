import { describe, expect, it } from "vitest";
import {
  IMPLEMENTATIONS,
  isImplementationCheckStale,
  validateImplementationCatalog,
  type ImplementationEntry,
} from "@/data/implementations";
import { IMPLEMENTATION_COUNTS } from "@/data/implementationCounts";

describe("implementation evidence", () => {
  it("never labels an implementation audited without linked, scoped evidence", () => {
    expect(validateImplementationCatalog(IMPLEMENTATIONS)).toEqual([]);
    expect(IMPLEMENTATIONS.every((entry) => entry.auditStatus !== "evidence-linked" || Boolean(entry.auditEvidence))).toBe(true);
  });

  it("rejects a bare audit claim", () => {
    const entry: ImplementationEntry = {
      ...IMPLEMENTATIONS[0],
      auditStatus: "evidence-linked",
      auditEvidence: undefined,
    };
    expect(validateImplementationCatalog([entry])).toEqual([
      `${entry.algorithmId}/${entry.ecosystem}/${entry.library}: audit evidence is missing`,
    ]);
  });

  it("gives every entry sourced, dated version context without calling it an audit", () => {
    expect(IMPLEMENTATIONS).toHaveLength(58);
    expect(validateImplementationCatalog(IMPLEMENTATIONS)).toEqual([]);
    expect(IMPLEMENTATIONS.every((entry) => entry.versionContext.checked === "2026-09-18")).toBe(true);
    expect(IMPLEMENTATIONS.every((entry) => entry.versionContext.url.startsWith("https://"))).toBe(true);
  });

  it("keeps the lightweight card counts synchronized with the full catalog", () => {
    const actualCounts = IMPLEMENTATIONS.reduce<Record<string, number>>((counts, entry) => {
      counts[entry.algorithmId] = (counts[entry.algorithmId] ?? 0) + 1;
      return counts;
    }, {});

    expect(IMPLEMENTATION_COUNTS).toEqual(actualCounts);
  });

  it("marks catalog checks older than 120 days as stale", () => {
    expect(isImplementationCheckStale("2024-12-01", new Date("2026-09-17T00:00:00Z"))).toBe(true);
    expect(isImplementationCheckStale("2026-09-01", new Date("2026-09-17T00:00:00Z"))).toBe(false);
    expect(isImplementationCheckStale("not-a-date", new Date("2026-09-17T00:00:00Z"))).toBe(true);
  });
});
