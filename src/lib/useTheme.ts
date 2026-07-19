"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("crypto-compare-theme");
  if (stored === "light" || stored === "dark") return stored;
  // Default to dark regardless of the OS `prefers-color-scheme`. The site is
  // designed dark-first; light is opt-in via the header toggle only.
  return "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("crypto-compare-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
