"use client";

import { useCart } from "@/components/cart/CartProvider";
import Link from "next/link";

/**
 * 🛠️ FEATURES 5, 6, 7 — the cart page, at URL "/cart".
 *
 * This page is a CLIENT COMPONENT ("use client" above) because the cart lives
 * in React state in the browser (CartProvider), and it needs interactivity.
 *
 * What to build:
 *   Feature 5 (cart state):
 *     - Read items from `useCart()`.
 *     - Empty state: "Your cart is empty" + link to /products.
 *     - For each line: title, unit price (use getUnitPriceCents), a quantity
 *       control (− / number / +) that can't exceed stock, line total, and a
 *       "Remove" button.
 *   Feature 6 (pricing):
 *     - Call `calculateCartTotals(items, promo)` and render <CartSummary />
 *       with subtotal, discount (only if > 0), shipping ("Free" when 0),
 *       tax, and total.
 *     - Show "Add $X.XX more for free shipping" when under the threshold.
 *   Feature 7 (promo codes):
 *     - Render <PromoCodeForm /> and keep the applied promo in state
 *       (hint: it's cart state — put it in CartProvider so it survives
 *       navigation).
 *     - Show totals.promoError next to the form when the code doesn't apply.
 */

import styles from "./page.module.css";
import { type Product } from "@/lib/types";
import { calculateCartTotals, getUnitPriceCents } from "@/lib/pricing";
import { formatCents } from "@/lib/format";

export default function CartPage() {
  const { items, itemCount, promo, updateQuantity } = useCart();
  const totalPrice = formatCents(
    calculateCartTotals(items, promo).subtotalCents,
  );

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Cart</h1>
        <Link href="/products" className="text-blue-500">
          ← Go to products
        </Link>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const onChangeQuantity = (productId: Product["id"], newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cart ({itemCount})</h1>
      {items.map((cartItem) => {
        const product = cartItem.product;
        const unitPrice = formatCents(getUnitPriceCents(product));

        return (
          <div
            key={product.id}
            className="border border-solid border-gray-400 rounded-md p-3 flex justify-between items-center"
          >
            <div>
              {product.title} ({unitPrice})
            </div>
            <div className={styles.controls}>
              <button
                className={styles.decrement}
                onClick={() => {
                  onChangeQuantity(product.id, cartItem.quantity - 1);
                }}
              >
                ➖
              </button>
              <div className={styles.quantity}>{cartItem.quantity}</div>
              <button
                disabled={cartItem.quantity >= product.stock}
                className={styles.increment}
                onClick={() => {
                  onChangeQuantity(product.id, cartItem.quantity + 1);
                }}
              >
                ➕
              </button>
            </div>
          </div>
        );
      })}
      <div>
        <p>Subtotal: {totalPrice}</p>
      </div>
    </div>
  );
}
