import { TtlCache, type Clock } from "@/lib/cache";

// Redo from scratch (Tue Oct 20). Rules are in src/lib/cache.ts, Part 3.
// TtlCache is imported so you only rebuild memoizeAsync.

// wrapper around functions so that calls are cheap
export function memoizeAsync<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  options: { ttlMs: number; key?: (...args: A) => string; now?: Clock },
): (...args: A) => Promise<R> {
  // set up ttl cache -
  // cache that stores key with resolved data from fn()
  const cache = new TtlCache<string, R>({
    ttlMs: options.ttlMs,
    now: options.now,
  });

  // local cache to store in-flight calls to fn
  const inFlightRequests = new Map<string, Promise<R>>();

  const getKey = (...args: A): string => {
    if (options.key) {
      return options.key(...args);
    }
    return JSON.stringify(args);
  };

  // Wrap fn so that if a key has been seen already, then we return the cached value.
  // If multiple calls are made with the same args, then we only want to call fn once.
  const memoizedFc = (...args: A): Promise<R> => {
    const key = getKey(...args);
    const value = cache.get(key);

    // Resolved value is in the cache
    if (value !== undefined) {
      return Promise.resolve(value);
    }

    // Check if a request is being actively made with the same key
    const inFlight = inFlightRequests.get(key);
    if (inFlight) {
      return inFlight;
    }

    // First request made with given key
    const response = fn(...args);
    inFlightRequests.set(key, response);
    response
      .then((resolved) => {
        // Once the request is resolved, store the resolved value in the cache
        cache.set(key, resolved);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // If the request succeeds or fails, we still have to mark the key as no longer being in flight
        inFlightRequests.delete(key);
      });
    return response;
  };

  return memoizedFc;
}
