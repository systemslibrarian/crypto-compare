import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoCard from "@/components/AlgoCard";
import type { Algorithm } from "@/types/crypto";

const algo: Algorithm = {
  id: "xchacha20poly",
  name: "XChaCha20-Poly1305",
  category: "symmetric",
  family: "ChaCha",
  origin: "United States",
  originDetail: "Extended-nonce variant",
  useCases: "File encryption and high-volume nonce-safe AEAD.",
  status: "standard",
  statusLabel: "RFC draft / deployed",
  recommendation: "recommended",
  recommendationRationale: "Safe random nonces and mature library support.",
  recommendationChangesWhen: "If a stronger misuse-resistant AEAD becomes standard.",
  whyNotThis: "Not finalized as an RFC.",
  assumptions: "ChaCha20 hardness and correct nonce handling.",
  securityBits: 256,
  pqSecurityBits: 128,
  bestAttack: "Brute force",
  reductionQuality: "Strong",
  performance: "Fast",
  notes: "Good default for at-rest encryption.",
  estimationMethodology: {
    classicalBasis: "exact",
    quantumBasis: "exact",
    classicalNote: "256-bit key",
    quantumNote: "Grover halves effective key length",
  },
  keySize: 256,
  nonceSize: 192,
  tagSize: 128,
  blockSize: null,
  pqRelevance: "pq-safe",
  sources: [
    {
      label: "Example source",
      url: "https://example.com/source",
      note: "Reference note",
      kind: "analysis",
    },
  ],
};

describe("AlgoCard", () => {
  it("shows a labeled details control and reveals demo links", () => {
    render(
      <AlgoCard
        algo={algo}
        selected={false}
        onToggle={vi.fn()}
      />,
    );

    const detailsButton = screen.getByRole("button", { name: /show xchacha20-poly1305 details/i });
    expect(detailsButton).toHaveTextContent(/details/i);

    fireEvent.click(detailsButton);

    expect(screen.getByText("Demos")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chacha20 stream/i })).toBeInTheDocument();
  });
});