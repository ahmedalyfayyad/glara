import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";
import { locales } from "@/i18n/config";

const STATIC_PATHS = [
  "",
  "/units",
  "/customize",
  "/contact",
  "/support/installation",
  "/support/warranty",
  "/support/care",
  "/support/faqs",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const pages = locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );

  const productPages = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${base}/${locale}/units/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  return [...pages, ...productPages];
}
