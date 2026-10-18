/**
 * 🛠️ FEATURE 10 — build a small in-memory cache from scratch.
 *
 * Tests: src/lib/__tests__/cache.test.ts   (run `npm test -- cache`)
 *
 * This is plain TypeScript with no React and no Next. It's the kind of
 * "practical, multi-part" task that shows up in live-coding interviews, so
 * practice it like one: talk through the data structure before you code.
 *
 * Time is injected through `now` (defaults to Date.now) so tests can control
 * the clock instead of sleeping. Same idea as passing `now` into
 * calculateCartTotals.
 *
 * ─────────────────────────── PART 1: TtlCache ───────────────────────────
 *
 * A key/value cache where every entry expires `ttlMs` after it was SET.
 *
 *   const cache = new TtlCache<string, number>({ ttlMs: 1000 });
 *   cache.set("a", 1);
 *   cache.get("a");        // 1
 *   // ...1000ms later
 *   cache.get("a");        // undefined (expired, and removed)
 *
 * Rules:
 *   - get(key): the value, or undefined if missing OR expired. An expired
 *     entry is deleted when you discover it ("lazy expiry").
 *   - An entry is expired when now >= expiresAt (exactly at ttl = expired).
 *   - set(key, value, ttlMs?): the per-call ttlMs overrides the default.
 *     Setting an existing key replaces the value AND resets its expiry.
 *   - has(key): like get, but returns a boolean. Expired counts as missing.
 *   - delete(key): returns true if something was removed.
 *   - clear(): removes everything.
 *   - size: the number of entries that are NOT expired.
 *
 * ─────────────────────── PART 2: maxSize + LRU ────────────────────────
 *
 * Optional `maxSize`. When a set() would make the cache hold more than
 * maxSize entries, evict the LEAST RECENTLY USED entry first.
 *   - "Used" means set() or a successful get().
 *   - Hint: a JS Map remembers insertion order, and `map.keys().next().value`
 *     is the oldest key. To mark a key as most-recently-used, delete it and
 *     re-insert it.
 *
 * ───────────────────── PART 3: memoizeAsync ──────────────────────
 *
 * Wrap an async function (e.g. getPromoCode) so repeated calls are cheap.
 *
 *   const cachedGet = memoizeAsync(getPromoCode, { ttlMs: 60_000 });
 *
 * Rules:
 *   - Calls with the same key within ttlMs return the cached result without
 *     calling fn again.
 *   - DEDUPE IN-FLIGHT CALLS: if a call for a key is still pending, a second
 *     call with the same key must return the SAME promise and not start a
 *     second request. (Think: a user double-clicks "Apply".)
 *   - Failures are NOT cached. If the promise rejects, the next call tries
 *     again. (Caching an error would make a temporary blip permanent.)
 *   - The key defaults to JSON.stringify(args). options.key overrides it.
 *   - The TTL starts when the promise RESOLVES, not when the call starts.
 */

export type Clock = () => number;

export class TtlCache<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>();
  private clock = Date.now;

  constructor(
    private options: { ttlMs: number; maxSize?: number; now?: Clock },
  ) {}

  private removeExpired(): number {
    const expired: K[] = [];
    const currentTime = this.getCurrentTime();

    this.store.forEach((value, key) => {
      if (value.expiresAt <= currentTime) {
        expired.push(key);
      }
    });

    for (const id of expired) {
      this.store.delete(id);
    }

    return this.store.size;
  }

  private isExpired(key: K): boolean {
    const storeValue = this.store.get(key);
    const currentTime = this.options.now ? this.options.now() : this.clock();

    return storeValue !== undefined && storeValue.expiresAt <= currentTime;
  }

  private getCurrentTime(): number {
    return this.options.now ? this.options.now() : this.clock();
  }

  get(key: K): V | undefined {
    const storeValue = this.store.get(key);
    const isExpired = this.isExpired(key);

    if (!storeValue) {
      return undefined;
    }

    if (isExpired) {
      this.store.delete(key);
      return undefined;
    }

    // Add the store value again so that it's considered as more recently "used"
    this.store.delete(key);
    this.store.set(key, storeValue);

    return storeValue.value;
  }

  set(key: K, value: V, ttlMs?: number): void {
    const currentTime = this.getCurrentTime();
    const expiresAt =
      currentTime + (ttlMs !== undefined ? ttlMs : this.options.ttlMs);
    const upToDateSize = this.removeExpired();

    if (this.store.has(key)) {
      this.store.delete(key);
      this.store.set(key, { value, expiresAt });
      return;
    }

    if (this.options.maxSize && upToDateSize >= this.options.maxSize) {
      this.store.delete(this.store.keys().next().value!);
    }

    this.store.set(key, { value, expiresAt });
  }

  has(key: K): boolean {
    const isExpired = this.isExpired(key);

    if (isExpired) {
      this.store.delete(key);
      return false;
    }

    return this.store.has(key);
  }

  delete(key: K): boolean {
    if (this.store.has(key)) {
      const isExpired = this.isExpired(key);
      this.store.delete(key);
      return !isExpired;
    }

    return false;
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.removeExpired();
  }
}

export function memoizeAsync<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  options: { ttlMs: number; key?: (...args: A) => string; now?: Clock },
): (...args: A) => Promise<R> {
  const ttlCache = new TtlCache<string, R>({
    ttlMs: options.ttlMs,
    now: options.now,
  });

  const inProgressCache: Map<string, Promise<R>> = new Map();

  const getKey = (...args: A) => {
    if (options.key) {
      return options.key(...args);
    }
    return JSON.stringify(args);
  };

  const memoized = (...args: A): Promise<R> => {
    const computedKey = getKey(...args);
    const cacheValue = ttlCache.get(computedKey);
    const inProgressValue = inProgressCache.get(computedKey);

    if (cacheValue) {
      return Promise.resolve(cacheValue);
    }

    if (inProgressValue) {
      return inProgressValue;
    }

    const newPromise = fn(...args)
      .then((value) => {
        inProgressCache.delete(computedKey);
        ttlCache.set(computedKey, value);
        return value;
      })
      .catch((err) => {
        inProgressCache.delete(computedKey);
        throw err;
      });
    inProgressCache.set(computedKey, newPromise);
    return newPromise;
  };

  return memoized;
}
