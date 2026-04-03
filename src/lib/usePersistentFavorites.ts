import { useEffect, useState } from "react";

const DEFAULT_STORAGE_KEY = "crypto-compare-favorites";

export function readFavorites(storageKey = DEFAULT_STORAGE_KEY): string[] {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function usePersistentFavorites(storageKey = DEFAULT_STORAGE_KEY) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return readFavorites(storageKey);
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {
      // Ignore storage failures and keep the in-memory state.
    }
  }, [favorites, storageKey]);

  const toggleFavorite = (id: string) => {
    setFavorites((previous) => (previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]));
  };

  return { favorites, setFavorites, toggleFavorite };
}