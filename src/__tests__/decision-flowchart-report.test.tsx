import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DecisionFlowchart from "@/components/DecisionFlowchart";
import { ALGORITHMS } from "@/data/algorithms";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";

describe("Decision flowchart report", () => {
  it("exports the canonical URL and the choices that produced the result", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <DecisionFlowchart
        onNavigate={() => {}}
        algorithms={ALGORITHMS}
        provenance={ALGORITHM_PROVENANCE}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /encrypt data with a shared key/i }));
    fireEvent.click(screen.getByRole("button", { name: /fips.*approved implementation/i }));
    fireEvent.click(screen.getByRole("button", { name: /yes.*uniqueness is enforced/i }));
    fireEvent.click(screen.getByRole("button", { name: /copy as markdown/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    const report = writeText.mock.calls[0][0] as string;

    expect(report).toContain("https://crypto-compare.systemslibrarian.dev/");
    expect(report).not.toContain("systemslubrarian");
    expect(report).toContain("**Q**: What do you need to do?");
    expect(report).toContain("**A**: Encrypt data with a shared key");
    expect(report).toContain("**Q**: What is the deployment context?");
    expect(report).toContain("**A**: A FIPS/NIST-approved implementation is required");
    expect(report).toContain("**Q**: Can the system guarantee a unique 96-bit nonce");
    expect(report).toContain("**A**: Yes — uniqueness is enforced and monitored");
    expect(report).not.toContain("**A**: —");
  });
});
