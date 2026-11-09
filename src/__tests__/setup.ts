import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

function installStorage(name: "localStorage" | "sessionStorage") {
  Object.defineProperty(window, name, {
    configurable: true,
    writable: true,
    value: new MemoryStorage(),
  });
}

installStorage("localStorage");
installStorage("sessionStorage");

beforeEach(() => {
  installStorage("localStorage");
  installStorage("sessionStorage");
});

/* UNMOUNT WHAT EACH TEST RENDERED.
 *
 * Testing Library auto-cleans only when a global `afterEach` exists -- its own
 * index.js gates on `typeof afterEach === "function"`. This project runs Vitest
 * WITHOUT globals (every test imports describe/it/expect from "vitest"), so that
 * check was false and cleanup never ran: 52 render() calls across 43 files stayed
 * mounted for the whole file, and were still mounted when the file's jsdom was
 * destroyed.
 *
 * That is the leak in crypto-compare#59 that no app timer explains. React's
 * scheduler had queued work for those trees; its setImmediate callback then ran
 * in the NEXT file's context, where `window` is gone --
 *
 *   ReferenceError: window is not defined
 *     at react-dom-client.development.js:19555
 *     at Immediate.performWorkUntilDeadline (scheduler.development.js:45)
 *     at process.processImmediate (node:internal/timers:484)
 *
 * -- an error attributed to whichever file was running. It also explains the
 * named failures directly: a file's second render left the first one in
 * document.body, so a findByRole query searched two or three copies of the app.
 *
 * Measured, not assumed: before this, a probe rendering in one test and reading
 * document.body in the next saw `body="probe" containers=1`. It is empty now.
 */
afterEach(() => {
  cleanup();
});
