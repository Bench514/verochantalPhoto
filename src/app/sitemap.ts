import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Pages publiques uniquement ; les espaces admin et client n'y figurent pas.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/portfolio", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/deroulement", priority: 0.7 },
  { path: "/bio", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    priority,
  }));
}
