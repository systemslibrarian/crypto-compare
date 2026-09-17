import type { AlgorithmCategory } from "@/types/crypto";

export const ADVISOR_RULESET_VERSION = "2026.09.2";
export const ADVISOR_START_NODE = "start";

export type AdvisorRecommendation = {
  kind?: "recommendation";
  algo: string;
  id: string;
  reason: string;
  category: AlgorithmCategory;
};

export type AdvisorReviewOutcome = {
  kind: "review";
  algo: "Security review required";
  id: null;
  reason: string;
  category: AlgorithmCategory;
  nextSteps: string[];
};

export type AdvisorOutcome = AdvisorRecommendation | AdvisorReviewOutcome;

export function isAdvisorRecommendation(
  outcome: AdvisorOutcome,
): outcome is AdvisorRecommendation {
  return outcome.kind !== "review";
}

export type AdvisorOption = {
  label: string;
  next?: string;
  answer?: AdvisorOutcome;
};

export type AdvisorNode = {
  question: string;
  options: AdvisorOption[];
};

export type AdvisorRuleTree = Record<string, AdvisorNode>;

export type AdvisorDecisionStep = {
  nodeId: string;
  optionId: string;
  optionLabel: string;
  nextNodeId: string;
};

export type AdvisorLeafPath = {
  choiceIds: string[];
  steps: AdvisorDecisionStep[];
  result: AdvisorOutcome;
};

export function advisorOptionId(nodeId: string, optionIndex: number): string {
  return `${nodeId}.${optionIndex + 1}`;
}

export function enumerateAdvisorLeafPaths(
  tree: AdvisorRuleTree,
  startNode = ADVISOR_START_NODE,
): AdvisorLeafPath[] {
  const leaves: AdvisorLeafPath[] = [];

  function visit(nodeId: string, steps: AdvisorDecisionStep[], activeNodes: Set<string>) {
    if (activeNodes.has(nodeId)) throw new Error(`Advisor cycle detected at ${nodeId}`);
    const node = tree[nodeId];
    if (!node) throw new Error(`Advisor path references missing node ${nodeId}`);

    const nextActiveNodes = new Set(activeNodes).add(nodeId);
    node.options.forEach((option, optionIndex) => {
      const optionId = advisorOptionId(nodeId, optionIndex);
      if (option.answer) {
        leaves.push({ choiceIds: [...steps.map((step) => step.optionId), optionId], steps, result: option.answer });
      } else if (option.next) {
        visit(
          option.next,
          [...steps, { nodeId, optionId, optionLabel: option.label, nextNodeId: option.next }],
          nextActiveNodes,
        );
      }
    });
  }

  visit(startNode, [], new Set());
  return leaves;
}

export function validateAdvisorRules(tree: AdvisorRuleTree, algorithmIds: Set<string>): string[] {
  const errors: string[] = [];
  const optionIds = new Set<string>();

  for (const [nodeId, node] of Object.entries(tree)) {
    if (!node.question.trim()) errors.push(`${nodeId}: missing question`);
    if (node.options.length < 2) errors.push(`${nodeId}: must provide at least two options`);

    node.options.forEach((option, optionIndex) => {
      const optionId = advisorOptionId(nodeId, optionIndex);
      if (optionIds.has(optionId)) errors.push(`${nodeId}: duplicate option id ${optionId}`);
      optionIds.add(optionId);

      const targetCount = Number(Boolean(option.next)) + Number(Boolean(option.answer));
      if (targetCount !== 1) errors.push(`${optionId}: must have exactly one next node or answer`);
      if (option.next && !tree[option.next]) errors.push(`${optionId}: missing next node ${option.next}`);
      if (option.answer && isAdvisorRecommendation(option.answer) && !algorithmIds.has(option.answer.id)) {
        errors.push(`${optionId}: unknown algorithm ${option.answer.id}`);
      }
      if (option.answer?.kind === "review" && option.answer.nextSteps.length === 0) {
        errors.push(`${optionId}: review outcome must provide next steps`);
      }
    });
  }

  try {
    const leaves = enumerateAdvisorLeafPaths(tree);
    if (leaves.length === 0) errors.push("advisor has no recommendation leaves");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  return errors;
}
