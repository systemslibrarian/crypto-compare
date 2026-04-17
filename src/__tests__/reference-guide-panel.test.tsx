import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReferenceGuidePanel from "@/components/ReferenceGuidePanel";
import type { Algorithm } from "@/types/crypto";

const algorithms: Algorithm[] = [
  {
    id: "mlkem768",
    name: "ML-KEM-768 (Kyber)",
    category: "kem",
    family: "Lattice",
    origin: "Europe",
    originDetail: "NIST PQC",
    useCases: "Post-quantum key exchange.",
    status: "standard",
    statusLabel: "NIST FIPS 203",
    recommendation: "recommended",
    recommendationRationale: "Primary PQ KEM standard.",
    recommendationChangesWhen: "If a stronger standard replaces it.",
    whyNotThis: "Larger public keys than classical ECC.",
    assumptions: "Module-lattice hardness.",
    securityBits: 192,
    pqSecurityBits: 192,
    bestAttack: "Lattice reduction",
    reductionQuality: "Estimated",
    performance: "Fast",
    notes: "Hybrid deployments already exist.",
    estimationMethodology: {
      classicalBasis: "estimated",
      quantumBasis: "estimated",
      classicalNote: "Based on NIST security categories",
      quantumNote: "Based on best known lattice attacks",
    },
    publicKeySize: 1184,
    ciphertextSize: 1088,
    sharedSecretSize: 32,
    sources: [
      {
        label: "NIST FIPS 203",
        url: "https://example.com/fips-203",
        note: "Standard text",
        kind: "standard",
      },
    ],
  },
];

describe("ReferenceGuidePanel", () => {
  it("renders glossary entries, demo links, and source references for visible results", () => {
    render(<ReferenceGuidePanel algorithms={algorithms} />);

    expect(screen.getByText(/terminology guide/i)).toBeInTheDocument();
    expect(screen.getByText("KEM")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /kyber vault/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nist fips 203/i })).toBeInTheDocument();
  });
});