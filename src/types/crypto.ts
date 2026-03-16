import type { ReactNode } from "react";

export type AlgorithmCategory =
  | "symmetric"
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
  | "ot_pir";

export type AlgorithmStatus = "standard" | "candidate";

export type SourceKind = "standard" | "analysis" | "deployment" | "benchmark";

export type AlgorithmSource = {
  label: string;
  url: string;
  note: string;
  kind: SourceKind;
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
  securityBits: number;
  pqSecurityBits: number;
  bestAttack: string;
  reductionQuality: string;
  performance: string;
  notes: string;
  standardized?: boolean;
  nistStandardized?: boolean;
  widelyDeployed?: boolean;
  countryTag?: string;
  sources?: AlgorithmSource[];
  lastReviewed?: string;
};

export type SymmetricAlgorithm = AlgorithmBase & {
  category: "symmetric";
  keySize: number;
  nonceSize: number;
  tagSize: number | null;
  blockSize: number | null;
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

export type Algorithm =
  | SymmetricAlgorithm
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
  | OTPIRAlgorithm;

export type ComparisonRow = {
  label: string;
  render: (algo: Algorithm) => ReactNode;
};
