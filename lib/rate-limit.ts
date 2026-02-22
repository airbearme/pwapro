type RateEntry = {
  count: number;
  resetAt: number;
};

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;

const store: Map<string, RateEntry> =
  (
    globalThis as typeof globalThis & {
      __rateLimitStore?: Map<string, RateEntry>;
    }
  ).__rateLimitStore ?? new Map();

(
  globalThis as typeof globalThis & {
    __rateLimitStore?: Map<string, RateEntry>;
  }
).__rateLimitStore = store;

export function rateLimit(
  key: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}
