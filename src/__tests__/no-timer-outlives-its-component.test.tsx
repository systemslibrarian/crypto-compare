import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEffect, useState } from "react";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import DecisionFlowchart from "@/components/DecisionFlowchart";
import { ALGORITHMS } from "@/data/algorithms";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { useCopiedFlag } from "@/lib/useCopiedFlag";

/*
 * crypto-compare#59: three tests failed only in the full parallel run, with
 * "ReferenceError: window is not defined" blamed on a file that had not caused
 * it. Vitest gives each test file its own jsdom, so a timer that outlives its
 * file fires while the NEXT file's environment is current, and `window` is gone.
 *
 * These assertions are deliberately about TIMER COUNTS and SOURCE SHAPE rather
 * than about wall-clock behaviour. The failure in #59 is a scheduling race, and a
 * test that waits to see whether something leaks measures the machine: on the
 * host where this fix was written the load average was 150 on 10 cores, and the
 * three named tests failed even when run one file at a time. vi.getTimerCount()
 * is the same answer under any load.
 */

afterEach(() => {
  vi.useRealTimers();
});

function CopyProbe({ onReady }: { onReady: (mark: () => void) => void }) {
  const [copied, markCopied] = useCopiedFlag();
  useEffect(() => onReady(markCopied), [onReady, markCopied]);
  return <span>{copied ? "copied" : "idle"}</span>;
}

describe("nothing a component schedules outlives the component", () => {
  it("useCopiedFlag clears its reset timer when the component unmounts", () => {
    vi.useFakeTimers();
    let mark: (() => void) | null = null;
    const { unmount } = render(<CopyProbe onReady={(m) => { mark = m; }} />);
    expect(mark).toBeTypeOf("function");
    mark!();
    expect(vi.getTimerCount()).toBe(1);   // the 1500ms reset is pending
    unmount();
    expect(vi.getTimerCount()).toBe(0);   // and it goes with the component
  });

  it("a clipboard resolution that arrives after unmount schedules nothing", () => {
    /* The other half, and the half a timer-cleanup alone does not fix: the
       promise callback runs on a microtask after the click handler returns, so
       the component can already be gone when it calls the flag. */
    vi.useFakeTimers();
    let mark: (() => void) | null = null;
    const { unmount } = render(<CopyProbe onReady={(m) => { mark = m; }} />);
    unmount();
    mark!();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("the real reproducer leaves no timer behind: DecisionFlowchart copy-as-markdown", async () => {
    /* Exactly what src/__tests__/decision-flowchart-report.test.tsx does. That
       file awaits the clipboard CALL and then ends, so before this fix it left a
       1500ms setCopied(false) to fire in whatever file ran next. */
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    const view = render(
      <DecisionFlowchart onNavigate={() => {}} algorithms={ALGORITHMS} provenance={ALGORITHM_PROVENANCE} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /encrypt data with a shared key/i }));
    fireEvent.click(screen.getByRole("button", { name: /fips.*approved implementation/i }));
    fireEvent.click(screen.getByRole("button", { name: /yes.*uniqueness is enforced/i }));

    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: /copy as markdown/i }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(vi.getTimerCount()).toBe(1);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("Testing Library unmounts what a test rendered, so nothing is left mounted at file end", () => {
    /* The second half of #59, and the one no app timer explains. Testing Library
       auto-cleans only when a global `afterEach` exists -- its index.js gates on
       `typeof afterEach === "function"` -- and this project runs Vitest without
       globals, so it never ran. 52 renders across 43 files stayed mounted until
       their jsdom was destroyed, and React's scheduler then ran queued work for
       them in the next file's context.

       Asserted as two tests in sequence rather than by inspecting setup.ts,
       because what matters is the observable state at the start of a test. */
    render(<div data-testid="left-mounted">still here</div>);
    expect(screen.getByTestId("left-mounted")).toBeInTheDocument();
  });

  it("…and the previous test's render is gone by the time this one starts", () => {
    expect(document.body.textContent).toBe("");
    expect(document.body.querySelectorAll("div").length).toBe(0);
  });

  it("no source file starts a timer it does not keep a handle to", () => {
    /* The rule, not the four instances. Six sites leaked before this fix, in four
       components and two hooks, and the shape was identical every time: a bare
       setTimeout whose id nobody holds, so nothing can clear it. A site that
       keeps its handle can still forget to clear it, which the three tests above
       cover for the flag; this one stops a NEW unowned timer being written. */
    const root = join(process.cwd(), "src");
    const files: string[] = [];
    (function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) { if (entry.name !== "__tests__") walk(p); continue; }
        if (/\.(ts|tsx)$/.test(entry.name)) files.push(p);
      }
    })(root);
    expect(files.length).toBeGreaterThan(20);

    const unowned: string[] = [];
    for (const file of files) {
      readFileSync(file, "utf8").split("\n").forEach((line, i) => {
        /* Comments are stripped first, and this is not a detail: the first run of
           this test failed on useCopiedFlag.ts's own doc comment, which quotes
           the defective line it exists to explain. A source rule that reads its
           own documentation as a violation is the mistake in miniature. */
        const trimmed = line.trim();
        if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) return;
        if (!/\b(setTimeout|setInterval)\s*\(/.test(line)) return;
        // owned: the handle is assigned to something that can be cleared later
        if (/=\s*(window\.)?(setTimeout|setInterval)\s*\(/.test(line)) return;
        unowned.push(`${file.slice(root.length - 3)}:${i + 1}  ${trimmed.slice(0, 70)}`);
      });
    }
    expect(unowned).toEqual([]);
  });
});
