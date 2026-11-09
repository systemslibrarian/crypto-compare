import { useCallback, useEffect, useRef, useState } from "react";

/** A self-resetting "copied" flag whose reset timer belongs to the component.
 *
 * Four call sites used to start the reset inside the clipboard promise
 * continuation of an event handler:
 *
 *     navigator.clipboard.writeText(text).then(() => {
 *       setCopied(true);
 *       setTimeout(() => setCopied(false), 1500);
 *     });
 *
 * Nothing held that timer id, so nothing could cancel it — not an effect
 * cleanup, and therefore not an unmount either. A test that clicked copy and
 * finished left a 1500ms timer pending with no owner.
 *
 * When it fires after the test environment is gone, `setCopied` reaches
 * React's dispatchSetState -> requestUpdateLane -> resolveUpdatePriority,
 * which reads a bare `window.event` with no mounted-fiber check ahead of it:
 *
 *     ReferenceError: window is not defined
 *      at resolveUpdatePriority react-dom-client.development.js:1498
 *      at requestUpdateLane
 *      at dispatchSetState
 *
 * Holding the id in a ref and clearing it on unmount makes the timer the
 * component's, so unmounting cancels it. Re-copying before the previous reset
 * lands also clears the old timer rather than racing it. */
const RESET_MS = 1500;

export function useCopiedFlag(resetMs: number = RESET_MS) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReset = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clearReset, [clearReset]);

  const markCopied = useCallback(() => {
    clearReset();
    setCopied(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setCopied(false);
    }, resetMs);
  }, [clearReset, resetMs]);

  return [copied, markCopied] as const;
}
