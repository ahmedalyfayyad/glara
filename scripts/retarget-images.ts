/**
 * Point the catalogue rows at the cut-out renders.
 *
 * The studio shots were re-published as transparent WebP, so every stored URL
 * ending in a product `.jpg` now needs the new extension. A targeted rename
 * rather than a reseed: the seed wipes carts, orders and saved configurations,
 * and none of that has anything to do with a file extension.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATTERN = /^\/products\/[A-Za-z0-9_-]+\.jpg$/;

async function main() {
  const images = await prisma.productImage.findMany({ select: { id: true, url: true } });
  const finishes = await prisma.productFinish.findMany({ select: { id: true, imageUrl: true } });

  const staleImages = images.filter((image) => PATTERN.test(image.url));
  const staleFinishes = finishes.filter((finish) => PATTERN.test(finish.imageUrl));

  const swap = (url: string) => url.replace(/\.jpg$/, ".webp");

  await prisma.$transaction([
    ...staleImages.map((image) =>
      prisma.productImage.update({ where: { id: image.id }, data: { url: swap(image.url) } }),
    ),
    ...staleFinishes.map((finish) =>
      prisma.productFinish.update({
        where: { id: finish.id },
        data: { imageUrl: swap(finish.imageUrl) },
      }),
    ),
  ]);

  console.log({
    retargeted: { images: staleImages.length, finishes: staleFinishes.length },
    remainingJpg: (await prisma.productImage.findMany({ select: { url: true } })).filter((image) =>
      PATTERN.test(image.url),
    ).length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
