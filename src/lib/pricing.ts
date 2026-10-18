import type { CartItem, CartTotals, Product, PromoCode } from "@/lib/types";
import { K } from "vitest/dist/chunks/reporters.d.BuRON0I0.js";
import { formatCents } from "./format";

/**
 * 🛠️ FEATURE 6 — cart pricing business logic.
 *
 * Tests: src/lib/__tests__/pricing.test.ts   (run `npm test`)
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
  return product.salePriceCents ?? product.priceCents;
}

/** Rules 1–3 */
export function getSubtotalCents(items: CartItem[]): number {
  return items.reduce((prev, curr) => {
    const quantity = clampQuantity(curr.quantity, curr.product);
    const unitPriceCents = getUnitPriceCents(curr.product);
    const lineTotal = quantity * unitPriceCents;

    prev += lineTotal;
    return prev;
  }, 0);
}

/** Rules 1–7. `promo` is null when the user hasn't entered a code. */
export function calculateCartTotals(
  items: CartItem[],
  promo: PromoCode | null,
  now: Date = new Date(),
): CartTotals {
  const subtotalCents = getSubtotalCents(items);
  let discountCents = 0;
  let promoError = null;

  if (promo) {
    if (promo.expiresAt && promo.expiresAt <= now) {
      promoError = "This code has expired";
    } else if (subtotalCents < promo.minSubtotalCents) {
      promoError = `Spend ${formatCents(promo.minSubtotalCents - subtotalCents)} more to use this code`;
    } else {
      let eligibleAmount = subtotalCents;

      if (promo.category) {
        const itemsInCategory = items.filter(
          (item) => item.product.category === promo.category,
        );
        if (itemsInCategory.length === 0) {
          promoError = `This code only applies to ${promo.category} items`;
        }
        eligibleAmount = getSubtotalCents(itemsInCategory);
      }

      if (promo.type === "percent") {
        discountCents = Math.round((eligibleAmount * promo.value) / 100);
      } else {
        discountCents = Math.min(promo.value, eligibleAmount);
      }
    }
  }

  const priceAfterDiscounts = subtotalCents - discountCents;
  const shippingCents =
    items.length === 0 || priceAfterDiscounts >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : FLAT_SHIPPING_CENTS;
  const taxCents = Math.round((subtotalCents - discountCents) * TAX_RATE);
  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
    promoError,
  };
}

/**
 * Cart quantity rule (used by Feature 5):
 * Clamp a requested quantity to [0, product.stock]. Non-integers round down.
 * 0 means "remove from cart".
 */
export function clampQuantity(requested: number, product: Product): number {
  return Math.min(Math.floor(Math.max(0, requested)), product.stock);
}
