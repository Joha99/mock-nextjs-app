"use client";

import type { PromoCode } from "@/lib/types";

/**
 * 🛠️ FEATURE 7 — promo code input that calls the API.
 *
 * Flow:
 *   1. Controlled <input> + "Apply" button inside a <form>. Handle onSubmit
 *      and call e.preventDefault() (or you'll reload the page).
 *   2. Ignore empty/whitespace-only input.
 *   3. While the request is in flight: disable the button and show
 *      "Applying…". Prevent double-submits.
 *   4. Call getPromoCode(code) from src/lib/api.ts, then normalizePromoCode().
 *        - success: onApply(promo), clear the input
 *        - ApiError 404: show "That code doesn't exist"
 *        - anything else: show "Couldn't check that code. Try again."
 *   5. When a promo is applied, show "SAVE10 applied" with a "Remove" button
 *      that calls onApply(null), instead of the input.
 *   6. The *business* validation (expired, minimum spend, category) is NOT
 *      done here — calculateCartTotals returns promoError and the cart page
 *      displays it. The API only tells you the code exists.
 *
 * Accessibility: give the input a <label>, and put error text in an element
 * with role="alert" (or aria-live="polite") so screen readers announce it.
 *
 * Try: SAVE10, take20 (case-insensitive!), TECH15, OLDDEAL (expired), NOPE.
 */
export function PromoCodeForm({
  appliedPromo,
  onApply,
}: {
  appliedPromo: PromoCode | null;
  onApply: (promo: PromoCode | null) => void;
}) {
  void appliedPromo;
  void onApply;
  return <div className="text-zinc-500">TODO (Feature 7): promo code form</div>;
}
