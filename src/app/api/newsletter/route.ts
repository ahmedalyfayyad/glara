import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  locale: z.enum(["en", "ar"]).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalidEmail" }, { status: 400 });

  const { email, locale = "en" } = parsed.data;

  // Re-subscribing is not an error worth showing anyone.
  await prisma.subscriber.upsert({
    where: { email },
    update: { locale },
    create: { email, locale },
  });

  return NextResponse.json({ ok: true });
}
