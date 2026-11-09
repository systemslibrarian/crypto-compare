/* The invariant whose absence caused the cross-file async leak (#59).
 *
 * React Testing Library registers its own `afterEach(cleanup)` ONLY when a
 * global `afterEach` exists:
 *
 *     // @testing-library/react/dist/index.js:26
 *     if (typeof afterEach === 'function') { afterEach(() => { cleanup() }) }
 *
 * This project sets no `test.globals`, and vitest defaults it to false, so
 * that registration never happened and nothing was ever unmounted. Mounted
 * components kept their effects alive, and the cancel-on-unmount cleanups that
 * next/link's prefetch observer and this app's own effects rely on never ran.
 *
 * These tests fail if setup.ts stops registering cleanup, which is the only
 * way this regresses. They assert the OBSERVABLE behaviour rather than the
 * registration, so they also hold if the project later turns globals on and
 * lets RTL register it instead. */
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { useEffect } from "react";

const effects: string[] = [];

function Tracked() {
  useEffect(() => {
    effects.push("mounted");
    return () => { effects.push("unmounted"); };
  }, []);
  return <div data-testid="cleanup-probe">probe</div>;
}

test("a rendered component is in the document during its own test", () => {
  render(<Tracked />);
  expect(document.querySelectorAll("[data-testid=cleanup-probe]")).toHaveLength(1);
  expect(effects).toContain("mounted");
});

test("the previous test's component was unmounted before this one", () => {
  // Without cleanup this is 1: the node from the previous test is still here,
  // and so are its effects, its timers and its document listeners.
  expect(document.querySelectorAll("[data-testid=cleanup-probe]")).toHaveLength(0);
  // And the unmount actually ran, so effect destructors — the ones that call
  // clearTimeout and removeEventListener — were given their chance.
  expect(effects).toEqual(["mounted", "unmounted"]);
});
