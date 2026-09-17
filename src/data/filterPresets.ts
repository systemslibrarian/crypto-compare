/** Built-in filter presets for common use cases. */

export type FilterPreset = {
  id: string;
  label: string;
  icon: string;
  description: string;
  filters: {
    globalSearch?: boolean;
    pqOnly?: boolean;
    standardOnly?: boolean;
    nistOnly?: boolean;
    deployedOnly?: boolean;
    showDefaults?: boolean;
    country?: string;
    sortBy?: string;
    search?: string;
  };
};

export const FILTER_PRESETS: readonly FilterPreset[] = [
  {
    id: "web-crypto",
    label: "Web Crypto API",
    icon: "🌐",
    description: "Standardized, widely deployed algorithms (Web Crypto compatible)",
    filters: { globalSearch: true, standardOnly: true, deployedOnly: true, sortBy: "name" },
  },
  {
    id: "pq-ready",
    label: "Post-Quantum Ready",
    icon: "🛡️",
    description: "Algorithms safe against quantum computers",
    filters: { globalSearch: true, pqOnly: true, sortBy: "name" },
  },
  {
    id: "nist-approved",
    label: "NIST Approved",
    icon: "🏛️",
    description: "NIST FIPS-standardized algorithms only",
    filters: { globalSearch: true, nistOnly: true, standardOnly: true },
  },
  {
    id: "iot-constrained",
    label: "IoT / Constrained",
    icon: "📡",
    description: "Widely deployed, standards-backed algorithms for resource-limited devices",
    filters: { globalSearch: true, deployedOnly: true, standardOnly: true, sortBy: "name" },
  },
  {
    id: "reviewed-defaults",
    label: "Reviewed Defaults",
    icon: "🔒",
    description: "Curated defaults backed by final standards or specifications",
    filters: { globalSearch: true, sortBy: "name", standardOnly: true, showDefaults: true },
  },
  {
    id: "battle-tested",
    label: "Battle-Tested",
    icon: "⚔️",
    description: "Widely deployed, standards-backed algorithms",
    filters: { globalSearch: true, deployedOnly: true, standardOnly: true, sortBy: "name" },
  },
] as const;
