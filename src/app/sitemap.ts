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

  /*
   * The sitemap is generated at build time. A database that is unreachable then
   * should cost us the product URLs, not the whole deployment — `migrate deploy`
   * in the build script is what fails loudly when the connection is genuinely bad.
   */
  let products: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.warn("sitemap: catalogue unavailable, emitting static routes only", error);
  }

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
