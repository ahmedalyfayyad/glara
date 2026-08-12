import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    return NextResponse.json({ error: field === "password" ? "shortPassword" : "invalid" }, { status: 400 });
  }

  const { name, email, phone, password } = parsed.data;

  const taken = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (taken) return NextResponse.json({ error: "emailTaken" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await hashPassword(password),
    },
    select: { id: true },
  });

  await createSession(user.id);

  // Adopt whatever the visitor put in the cart before signing up.
  const token = (await cookies()).get("glara_cart")?.value;
  if (token) {
    await prisma.cart.updateMany({ where: { token, userId: null }, data: { userId: user.id } });
  }

  return NextResponse.json({ ok: true });
}
