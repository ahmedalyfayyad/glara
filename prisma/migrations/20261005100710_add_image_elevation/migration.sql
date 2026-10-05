-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "elevation" BOOLEAN NOT NULL DEFAULT false;

-- Backfill the shots that are squared on to the unit, so the hero orbit can ask
-- for a front elevation instead of taking whichever image happens to be first.
-- Seeded databases get this from the seed; this is for the rows already stored.
-- The tower-system compositions are left out on purpose: the vanity faces front
-- but the tall cabinet beside it is turned.
UPDATE "ProductImage" SET "elevation" = true WHERE "url" IN (
  '/products/atlas-walnut-double-vanity-02.webp',
  '/products/basalt-stone-vanity-02.webp',
  '/products/cairo-terrazzo-vanity-02.webp',
  '/products/dune-sand-vanity-02.webp',
  '/products/luna-double-vanity-02.webp',
  '/products/mono-concrete-vanity-02.webp',
  '/products/ruba-marble-vanity-02.webp',
  '/products/siwa-compact-vanity-02.webp',
  '/products/vela-fluted-oak-vanity-02.webp',
  '/products/vela-fluted-tall-cabinet-02.webp',
  '/products/verde-floating-vanity-02.webp',
  '/products/linea-oak-01.png',
  '/products/black-01.png',
  '/products/walnut-open-01.png',
  '/products/oak-wide-01.png'
);
