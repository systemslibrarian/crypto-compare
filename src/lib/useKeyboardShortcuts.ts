"use client";

import { useEffect } from "react";

type KeyboardShortcutHandlers = {
  onFocusSearch: () => void;
  onToggleMethodology: () => void;
  onEscape: () => void;
  onNextCategory: () => void;
  onPrevCategory: () => void;
};

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      if (e.key === "Escape") {
        handlers.onEscape();
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if (isInput) return;

      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault();
        handlers.onFocusSearch();
        return;
      }

      if (e.key === "?" && e.shiftKey) {
        handlers.onToggleMethodology();
        return;
      }

      if (e.key === "ArrowRight" && !e.metaKey) {
        handlers.onNextCategory();
        return;
      }

      if (e.key === "ArrowLeft" && !e.metaKey) {
        handlers.onPrevCategory();
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
