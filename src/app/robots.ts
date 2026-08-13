import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/en/admin", "/ar/admin", "/en/account", "/ar/account", "/en/checkout", "/ar/checkout"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
