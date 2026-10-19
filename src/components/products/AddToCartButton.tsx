"use client";

import type { Product } from "@/lib/types";
import { useCart } from "../cart/CartProvider";
import { useEffect, useRef, useState } from "react";

/**
 * 🛠️ FEATURE 5 — the one interactive piece of the (server-rendered) detail page.
 *
 * This is the "islands" pattern: the page is a Server Component, and only
 * this small button ships JavaScript to the browser.
 *
 * Behavior:
 *   - Calls addItem(product) from useCart().
 *   - Disabled with label "Out of stock" when product.stock === 0.
 *   - Disabled with label "Max in cart" when the cart already holds `stock`
 *     units of this product.
 *   - After adding, briefly show "Added ✓" (~1.5s) then revert. Clean up the
 *     timeout in a useEffect cleanup or you'll get a state update on an
 *     unmounted component if the user navigates away.
 */
export function AddToCartButton({ product }: { product: Product }) {
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const { addItem, items } = useCart();
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending "Added ✔" timer if the button unmounts (e.g. the user navigates away).
  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  const isOutOfStock = product.stock === 0;

  if (isOutOfStock) {
    return (
      <button
        type="button"
        disabled={true}
        className={`rounded px-4 py-2 text-white bg-gray-400`}
      >
        Out of stock
      </button>
    );
  }

  const cartItem = items.find((item) => item.product.id === product.id);
  const isMaxInCart = cartItem && cartItem.product.stock === cartItem.quantity;

  if (isMaxInCart) {
    return (
      <button
        type="button"
        disabled={true}
        className={`rounded px-4 py-2 text-white bg-gray-400`}
      >
        Max in cart
      </button>
    );
  }

  const onAddItem = () => {
    addItem(product, 1);
    setJustAdded(true);
    // Restart the timer on every click, so a quick second click doesn't end it early.
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  return (
    <button
      type="button"
      className={`rounded px-4 py-2 text-white bg-blue-400`}
      onClick={onAddItem}
    >
      {justAdded ? "Added ✔" : "Add to cart"}
    </button>
  );
}
