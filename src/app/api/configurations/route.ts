import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { configCode } from "@/lib/utils";
import { configurationPrice } from "@/lib/pricing";
import { getMaterial, materialDelta } from "@/lib/materials";

export const dynamic = "force-dynamic";

const schema = z.object({
  productId: z.string().min(1),
  finishKey: z.string().min(1),
  materialCode: z.string().min(1).nullish(),
  sizeLabel: z.string().min(1),
  hardware: z.enum(["brushed", "black", "gold"]),
  basin: z.enum(["integrated", "vessel", "double"]),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { productId, finishKey, materialCode, sizeLabel, hardware, basin, notes } = parsed.data;

  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
    include: { finishes: true, sizes: true },
  });
  if (!product) return NextResponse.json({ error: "product_not_found" }, { status: 404 });

  const finish = product.finishes.find((row) => row.key === finishKey);
  const size = product.sizes.find((row) => row.label === sizeLabel);
  if (!finish || !size) {
    return NextResponse.json({ error: "invalid_combination" }, { status: 400 });
  }

  // An unknown décor code is a stale client, not a cheaper unit — refuse it
  // rather than quietly falling back to the finish price.
  const material = materialCode ? await getMaterial(materialCode) : null;
  if (materialCode && !material) {
    return NextResponse.json({ error: "invalid_material" }, { status: 400 });
  }

  const user = await getSessionUser();
  // One surface, one surcharge: the décor replaces the finish delta.
  const price = configurationPrice(
    product.basePrice,
    material ? materialDelta(material.priceTier) : finish.priceDelta,
    size.priceDelta,
    hardware,
    basin,
  );

  const config = await prisma.configuration.create({
    data: {
      code: configCode(),
      productId: product.id,
      userId: user?.id ?? null,
      finishKey,
      materialCode: material?.code ?? null,
      sizeLabel,
      hardware,
      basin,
      notes: notes || null,
      price,
    },
    select: { id: true, code: true, price: true },
  });

  return NextResponse.json({ configuration: config });
}
