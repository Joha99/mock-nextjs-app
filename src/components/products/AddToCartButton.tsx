"use client";

import type { Product } from "@/lib/types";

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
 *   - Optional: a quantity <select> limited to available stock.
 */
export function AddToCartButton({ product }: { product: Product }) {
  void product;
  return (
    <button type="button" disabled className="rounded bg-zinc-300 px-4 py-2 text-white">
      TODO (Feature 5): Add to cart
    </button>
  );
}
