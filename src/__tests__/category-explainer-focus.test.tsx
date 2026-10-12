import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CryptoCompare from "@/components/CryptoCompare";
import { CATEGORY_INFO } from "@/data/categories";

const sections = ["What it does", "Where you see it in the real world", "Why it matters"];

async function expand() {
  const toggle = await screen.findByRole("button", { name: /Learn more — expand/ });
  fireEvent.click(toggle);
  return screen.getByRole("button", { name: /Less — collapse/ });
}

function openSections() {
  for (const label of sections) fireEvent.click(screen.getByRole("button", { name: `Expand ${label}` }));
  fireEvent.click(screen.getByRole("button", { name: /^Expand projects/ }));
}

function expectSectionsClosed() {
  for (const label of sections) {
    expect(screen.getByRole("button", { name: `Expand ${label}` })).toHaveAttribute("aria-expanded", "false");
  }
  expect(screen.getByRole("button", { name: /^Expand projects/ })).toHaveAttribute("aria-expanded", "false");
}

describe("category explainer focus and disclosure state", () => {
  it("keeps the same focused toggle when the real app expands and collapses details", async () => {
    const { unmount } = render(<CryptoCompare />);
    try {
      const toggle = await screen.findByRole("button", { name: /Learn more — expand/ });
      toggle.focus();
      fireEvent.click(toggle);
      expect(screen.getByRole("button", { name: /Less — collapse/ })).toBe(toggle);
      expect(toggle).toHaveFocus();
      fireEvent.click(toggle);
      expect(screen.getByRole("button", { name: /Learn more — expand/ })).toBe(toggle);
      expect(toggle).toHaveFocus();
    } finally {
      unmount();
    }
  });

  it("resets every inner disclosure after collapsing and reopening details", async () => {
    const { unmount } = render(<CryptoCompare />);
    try {
      const toggle = await expand();
      openSections();
      fireEvent.click(toggle);
      fireEvent.click(screen.getByRole("button", { name: /Learn more — expand/ }));
      expectSectionsClosed();
    } finally {
      unmount();
    }
  });

  it("resets every inner disclosure on category change without taking navigation focus", async () => {
    const { unmount } = render(<CryptoCompare />);
    try {
      await expand();
      openSections();
      const navigation = screen.getByRole("navigation", { name: "Cryptography categories" });
      const hash = within(navigation).getByRole("button", { name: /\bHash\b/i });
      hash.focus();
      fireEvent.click(hash);
      expect(screen.getByRole("button", {
        name: `Less — collapse ${CATEGORY_INFO.hash.title} details`,
      })).toBeInTheDocument();
      expectSectionsClosed();
      expect(hash).toHaveFocus();
    } finally {
      unmount();
    }
  });

  it("preserves disclosure state across unrelated search updates", async () => {
    const { unmount } = render(<CryptoCompare />);
    try {
      await expand();
      fireEvent.click(screen.getByRole("button", { name: "Expand What it does" }));
      fireEvent.change(screen.getByRole("textbox", { name: "Search algorithms" }), {
        target: { value: "chacha" },
      });
      expect(screen.getByRole("button", { name: "Collapse What it does" })).toHaveAttribute("aria-expanded", "true");
    } finally {
      unmount();
    }
  });
});
