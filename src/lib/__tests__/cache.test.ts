import { describe, expect, it, vi } from "vitest";
import { TtlCache, memoizeAsync } from "@/lib/cache";

/** A fake clock we can move forward by hand. */
function fakeClock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

describe("TtlCache: Part 1 (expiry)", () => {
  it("stores and returns values", () => {
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: fakeClock().now });
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
    expect(cache.has("a")).toBe(true);
    expect(cache.get("missing")).toBeUndefined();
    expect(cache.has("missing")).toBe(false);
  });

  it("expires entries exactly at ttl", () => {
    const clock = fakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    cache.set("a", 1);
    clock.advance(999);
    expect(cache.get("a")).toBe(1);
    clock.advance(1);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.has("a")).toBe(false);
  });

  it("supports a per-entry ttl override", () => {
    const clock = fakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    cache.set("short", 1, 100);
    cache.set("long", 2);
    clock.advance(100);
    expect(cache.get("short")).toBeUndefined();
    expect(cache.get("long")).toBe(2);
  });

  it("re-setting a key replaces the value and resets expiry", () => {
    const clock = fakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    cache.set("a", 1);
    clock.advance(800);
    cache.set("a", 2);
    clock.advance(800);
    expect(cache.get("a")).toBe(2);
  });

  it("can cache falsy values like 0, empty string and null", () => {
    const cache = new TtlCache<string, unknown>({ ttlMs: 1000, now: fakeClock().now });
    cache.set("zero", 0);
    cache.set("empty", "");
    cache.set("null", null);
    expect(cache.get("zero")).toBe(0);
    expect(cache.has("empty")).toBe(true);
    expect(cache.has("null")).toBe(true);
  });

  it("delete, clear and size", () => {
    const clock = fakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    cache.set("a", 1);
    cache.set("b", 2, 10);
    expect(cache.size).toBe(2);
    clock.advance(10);
    expect(cache.size).toBe(1); // "b" expired
    expect(cache.delete("a")).toBe(true);
    expect(cache.delete("a")).toBe(false);
    cache.set("c", 3);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});

describe("TtlCache: Part 2 (maxSize + LRU)", () => {
  it("evicts the least recently set entry when full", () => {
    const cache = new TtlCache<string, number>({ ttlMs: 1000, maxSize: 2, now: fakeClock().now });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.has("a")).toBe(false);
    expect(cache.has("b")).toBe(true);
    expect(cache.has("c")).toBe(true);
  });

  it("a get() counts as a use", () => {
    const cache = new TtlCache<string, number>({ ttlMs: 1000, maxSize: 2, now: fakeClock().now });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a"); // "a" is now most recently used, so "b" is the LRU
    cache.set("c", 3);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
  });

  it("updating an existing key does not evict anything", () => {
    const cache = new TtlCache<string, number>({ ttlMs: 1000, maxSize: 2, now: fakeClock().now });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("a", 10);
    expect(cache.size).toBe(2);
    expect(cache.get("a")).toBe(10);
    expect(cache.get("b")).toBe(2);
  });
});

describe("memoizeAsync: Part 3", () => {
  it("caches resolved results within ttl", async () => {
    const clock = fakeClock();
    const fn = vi.fn(async (x: number) => x * 2);
    const cached = memoizeAsync(fn, { ttlMs: 1000, now: clock.now });

    expect(await cached(2)).toBe(4);
    expect(await cached(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(await cached(3)).toBe(6); // different args = different key
    expect(fn).toHaveBeenCalledTimes(2);

    clock.advance(1000);
    await cached(2);
    expect(fn).toHaveBeenCalledTimes(3); // expired, so called again
  });

  it("dedupes concurrent calls with the same key", async () => {
    let resolve!: (v: string) => void;
    const fn = vi.fn(() => new Promise<string>((r) => (resolve = r)));
    const cached = memoizeAsync(fn, { ttlMs: 1000, now: fakeClock().now });

    const p1 = cached();
    const p2 = cached();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(p1).toBe(p2);

    resolve("done");
    expect(await p1).toBe("done");
  });

  it("does not cache failures", async () => {
    const fn = vi
      .fn<(code: string) => Promise<string>>()
      .mockRejectedValueOnce(new Error("network blip"))
      .mockResolvedValueOnce("SAVE10");
    const cached = memoizeAsync(fn, { ttlMs: 1000, now: fakeClock().now });

    await expect(cached("save10")).rejects.toThrow("network blip");
    expect(await cached("save10")).toBe("SAVE10");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("starts the ttl when the promise resolves, not when it starts", async () => {
    const clock = fakeClock();
    let resolve!: (v: number) => void;
    const fn = vi.fn(() => new Promise<number>((r) => (resolve = r)));
    const cached = memoizeAsync(fn, { ttlMs: 1000, now: clock.now });

    const p = cached();
    clock.advance(5000); // slow request
    resolve(1);
    await p;
    clock.advance(999);
    await cached();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("supports a custom key function", async () => {
    const fn = vi.fn(async (code: string) => code.toUpperCase());
    const cached = memoizeAsync(fn, { ttlMs: 1000, key: (code) => code.trim().toLowerCase(), now: fakeClock().now });
    await cached("save10");
    await cached("  SAVE10 ");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
