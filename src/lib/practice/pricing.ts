import type { CartItem, CartTotals, Product, PromoCode } from "@/lib/types";
import { formatCents } from "@/lib/format";

/**
 * 🛠️ FEATURE 6 — cart pricing business logic.
 *
 * Practice redo (Thu Oct 22). Tests: npx vitest run practice/pricing
 *
 * These are PURE functions: no React, no fetch, no Date.now() hidden inside
 * (the current time is passed in as `now`). That makes them trivial to test
 * and is exactly the kind of separation interviewers like to see.
 *
 * All amounts are integer cents. Round with Math.round() whenever you
 * multiply by a percentage, and only at the points described below.
 *
 * ─────────────────────────── THE RULES ───────────────────────────
 *
 * 1. Unit price
 *    The product's salePriceCents if it is not null, otherwise priceCents.
 *
 * 2. Line total = unit price × quantity
 *
 * 3. Subtotal = sum of all line totals
 *
 * 4. Promo discount (at most one promo code per cart)
 *    A promo does NOT apply (discount = 0, promoError set) when:
 *      a. it is expired: expiresAt is not null and expiresAt <= now
 *         -> promoError: "This code has expired"
 *      b. subtotal < minSubtotalCents
 *         -> promoError: "Spend $X.XX more to use this code"
 *            where X.XX = minSubtotalCents - subtotal (use formatCents)
 *      c. it has a category and no cart items are in that category
 *         -> promoError: "This code only applies to <category> items"
 *    Otherwise:
 *      - "eligible amount" = subtotal, or for a category promo, the sum of
 *        line totals for items in that category only
 *      - percent: Math.round(eligible × value / 100)
 *      - fixed:   Math.min(value, eligible)   (never discount below $0)
 *
 * 5. Shipping
 *    - empty cart: 0
 *    - (subtotal - discount) >= FREE_SHIPPING_THRESHOLD_CENTS: 0
 *    - otherwise: FLAT_SHIPPING_CENTS
 *
 * 6. Tax = Math.round((subtotal - discount) × TAX_RATE)
 *    Shipping is NOT taxed.
 *
 * 7. Total = subtotal - discount + shipping + tax
 */

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
export const FLAT_SHIPPING_CENTS = 599;
export const TAX_RATE = 0.0825;

/** Rule 1 */
export function getUnitPriceCents(product: Product): number {
  void product;
  throw new Error("TODO");
}

/** Rules 2–3 */
export function getSubtotalCents(items: CartItem[]): number {
  void items;
  throw new Error("TODO");
}

/** Rules 1–7. `promo` is null when the user hasn't entered a code. */
export function calculateCartTotals(
  items: CartItem[],
  promo: PromoCode | null,
  now: Date = new Date(),
): CartTotals {
  void [items, promo, now, formatCents];
  throw new Error("TODO");
}

/**
 * Clamp a requested quantity to [0, product.stock]. Non-integers round down.
 */
export function clampQuantity(requested: number, product: Product): number {
  void [requested, product];
  throw new Error("TODO");
}
