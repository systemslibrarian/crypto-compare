import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A "✓ Copied" flag that turns itself off again, owning both the timer that does
 * it and its own lifetime.
 *
 * Four components had this inline, and all four leaked twice over:
 *
 *     navigator.clipboard.writeText(text).then(() => {
 *       setCopied(true);
 *       setTimeout(() => setCopied(false), 1500);   // never cleared
 *     }, () => {});
 *
 * The promise resolves on a microtask after the click handler returns, and the
 * timer then fires 1.5 seconds later. Neither is tied to the component, so a
 * click followed by an unmount leaves both to run afterwards. Under test that is
 * a cross-FILE defect rather than a cross-component one: Vitest gives each file
 * its own jsdom, so a timer outliving its file fires while the NEXT file's
 * environment is current, where `window` no longer exists — the
 * `ReferenceError: window is not defined` attributed to whichever file happened
 * to be running (crypto-compare#59). In the browser the same two lines are a
 * setState on an unmounted tree.
 *
 * So the flag owns both halves. `live` makes a resolution that arrives after
 * unmount a no-op, which closes the promise; the cleanup clears the timer, which
 * closes the timer. One of the two is not enough: without `live` the microtask
 * still calls setState after teardown, and without the cleanup the 1.5-second
 * timer still fires into the next environment.
 */
export function useCopiedFlag(resetAfterMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = useRef(true);

  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  const markCopied = useCallback(() => {
    if (!live.current) return;
    setCopied(true);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      if (live.current) setCopied(false);
    }, resetAfterMs);
  }, [resetAfterMs]);

  return [copied, markCopied] as const;
}
