import { Badge, RecommendationBadge, SecurityMeter, formatBytes, recommendationText } from "@/components/ui";
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

function formatReviewDate(iso: string | undefined): string {
  if (!iso) return "Not reviewed";
  const [y, m] = iso.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export function buildRows(category: AlgorithmCategory, advanced: boolean): ComparisonRow[] {
  const rows: ComparisonRow[] = [];
  rows.push({ label: "Origin", render: (a) => a.origin, exportText: (a) => a.origin });
  rows.push({ label: "Status", render: (a) => <Badge status={a.status} label={a.statusLabel} />, exportText: (a) => a.statusLabel });
  rows.push({ label: "Recommendation", render: (a) => <RecommendationBadge level={a.recommendation} />, exportText: (a) => recommendationText(a.recommendation) });
  rows.push({ label: "Justification", render: (a) => a.recommendationRationale ?? "—", exportText: (a) => a.recommendationRationale ?? "" });
  rows.push({ label: "Changes When", render: (a) => a.recommendationChangesWhen, exportText: (a) => a.recommendationChangesWhen });
  rows.push({ label: "Why Not This?", render: (a) => a.whyNotThis, exportText: (a) => a.whyNotThis });
  rows.push({ label: "Classical", render: (a) => <SecurityMeter bits={a.securityBits} />, exportText: (a) => a.securityBits != null ? `${a.securityBits} bits` : "TBD" });
  rows.push({ label: "PQ", render: (a) => <SecurityMeter bits={a.pqSecurityBits} />, exportText: (a) => a.pqSecurityBits != null ? `${a.pqSecurityBits} bits` : "TBD" });

  if (category === "symmetric") {
    rows.push({ label: "Key", render: (a) => `${asSymmetric(a).keySize} bits`, exportText: (a) => `${asSymmetric(a).keySize} bits` });
    rows.push({ label: "Nonce", render: (a) => `${asSymmetric(a).nonceSize} bits`, exportText: (a) => `${asSymmetric(a).nonceSize} bits` });
    rows.push({ label: "Tag", render: (a) => (asSymmetric(a).tagSize ? `${asSymmetric(a).tagSize} bits` : "-"), exportText: (a) => (asSymmetric(a).tagSize ? `${asSymmetric(a).tagSize} bits` : "-") });
    rows.push({ label: "Block", render: (a) => (asSymmetric(a).blockSize ? `${asSymmetric(a).blockSize} bits` : "Stream"), exportText: (a) => (asSymmetric(a).blockSize ? `${asSymmetric(a).blockSize} bits` : "Stream") });
  } else if (category === "kem") {
    rows.push({ label: "Public Key", render: (a) => formatBytes(asKEM(a).publicKeySize), exportText: (a) => formatBytes(asKEM(a).publicKeySize) });
    rows.push({ label: "Ciphertext", render: (a) => formatBytes(asKEM(a).ciphertextSize), exportText: (a) => formatBytes(asKEM(a).ciphertextSize) });
    rows.push({ label: "Secret", render: (a) => `${asKEM(a).sharedSecretSize} bits`, exportText: (a) => `${asKEM(a).sharedSecretSize} bits` });
  } else if (category === "signature") {
    rows.push({ label: "Public Key", render: (a) => formatBytes(asSignature(a).publicKeySize), exportText: (a) => formatBytes(asSignature(a).publicKeySize) });
    rows.push({ label: "Signature", render: (a) => formatBytes(asSignature(a).signatureSize), exportText: (a) => formatBytes(asSignature(a).signatureSize) });
  } else if (category === "hash") {
    rows.push({ label: "Output", render: (a) => `${asHash(a).outputSize} bits`, exportText: (a) => `${asHash(a).outputSize} bits` });
    rows.push({ label: "Block", render: (a) => `${asHash(a).blockSize} bits`, exportText: (a) => `${asHash(a).blockSize} bits` });
  } else if (category === "kdf") {
    rows.push({ label: "Input Type", render: (a) => asKDF(a).inputType, exportText: (a) => asKDF(a).inputType });
    rows.push({ label: "Output", render: (a) => asKDF(a).outputType, exportText: (a) => asKDF(a).outputType });
  } else if (category === "mac") {
    rows.push({ label: "Key", render: (a) => `${asMAC(a).keySize} bits`, exportText: (a) => `${asMAC(a).keySize} bits` });
    rows.push({ label: "Tag", render: (a) => `${asMAC(a).tagSize} bits`, exportText: (a) => `${asMAC(a).tagSize} bits` });
  } else if (category === "password") {
    rows.push({ label: "Memory-Hard", render: (a) => (asPassword(a).memoryHard ? "Yes" : "No"), exportText: (a) => (asPassword(a).memoryHard ? "Yes" : "No") });
    rows.push({ label: "GPU-Resistant", render: (a) => (asPassword(a).gpuResistant ? "Yes" : "No"), exportText: (a) => (asPassword(a).gpuResistant ? "Yes" : "No") });
    rows.push({ label: "Side-Ch. Safe", render: (a) => (asPassword(a).sidechannelResistant ? "Yes" : "Partial"), exportText: (a) => (asPassword(a).sidechannelResistant ? "Yes" : "Partial") });
  } else if (category === "sharing") {
    rows.push({ label: "Threshold", render: (a) => (asSharing(a).threshold ? "Yes" : "n-of-n only"), exportText: (a) => (asSharing(a).threshold ? "Yes" : "n-of-n only") });
    rows.push({ label: "Verifiable", render: (a) => (asSharing(a).verifiable ? "Yes" : "No"), exportText: (a) => (asSharing(a).verifiable ? "Yes" : "No") });
    rows.push({ label: "IT-Secure", render: (a) => (asSharing(a).informationTheoretic ? "Yes" : "Computational"), exportText: (a) => (asSharing(a).informationTheoretic ? "Yes" : "Computational") });
  } else if (category === "he") {
    rows.push({ label: "HE Type", render: (a) => asHE(a).heType, exportText: (a) => asHE(a).heType });
    rows.push({ label: "Bootstrap", render: (a) => asHE(a).bootstrappingSpeed, exportText: (a) => asHE(a).bootstrappingSpeed });
  } else if (category === "zkp") {
    rows.push({ label: "Proof Size", render: (a) => asZKP(a).proofSize, exportText: (a) => asZKP(a).proofSize });
    rows.push({ label: "Verify Time", render: (a) => asZKP(a).verificationTime, exportText: (a) => asZKP(a).verificationTime });
    rows.push({ label: "Trusted Setup", render: (a) => (asZKP(a).trustedSetup ? "Required" : "None"), exportText: (a) => (asZKP(a).trustedSetup ? "Required" : "None") });
    rows.push({ label: "PQ-Safe", render: (a) => (asZKP(a).pqSafe ? "Yes" : "No"), exportText: (a) => (asZKP(a).pqSafe ? "Yes" : "No") });
  } else if (category === "mpc") {
    rows.push({ label: "Adversary", render: (a) => asMPC(a).adversaryModel, exportText: (a) => asMPC(a).adversaryModel });
    rows.push({ label: "Parties", render: (a) => asMPC(a).numParties, exportText: (a) => asMPC(a).numParties });
    rows.push({ label: "Preprocessing", render: (a) => (asMPC(a).preprocessingNeeded ? "Required" : "None"), exportText: (a) => (asMPC(a).preprocessingNeeded ? "Required" : "None") });
  } else if (category === "ot_pir") {
    rows.push({ label: "Type", render: (a) => asOTPIR(a).otType, exportText: (a) => asOTPIR(a).otType });
    rows.push({ label: "Model", render: (a) => asOTPIR(a).computationalModel, exportText: (a) => asOTPIR(a).computationalModel });
  }

  rows.push({ label: "Use Cases", render: (a) => a.useCases, exportText: (a) => a.useCases });
  rows.push({
    label: "Sources",
    render: (a) => {
      const count = a.sources?.length ?? 0;
      const reviewed = a.lastReviewed ?? "—";
      return <span style={{ color: "#93a4bb", fontSize: "13px" }}>{count} source{count !== 1 ? "s" : ""} · {reviewed}</span>;
    },
    exportText: (a) => {
      if (!a.sources || a.sources.length === 0) return "No sources listed";
      return a.sources.map((s) => s.label).join("; ");
    },
  });
  rows.push({
    label: "Last Reviewed",
    render: (a) => <span style={{ color: "#93a4bb", fontSize: "13px" }}>{a.lastReviewed ?? "Not reviewed"}</span>,
    exportText: (a) => formatReviewDate(a.lastReviewed),
  });
  rows.push({
    label: "Assumptions",
    render: (a) => a.assumptions,
    exportText: (a) => a.assumptions,
  });
  rows.push({
    label: "Classical Basis",
    render: (a) => `${a.estimationMethodology.classicalBasis}: ${a.estimationMethodology.classicalNote}`,
    exportText: (a) => `${a.estimationMethodology.classicalBasis}: ${a.estimationMethodology.classicalNote}`,
  });
  rows.push({
    label: "Quantum Basis",
    render: (a) => `${a.estimationMethodology.quantumBasis}: ${a.estimationMethodology.quantumNote}`,
    exportText: (a) => `${a.estimationMethodology.quantumBasis}: ${a.estimationMethodology.quantumNote}`,
  });

  if (advanced) {
    rows.push({ label: "Best Attack", render: (a) => a.bestAttack, exportText: (a) => a.bestAttack });
    rows.push({ label: "Reduction", render: (a) => a.reductionQuality, exportText: (a) => a.reductionQuality });
    rows.push({ label: "Performance", render: (a) => a.performance, exportText: (a) => a.performance });
    rows.push({ label: "Notes", render: (a) => a.notes, exportText: (a) => a.notes });
  }

  return rows;
}

export function exportToCSV(rows: ComparisonRow[], algos: Algorithm[]): string {
  const algoNames = algos.map((a) => a.name);
  const csvRows = [["Property", ...algoNames].join(",")];
  for (const row of rows) {
    csvRows.push([row.label, ...algos.map((a) => `"${row.exportText(a).replace(/"/g, '""')}"`)] .join(","));
  }
  return csvRows.join("\n");
}

export function exportToMarkdown(rows: ComparisonRow[], algos: Algorithm[]): string {
  const algoNames = algos.map((a) => a.name);
  const mdRows = [
    `| Property | ${algoNames.join(" | ")} |`,
    `| --- | ${algoNames.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.label} | ${algos.map((a) => r.exportText(a)).join(" | ")} |`),
  ];
  return mdRows.join("\n");
}