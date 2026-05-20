import { NextResponse } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitGlobal = typeof globalThis & {
  opaRateLimitBuckets?: Map<string, RateLimitBucket>;
};

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function rateLimit(request: Request, options: RateLimitOptions) {
  const g = globalThis as RateLimitGlobal;
  g.opaRateLimitBuckets ??= new Map();

  const now = Date.now();
  const ip = getClientIp(request);
  const bucketKey = `${options.key}:${ip}`;
  const bucket = g.opaRateLimitBuckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    g.opaRateLimitBuckets.set(bucketKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  bucket.count += 1;
  if (bucket.count <= options.limit) return null;

  const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
  return NextResponse.json(
    { error: "Muitas tentativas. Tente novamente em alguns instantes." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    }
  );
}
