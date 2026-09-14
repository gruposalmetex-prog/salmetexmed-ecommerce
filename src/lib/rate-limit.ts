import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimiterName =
  | "adminSignIn"
  | "adminUploadSignature"
  | "searchSuggestions"
  | "cartResolve"
  | "favoritesResolve"
  | "productDetails";

interface RateLimiters {
  adminSignIn: Ratelimit;
  adminUploadSignature: Ratelimit;
  searchSuggestions: Ratelimit;
  cartResolve: Ratelimit;
  favoritesResolve: Ratelimit;
  productDetails: Ratelimit;
}

let rateLimiters: RateLimiters | undefined;

function getRedisCredentials() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Las credenciales de Upstash Redis no están configuradas.");
  }

  return {
    url,
    token,
  };
}

function getRateLimiters(): RateLimiters {
  if (rateLimiters) {
    return rateLimiters;
  }

  const redis = new Redis(getRedisCredentials());

  rateLimiters = {
    adminSignIn: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "salmetexmed:rate-limit:admin-sign-in",
    }),

    adminUploadSignature: new Ratelimit({
      redis,

      limiter: Ratelimit.slidingWindow(30, "5 m"),

      analytics: true,

      prefix: "salmetexmed:rate-limit:admin-upload-signature",
    }),

    searchSuggestions: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "salmetexmed:rate-limit:search",
    }),

    cartResolve: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "salmetexmed:rate-limit:cart",
    }),

    favoritesResolve: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "salmetexmed:rate-limit:favorites",
    }),

    productDetails: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "salmetexmed:rate-limit:product-details",
    }),
  };
  return rateLimiters;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  const forwardedIp = forwardedFor?.split(",").at(0)?.trim();

  return forwardedIp || request.headers.get("x-real-ip") || "unknow";
}

async function consumeRateLimit(name: RateLimiterName, identifier: string) {
  const limiter = getRateLimiters()[name];

  const result = await limiter.limit(identifier);

  await result.pending;

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));

  return {
    success: result.success,

    headers: {
      "X-RateLimit-Limit": String(result.limit),

      "X-RateLimit-Remaining": String(result.remaining),

      "X-RateLimit-Reset": String(result.reset),

      "Retry-After": String(retryAfter),
    },
  };
}

export async function checkRateLimit(name: RateLimiterName, request: Request) {
  const clientIp = getClientIp(request);

  return consumeRateLimit(name, `ip:${clientIp}`);
}

export async function checkRateLimitByIdentifier(
  name: RateLimiterName,
  identifier: string,
) {
  return consumeRateLimit(name, identifier);
}
