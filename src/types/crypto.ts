import type { ReactNode } from "react";

export type AlgorithmCategory =
  | "symmetric"
  | "curve"
  | "kem"
  | "signature"
  | "hash"
  | "kdf"
  | "mac"
  | "password"
  | "sharing"
  | "he"
  | "zkp"
  | "mpc"
  | "ot_pir"
  | "asymmetric"
  | "steganography"
  | "threshold_sig"
  | "csprng";

export type AlgorithmStatus = "standard" | "candidate";

export type RecommendationLevel =
  | "recommended"
  | "acceptable"
  | "legacy"
  | "research"
  | "avoid";

export type SourceKind = "standard" | "analysis" | "deployment" | "benchmark";

export type AlgorithmSource = {
  label: string;
  url: string;
  note: string;
  kind: SourceKind;
};

export type EstimationBasis = "exact" | "conservative" | "estimated" | "speculative";

export type SecurityEstimation = {
  classicalBasis: EstimationBasis;
  quantumBasis: EstimationBasis;
  classicalNote: string;
  quantumNote: string;
};

export type CategoryProject = {
  name: string;
  tech: string;
  url: string | null;
  public: boolean;
  app?: string;
  note?: string;
};

export type CategoryInfo = {
  title: string;
  oneLiner: string;
  projects: CategoryProject[];
  explanation: string;
  realWorld: string;
  whyItMatters: string;
  projectIdea?: string;
};

export type CategoryInfoMap = Record<AlgorithmCategory, CategoryInfo>;

export type CategoryDefinition = {
  id: AlgorithmCategory;
  label: string;
  icon: string;
};

export type AlgorithmBase = {
  id: string;
  name: string;
  category: AlgorithmCategory;
  family: string;
  origin: string;
  originDetail: string;
  useCases: string;
  status: AlgorithmStatus;
  statusLabel: string;
  recommendation: RecommendationLevel;
  recommendationRationale: string;
  recommendationChangesWhen: string;
  whyNotThis: string;
  assumptions: string;
  securityBits: number;
  pqSecurityBits: number;
  bestAttack: string;
  reductionQuality: string;
  performance: string;
  notes: string;
  estimationMethodology: SecurityEstimation;
  standardized?: boolean;
  nistStandardized?: boolean;
  widelyDeployed?: boolean;
  countryTag?: string;
  sources?: AlgorithmSource[];
  lastReviewed?: string;
  wrongChoiceConsequence?: {
    scenario: string;
    consequence: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }[];
  maturity?: 'mature' | 'established' | 'emerging' | 'experimental';
  standardization?: 'nist' | 'ietf' | 'iso' | 'candidate' | 'none';
  pqRelevance?: 'pq-safe' | 'pq-ready' | 'pq-vulnerable' | 'pq-neutral';
};

export type SymmetricAlgorithm = AlgorithmBase & {
  category: "symmetric";
  keySize: number;
  nonceSize: number;
  tagSize: number | null;
  blockSize: number | null;
};

export type CurveAlgorithm = AlgorithmBase & {
  category: "curve";
  curveForm: string;
  safeCurves: string;
};

export type KEMAlgorithm = AlgorithmBase & {
  category: "kem";
  publicKeySize: number | null;
  ciphertextSize: number | null;
  sharedSecretSize: number;
};

export type SignatureAlgorithm = AlgorithmBase & {
  category: "signature";
  publicKeySize: number | null;
  signatureSize: number | null;
};

export type HashAlgorithm = AlgorithmBase & {
  category: "hash";
  outputSize: number;
  blockSize: number;
  stateSize: number;
};

export type KDFAlgorithm = AlgorithmBase & {
  category: "kdf";
  inputType: string;
  outputType: string;
};

export type MACAlgorithm = AlgorithmBase & {
  category: "mac";
  keySize: number;
  tagSize: number;
};

export type PasswordAlgorithm = AlgorithmBase & {
  category: "password";
  memoryHard: boolean;
  gpuResistant: boolean;
  sidechannelResistant: boolean;
};

export type SharingAlgorithm = AlgorithmBase & {
  category: "sharing";
  threshold: boolean;
  verifiable: boolean;
  proactive: boolean;
  informationTheoretic: boolean;
};

export type HEAlgorithm = AlgorithmBase & {
  category: "he";
  heType: string;
  bootstrappingSpeed: string;
};

export type ZKPAlgorithm = AlgorithmBase & {
  category: "zkp";
  proofSize: string;
  verificationTime: string;
  trustedSetup: boolean;
  transparent: boolean;
  pqSafe: boolean;
};

export type MPCAlgorithm = AlgorithmBase & {
  category: "mpc";
  adversaryModel: string;
  numParties: string;
  preprocessingNeeded: boolean;
};

export type OTPIRAlgorithm = AlgorithmBase & {
  category: "ot_pir";
  otType: string;
  computationalModel: string;
};

export type AsymmetricAlgorithm = AlgorithmBase & {
  category: "asymmetric";
  keySize: number;
  ciphertextOverhead: string;
  pqSafe: boolean;
};

export type SteganographyAlgorithm = AlgorithmBase & {
  category: "steganography";
  carrierType: string;
  payloadCapacity: string;
  steganalysisResistance: string;
  producesArtifacts: boolean;
};

export type ThresholdSigAlgorithm = AlgorithmBase & {
  category: "threshold_sig";
  thresholdConfig: string;
  rounds: number;
  identifiableAbort: boolean;
  pqSafe: boolean;
};

export type CSPRNGAlgorithm = AlgorithmBase & {
  category: "csprng";
  nistApproved: boolean;
  reseedRequired: boolean;
  forwardSecrecy: boolean;
  catastrophicReseedRecovery: boolean;
};

export type Algorithm =
  | SymmetricAlgorithm
  | CurveAlgorithm
  | KEMAlgorithm
  | SignatureAlgorithm
  | HashAlgorithm
  | KDFAlgorithm
  | MACAlgorithm
  | PasswordAlgorithm
  | SharingAlgorithm
  | HEAlgorithm
  | ZKPAlgorithm
  | MPCAlgorithm
  | OTPIRAlgorithm
  | AsymmetricAlgorithm
  | SteganographyAlgorithm
  | ThresholdSigAlgorithm
  | CSPRNGAlgorithm;

export type ComparisonRow = {
  label: string;
  render: (algo: Algorithm) => ReactNode;
  exportText: (algo: Algorithm) => string;
};
