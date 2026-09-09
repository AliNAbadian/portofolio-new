export const HOUR_CAP = 10;
export const DAY_CAP = 30;
export const HOUR_WINDOW_MS = 60 * 60 * 1000;
export const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;

export type RateLimitBuckets = {
  hourHits: number[];
  dayHits: number[];
};

export type ChatQuotaView = {
  remainingHour: number;
  remainingDay: number;
  retryAfterSeconds: number | null;
  limited: boolean;
};

export function pruneHits(
  hits: number[],
  now: number,
  windowMs: number,
): number[] {
  const cutoff = now - windowMs;
  return hits.filter((timestamp) => timestamp > cutoff);
}

export function pruneBuckets(
  buckets: RateLimitBuckets,
  now: number,
): RateLimitBuckets {
  return {
    hourHits: pruneHits(buckets.hourHits, now, HOUR_WINDOW_MS),
    dayHits: pruneHits(buckets.dayHits, now, DAY_WINDOW_MS),
  };
}

function retryAfterFromOldest(
  hits: number[],
  cap: number,
  windowMs: number,
  now: number,
): number | null {
  if (hits.length < cap) {
    return null;
  }

  const oldest = hits[0];
  if (oldest === undefined) {
    return null;
  }

  return Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
}

export function evaluateRateLimit(
  buckets: RateLimitBuckets,
  now: number,
): ChatQuotaView {
  const pruned = pruneBuckets(buckets, now);
  const remainingHour = Math.max(0, HOUR_CAP - pruned.hourHits.length);
  const remainingDay = Math.max(0, DAY_CAP - pruned.dayHits.length);
  const limited = remainingHour === 0 || remainingDay === 0;

  const hourRetry = retryAfterFromOldest(
    pruned.hourHits,
    HOUR_CAP,
    HOUR_WINDOW_MS,
    now,
  );
  const dayRetry = retryAfterFromOldest(
    pruned.dayHits,
    DAY_CAP,
    DAY_WINDOW_MS,
    now,
  );

  const retryAfterSeconds = limited
    ? Math.max(hourRetry ?? 0, dayRetry ?? 0) || null
    : null;

  return {
    remainingHour,
    remainingDay,
    retryAfterSeconds,
    limited,
  };
}

export function recordHit(
  buckets: RateLimitBuckets,
  now: number,
): RateLimitBuckets {
  const pruned = pruneBuckets(buckets, now);
  return {
    hourHits: [...pruned.hourHits, now],
    dayHits: [...pruned.dayHits, now],
  };
}

export function stricterQuota(
  first: ChatQuotaView,
  second: ChatQuotaView,
): ChatQuotaView {
  const remainingHour = Math.min(first.remainingHour, second.remainingHour);
  const remainingDay = Math.min(first.remainingDay, second.remainingDay);
  const limited = remainingHour === 0 || remainingDay === 0;
  const retries = [first.retryAfterSeconds, second.retryAfterSeconds].filter(
    (value): value is number => value !== null,
  );

  return {
    remainingHour,
    remainingDay,
    retryAfterSeconds: limited
      ? retries.length > 0
        ? Math.max(...retries)
        : null
      : null,
    limited,
  };
}
