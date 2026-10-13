"use client";

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
export default function CartPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <p className="rounded border border-dashed border-zinc-300 bg-white p-6 text-zinc-500">
        TODO (Features 5–7): render cart items, totals and a promo code form.
      </p>
    </div>
  );
}
