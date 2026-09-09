import { createHash, randomUUID } from "node:crypto";
import {
  evaluateRateLimit,
  pruneBuckets,
  recordHit,
  stricterQuota,
  type ChatQuotaView,
  type RateLimitBuckets,
} from "../model/chat-limits";

export const VISITOR_COOKIE_NAME = "about_me_chat_vid";

const visitorStore = new Map<string, RateLimitBuckets>();
const ipStore = new Map<string, RateLimitBuckets>();

function emptyBuckets(): RateLimitBuckets {
  return { hourHits: [], dayHits: [] };
}

function getBuckets(
  store: Map<string, RateLimitBuckets>,
  key: string,
): RateLimitBuckets {
  return store.get(key) ?? emptyBuckets();
}

export function hashVisitorId(visitorId: string): string {
  return createHash("sha256").update(visitorId).digest("hex").slice(0, 16);
}

export function readVisitorId(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === VISITOR_COOKIE_NAME) {
      const value = rest.join("=").trim();
      return value || null;
    }
  }

  return null;
}

export function createVisitorId(): string {
  return randomUUID();
}

export function isCrossOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin !== new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function buildVisitorCookie(visitorId: string, request: Request): string {
  const crossOrigin = isCrossOriginRequest(request);
  const secure =
    new URL(request.url).protocol === "https:" || crossOrigin;
  const sameSite = crossOrigin ? "None" : "Lax";
  const parts = [
    `${VISITOR_COOKIE_NAME}=${visitorId}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${sameSite}`,
    "Max-Age=2592000",
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function resolveIpKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `ip:${hashVisitorId(ip)}`;
}

export function peekQuota(
  visitorId: string,
  ipKey: string,
  now = Date.now(),
): ChatQuotaView {
  const visitor = evaluateRateLimit(getBuckets(visitorStore, visitorId), now);
  const ip = evaluateRateLimit(getBuckets(ipStore, ipKey), now);
  return stricterQuota(visitor, ip);
}

export function tryConsumeQuota(
  visitorId: string,
  ipKey: string,
  now = Date.now(),
): { ok: true; quota: ChatQuotaView } | { ok: false; quota: ChatQuotaView } {
  const current = peekQuota(visitorId, ipKey, now);
  if (current.limited) {
    return { ok: false, quota: current };
  }

  visitorStore.set(
    visitorId,
    recordHit(getBuckets(visitorStore, visitorId), now),
  );
  ipStore.set(ipKey, recordHit(getBuckets(ipStore, ipKey), now));

  visitorStore.set(
    visitorId,
    pruneBuckets(getBuckets(visitorStore, visitorId), now),
  );
  ipStore.set(ipKey, pruneBuckets(getBuckets(ipStore, ipKey), now));

  return { ok: true, quota: peekQuota(visitorId, ipKey, now) };
}
