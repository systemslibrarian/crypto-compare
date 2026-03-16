import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

const REQUIRED_BY_CATEGORY: Record<AlgorithmCategory, string[]> = {
  symmetric: ["keySize", "nonceSize", "blockSize"],
  kem: ["publicKeySize", "ciphertextSize", "sharedSecretSize"],
  signature: ["publicKeySize", "signatureSize"],
  hash: ["outputSize", "blockSize", "stateSize"],
  kdf: ["inputType", "outputType"],
  mac: ["keySize", "tagSize"],
  password: ["memoryHard", "gpuResistant", "sidechannelResistant"],
  sharing: ["threshold", "verifiable", "proactive", "informationTheoretic"],
  he: ["heType", "bootstrappingSpeed"],
  zkp: ["proofSize", "verificationTime", "trustedSetup", "transparent", "pqSafe"],
  mpc: ["adversaryModel", "numParties", "preprocessingNeeded"],
  ot_pir: ["otType", "computationalModel"],
};

const BASE_REQUIRED: string[] = [
  "id",
  "name",
  "category",
  "family",
  "origin",
  "originDetail",
  "useCases",
  "status",
  "statusLabel",
  "securityBits",
  "pqSecurityBits",
  "bestAttack",
  "reductionQuality",
  "performance",
  "notes",
];

export function validateAlgorithms(algorithms: Algorithm[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const algo of algorithms) {
    if (ids.has(algo.id)) {
      errors.push(`Duplicate algorithm id: ${algo.id}`);
    }
    ids.add(algo.id);

    for (const key of BASE_REQUIRED) {
      const value = (algo as Record<string, unknown>)[key];
      if (value === undefined || value === null || value === "") {
        errors.push(`${algo.id}: missing required field '${String(key)}'`);
      }
    }

    const categoryRequired = REQUIRED_BY_CATEGORY[algo.category];
    for (const key of categoryRequired) {
      if (!(key in algo)) {
        errors.push(`${algo.id}: missing category field '${String(key)}' for ${algo.category}`);
      }
    }

    if (algo.securityBits < 0 || algo.pqSecurityBits < 0) {
      errors.push(`${algo.id}: security bits must be non-negative`);
    }

    if (algo.lastReviewed && Number.isNaN(Date.parse(algo.lastReviewed))) {
      errors.push(`${algo.id}: invalid lastReviewed date format`);
    }
  }

  return errors;
}
