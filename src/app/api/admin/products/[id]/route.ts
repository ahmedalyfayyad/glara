import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z
  .object({
    active: z.boolean().optional(),
    featured: z.boolean().optional(),
    isNew: z.boolean().optional(),
    basePrice: z.number().int().min(0).max(1_000_000).optional(),
    sortOrder: z.number().int().min(0).max(9999).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: "empty" });

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
  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
    select: { id: true, active: true, featured: true, isNew: true, basePrice: true },
  });

  return NextResponse.json({ product });
}
