import { prisma } from "./prisma";
import type { Locale } from "@/i18n/config";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  collection: string;
  collectionAr: string;
  type: string;
  tagline: string;
  taglineAr: string;
  basePrice: number;
  isNew: boolean;
  featured: boolean;
  image: string;
  imageAlt: string;
  hoverImage: string | null;
  finishKeys: string[];
  swatches: Array<{ key: string; swatch: string; label: string; labelAr: string }>;
};

const listSelect = {
  id: true,
  slug: true,
  name: true,
  nameAr: true,
  collection: true,
  collectionAr: true,
  type: true,
  tagline: true,
  taglineAr: true,
  basePrice: true,
  isNew: true,
  featured: true,
  images: { orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
  finishes: {
    orderBy: { sortOrder: "asc" },
    select: { key: true, swatch: true, label: true, labelAr: true },
  },
} as const;

type ListRow = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  collection: string;
  collectionAr: string;
  type: string;
  tagline: string;
  taglineAr: string;
  basePrice: number;
  isNew: boolean;
  featured: boolean;
  images: Array<{ url: string; alt: string }>;
  finishes: Array<{ key: string; swatch: string; label: string; labelAr: string }>;
};

function toListItem(row: ListRow): ProductListItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameAr: row.nameAr,
    collection: row.collection,
    collectionAr: row.collectionAr,
    type: row.type,
    tagline: row.tagline,
    taglineAr: row.taglineAr,
    basePrice: row.basePrice,
    isNew: row.isNew,
    featured: row.featured,
    image: row.images[0]?.url ?? "/products/linea-oak-01.png",
    imageAlt: row.images[0]?.alt ?? row.name,
    hoverImage: row.images[1]?.url ?? null,
    finishKeys: row.finishes.map((finish) => finish.key),
    swatches: row.finishes,
  };
}

export type ProductFilters = {
  type?: string;
  finish?: string;
  q?: string;
  sort?: "featured" | "priceAsc" | "priceDesc" | "newest";
};

export async function listProducts(filters: ProductFilters = {}): Promise<ProductListItem[]> {
  const { type, finish, q, sort = "featured" } = filters;

  const rows = await prisma.product.findMany({
    where: {
      active: true,
      ...(type && type !== "all" ? { type } : {}),
      ...(finish && finish !== "all" ? { finishes: { some: { key: finish } } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { nameAr: { contains: q } },
              { collection: { contains: q } },
              { collectionAr: { contains: q } },
              { tagline: { contains: q } },
              { taglineAr: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    select: listSelect,
    orderBy:
      sort === "priceAsc"
        ? [{ basePrice: "asc" }]
        : sort === "priceDesc"
          ? [{ basePrice: "desc" }]
          : sort === "newest"
            ? [{ createdAt: "desc" }, { sortOrder: "asc" }]
            : [{ featured: "desc" }, { sortOrder: "asc" }],
  });

  return rows.map(toListItem);
}

export async function featuredProducts(limit = 6): Promise<ProductListItem[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    select: listSelect,
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  if (rows.length >= limit) return rows.map(toListItem);

  const fill = await prisma.product.findMany({
    where: { active: true, featured: false },
    select: listSelect,
    orderBy: { sortOrder: "asc" },
    take: limit - rows.length,
  });
  return [...rows, ...fill].map(toListItem);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      finishes: { orderBy: { sortOrder: "asc" } },
      sizes: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function relatedProducts(
  productId: string,
  type: string,
  limit = 3,
): Promise<ProductListItem[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, id: { not: productId }, type },
    select: listSelect,
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  if (rows.length >= limit) return rows.map(toListItem);

  const fill = await prisma.product.findMany({
    where: { active: true, id: { not: productId }, type: { not: type } },
    select: listSelect,
    orderBy: { sortOrder: "asc" },
    take: limit - rows.length,
  });
  return [...rows, ...fill].map(toListItem);
}

/** Base units offered in the customisation lab. */
export async function labProducts() {
  return prisma.product.findMany({
    where: { active: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      finishes: { orderBy: { sortOrder: "asc" } },
      sizes: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export function localised<T extends Record<string, unknown>>(
  row: T,
  key: string,
  locale: Locale,
): string {
  const field = locale === "ar" ? `${key}Ar` : key;
  const value = row[field] ?? row[key];
  return typeof value === "string" ? value : "";
}
