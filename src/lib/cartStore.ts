import { createStore, useStore } from "@/lib/store";
import type { CartItem, PromoCode } from "@/lib/types";

/**
 * 🛠️ FEATURE 15 (Part 3) — move the cart to the external store, then persist
 * it and sync it across tabs.
 *
 * Do this AFTER Feature 5 works with Context + useReducer, so you can compare
 * the two approaches. Steps:
 *
 *   1. `cartStore = createStore<CartState>({ items: [], promo: null })`
 *   2. Plain action functions OUTSIDE React (no hooks needed to call them):
 *        export function addItem(product, qty = 1) { cartStore.setState(prev => ...) }
 *      Tip: reuse your reducer from Feature 5 here:
 *        cartStore.setState(prev => cartReducer(prev, { type: "add", product }))
 *   3. Hooks for components to subscribe to slices:
 *        export const useCartItems = () => useStore(cartStore, s => s.items);
 *        export const useCartCount = () => useStore(cartStore, s => s.items) ... then sum
 *      CartLink should re-render when the count changes, but NOT when the
 *      promo changes. That's the advantage over Context. Verify it with React
 *      DevTools' "Highlight updates when components render".
 *   4. Persistence, in `startCartPersistence()`, called once from a
 *      useEffect in a small client component in the layout:
 *        - load: read localStorage["cart"] and setState with it. Do this AFTER
 *          mount (in the effect), never during render, or the server HTML
 *          (empty cart) won't match the first client render: a hydration error.
 *        - save: cartStore.subscribe(() => localStorage.setItem(...))
 *        - guard JSON.parse with try/catch, since stored data can be corrupt
 *          or from an older version of your app. Consider a `version` field.
 *        - Dates (product.createdAt) come back from JSON as STRINGS. What will
 *          you do about that?
 *   5. Cross-tab sync: window.addEventListener("storage", ...) fires in OTHER
 *      tabs when localStorage changes. Update the store from it. Careful not
 *      to create an infinite save→event→save loop. (Does the "storage" event
 *      fire in the tab that made the change?)
 *   6. Return a cleanup function that removes listeners.
 *
 * Acceptance:
 *   ✅ Add items, refresh: the cart is still there, with no hydration warning.
 *   ✅ Open /cart in two tabs, change a quantity in one, and the other updates.
 *   ✅ Put garbage in localStorage["cart"] via DevTools, refresh: no crash,
 *      just an empty cart.
 */

export type CartState = { items: CartItem[]; promo: PromoCode | null };

// Nothing imports this file yet, so it's safe that createStore still throws.
// Implement createStore (Parts 1 & 2) before you start using this file.
export const cartStore = createStore<CartState>({ items: [], promo: null });

export function useCartItems(): CartItem[] {
  // TODO(Feature 15)
  void useStore;
  return [];
}

export function startCartPersistence(): () => void {
  // TODO(Feature 15)
  return () => {};
}
