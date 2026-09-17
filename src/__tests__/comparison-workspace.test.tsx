import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  afterEach(cleanup);

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

  it("manages focus, traps Tab, and closes on Escape", async () => {
    const onClose = vi.fn();
    render(
      <ComparisonWorkspace
        algorithms={algorithms}
        comparing
        categoryAccent="#3b82f6"
        rows={rows}
        onStartCompare={vi.fn()}
        onClose={onClose}
        onCopyLink={vi.fn()}
        onClearSelection={vi.fn()}
        onExportCsv={vi.fn()}
        onExportMarkdown={vi.fn()}
        onExportJson={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog", { name: /comparison/i });
    const close = screen.getByRole("button", { name: /close comparison/i });
    await waitFor(() => expect(close).toHaveFocus());

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(screen.getByRole("button", { name: "Copy link" })).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("makes the application background inert while open", () => {
    const background = document.createElement("div");
    background.className = "cryptoCompareRoot";
    document.body.appendChild(background);

    const { unmount } = render(
      <ComparisonWorkspace
        algorithms={algorithms}
        comparing
        categoryAccent="#3b82f6"
        rows={rows}
        onStartCompare={vi.fn()}
        onClose={vi.fn()}
        onCopyLink={vi.fn()}
        onClearSelection={vi.fn()}
        onExportCsv={vi.fn()}
        onExportMarkdown={vi.fn()}
        onExportJson={vi.fn()}
      />,
    );

    expect(background).toHaveAttribute("inert");
    expect(background).toHaveAttribute("aria-hidden", "true");
    unmount();
    expect(background).not.toHaveAttribute("inert");
    background.remove();
  });
});
