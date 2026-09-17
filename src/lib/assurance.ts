import type {
  Algorithm,
  AsymmetricAlgorithm,
  CSPRNGAlgorithm,
  CurveAlgorithm,
  HashAlgorithm,
  HEAlgorithm,
  KDFAlgorithm,
  KEMAlgorithm,
  MACAlgorithm,
  MPCAlgorithm,
  OTPIRAlgorithm,
  PasswordAlgorithm,
  SharingAlgorithm,
  SignatureAlgorithm,
  SteganographyAlgorithm,
  SymmetricAlgorithm,
  ThresholdSigAlgorithm,
  ZKPAlgorithm,
} from "@/types/crypto";

export type AssuranceMetric = {
  label: string;
  value: string;
};

export type AssuranceProfile = {
  kind: string;
  headline: string;
  metrics: AssuranceMetric[];
  caveat: string;
};

const NIST_PQ_CATEGORIES: Partial<Record<string, number>> = {
  mlkem512: 1,
  mlkem768: 3,
  mlkem1024: 5,
  mldsa44: 2,
  mldsa65: 3,
  falcon512: 1,
  frodokem: 3,
};

function pqProfile(algorithm: KEMAlgorithm | SignatureAlgorithm): AssuranceProfile {
  const category = NIST_PQ_CATEGORIES[algorithm.id];
  return {
    kind: "post-quantum-parameter-set",
    headline: category
      ? `Post-quantum parameter set · NIST category ${category}`
      : "Post-quantum assurance is parameter- and estimator-specific",
    metrics: [
      {
        label: "Classical model",
        value: `${algorithm.estimationMethodology.classicalBasis} · ${algorithm.estimationMethodology.classicalNote}`,
      },
      {
        label: "Quantum model",
        value: `${algorithm.estimationMethodology.quantumBasis} · ${algorithm.estimationMethodology.quantumNote}`,
      },
    ],
    caveat: "NIST categories and estimator outputs are comparison targets, not exact security-bit measurements. Record the parameter set and estimator version with every decision.",
  };
}

export function getAssuranceProfile(algorithm: Algorithm): AssuranceProfile {
  if (algorithm.category === "symmetric") {
    const symmetric = algorithm as SymmetricAlgorithm;
    const authenticated = symmetric.tagSize !== null;
    return {
      kind: authenticated ? "aead" : "cipher",
      headline: authenticated
        ? "AEAD profile · confidentiality and forgery bounds are separate"
        : "Cipher profile · authentication must be supplied separately",
      metrics: [
        { label: "Key-search estimate", value: `${algorithm.securityBits}-bit classical · ${algorithm.pqSecurityBits}-bit Grover model` },
        { label: "Authentication", value: authenticated ? `${symmetric.tagSize}-bit tag; usage limits affect forgery probability` : "Not built in" },
        { label: "Nonce / IV", value: `${symmetric.nonceSize} bits; construction-specific uniqueness rules apply` },
      ],
      caveat: "Key length is not the whole AEAD guarantee. Nonce discipline, tag length, per-invocation limits, per-key volume, and implementation behavior must be evaluated independently.",
    };
  }

  if (algorithm.category === "hash") {
    const hash = algorithm as HashAlgorithm;
    const idealCollision = Math.floor(hash.outputSize / 2);
    const quantumPreimage = Math.floor(hash.outputSize / 2);
    const quantumCollision = Math.floor(hash.outputSize / 3);
    return {
      kind: "hash",
      headline: "Hash profile · preimage and collision strength are different properties",
      metrics: [
        { label: "Preimage", value: `${hash.outputSize}-bit ideal classical bound · ${quantumPreimage}-bit Grover model` },
        { label: "Collision", value: `${idealCollision}-bit ideal birthday bound · ≈${quantumCollision}-bit BHT model` },
        { label: "Output", value: `${hash.outputSize} bits` },
      ],
      caveat: "These are ideal generic bounds. Algorithm-specific cryptanalysis, truncation, keyed use, domain separation, and protocol context can produce different effective guarantees.",
    };
  }

  if (algorithm.category === "password") {
    const password = algorithm as PasswordAlgorithm;
    return {
      kind: "password-hashing",
      headline: "Password assurance depends on password entropy and configured attacker cost",
      metrics: [
        { label: "Memory hard", value: password.memoryHard ? "Yes" : "No" },
        { label: "GPU resistance", value: password.gpuResistant ? "Designed to raise attacker cost" : "Limited" },
        { label: "Side-channel posture", value: password.sidechannelResistant ? "Designed for data-independent access" : "Implementation / variant dependent" },
      ],
      caveat: "An output length is not password strength. Record memory, time, parallelism, salt requirements, measured latency, and the expected password distribution.",
    };
  }

  if (algorithm.category === "kdf") {
    const kdf = algorithm as KDFAlgorithm;
    return {
      kind: "key-derivation",
      headline: "KDF assurance follows input entropy, parameters, and domain separation",
      metrics: [
        { label: "Input", value: kdf.inputType },
        { label: "Output", value: kdf.outputType },
        { label: "Model", value: algorithm.estimationMethodology.classicalNote },
      ],
      caveat: "Derived-key length does not create entropy. Password KDFs require calibrated cost parameters; extract-and-expand KDFs require suitable input keying material.",
    };
  }

  if (algorithm.category === "mac") {
    const mac = algorithm as MACAlgorithm;
    return {
      kind: "message-authentication",
      headline: "MAC profile · forgery resistance and key-search resistance are separate",
      metrics: [
        { label: "Tag", value: `${mac.tagSize} bits; truncation and query volume affect forgery bounds` },
        { label: "Key", value: `${mac.keySize} bits` },
        { label: "Quantum key search", value: `${algorithm.pqSecurityBits}-bit model` },
      ],
      caveat: "Effective authentication strength depends on tag length, verification attempts, key separation, nonce or one-time-key rules, and constant-time verification.",
    };
  }

  if (algorithm.category === "kem" || algorithm.category === "signature") {
    return pqProfile(algorithm as KEMAlgorithm | SignatureAlgorithm);
  }

  if (algorithm.category === "curve") {
    const curve = algorithm as CurveAlgorithm;
    return {
      kind: "classical-public-key",
      headline: "Classical curve profile · vulnerable to a large cryptographically relevant quantum computer",
      metrics: [
        { label: "Classical estimate", value: `${algorithm.securityBits}-bit model · ${algorithm.estimationMethodology.classicalBasis}` },
        { label: "Quantum status", value: algorithm.pqSecurityBits === 0 ? "Broken by Shor's algorithm" : algorithm.estimationMethodology.quantumNote },
        { label: "Curve form", value: curve.curveForm },
      ],
      caveat: "The estimate depends on the exact group, validation rules, protocol, implementation, and attack model; curve size alone is not an operational assurance claim.",
    };
  }

  if (algorithm.category === "asymmetric") {
    const asymmetric = algorithm as AsymmetricAlgorithm;
    return {
      kind: "classical-public-key",
      headline: asymmetric.pqSafe
        ? "Public-key profile · parameter-specific post-quantum claim"
        : "Classical public-key profile · Shor-vulnerable",
      metrics: [
        { label: "Classical estimate", value: `${algorithm.securityBits}-bit model · ${algorithm.estimationMethodology.classicalBasis}` },
        { label: "Quantum status", value: asymmetric.pqSafe ? algorithm.estimationMethodology.quantumNote : "Broken by Shor's algorithm" },
        { label: "Key / modulus", value: `${asymmetric.keySize} bits` },
      ],
      caveat: "Padding, key validation, protocol composition, forward secrecy, and oracle resistance are part of the security claim; modulus or curve size alone is insufficient.",
    };
  }

  if (algorithm.category === "sharing") {
    const sharing = algorithm as SharingAlgorithm;
    return {
      kind: "secret-sharing",
      headline: sharing.informationTheoretic
        ? "Information-theoretic privacy under the stated threshold model"
        : "Computational or leakage-dependent sharing model",
      metrics: [
        { label: "Threshold", value: sharing.threshold ? "Configurable t-of-n" : "n-of-n" },
        { label: "Verifiability", value: sharing.verifiable ? "Included" : "Not included" },
        { label: "Proactive refresh", value: sharing.proactive ? "Supported" : "Not inherent" },
      ],
      caveat: "Security depends on field choice, authenticated transport, share custody, participant corruption assumptions, and whether verifiability or proactive refresh is required.",
    };
  }

  if (algorithm.category === "he") {
    const he = algorithm as HEAlgorithm;
    return {
      kind: "homomorphic-encryption",
      headline: "HE assurance is parameter-set and workload dependent",
      metrics: [
        { label: "Scheme type", value: he.heType },
        { label: "Bootstrapping", value: he.bootstrappingSpeed },
        { label: "Security model", value: algorithm.estimationMethodology.quantumNote },
      ],
      caveat: "A scheme name has no standalone bit strength. Report ring dimension, modulus chain, error distribution, estimator version, circuit depth, and failure/decryption conditions.",
    };
  }

  if (algorithm.category === "zkp") {
    const zkp = algorithm as ZKPAlgorithm;
    return {
      kind: "zero-knowledge-proof",
      headline: "Proof-system assurance depends on soundness, setup, and concrete instantiation",
      metrics: [
        { label: "Setup", value: zkp.trustedSetup ? "Trusted setup required" : "Transparent" },
        { label: "Quantum posture", value: zkp.pqSafe ? "Designed for post-quantum assumptions" : "Classical-only assumptions" },
        { label: "Proof / verification", value: `${zkp.proofSize} · ${zkp.verificationTime}` },
      ],
      caveat: "Soundness error, Fiat–Shamir model, ceremony integrity, field/curve selection, implementation, and circuit correctness must be recorded separately.",
    };
  }

  if (algorithm.category === "mpc") {
    const mpc = algorithm as MPCAlgorithm;
    return {
      kind: "multi-party-computation",
      headline: "MPC assurance is defined by the corruption and adversary model",
      metrics: [
        { label: "Adversary", value: mpc.adversaryModel },
        { label: "Parties", value: mpc.numParties },
        { label: "Preprocessing", value: mpc.preprocessingNeeded ? "Required" : "Not required" },
      ],
      caveat: "State the corruption threshold, active versus passive security, abort/fairness guarantees, network assumptions, and the concrete OT or public-key instantiation.",
    };
  }

  if (algorithm.category === "ot_pir") {
    const otPir = algorithm as OTPIRAlgorithm;
    return {
      kind: "ot-pir",
      headline: "Privacy assurance follows the computational and non-collusion model",
      metrics: [
        { label: "Type", value: otPir.otType },
        { label: "Model", value: otPir.computationalModel },
        { label: "Underlying assumptions", value: algorithm.estimationMethodology.classicalNote },
      ],
      caveat: "The primitive name is not a bit-strength claim. Record server-collusion assumptions, malicious security, leakage, query volume, and the concrete base-OT or encryption scheme.",
    };
  }

  if (algorithm.category === "steganography") {
    const stego = algorithm as SteganographyAlgorithm;
    return {
      kind: "steganography",
      headline: "Steganographic assurance is detectability risk, not cryptographic bit strength",
      metrics: [
        { label: "Carrier", value: stego.carrierType },
        { label: "Capacity", value: stego.payloadCapacity },
        { label: "Steganalysis", value: stego.steganalysisResistance },
      ],
      caveat: "Evaluate against a named detector, corpus, transformation channel, payload rate, and threat model. Encryption of the payload does not make its presence undetectable.",
    };
  }

  if (algorithm.category === "threshold_sig") {
    const threshold = algorithm as ThresholdSigAlgorithm;
    return {
      kind: "threshold-signature",
      headline: "Threshold assurance depends on the base signature and participant model",
      metrics: [
        { label: "Threshold", value: threshold.thresholdConfig },
        { label: "Rounds", value: `${threshold.rounds}` },
        { label: "Quantum posture", value: threshold.pqSafe ? "Post-quantum base scheme" : "Classical base scheme" },
      ],
      caveat: "Record dealer/DKG assumptions, malicious security, identifiable abort, key refresh, nonce handling, transport authentication, and the exact base-signature parameters.",
    };
  }

  const csprng = algorithm as CSPRNGAlgorithm;
  return {
    kind: "csprng",
    headline: "CSPRNG assurance depends on entropy, state handling, and reseeding",
    metrics: [
      { label: "Approval", value: csprng.nistApproved ? "NIST-approved construction" : "Not NIST-approved" },
      { label: "Reseeding", value: csprng.reseedRequired ? "Explicit reseeding required" : "Self-reseeding design" },
      { label: "State compromise", value: csprng.catastrophicReseedRecovery ? "Recovery mechanism included" : "Recovery depends on fresh reseed" },
    ],
    caveat: "Internal state size is not output assurance. Entropy-source quality, fork behavior, prediction/backtracking resistance, request limits, and reseed policy determine the operational guarantee.",
  };
}

export function formatAssuranceForExport(algorithm: Algorithm): string {
  const profile = getAssuranceProfile(algorithm);
  return [
    profile.headline,
    ...profile.metrics.map((metric) => `${metric.label}: ${metric.value}`),
    `Caveat: ${profile.caveat}`,
  ].join(" | ");
}
