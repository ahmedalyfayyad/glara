import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/en/admin", "/ar/admin", "/en/account", "/ar/account", "/en/checkout", "/ar/checkout"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
