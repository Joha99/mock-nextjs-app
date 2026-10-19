"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { CartItem, Product, PromoCode } from "@/lib/types";
import { clampQuantity } from "@/lib/pricing";

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

type Action =
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        quantity: number;
      };
    }
  | { type: "REMOVE_ITEM"; payload: { productId: Product["id"] } }
  | { type: "CLEAR_CART" }
  | { type: "SET_PROMO"; payload: { promo: PromoCode | null } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: number; quantity: number };
    };

type Store = {
  items: Map<Product["id"], CartItem>;
  promo: PromoCode | null;
};

const reducer = (state: Store, action: Action) => {
  switch (action.type) {
    case "UPDATE_QUANTITY": {
      const cartItem = state.items.get(action.payload.productId);

      if (!cartItem) return state;

      const product = cartItem.product;
      const clampedQuantity = clampQuantity(action.payload.quantity, product);
      const newItems = new Map([...state.items]);

      if (clampedQuantity === 0) {
        newItems.delete(product.id);
      } else {
        newItems.set(product.id, {
          ...cartItem,
          quantity: clampedQuantity,
        });
      }

      return {
        ...state,
        items: newItems,
      };
    }
    case "SET_PROMO": {
      return {
        ...state,
        promo: action.payload.promo,
      };
    }
    case "ADD_ITEM": {
      const product = action.payload.product;
      const requested = action.payload.quantity;

      if (product.stock === 0) return state;

      const cartItem = state.items.get(product.id) ?? { product, quantity: 0 };
      const clampedQuantity = clampQuantity(
        cartItem.quantity + requested,
        product,
      );
      const newItems = new Map([...state.items]);

      newItems.set(product.id, {
        ...cartItem,
        quantity: clampedQuantity,
      });

      return {
        ...state,
        items: newItems,
      };
    }
    case "REMOVE_ITEM": {
      const productId = action.payload.productId;
      const cartItem = state.items.get(productId);

      if (!cartItem) return state;

      const newItems = new Map([...state.items]);
      newItems.delete(productId);

      return {
        ...state,
        items: newItems,
      };
    }
    case "CLEAR_CART": {
      return {
        ...state,
        items: new Map<Product["id"], CartItem>(),
      };
    }
    default: {
      return state;
    }
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: new Map<Product["id"], CartItem>(),
    promo: null,
  });

  const cartItemsList = [...state.items.values()];
  const itemCount = cartItemsList.reduce((prev, curr) => {
    prev += curr.quantity;
    return prev;
  }, 0);

  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeItem = (productId: Product["id"]) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const clear = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const setPromo = (promo: PromoCode | null) => {
    dispatch({ type: "SET_PROMO", payload: { promo } });
  };

  const value: CartContextValue = {
    items: cartItemsList,
    promo: state.promo,
    itemCount,
    addItem,
    removeItem,
    clear,
    updateQuantity,
    setPromo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** ✅ Use this in any Client Component: `const { items, addItem } = useCart()` */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
