import { PrismaClient } from "@prisma/client";

/**
 * Neon scales the compute to zero when idle, so the first query after a quiet
 * spell has to wait for it to wake. Prisma's default 5s connect timeout is
 * shorter than that cold start, which surfaces as a 500 on the first request
 * rather than a slow one. The connection string is managed by the Vercel
 * integration, so the timeout is appended here instead of in the env var.
 */
function withConnectTimeout(url: string | undefined, seconds: number): string | undefined {
  if (!url || url.includes("connect_timeout=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}connect_timeout=${seconds}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: withConnectTimeout(process.env.DATABASE_URL, 20),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
