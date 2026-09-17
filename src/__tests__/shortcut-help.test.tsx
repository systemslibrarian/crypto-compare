import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShortcutHelp from "@/components/ShortcutHelp";

describe("ShortcutHelp", () => {
  afterEach(cleanup);

  it("focuses the close control, closes on Escape, and hides the background", async () => {
    const onClose = vi.fn();
    const background = document.createElement("div");
    background.className = "cryptoCompareRoot";
    document.body.appendChild(background);

    render(<ShortcutHelp open onClose={onClose} />);

    const close = screen.getByRole("button", { name: /close shortcuts panel/i });
    await waitFor(() => expect(close).toHaveFocus());
    expect(background).toHaveAttribute("inert");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();

    background.remove();
  });
});
