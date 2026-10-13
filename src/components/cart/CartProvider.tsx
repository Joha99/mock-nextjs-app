"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CartItem, Product, PromoCode } from "@/lib/types";

/**
 * 🛠️ FEATURE 5 — global cart state with React Context.
 *
 * Why context? The cart is read by the header badge (CartLink), the
 * AddToCartButton on detail pages, and the /cart page. Lifting state into a
 * provider in the root layout means it survives client-side navigation.
 *
 * Why "use client"? Context, useState and useReducer only work in Client
 * Components. Note that layout.tsx (a Server Component) can still RENDER
 * this provider and pass server-rendered `children` through it.
 *
 * What to build:
 *   - Hold `items: CartItem[]` and `promo: PromoCode | null` in state.
 *     Tip: useReducer with actions like { type: "add", product } keeps the
 *     update logic in one testable place — a good thing to mention.
 *   - addItem(product, qty = 1): if already in cart, increase quantity;
 *     otherwise append. Never exceed stock (use clampQuantity from
 *     src/lib/pricing.ts). Out-of-stock products can't be added.
 *   - updateQuantity(productId, qty): clamp; if it becomes 0, remove the line.
 *   - removeItem(productId)
 *   - clear()
 *   - setPromo(promo | null)
 *   - itemCount: total number of units (sum of quantities), not number of lines.
 *   - IMPORTANT: never mutate state arrays/objects — always return new ones,
 *     or React won't re-render.
 *
 * Stretch: persist to localStorage. Careful — localStorage doesn't exist on
 * the server, and reading it during the first render causes a hydration
 * mismatch. Load it in a useEffect after mount.
 */

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  promo: PromoCode | null;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  setPromo: (promo: PromoCode | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const notImplemented = () => {
  throw new Error("TODO (Feature 5): implement CartProvider");
};

export function CartProvider({ children }: { children: ReactNode }) {
  // TODO(Feature 5): replace this placeholder value with real state.
  const value: CartContextValue = {
    items: [],
    itemCount: 0,
    promo: null,
    addItem: notImplemented,
    updateQuantity: notImplemented,
    removeItem: notImplemented,
    clear: notImplemented,
    setPromo: notImplemented,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** ✅ Use this in any Client Component: `const { items, addItem } = useCart()` */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
