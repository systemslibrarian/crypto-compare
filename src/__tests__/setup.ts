import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

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
