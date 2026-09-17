import { describe, expect, it } from "vitest";
import { DECISION_TREE } from "@/components/DecisionFlowchart";
import { ALGORITHMS } from "@/data/algorithms";
import {
  ADVISOR_RULESET_VERSION,
  enumerateAdvisorLeafPaths,
  validateAdvisorRules,
} from "@/lib/advisorEngine";

describe("advisor rule engine", () => {
  const algorithmIds = new Set(ALGORITHMS.map((algorithm) => algorithm.id));

  it("has a versioned, valid, acyclic ruleset", () => {
    expect(ADVISOR_RULESET_VERSION).toMatch(/^\d{4}\.\d{2}\.\d+$/);
    expect(validateAdvisorRules(DECISION_TREE, algorithmIds)).toEqual([]);
  });

  it("enumerates every recommendation leaf with a deterministic choice path", () => {
    const leaves = enumerateAdvisorLeafPaths(DECISION_TREE);
    const pathKeys = leaves.map((leaf) => leaf.choiceIds.join("/"));

    expect(leaves.length).toBeGreaterThan(30);
    expect(new Set(pathKeys).size).toBe(pathKeys.length);
    expect(leaves.every((leaf) => algorithmIds.has(leaf.result.id))).toBe(true);
    expect(leaves.every((leaf) => leaf.choiceIds.length >= 2)).toBe(true);
  });

  it("reaches every answer without placeholder decision labels", () => {
    const leaves = enumerateAdvisorLeafPaths(DECISION_TREE);

    for (const leaf of leaves) {
      expect(leaf.steps.every((step) => step.optionLabel !== "—")).toBe(true);
      expect(leaf.result.reason.trim().length).toBeGreaterThan(20);
    }
  });
});
