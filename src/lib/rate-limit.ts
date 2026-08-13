import { NextResponse } from "next/server";

type Window = { count: number; resetAt: number };

/*
 * Fixed-window limiter kept in module memory.
 *
 * Serverless instances do not share this map, so the real ceiling is
 * (limit x warm instances) rather than a hard global cap. That is fine for what
 * this defends against: a single client hammering the contact form, the
 * newsletter, or a login password list. A distributed limiter (Upstash, Vercel
 * KV) is the upgrade path if the site ever attracts a determined attacker.
 */
const windows = new Map<string, Window>();

/** Stops the map from growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (windows.size < 5000) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimit = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): RateLimit {
  const now = Date.now();
  sweep(now);

  const key = `${bucket}:${clientIp(request)}`;
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  current.count += 1;
  if (current.count > limit) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  return { ok: true };
}

/** Returns a 429 response, or null when the caller is within its allowance. */
export function tooManyRequests(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const result = rateLimit(request, bucket, limit, windowMs);
  if (result.ok) return null;

  return NextResponse.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": String(result.retryAfter) } },
  );
}
