import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

/* Unmount everything rendered by a test, after that test.

   React Testing Library registers this itself -- but only when a global
   `afterEach` exists, which is how it detects a supporting runner:

     // @testing-library/react/dist/index.js
     if (typeof process === 'undefined' || !process.env?.RTL_SKIP_AUTO_CLEANUP) {
       if (typeof afterEach === 'function') { afterEach(() => { cleanup() }) }
     }

   This project does not set `test.globals`, so vitest injects no global
   `afterEach`, `typeof afterEach` is "undefined", and that registration never
   happened. Every `render()` therefore stayed mounted for the rest of its file:
   measured directly -- a node rendered in one test was still queryable in the
   next one.

   Live components keep their effects alive, so their timers, animation frames
   and document listeners kept running too. When the file finished and vitest
   tore the jsdom environment down with that work still queued, the callbacks
   ran against a destroyed environment and threw `ReferenceError: window is not
   defined`, which vitest reports as an unhandled error against whichever file
   happened to be executing at that moment -- so the failure landed on
   innocent files and moved around with scheduling and machine load.

   Registering it explicitly is the fix for that cause. Six test files already
   called cleanup by hand, which is the same intent applied unevenly. */
afterEach(cleanup);

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
