import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ComparisonWorkspace from "@/components/ComparisonWorkspace";
import type { Algorithm, ComparisonRow } from "@/types/crypto";

const algorithms: Algorithm[] = [
  {
    id: "aes256gcm",
    name: "AES-256-GCM",
    category: "symmetric",
    family: "AES",
    origin: "USA",
    originDetail: "NIST",
    useCases: "TLS",
    status: "standard",
    statusLabel: "NIST standard",
    recommendation: "recommended",
    recommendationRationale: "Default choice",
    recommendationChangesWhen: "Constraints change",
    whyNotThis: "None",
    assumptions: "Trusted implementation",
    securityBits: 256,
    pqSecurityBits: 128,
    bestAttack: "Brute force",
    reductionQuality: "Conservative",
    performance: "Fast",
    notes: "Widely deployed",
    estimationMethodology: {
      classicalBasis: "exact",
      quantumBasis: "conservative",
      classicalNote: "Exact",
      quantumNote: "Grover bound",
    },
    keySize: 32,
    nonceSize: 12,
    tagSize: 16,
    blockSize: 16,
  },
  {
    id: "xchacha20poly",
    name: "XChaCha20-Poly1305",
    category: "symmetric",
    family: "ChaCha20",
    origin: "Europe",
    originDetail: "IETF",
    useCases: "Messaging",
    status: "candidate",
    statusLabel: "RFC",
    recommendation: "recommended",
    recommendationRationale: "Strong nonce safety",
    recommendationChangesWhen: "Hardware acceleration matters",
    whyNotThis: "None",
    assumptions: "Trusted implementation",
    securityBits: 256,
    pqSecurityBits: 128,
    bestAttack: "Brute force",
    reductionQuality: "Conservative",
    performance: "Fast",
    notes: "Good software performance",
    estimationMethodology: {
      classicalBasis: "exact",
      quantumBasis: "conservative",
      classicalNote: "Exact",
      quantumNote: "Grover bound",
    },
    keySize: 32,
    nonceSize: 24,
    tagSize: 16,
    blockSize: null,
  },
];

const rows: ComparisonRow[] = [
  {
    label: "Family",
    render: (algorithm) => algorithm.family,
    exportText: (algorithm) => algorithm.family,
  },
];

describe("ComparisonWorkspace", () => {
  it("shows the pre-compare actions and forwards callbacks", () => {
    const onStartCompare = vi.fn();
    const onCopyLink = vi.fn();

    render(
      <ComparisonWorkspace
        algorithms={algorithms}
        comparing={false}
        categoryAccent="#3b82f6"
        rows={rows}
        onStartCompare={onStartCompare}
        onCopyLink={onCopyLink}
        onClearSelection={vi.fn()}
        onExportCsv={vi.fn()}
        onExportMarkdown={vi.fn()}
        onExportJson={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /compare 2 selected algorithms/i }));
    fireEvent.click(screen.getByRole("button", { name: /copy comparison link/i }));

    expect(onStartCompare).toHaveBeenCalledTimes(1);
    expect(onCopyLink).toHaveBeenCalledTimes(1);
  });
});