import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { getSessionUser } from "./auth";
import { cartToken } from "./utils";
import { orderTotals } from "./money";

const CART_COOKIE = "glara_cart";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 60; // 60 days

export type CartLine = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  nameAr: string;
  imageUrl: string;
  finishKey: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  configId: string | null;
};

export type CartView = {
  id: string | null;
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
};

export const emptyCart: CartView = {
  id: null,
  lines: [],
  count: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
};

/** Reads the cart cookie without creating anything — safe in server components. */
export async function readCart(): Promise<CartView> {
  const store = await cookies();
  const token = store.get(CART_COOKIE)?.value;
  const user = await getSessionUser();

  const cart = token
    ? await prisma.cart.findUnique({ where: { token }, include: { items: true } })
    : user
      ? await prisma.cart.findFirst({
          where: { userId: user.id },
          include: { items: true },
          orderBy: { updatedAt: "desc" },
        })
      : null;

  if (!cart) return emptyCart;
  return toView(cart.id, cart.items);
}

/**
 * Gets the caller's cart, creating one (and its cookie) if needed.
 * Only call from route handlers / server actions — it writes a cookie.
 */
export async function getOrCreateCart(): Promise<{ id: string; token: string }> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  const user = await getSessionUser();

  if (existing) {
    const cart = await prisma.cart.findUnique({ where: { token: existing } });
    if (cart) {
      // Claim an anonymous cart the moment its owner signs in.
      if (user && !cart.userId) {
        await prisma.cart.update({ where: { id: cart.id }, data: { userId: user.id } });
      }
      return { id: cart.id, token: cart.token };
    }
  }

  const token = cartToken();
  const cart = await prisma.cart.create({ data: { token, userId: user?.id ?? null } });
  store.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return { id: cart.id, token };
}

export async function cartViewById(cartId: string): Promise<CartView> {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    orderBy: { createdAt: "asc" },
  });
  return toView(cartId, items);
}

export async function clearCart(cartId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { cartId } });
}

type ItemRow = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  nameAr: string;
  imageUrl: string;
  finishKey: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  configId: string | null;
};

function toView(id: string, items: ItemRow[]): CartView {
  const lines: CartLine[] = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    nameAr: item.nameAr,
    imageUrl: item.imageUrl,
    finishKey: item.finishKey,
    sizeLabel: item.sizeLabel,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.unitPrice * item.quantity,
    configId: item.configId,
  }));

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  return { id, lines, count, ...orderTotals(subtotal) };
}
