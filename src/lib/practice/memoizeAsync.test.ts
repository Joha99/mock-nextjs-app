import { describe, expect, it, vi } from "vitest";
import { memoizeAsync } from "@/lib/practice/memoizeAsync";

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
