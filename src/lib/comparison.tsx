import { Badge, SecurityMeter, formatBytes } from "@/components/ui";
import type {
  Algorithm,
  ComparisonRow,
  HEAlgorithm,
  HashAlgorithm,
  KDFAlgorithm,
  KEMAlgorithm,
  MACAlgorithm,
  MPCAlgorithm,
  OTPIRAlgorithm,
  PasswordAlgorithm,
  SharingAlgorithm,
  SignatureAlgorithm,
  SymmetricAlgorithm,
  ZKPAlgorithm,
  AlgorithmCategory,
} from "@/types/crypto";

function asSymmetric(algo: Algorithm): SymmetricAlgorithm {
  return algo as SymmetricAlgorithm;
}

function asKEM(algo: Algorithm): KEMAlgorithm {
  return algo as KEMAlgorithm;
}

function asSignature(algo: Algorithm): SignatureAlgorithm {
  return algo as SignatureAlgorithm;
}

function asHash(algo: Algorithm): HashAlgorithm {
  return algo as HashAlgorithm;
}

function asKDF(algo: Algorithm): KDFAlgorithm {
  return algo as KDFAlgorithm;
}

function asMAC(algo: Algorithm): MACAlgorithm {
  return algo as MACAlgorithm;
}

function asPassword(algo: Algorithm): PasswordAlgorithm {
  return algo as PasswordAlgorithm;
}

function asSharing(algo: Algorithm): SharingAlgorithm {
  return algo as SharingAlgorithm;
}

function asHE(algo: Algorithm): HEAlgorithm {
  return algo as HEAlgorithm;
}

function asZKP(algo: Algorithm): ZKPAlgorithm {
  return algo as ZKPAlgorithm;
}

function asMPC(algo: Algorithm): MPCAlgorithm {
  return algo as MPCAlgorithm;
}

function asOTPIR(algo: Algorithm): OTPIRAlgorithm {
  return algo as OTPIRAlgorithm;
}

export function buildRows(category: AlgorithmCategory, advanced: boolean): ComparisonRow[] {
  const rows: ComparisonRow[] = [];
  rows.push({ label: "Origin", render: (a) => a.origin });
  rows.push({ label: "Status", render: (a) => <Badge status={a.status} label={a.statusLabel} /> });
  rows.push({ label: "Classical", render: (a) => <SecurityMeter bits={a.securityBits} /> });
  rows.push({ label: "PQ", render: (a) => <SecurityMeter bits={a.pqSecurityBits} /> });

  if (category === "symmetric") {
    rows.push({ label: "Key", render: (a) => `${asSymmetric(a).keySize} bits` });
    rows.push({ label: "Nonce", render: (a) => `${asSymmetric(a).nonceSize} bits` });
    rows.push({ label: "Tag", render: (a) => (asSymmetric(a).tagSize ? `${asSymmetric(a).tagSize} bits` : "-") });
    rows.push({ label: "Block", render: (a) => (asSymmetric(a).blockSize ? `${asSymmetric(a).blockSize} bits` : "Stream") });
  } else if (category === "kem") {
    rows.push({ label: "Public Key", render: (a) => formatBytes(asKEM(a).publicKeySize) });
    rows.push({ label: "Ciphertext", render: (a) => formatBytes(asKEM(a).ciphertextSize) });
    rows.push({ label: "Secret", render: (a) => `${asKEM(a).sharedSecretSize} bits` });
  } else if (category === "signature") {
    rows.push({ label: "Public Key", render: (a) => formatBytes(asSignature(a).publicKeySize) });
    rows.push({ label: "Signature", render: (a) => formatBytes(asSignature(a).signatureSize) });
  } else if (category === "hash") {
    rows.push({ label: "Output", render: (a) => `${asHash(a).outputSize} bits` });
    rows.push({ label: "Block", render: (a) => `${asHash(a).blockSize} bits` });
  } else if (category === "kdf") {
    rows.push({ label: "Input Type", render: (a) => asKDF(a).inputType });
    rows.push({ label: "Output", render: (a) => asKDF(a).outputType });
  } else if (category === "mac") {
    rows.push({ label: "Key", render: (a) => `${asMAC(a).keySize} bits` });
    rows.push({ label: "Tag", render: (a) => `${asMAC(a).tagSize} bits` });
  } else if (category === "password") {
    rows.push({ label: "Memory-Hard", render: (a) => (asPassword(a).memoryHard ? "Yes" : "No") });
    rows.push({ label: "GPU-Resistant", render: (a) => (asPassword(a).gpuResistant ? "Yes" : "No") });
    rows.push({ label: "Side-Ch. Safe", render: (a) => (asPassword(a).sidechannelResistant ? "Yes" : "Partial") });
  } else if (category === "sharing") {
    rows.push({ label: "Threshold", render: (a) => (asSharing(a).threshold ? "Yes" : "n-of-n only") });
    rows.push({ label: "Verifiable", render: (a) => (asSharing(a).verifiable ? "Yes" : "No") });
    rows.push({ label: "IT-Secure", render: (a) => (asSharing(a).informationTheoretic ? "Yes" : "Computational") });
  } else if (category === "he") {
    rows.push({ label: "HE Type", render: (a) => asHE(a).heType });
    rows.push({ label: "Bootstrap", render: (a) => asHE(a).bootstrappingSpeed });
  } else if (category === "zkp") {
    rows.push({ label: "Proof Size", render: (a) => asZKP(a).proofSize });
    rows.push({ label: "Verify Time", render: (a) => asZKP(a).verificationTime });
    rows.push({ label: "Trusted Setup", render: (a) => (asZKP(a).trustedSetup ? "Required" : "None") });
    rows.push({ label: "PQ-Safe", render: (a) => (asZKP(a).pqSafe ? "Yes" : "No") });
  } else if (category === "mpc") {
    rows.push({ label: "Adversary", render: (a) => asMPC(a).adversaryModel });
    rows.push({ label: "Parties", render: (a) => asMPC(a).numParties });
    rows.push({ label: "Preprocessing", render: (a) => (asMPC(a).preprocessingNeeded ? "Required" : "None") });
  } else if (category === "ot_pir") {
    rows.push({ label: "Type", render: (a) => asOTPIR(a).otType });
    rows.push({ label: "Model", render: (a) => asOTPIR(a).computationalModel });
  }

  rows.push({ label: "Use Cases", render: (a) => a.useCases });

  if (advanced) {
    rows.push({ label: "Best Attack", render: (a) => a.bestAttack });
    rows.push({ label: "Reduction", render: (a) => a.reductionQuality });
    rows.push({ label: "Performance", render: (a) => a.performance });
    rows.push({ label: "Notes", render: (a) => a.notes });
  }

  return rows;
}