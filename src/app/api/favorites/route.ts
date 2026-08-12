import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({ productId: z.string().min(1) });

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: user.id, productId: parsed.data.productId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.favorite.create({ data: { userId: user.id, productId: parsed.data.productId } });
  return NextResponse.json({ saved: true });
}
