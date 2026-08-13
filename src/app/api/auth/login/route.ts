import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  // Ten attempts per quarter hour — generous for a typo, useless for a word list.
  const limited = tooManyRequests(request, "login", 10, 15 * 60_000);
  if (limited) return limited;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalidCredentials" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;

  if (!user || !ok) {
    return NextResponse.json({ error: "invalidCredentials" }, { status: 401 });
  }

  await createSession(user.id);

  const token = (await cookies()).get("glara_cart")?.value;
  if (token) {
    await prisma.cart.updateMany({ where: { token, userId: null }, data: { userId: user.id } });
  }

  return NextResponse.json({ ok: true, role: user.role });
}
