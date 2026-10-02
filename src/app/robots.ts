import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Les espaces admin et client (et les photos de séance qu'ils servent) sont
// privés : on demande aux moteurs de ne pas les explorer.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/client", "/session-photos"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
