import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { clearCart, readCart } from "@/lib/cart";
import { orderTotals } from "@/lib/money";
import { orderNumber } from "@/lib/utils";
import { tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
  customerName: z.string().trim().min(2).max(80),
  customerEmail: z.string().trim().toLowerCase().email(),
  customerPhone: z.string().trim().min(6).max(30),
  addressLine: z.string().trim().min(4).max(200),
  city: z.string().trim().min(2).max(80),
  governorate: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  paymentMethod: z.enum(["cod", "bank"]),
});

export async function POST(request: Request) {
  const limited = tooManyRequests(request, "orders", 10, 60 * 60_000);
  if (limited) return limited;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const cart = await readCart();
  if (!cart.id || cart.lines.length === 0) {
    return NextResponse.json({ error: "empty_cart" }, { status: 409 });
  }

  const user = await getSessionUser();
  const totals = orderTotals(cart.subtotal);
  const data = parsed.data;

  const order = await prisma.order.create({
    data: {
      number: orderNumber(),
      userId: user?.id ?? null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      addressLine: data.addressLine,
      city: data.city,
      governorate: data.governorate,
      postalCode: data.postalCode || null,
      notes: data.notes || null,
      paymentMethod: data.paymentMethod,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      items: {
        create: cart.lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          nameAr: line.nameAr,
          slug: line.slug,
          imageUrl: line.imageUrl,
          finishKey: line.finishKey,
          sizeLabel: line.sizeLabel,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          lineTotal: line.lineTotal,
          configId: line.configId,
        })),
      },
    },
    select: { number: true },
  });

  await clearCart(cart.id);

  return NextResponse.json({ order });
}
