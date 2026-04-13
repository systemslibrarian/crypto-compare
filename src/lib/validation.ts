import { z } from "zod";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

const ALGORITHM_CATEGORIES = [
  "symmetric", "curve", "kem", "signature", "hash", "kdf", "mac",
  "password", "sharing", "he", "zkp", "mpc", "ot_pir",
  "asymmetric", "steganography", "threshold_sig", "csprng",
] as const;

const ALGORITHM_STATUSES = ["standard", "candidate"] as const;

const RECOMMENDATION_LEVELS = ["recommended", "acceptable", "legacy", "research", "avoid"] as const;

const SOURCE_KINDS = ["standard", "analysis", "deployment", "benchmark"] as const;

const ESTIMATION_BASES = ["exact", "conservative", "estimated", "speculative"] as const;

const AlgorithmSourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  note: z.string().min(1),
  kind: z.enum(SOURCE_KINDS),
});

const SecurityEstimationSchema = z.object({
  classicalBasis: z.enum(ESTIMATION_BASES),
  quantumBasis: z.enum(ESTIMATION_BASES),
  classicalNote: z.string().min(1),
  quantumNote: z.string().min(1),
});

const AlgorithmBaseSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9_]+$/, "ID must be lowercase alphanumeric with underscores"),
  name: z.string().min(1),
  category: z.enum(ALGORITHM_CATEGORIES),
  family: z.string().min(1),
  origin: z.string().min(1),
  originDetail: z.string().min(1),
  useCases: z.string().min(1),
  status: z.enum(ALGORITHM_STATUSES),
  statusLabel: z.string().min(1),
  recommendation: z.enum(RECOMMENDATION_LEVELS),
  recommendationRationale: z.string().min(10, "Recommendation rationale must be at least 10 characters"),
  recommendationChangesWhen: z.string().min(10, "Must describe when recommendation would change"),
  whyNotThis: z.string().min(10, "Must explain tradeoffs or reasons not to choose this algorithm"),
  assumptions: z.string().min(10, "Assumptions must be at least 10 characters"),
  securityBits: z.number().int().min(0).max(512),
  pqSecurityBits: z.number().int().min(0).max(512),
  bestAttack: z.string().min(1),
  reductionQuality: z.string().min(1),
  performance: z.string().min(1),
  notes: z.string().min(1),
  estimationMethodology: SecurityEstimationSchema,
  standardized: z.boolean().optional(),
  nistStandardized: z.boolean().optional(),
  widelyDeployed: z.boolean().optional(),
  countryTag: z.string().optional(),
  sources: z.array(AlgorithmSourceSchema).optional(),
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format").optional(),
  wrongChoiceConsequence: z.array(z.object({
    scenario: z.string().min(1),
    consequence: z.string().min(1),
    severity: z.enum(["critical", "high", "medium", "low"]),
  })).optional(),
  maturity: z.enum(["mature", "established", "emerging", "experimental"]).optional(),
  standardization: z.enum(["nist", "ietf", "iso", "candidate", "none"]).optional(),
  pqRelevance: z.enum(["pq-safe", "pq-ready", "pq-vulnerable", "pq-neutral"]).optional(),
});

const SymmetricSchema = AlgorithmBaseSchema.extend({
  category: z.literal("symmetric"),
  keySize: z.number().int().min(64).max(512),
  nonceSize: z.number().int().min(0).max(512),
  tagSize: z.number().int().min(0).nullable(),
  blockSize: z.number().int().min(0).nullable(),
});

const CurveSchema = AlgorithmBaseSchema.extend({
  category: z.literal("curve"),
  curveForm: z.string().min(1),
  safeCurves: z.string().min(1),
});

const KEMSchema = AlgorithmBaseSchema.extend({
  category: z.literal("kem"),
  publicKeySize: z.number().int().min(0).nullable(),
  ciphertextSize: z.number().int().min(0).nullable(),
  sharedSecretSize: z.number().int().min(0),
});

const SignatureSchema = AlgorithmBaseSchema.extend({
  category: z.literal("signature"),
  publicKeySize: z.number().int().min(0).nullable(),
  signatureSize: z.number().int().min(0).nullable(),
});

const HashSchema = AlgorithmBaseSchema.extend({
  category: z.literal("hash"),
  outputSize: z.number().int().min(0),
  blockSize: z.number().int().min(0),
  stateSize: z.number().int().min(0),
});

const KDFSchema = AlgorithmBaseSchema.extend({
  category: z.literal("kdf"),
  inputType: z.string().min(1),
  outputType: z.string().min(1),
});

const MACSchema = AlgorithmBaseSchema.extend({
  category: z.literal("mac"),
  keySize: z.number().int().min(0),
  tagSize: z.number().int().min(0),
});

const PasswordSchema = AlgorithmBaseSchema.extend({
  category: z.literal("password"),
  memoryHard: z.boolean(),
  gpuResistant: z.boolean(),
  sidechannelResistant: z.boolean(),
});

const SharingSchema = AlgorithmBaseSchema.extend({
  category: z.literal("sharing"),
  threshold: z.boolean(),
  verifiable: z.boolean(),
  proactive: z.boolean(),
  informationTheoretic: z.boolean(),
});

const HESchema = AlgorithmBaseSchema.extend({
  category: z.literal("he"),
  heType: z.string().min(1),
  bootstrappingSpeed: z.string().min(1),
});

const ZKPSchema = AlgorithmBaseSchema.extend({
  category: z.literal("zkp"),
  proofSize: z.string().min(1),
  verificationTime: z.string().min(1),
  trustedSetup: z.boolean(),
  transparent: z.boolean(),
  pqSafe: z.boolean(),
});

const MPCSchema = AlgorithmBaseSchema.extend({
  category: z.literal("mpc"),
  adversaryModel: z.string().min(1),
  numParties: z.string().min(1),
  preprocessingNeeded: z.boolean(),
});

const OTPIRSchema = AlgorithmBaseSchema.extend({
  category: z.literal("ot_pir"),
  otType: z.string().min(1),
  computationalModel: z.string().min(1),
});

const AsymmetricSchema = AlgorithmBaseSchema.extend({
  category: z.literal("asymmetric"),
  keySize: z.number().int().min(0),
  ciphertextOverhead: z.string().min(1),
  pqSafe: z.boolean(),
});

const SteganographySchema = AlgorithmBaseSchema.extend({
  category: z.literal("steganography"),
  carrierType: z.string().min(1),
  payloadCapacity: z.string().min(1),
  steganalysisResistance: z.string().min(1),
  producesArtifacts: z.boolean(),
});

const ThresholdSigSchema = AlgorithmBaseSchema.extend({
  category: z.literal("threshold_sig"),
  thresholdConfig: z.string().min(1),
  rounds: z.number().int().min(1),
  identifiableAbort: z.boolean(),
  pqSafe: z.boolean(),
});

const CSPRNGSchema = AlgorithmBaseSchema.extend({
  category: z.literal("csprng"),
  nistApproved: z.boolean(),
  reseedRequired: z.boolean(),
  forwardSecrecy: z.boolean(),
  catastrophicReseedRecovery: z.boolean(),
});

const AlgorithmSchema = z.discriminatedUnion("category", [
  SymmetricSchema,
  CurveSchema,
  KEMSchema,
  SignatureSchema,
  HashSchema,
  KDFSchema,
  MACSchema,
  PasswordSchema,
  SharingSchema,
  HESchema,
  ZKPSchema,
  MPCSchema,
  OTPIRSchema,
  AsymmetricSchema,
  SteganographySchema,
  ThresholdSigSchema,
  CSPRNGSchema,
]);

function crossFieldRules(algo: Algorithm): string[] {
  const errors: string[] = [];

  // Non-PQ algorithms (securityBits based on classical only) should not claim PQ security > securityBits
  // unless they are genuinely PQ-safe (lattice, code-based, hash-based, IT-secure)
  const PQ_SAFE_FAMILIES = [
    "lattice", "code-based", "hash", "sponge", "keccak", "chacha", "aes",
    "oblivious transfer", "private information retrieval", "additive",
    "shamir", "secret sharing", "argon2", "bcrypt", "scrypt",
  ];
  const familyLower = algo.family.toLowerCase();
  const isPQSafeFamily = PQ_SAFE_FAMILIES.some((f) => familyLower.includes(f));

  if (!isPQSafeFamily && algo.pqSecurityBits > algo.securityBits) {
    errors.push(`${algo.id}: PQ security (${algo.pqSecurityBits}) exceeds classical security (${algo.securityBits}) for non-PQ family "${algo.family}"`);
  }

  // Signature algorithms require a signatureSize (or explicit null for pending specs)
  if (algo.category === "signature") {
    const sig = algo as { signatureSize: number | null };
    if (sig.signatureSize === undefined) {
      errors.push(`${algo.id}: signature algorithm must define signatureSize (use null for pending)`);
    }
  }

  // Security bits sanity: securityBits should be > 0 for all algorithms
  if (algo.securityBits <= 0) {
    errors.push(`${algo.id}: securityBits must be positive`);
  }

  // Legacy/avoid algorithms should mention migration or replacement in rationale
  if (algo.recommendation === "legacy" || algo.recommendation === "avoid") {
    const rationale = algo.recommendationRationale.toLowerCase();
    const hasMigrationGuidance = rationale.includes("migrat") || rationale.includes("replac") || rationale.includes("backward compat") || rationale.includes("retained only");
    if (!hasMigrationGuidance) {
      errors.push(`${algo.id}: legacy/avoid recommendation rationale should mention migration path or replacement`);
    }
  }

  return errors;
}

export function validateAlgorithms(algorithms: Algorithm[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const algo of algorithms) {
    if (ids.has(algo.id)) {
      errors.push(`Duplicate algorithm id: ${algo.id}`);
    }
    ids.add(algo.id);

    const result = AlgorithmSchema.safeParse(algo);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${algo.id}: ${issue.path.join(".")}: ${issue.message}`);
      }
    }

    errors.push(...crossFieldRules(algo));
  }

  // Verify all categories are covered
  const coveredCategories = new Set(algorithms.map((a) => a.category));
  for (const cat of ALGORITHM_CATEGORIES) {
    if (!coveredCategories.has(cat as AlgorithmCategory)) {
      errors.push(`Missing algorithms for category: ${cat}`);
    }
  }

  return errors;
}
