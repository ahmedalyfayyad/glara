-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "materialCode" TEXT;

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "decorNo" TEXT NOT NULL,
    "decorCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "texture" TEXT NOT NULL,
    "priceTier" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_code_key" ON "Material"("code");

-- CreateIndex
CREATE INDEX "Material_category_idx" ON "Material"("category");

-- CreateIndex
CREATE INDEX "Material_active_sortOrder_idx" ON "Material"("active", "sortOrder");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_materialCode_fkey" FOREIGN KEY ("materialCode") REFERENCES "Material"("code") ON DELETE SET NULL ON UPDATE CASCADE;
