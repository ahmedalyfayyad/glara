import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cartViewById, getOrCreateCart, readCart } from "@/lib/cart";
import { tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const addSchema = z.object({
  productId: z.string().min(1),
  finishKey: z.string().min(1),
  sizeLabel: z.string().min(1),
  quantity: z.number().int().min(1).max(20).optional(),
  configId: z.string().min(1).nullish(),
});

const patchSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(0).max(20),
});

const deleteSchema = z.object({ itemId: z.string().min(1).optional() });

export async function GET() {
  return NextResponse.json({ cart: await readCart() });
}

export async function POST(request: Request) {
  // Adding to a cart creates a Cart row for anonymous visitors — worth a ceiling.
  const limited = tooManyRequests(request, "cart-add", 60, 10 * 60_000);
  if (limited) return limited;

  const parsed = addSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const { productId, finishKey, sizeLabel, configId = null } = parsed.data;
  const quantity = parsed.data.quantity ?? 1;

  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      finishes: true,
      sizes: true,
    },
  });
  if (!product) return NextResponse.json({ error: "product_not_found" }, { status: 404 });

  const finish = product.finishes.find((row) => row.key === finishKey);
  const size = product.sizes.find((row) => row.label === sizeLabel);
  if (!finish || !size) {
    return NextResponse.json({ error: "invalid_combination" }, { status: 400 });
  }

  // A saved Lab build carries its own price — never recompute it from the catalog.
  const config = configId
    ? await prisma.configuration.findUnique({ where: { id: configId } })
    : null;
  const unitPrice = config ? config.price : product.basePrice + finish.priceDelta + size.priceDelta;

  const { id: cartId } = await getOrCreateCart();

  const existing = await prisma.cartItem.findFirst({
    where: { cartId, productId, finishKey, sizeLabel, configId: config?.id ?? null },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(existing.quantity + quantity, 20) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        finishKey,
        sizeLabel,
        quantity,
        unitPrice,
        name: product.name,
        nameAr: product.nameAr,
        slug: product.slug,
        imageUrl: finish.imageUrl || product.images[0]?.url || "/products/linea-oak-01.png",
        configId: config?.id ?? null,
      },
    });
  }

  await prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } });
  return NextResponse.json({ cart: await cartViewById(cartId) });
}

export async function PATCH(request: Request) {
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const item = await prisma.cartItem.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) return NextResponse.json({ cart: await readCart() });

  const owned = await ownsCart(item.cartId);
  if (!owned) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: parsed.data.quantity },
    });
  }

  return NextResponse.json({ cart: await cartViewById(item.cartId) });
}

export async function DELETE(request: Request) {
  const parsed = deleteSchema.safeParse(await request.json().catch(() => ({})));
  const itemId = parsed.success ? parsed.data.itemId : undefined;

  const current = await readCart();
  if (!current.id) return NextResponse.json({ cart: current });

  if (itemId) {
    await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: current.id } });
  } else {
    await prisma.cartItem.deleteMany({ where: { cartId: current.id } });
  }

  return NextResponse.json({ cart: await cartViewById(current.id) });
}

/** The cart cookie is the only credential a guest has — check the item belongs to it. */
async function ownsCart(cartId: string): Promise<boolean> {
  const current = await readCart();
  return current.id === cartId;
}
