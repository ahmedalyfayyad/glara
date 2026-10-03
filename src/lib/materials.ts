import { prisma } from "./prisma";

/** Surcharge per price tier, in whole store-currency units. */
export const MATERIAL_TIER_DELTA = [0, 240, 520] as const;

export const MATERIAL_CATEGORIES = [
  "wood",
  "solid",
  "stone",
  "fabric",
  "afx",
  "pattern",
] as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

export type MaterialOption = {
  code: string;
  decorNo: string;
  decorCode: string;
  name: string;
  category: string;
  family: string;
  hex: string;
  texture: string;
  priceDelta: number;
};

const selection = {
  code: true,
  decorNo: true,
  decorCode: true,
  name: true,
  category: true,
  family: true,
  hex: true,
  texture: true,
  priceTier: true,
} as const;

type Row = {
  code: string;
  decorNo: string;
  decorCode: string;
  name: string;
  category: string;
  family: string;
  hex: string;
  texture: string;
  priceTier: number;
};

function toOption(row: Row): MaterialOption {
  const { priceTier, ...rest } = row;
  return { ...rest, priceDelta: MATERIAL_TIER_DELTA[priceTier] ?? 0 };
}

export function materialDelta(priceTier: number): number {
  return MATERIAL_TIER_DELTA[priceTier] ?? 0;
}

/** The whole shade card, ordered for the lab's picker. */
export async function listMaterials(): Promise<MaterialOption[]> {
  const rows = await prisma.material.findMany({
    where: { active: true },
    select: selection,
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toOption);
}

export async function getMaterial(code: string) {
  return prisma.material.findFirst({ where: { code, active: true } });
}

/**
 * Décor names are proper nouns on a printed shade card — "Sherwood Oak" is the
 * same in a Cairo showroom as in the catalogue — so they are not translated.
 * The category and finish family are, since those are descriptions.
 */
export function groupByCategory(materials: MaterialOption[]) {
  const groups = new Map<string, MaterialOption[]>();
  for (const category of MATERIAL_CATEGORIES) groups.set(category, []);
  for (const material of materials) {
    const bucket = groups.get(material.category);
    if (bucket) bucket.push(material);
    else groups.set(material.category, [material]);
  }
  return [...groups.entries()]
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => ({ category, items }));
}
