import type { MetadataRoute } from "next";

const BASE_URL = "https://crypto-compare.systemslibrarian.dev";

// Every statically-exported route. Keep in sync with src/app/*/page.tsx.
const ROUTES = [
  "",
  "about",
  "advisor",
  "checklist",
  "implementations",
  "labs",
  "migrate",
  "safe-defaults",
  "stacks",
  "visuals",
] as const;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: route ? `${BASE_URL}/${route}/` : `${BASE_URL}/`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
