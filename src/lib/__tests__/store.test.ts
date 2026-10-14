import { describe, expect, it, vi } from "vitest";
import { createStore } from "@/lib/store";

describe("createStore", () => {
  it("returns the initial state", () => {
    const store = createStore({ count: 0 });
    expect(store.getState()).toEqual({ count: 0 });
  });

  it("replaces state with a value", () => {
    const store = createStore({ count: 0 });
    store.setState({ count: 5 });
    expect(store.getState()).toEqual({ count: 5 });
  });

  it("supports an updater function", () => {
    const store = createStore({ count: 1 });
    store.setState((prev) => ({ count: prev.count + 1 }));
    store.setState((prev) => ({ count: prev.count * 10 }));
    expect(store.getState().count).toBe(20);
  });

  it("notifies listeners after the state changes", () => {
    const store = createStore({ count: 0 });
    const seen: number[] = [];
    store.subscribe(() => seen.push(store.getState().count));
    store.setState({ count: 1 });
    store.setState({ count: 2 });
    expect(seen).toEqual([1, 2]);
  });

  it("does not notify when the state reference is unchanged", () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);
    store.setState((prev) => prev);
    store.setState(store.getState());
    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", () => {
    const store = createStore({ count: 0 });
    const a = vi.fn();
    const b = vi.fn();
    const unsubscribeA = store.subscribe(a);
    store.subscribe(b);
    unsubscribeA();
    store.setState({ count: 1 });
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});
