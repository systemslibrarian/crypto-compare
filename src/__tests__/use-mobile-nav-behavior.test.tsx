import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { useMobileNavBehavior } from "@/lib/useMobileNavBehavior";

function TestMobileNav() {
  const [open, setOpen] = useState(true);
  const navRef = useRef<HTMLElement>(null);

  useMobileNavBehavior({
    isOpen: open,
    navElement: navRef.current,
    onClose: () => setOpen(false),
  });

  return (
    <div>
      <div>{open ? "open" : "closed"}</div>
      <nav ref={navRef}>
        <button>first</button>
        <button>last</button>
      </nav>
    </div>
  );
}

describe("useMobileNavBehavior", () => {
  it("locks body scroll and closes on Escape", () => {
    render(<TestMobileNav />);

    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByText("closed")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});