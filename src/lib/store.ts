import { useSyncExternalStore } from "react";

/**
 * 🛠️ FEATURE 15 — a tiny external store (a mini Zustand).
 *
 * Tests: src/lib/__tests__/store.test.ts   (run `npm test -- store`)
 *
 * Context + useReducer (Feature 5) keeps state INSIDE React. An external
 * store keeps state OUTSIDE React in a plain object, and components subscribe
 * to it. That's how Zustand, Redux, and Jotai work under the hood. Why bother?
 *   - Code outside React can read and update it (e.g. a localStorage sync, a
 *     WebSocket handler, or a test).
 *   - A component can subscribe to a SLICE of state and only re-render when
 *     that slice changes. With Context, every consumer re-renders whenever the
 *     context value changes.
 *
 * ───────────────────────── PART 1: createStore ─────────────────────────
 *   const store = createStore({ count: 0 });
 *   store.getState();                                // { count: 0 }
 *   store.setState({ count: 1 });                    // replace
 *   store.setState((prev) => ({ count: prev.count + 1 })); // updater fn
 *   const unsubscribe = store.subscribe(() => console.log("changed"));
 *
 * Rules:
 *   - setState accepts a new state OR an updater function (like useState).
 *   - Listeners are called (with no arguments) after the state has changed.
 *   - If the new state is the SAME reference as the old one (Object.is), do
 *     NOT notify listeners. That's how "nothing changed" is detected cheaply,
 *     and why you must never mutate state in place.
 *   - subscribe returns an unsubscribe function.
 *
 * ───────────────────────── PART 2: useStore hook ─────────────────────────
 *   const count = useStore(store, (s) => s.count);
 *
 * Implement with React's useSyncExternalStore(subscribe, getSnapshot,
 * getServerSnapshot). The selector picks a slice. getServerSnapshot runs
 * during server rendering, so it must NOT touch localStorage. Return the
 * store's state as-is.
 *
 * Gotcha: the selector must return the same reference when nothing changed.
 * A selector like `(s) => s.items.filter(...)` creates a new array on every
 * call, and React will warn about an infinite loop. Select raw state and
 * derive in the component, or memoize.
 *
 * (No unit tests for the hook, because it needs a DOM. You'll test it by using it.)
 */

export type Listener = () => void;

export type Store<T> = {
  getState: () => T;
  setState: (update: T | ((prev: T) => T)) => void;
  subscribe: (listener: Listener) => () => void;
};

export function createStore<T>(initialState: T): Store<T> {
  // TODO(Feature 15, Part 1)
  void initialState;
  throw new Error("TODO: implement createStore");
}

export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  // TODO(Feature 15, Part 2): replace with useSyncExternalStore
  void useSyncExternalStore;
  return selector(store.getState());
}
