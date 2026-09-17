import { describe, expect, it } from "vitest";
import { DECISION_TREE } from "@/components/DecisionFlowchart";
import { ALGORITHMS } from "@/data/algorithms";
import {
  ADVISOR_RULESET_VERSION,
  enumerateAdvisorLeafPaths,
  type AdvisorRuleTree,
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
    expect(leaves.every((leaf) => leaf.result.id === null || algorithmIds.has(leaf.result.id))).toBe(true);
    expect(leaves.every((leaf) => leaf.choiceIds.length >= 2)).toBe(true);
  });

  it("reaches every answer without placeholder decision labels", () => {
    const leaves = enumerateAdvisorLeafPaths(DECISION_TREE);

    for (const leaf of leaves) {
      expect(leaf.steps.every((step) => step.optionLabel !== "—")).toBe(true);
      expect(leaf.result.reason.trim().length).toBeGreaterThan(20);
    }
  });

  it("offers explicit classical, post-quantum, and review paths", () => {
    const leaves = enumerateAdvisorLeafPaths(DECISION_TREE);

    expect(leaves).toEqual(expect.arrayContaining([
      expect.objectContaining({ choiceIds: ["start.2", "kem.1"], result: expect.objectContaining({ id: "curve25519" }) }),
      expect.objectContaining({ choiceIds: ["start.2", "kem.2", "kem_pq.1"], result: expect.objectContaining({ id: "mlkem768" }) }),
      expect.objectContaining({ choiceIds: ["start.2", "kem.3"], result: expect.objectContaining({ kind: "review", id: null }) }),
      expect.objectContaining({ choiceIds: ["start.3", "sig.1"], result: expect.objectContaining({ id: "ed25519" }) }),
      expect.objectContaining({ choiceIds: ["start.3", "sig.2", "sig_pq.1"], result: expect.objectContaining({ id: "mldsa65" }) }),
      expect.objectContaining({ choiceIds: ["start.3", "sig.4"], result: expect.objectContaining({ kind: "review", id: null }) }),
    ]));
  });

  it("supports a review-required outcome without inventing an algorithm", () => {
    const tree: AdvisorRuleTree = {
      start: {
        question: "Is the design within the catalog's scope?",
        options: [
          {
            label: "No",
            answer: {
              kind: "review",
              algo: "Security review required",
              id: null,
              reason: "The constraints require a construction-level review.",
              category: "symmetric",
              nextSteps: ["Document the threat model."],
            },
          },
          {
            label: "Yes",
            answer: {
              algo: "AES-256-GCM",
              id: "aes256gcm",
              reason: "The documented deployment constraints fit this profile.",
              category: "symmetric",
            },
          },
        ],
      },
    };

    expect(validateAdvisorRules(tree, algorithmIds)).toEqual([]);
    expect(enumerateAdvisorLeafPaths(tree)[0].result.id).toBeNull();
  });
});
