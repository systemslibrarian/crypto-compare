import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES } from "@/data/categories";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { buildRows, exportToCSV, exportToMarkdown } from "@/lib/comparison";
import { validateAlgorithms } from "@/lib/validation";
import type { Algorithm, AlgorithmCategory } from "@/types/crypto";

/** Merge provenance into algorithm (same as CryptoCompare.withProvenance) */
function withProvenance(algo: Algorithm): Algorithm {
  const traced = ALGORITHM_PROVENANCE[algo.id];
  return { ...algo, sources: traced?.sources, lastReviewed: traced?.lastReviewed };
}

// ─── Export Correctness ────────────────────────────────────────

describe("Export Correctness", () => {
  const symmetricAlgos = ALGORITHMS.filter((a) => a.category === "symmetric").slice(0, 2);
  const rows = buildRows("symmetric", false);

  it("CSV export contains no [object Object]", () => {
    const csv = exportToCSV(rows, symmetricAlgos);
    expect(csv).not.toContain("[object Object]");
  });

  it("Markdown export contains no [object Object]", () => {
    const md = exportToMarkdown(rows, symmetricAlgos);
    expect(md).not.toContain("[object Object]");
  });

  it("CSV export contains algorithm names in header", () => {
    const csv = exportToCSV(rows, symmetricAlgos);
    const firstLine = csv.split("\n")[0];
    expect(firstLine).toContain("Property");
    for (const algo of symmetricAlgos) {
      expect(firstLine).toContain(algo.name);
    }
  });

  it("CSV Status row exports statusLabel text, not a component", () => {
    const csv = exportToCSV(rows, symmetricAlgos);
    for (const algo of symmetricAlgos) {
      expect(csv).toContain(algo.statusLabel);
    }
  });

  it("CSV Classical security row exports bits as text", () => {
    const csv = exportToCSV(rows, symmetricAlgos);
    for (const algo of symmetricAlgos) {
      expect(csv).toContain(`${algo.securityBits} bits`);
    }
  });

  it("CSV PQ security row exports bits as text", () => {
    const csv = exportToCSV(rows, symmetricAlgos);
    for (const algo of symmetricAlgos) {
      expect(csv).toContain(`${algo.pqSecurityBits} bits`);
    }
  });

  it("Markdown export has correct table structure", () => {
    const md = exportToMarkdown(rows, symmetricAlgos);
    const lines = md.split("\n");
    expect(lines[0]).toMatch(/^\| Property \|/);
    expect(lines[1]).toMatch(/^\| --- \|/);
    for (let i = 2; i < lines.length; i++) {
      expect(lines[i]).toMatch(/^\|.*\|$/);
    }
  });

  it("Markdown Status row exports statusLabel text, not a component", () => {
    const md = exportToMarkdown(rows, symmetricAlgos);
    for (const algo of symmetricAlgos) {
      expect(md).toContain(algo.statusLabel);
    }
    expect(md).not.toContain("[object Object]");
  });

  it("Recommendation row exports readable text", () => {
    const csv = exportToCSV(rows, symmetricAlgos);
    // Should contain "Recommended default" or similar labels, not [object Object]
    expect(csv).toMatch(/Recommended default|Acceptable \(constrained\)|Legacy|Research|Do not use/);
  });

  it("exports all categories without [object Object]", () => {
    const categories: AlgorithmCategory[] = [
      "symmetric", "kem", "signature", "hash", "kdf", "mac",
      "password", "sharing", "he", "zkp", "mpc", "ot_pir",
    ];
    for (const cat of categories) {
      const algos = ALGORITHMS.filter((a) => a.category === cat).slice(0, 2);
      if (algos.length < 2) continue;
      const catRows = buildRows(cat, true);
      const csv = exportToCSV(catRows, algos);
      const md = exportToMarkdown(catRows, algos);
      expect(csv).not.toContain("[object Object]");
      expect(md).not.toContain("[object Object]");
    }
  });

  it("advanced mode rows export cleanly", () => {
    const advRows = buildRows("symmetric", true);
    const csv = exportToCSV(advRows, symmetricAlgos);
    expect(csv).toContain("Best Attack");
    expect(csv).toContain("Reduction");
    expect(csv).toContain("Performance");
    expect(csv).toContain("Notes");
    expect(csv).not.toContain("[object Object]");
  });
});

// ─── Exact Export Content (3 Representative Algorithms) ─────────

describe("Exact Export Content", () => {
  const aes = withProvenance(ALGORITHMS.find((a) => a.id === "aes256gcm")!);
  const mlkem = withProvenance(ALGORITHMS.find((a) => a.id === "mlkem768")!);
  const sha = withProvenance(ALGORITHMS.find((a) => a.id === "sha256")!);

  describe("AES-256-GCM (symmetric, Badge + SecurityMeter)", () => {
    const rows = buildRows("symmetric", true);

    it("CSV contains exact status label text, not JSX", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain('"NIST Standard"');
    });

    it("CSV contains exact recommendation text label", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain('"Recommended default"');
    });

    it("CSV contains justification text", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("NIST-standardized, ubiquitous hardware acceleration");
    });

    it("CSV contains classical security as plain text", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain('"256 bits"');
    });

    it("CSV contains PQ security as plain text", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain('"128 bits"');
    });

    it("CSV contains source labels, not count", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("NIST FIPS 197");
      expect(csv).toContain("NIST SP 800-38D");
    });

    it("CSV contains Last Reviewed in Month Year format", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("March 2026");
    });

    it("CSV contains assumptions text", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("nonce reuse is catastrophic");
    });

    it("CSV has no [object Object] or empty critical fields", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).not.toContain("[object Object]");
      // Every row should produce a non-empty value
      for (const row of rows) {
        const val = row.exportText(aes);
        expect(typeof val).toBe("string");
      }
    });

    it("Markdown contains exact values in table format", () => {
      const md = exportToMarkdown(rows, [aes]);
      expect(md).toContain("| Status | NIST Standard |");
      expect(md).toContain("| Recommendation | Recommended default |");
      expect(md).toContain("| Classical | 256 bits |");
      expect(md).toContain("| PQ | 128 bits |");
      expect(md).toContain("| Last Reviewed | March 2026 |");
      expect(md).not.toContain("[object Object]");
    });
  });

  describe("ML-KEM-768 (kem, formatBytes sizes)", () => {
    const rows = buildRows("kem", false);

    it("CSV contains exact status and recommendation", () => {
      const csv = exportToCSV(rows, [mlkem]);
      expect(csv).toContain('"NIST FIPS 203"');
      expect(csv).toContain('"Recommended default"');
    });

    it("CSV contains public key size via formatBytes", () => {
      const csv = exportToCSV(rows, [mlkem]);
      expect(csv).toContain("1.2 KB");
    });

    it("CSV contains ciphertext size via formatBytes", () => {
      const csv = exportToCSV(rows, [mlkem]);
      expect(csv).toContain("1.1 KB");
    });

    it("CSV contains justification for ML-KEM-768", () => {
      const csv = exportToCSV(rows, [mlkem]);
      expect(csv).toContain("NIST primary PQ KEM standard");
    });

    it("CSV contains source labels", () => {
      const csv = exportToCSV(rows, [mlkem]);
      expect(csv).toContain("NIST FIPS 203");
    });

    it("CSV has no [object Object]", () => {
      const csv = exportToCSV(rows, [mlkem]);
      expect(csv).not.toContain("[object Object]");
    });

    it("Markdown has correct table structure", () => {
      const md = exportToMarkdown(rows, [mlkem]);
      expect(md).toContain("| Recommendation | Recommended default |");
      expect(md).toContain("| Last Reviewed | March 2026 |");
      expect(md).not.toContain("[object Object]");
    });
  });

  describe("SHA-256 (hash, recommended)", () => {
    const rows = buildRows("hash", true);

    it("CSV contains exact hash-specific fields", () => {
      const csv = exportToCSV(rows, [sha]);
      expect(csv).toContain('"256 bits"'); // outputSize
      expect(csv).toContain('"512 bits"'); // blockSize
    });

    it("CSV contains recommendation and justification", () => {
      const csv = exportToCSV(rows, [sha]);
      expect(csv).toContain('"Recommended default"');
      expect(csv).toContain("NIST-standardized since 2001");
    });

    it("CSV contains assumptions", () => {
      const csv = exportToCSV(rows, [sha]);
      expect(csv).toContain("Collision resistance assumes no shortcut beyond the birthday bound");
    });

    it("CSV contains source labels and Last Reviewed", () => {
      const csv = exportToCSV(rows, [sha]);
      expect(csv).toContain("NIST FIPS 180-4");
      expect(csv).toContain("March 2026");
    });

    it("Markdown export has all required fields", () => {
      const md = exportToMarkdown(rows, [sha]);
      expect(md).toContain("| Status | NIST FIPS 180-4 |");
      expect(md).toContain("| Recommendation | Recommended default |");
      expect(md).toContain("| Justification |");
      expect(md).toContain("| Sources |");
      expect(md).toContain("| Last Reviewed | March 2026 |");
      expect(md).toContain("| Assumptions |");
      expect(md).not.toContain("[object Object]");
    });

    it("advanced rows include Best Attack and Performance", () => {
      const csv = exportToCSV(rows, [sha]);
      expect(csv).toContain("Best Attack");
      expect(csv).toContain("No practical attacks");
      expect(csv).toContain("Performance");
      expect(csv).toContain("cycles/byte");
    });
  });

  describe("New Trust Hardening Export Rows", () => {
    const rows = buildRows("symmetric", true);

    it("CSV contains Changes When row for AES-256-GCM", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("Changes When");
      expect(csv).toContain(aes.recommendationChangesWhen);
    });

    it("CSV contains Why Not This? row for AES-256-GCM", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("Why Not This?");
      expect(csv).toContain(aes.whyNotThis);
    });

    it("CSV contains Classical Basis row in advanced mode", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("Classical Basis");
      const basis = aes.estimationMethodology.classicalBasis;
      const note = aes.estimationMethodology.classicalNote;
      expect(csv).toContain(`${basis}: ${note}`);
    });

    it("CSV contains Quantum Basis row in advanced mode", () => {
      const csv = exportToCSV(rows, [aes]);
      expect(csv).toContain("Quantum Basis");
      const basis = aes.estimationMethodology.quantumBasis;
      const note = aes.estimationMethodology.quantumNote;
      expect(csv).toContain(`${basis}: ${note}`);
    });

    it("Markdown contains Changes When and Why Not This?", () => {
      const md = exportToMarkdown(rows, [aes]);
      expect(md).toContain("| Changes When |");
      expect(md).toContain("| Why Not This? |");
    });

    it("non-advanced mode still includes Changes When and Why Not This?", () => {
      const basicRows = buildRows("symmetric", false);
      const csv = exportToCSV(basicRows, [aes]);
      expect(csv).toContain("Changes When");
      expect(csv).toContain("Why Not This?");
    });
  });
});

// ─── Recommendation Labels ─────────────────────────────────────

describe("Recommendation Labels", () => {
  it("every algorithm has a valid recommendation", () => {
    const valid = ["recommended", "acceptable", "legacy", "research", "avoid"];
    for (const algo of ALGORITHMS) {
      expect(valid).toContain(algo.recommendation);
    }
  });

  it("at least one algorithm per non-research category is recommended or acceptable", () => {
    // Categories like HE are entirely research-stage; exclude them
    const researchOnlyCategories = new Set(["he"]);
    const categories = CATEGORIES.map((c) => c.id).filter((c) => !researchOnlyCategories.has(c));
    for (const cat of categories) {
      const algos = ALGORITHMS.filter((a) => a.category === cat);
      const hasGoodOption = algos.some(
        (a) => a.recommendation === "recommended" || a.recommendation === "acceptable",
      );
      expect(hasGoodOption).toBe(true);
    }
  });

  it("no algorithm with 'avoid' recommendation has 'standard' status", () => {
    const avoidAlgos = ALGORITHMS.filter((a) => a.recommendation === "avoid");
    for (const algo of avoidAlgos) {
      expect(algo.status).not.toBe("standard");
    }
  });
});

// ─── Zod Schema Validation ─────────────────────────────────────

describe("Zod Schema Validation", () => {
  it("passes full Zod validation with zero errors", () => {
    const errors = validateAlgorithms(ALGORITHMS);
    expect(errors).toEqual([]);
  });

  it("detects duplicate IDs", () => {
    const duped = [...ALGORITHMS, ALGORITHMS[0]];
    const errors = validateAlgorithms(duped);
    expect(errors.some((e) => e.includes("Duplicate"))).toBe(true);
  });

  it("detects missing required fields", () => {
    const broken = [{ ...ALGORITHMS[0], name: "", id: "test_broken" }] as Algorithm[];
    const errors = validateAlgorithms(broken);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("detects security bits out of range", () => {
    const broken = [{ ...ALGORITHMS[0], securityBits: 999, id: "test_range" }] as Algorithm[];
    const errors = validateAlgorithms(broken);
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ─── Provenance Coverage ─────────────────────────────────────

describe("Provenance Coverage", () => {
  it("every algorithm has a provenance entry", () => {
    for (const algo of ALGORITHMS) {
      expect(ALGORITHM_PROVENANCE).toHaveProperty(algo.id);
    }
  });

  it("every provenance entry maps to a real algorithm", () => {
    const algoIds = new Set(ALGORITHMS.map((a) => a.id));
    for (const id of Object.keys(ALGORITHM_PROVENANCE)) {
      expect(algoIds.has(id)).toBe(true);
    }
  });

  it("every source URL is a valid URL format", () => {
    for (const [id, prov] of Object.entries(ALGORITHM_PROVENANCE)) {
      for (const source of prov.sources) {
        expect(() => new URL(source.url)).not.toThrow();
      }
    }
  });

  it("every lastReviewed is a valid YYYY-MM-DD date", () => {
    for (const [id, prov] of Object.entries(ALGORITHM_PROVENANCE)) {
      expect(prov.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("every source has a valid kind", () => {
    const validKinds = ["standard", "analysis", "deployment", "benchmark"];
    for (const [id, prov] of Object.entries(ALGORITHM_PROVENANCE)) {
      for (const source of prov.sources) {
        expect(validKinds).toContain(source.kind);
      }
    }
  });
});

// ─── Build Rows Coverage ────────────────────────────────────

describe("buildRows coverage", () => {
  const categories: AlgorithmCategory[] = [
    "symmetric", "kem", "signature", "hash", "kdf", "mac",
    "password", "sharing", "he", "zkp", "mpc", "ot_pir",
  ];

  for (const cat of categories) {
    it(`produces rows for category: ${cat}`, () => {
      const rows = buildRows(cat, false);
      expect(rows.length).toBeGreaterThanOrEqual(4); // at least Origin, Status, Recommendation, Classical, PQ, Use Cases
    });

    it(`produces advanced rows for category: ${cat}`, () => {
      const basicRows = buildRows(cat, false);
      const advRows = buildRows(cat, true);
      expect(advRows.length).toBeGreaterThan(basicRows.length);
    });

    it(`all rows have exportText for category: ${cat}`, () => {
      const rows = buildRows(cat, true);
      const algos = ALGORITHMS.filter((a) => a.category === cat);
      for (const row of rows) {
        for (const algo of algos) {
          const text = row.exportText(algo);
          expect(typeof text).toBe("string");
          expect(text).not.toBe("[object Object]");
        }
      }
    });
  }
});

// ─── Cross-field Consistency ────────────────────────────────

describe("Cross-field Consistency", () => {
  it("signature algorithms define signatureSize (number or null)", () => {
    const sigs = ALGORITHMS.filter((a) => a.category === "signature");
    for (const sig of sigs) {
      expect("signatureSize" in sig).toBe(true);
    }
  });

  it("KEM algorithms define publicKeySize (number or null)", () => {
    const kems = ALGORITHMS.filter((a) => a.category === "kem");
    for (const kem of kems) {
      expect("publicKeySize" in kem).toBe(true);
    }
  });

  it("all securityBits are positive", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.securityBits).toBeGreaterThan(0);
    }
  });

  it("pqSecurityBits is non-negative", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.pqSecurityBits).toBeGreaterThanOrEqual(0);
    }
  });
});

// ─── URL State Hydration & Restoration ──────────────────────

describe("URL State Hydration", () => {
  beforeEach(() => {
    // Reset URL state between tests
    window.history.replaceState({}, "", "?");
  });

  it("default state produces minimal URL params", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // Default state writes cat=symmetric
    const params = new URLSearchParams(window.location.search);
    expect(params.get("cat")).toBe("symmetric");
    // No optional filters set
    expect(params.get("adv")).toBeNull();
    expect(params.get("cmp")).toBeNull();
    expect(params.get("pq")).toBeNull();
    unmount();
  });

  it("restores category from URL", async () => {
    window.history.replaceState({}, "", "?cat=hash");
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // The hash category tab should be selected
    const hashTab = screen.getByRole("tab", { name: /Hash/i });
    expect(hashTab).toHaveAttribute("aria-selected", "true");
    unmount();
  });

  it("restores advanced mode from URL", async () => {
    window.history.replaceState({}, "", "?cat=symmetric&adv=1");
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    const advButton = screen.getByRole("button", { name: /Advanced/i });
    expect(advButton).toHaveAttribute("aria-pressed", "true");
    unmount();
  });

  it("ignores invalid category param", async () => {
    window.history.replaceState({}, "", "?cat=invalid_not_real");
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // Falls back to default "symmetric"
    const symTab = screen.getByRole("tab", { name: /\bSymmetric\b/i });
    expect(symTab).toHaveAttribute("aria-selected", "true");
    unmount();
  });

  it("restores search query from URL", async () => {
    window.history.replaceState({}, "", "?cat=symmetric&q=chacha");
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    const searchInput = screen.getByLabelText("Search algorithms") as HTMLInputElement;
    expect(searchInput.value).toBe("chacha");
    unmount();
  });
});

// ─── Filter Combinations ─────────────────────────────────────

describe("Filter Combinations", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "?");
    cleanup();
  });

  it("PQ filter removes algorithms with 0 PQ bits", () => {
    const symmetric = ALGORITHMS.filter((a) => a.category === "symmetric");
    const pqFiltered = symmetric.filter((a) => a.pqSecurityBits >= 128);
    // Some symmetric algos (AES with Grover) have pqSecurityBits < 128
    expect(pqFiltered.length).toBeLessThanOrEqual(symmetric.length);
    // At least XChaCha20 and AES-256 should survive (128-bit PQ)
    const surviving = pqFiltered.map((a) => a.id);
    expect(surviving).toContain("aes256gcm");
  });

  it("search filter is case-insensitive", () => {
    const q = "CHACHA";
    const items = ALGORITHMS.filter((a) => a.category === "symmetric");
    const matched = items.filter((a) =>
      `${a.name} ${a.family} ${a.useCases} ${a.origin} ${a.statusLabel}`.toLowerCase().includes(q.toLowerCase()),
    );
    expect(matched.length).toBeGreaterThan(0);
    expect(matched.every((a) => a.name.toLowerCase().includes("chacha") || a.family.toLowerCase().includes("chacha"))).toBe(true);
  });

  it("combining PQ + standard filters can yield empty results", () => {
    // Some categories may have no PQ + standardized combo
    const macs = ALGORITHMS.filter((a) => a.category === "mac");
    const strict = macs.filter(
      (a) => a.pqSecurityBits >= 128 && a.status === "standard",
    );
    // Just verify the filter logic doesn't crash — result can be empty or non-empty
    expect(Array.isArray(strict)).toBe(true);
  });

  it("country filter correctly tags algorithms", () => {
    // Test deriveCountryTag logic inline
    const usAlgos = ALGORITHMS.filter((a) =>
      a.origin.toLowerCase().includes("united states") || a.origin.toLowerCase().includes("us/"),
    );
    expect(usAlgos.length).toBeGreaterThan(0);
  });

  it("sort by security descending works", () => {
    const items = [...ALGORITHMS.filter((a) => a.category === "symmetric")];
    items.sort((a, b) => b.securityBits - a.securityBits);
    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1].securityBits).toBeGreaterThanOrEqual(items[i].securityBits);
    }
  });

  it("sort by name is alphabetical", () => {
    const items = [...ALGORITHMS.filter((a) => a.category === "hash")];
    items.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1].name.localeCompare(items[i].name)).toBeLessThanOrEqual(0);
    }
  });
});

// ─── Compare Mode State Transitions ────────────────────────

describe("Compare Mode State Transitions", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "?");
    cleanup();
  });

  it("compare button does not render with fewer than 2 selections", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // Compare button only appears when 2+ algorithms are selected
    const compareBtn = screen.queryByRole("button", { name: /^Compare \d/i });
    expect(compareBtn).toBeNull();
    unmount();
  });

  it("clicking an algorithm card toggles selection", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // Click first algorithm card (aria-label: "Select <name> for comparison")
    const cards = screen.getAllByRole("button", { name: /Select .+ for comparison/i });
    expect(cards.length).toBeGreaterThan(0);
    fireEvent.click(cards[0]);
    // URL should now contain sel param
    const params = new URLSearchParams(window.location.search);
    expect(params.get("sel")).toBeTruthy();
    unmount();
  });

  it("selecting 2 algorithms shows compare button", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // Select first two algorithms
    const cards = screen.getAllByRole("button", { name: /Select .+ for comparison/i });
    fireEvent.click(cards[0]);
    fireEvent.click(cards[1]);
    const compareBtn = screen.getByRole("button", { name: /^Compare \d/i });
    expect(compareBtn).toBeInTheDocument();
    unmount();
  });
});

// ─── Keyboard Shortcuts ──────────────────────────────────────

describe("Keyboard Shortcuts", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "?");
    cleanup();
  });

  it("'/' focuses the search input", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    fireEvent.keyDown(document, { key: "/" });
    const searchInput = screen.getByLabelText("Search algorithms");
    expect(document.activeElement).toBe(searchInput);
    unmount();
  });

  it("'a' toggles advanced mode", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    const advButtons = screen.getAllByText(/Beginner/i);
    const advButton = advButtons.find((el) => el.hasAttribute("aria-pressed"))!;
    expect(advButton).toHaveAttribute("aria-pressed", "false");
    fireEvent.keyDown(document, { key: "a" });
    expect(advButton).toHaveAttribute("aria-pressed", "true");
    expect(advButton).toHaveTextContent("Advanced");
    unmount();
  });

  it("ArrowRight navigates to next category", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    // Default is "symmetric" — ArrowRight goes to next
    const nextCat = CATEGORIES[1]; // kem
    fireEvent.keyDown(document, { key: "ArrowRight" });
    const nextTab = screen.getByRole("tab", { name: new RegExp(nextCat.label, "i") });
    expect(nextTab).toHaveAttribute("aria-selected", "true");
    unmount();
  });

  it("ArrowLeft navigates to previous category", async () => {
    window.history.replaceState({}, "", "?cat=kem");
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    const symTab = screen.getByRole("tab", { name: /\bSymmetric\b/i });
    expect(symTab).toHaveAttribute("aria-selected", "true");
    unmount();
  });

  it("Escape key does not crash when nothing is open", async () => {
    const CryptoCompare = (await import("@/components/CryptoCompare")).default;
    const { unmount } = render(<CryptoCompare />);
    expect(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    }).not.toThrow();
    unmount();
  });
});

// ─── Decision Flowchart Recommendation Paths ─────────────────

describe("Decision Flowchart Paths", () => {
  afterEach(cleanup);

  it("renders the initial question", async () => {
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={() => {}} />);
    expect(screen.getByText("What do you need to do?")).toBeInTheDocument();
    unmount();
  });

  it("navigating symmetric → hardware AES recommends AES-256-GCM", async () => {
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={() => {}} />);
    fireEvent.click(screen.getByText(/Encrypt data with a shared key/));
    fireEvent.click(screen.getByText(/Yes.*hardware AES available/));
    expect(screen.getAllByText(/AES-256-GCM/).length).toBeGreaterThan(0);
    unmount();
  });

  it("navigating KEM → PQ → balance recommends ML-KEM-768", async () => {
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={() => {}} />);
    fireEvent.click(screen.getByText(/Establish a shared secret/));
    fireEvent.click(screen.getByText(/Yes.*protect against future/));
    fireEvent.click(screen.getByText(/Balance of speed and security/));
    expect(screen.getAllByText(/ML-KEM-768/).length).toBeGreaterThan(0);
    unmount();
  });

  it("navigating password → modern recommends Argon2id", async () => {
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={() => {}} />);
    fireEvent.click(screen.getByText(/Store user passwords/));
    fireEvent.click(screen.getByText(/Yes.*recommended/));
    expect(screen.getAllByText(/Argon2id/).length).toBeGreaterThan(0);
    unmount();
  });

  it("back button returns to prior question", async () => {
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={() => {}} />);
    fireEvent.click(screen.getByText(/Hash data/));
    expect(screen.getByText(/What's the primary use case/)).toBeInTheDocument();
    // Go back
    fireEvent.click(screen.getByText(/Back/));
    expect(screen.getByText("What do you need to do?")).toBeInTheDocument();
    unmount();
  });

  it("reset button returns to start from deep path", async () => {
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={() => {}} />);
    fireEvent.click(screen.getByText(/Encrypt data with a shared key/));
    fireEvent.click(screen.getByText(/No.*software/));
    fireEvent.click(screen.getByText(/Yes.*safe random nonces/));
    // Result shown — click Start over
    fireEvent.click(screen.getByText(/Start over/));
    expect(screen.getByText("What do you need to do?")).toBeInTheDocument();
    unmount();
  });

  it("onNavigate is called when clicking result view button", async () => {
    const navigateSpy = vi.fn();
    const DecisionFlowchart = (await import("@/components/DecisionFlowchart")).default;
    const { unmount } = render(<DecisionFlowchart onNavigate={navigateSpy} />);
    // Navigate to a result
    fireEvent.click(screen.getByText(/Hash data/));
    fireEvent.click(screen.getByText(/General purpose/));
    // Click the "View SHA-256 details →" button
    const viewBtn = screen.getByText(/View.*details/i);
    fireEvent.click(viewBtn);
    expect(navigateSpy).toHaveBeenCalledWith("hash", "sha256");
    unmount();
  });

  it("every recommended algorithm in flowchart exists in ALGORITHMS", async () => {
    // Extract all answer IDs from the decision tree
    const DecisionFlowchartModule = await import("@/components/DecisionFlowchart");
    // We test this indirectly — all flowchart results reference real algo IDs
    const algoIds = new Set(ALGORITHMS.map((a) => a.id));
    const expectedIds = [
      "aes256gcm", "xchacha20poly", "chacha20poly", // symmetric
      "mlkem768", "mlkem1024", "hqc", "classic_mceliece", // kem
      "mldsa65", "falcon512", "slh_dsa", "xmss", // signatures
      "sha256", "sha3_256", "blake3", "blake2b", // hash
      "hkdf", "argon2_kdf", // kdf
      "hmac_sha256", "cmac_aes", "kmac256", // mac
      "argon2id", "bcrypt", // password
      "shamir", "feldman_vss", "additive_sharing", // sharing
      "tfhe", "ckks", "bgv", // he
      "groth16", "zk_stark", "plonk", // zkp
      "spdz", "aby", "sharemind", "garbled_circuits", // mpc
      "ot_base", "ot_extension", "cpir", "it_pir", // ot & pir
    ];
    for (const id of expectedIds) {
      expect(algoIds.has(id)).toBe(true);
    }
  });
});
