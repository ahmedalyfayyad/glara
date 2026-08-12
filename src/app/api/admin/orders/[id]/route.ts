import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "in_production",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AuthError && error.kind === "forbidden" ? 403 : 401;
    return NextResponse.json({ error: "unauthorized" }, { status });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { id } = await params;
  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  });

  return NextResponse.json({ order });
}
