import type { Category, Product, PromoCode, RawProduct, RawPromoCode } from "@/lib/types";

/**
 * 🛠️ FEATURE 2 — turn messy API data into clean UI data.
 *
 * Tests: src/lib/__tests__/normalize.test.ts   (run `npm test`)
 *
 * Why this exists: if every component has to remember "category might have
 * trailing spaces" and "stock might be null", bugs creep in everywhere. Clean
 * the data ONCE at the boundary and the rest of the app can trust the types.
 */

export const CATEGORIES: Category[] = ["electronics", "home", "outdoors", "books", "apparel"];

/**
 * Rules for a single product:
 *   - snake_case -> camelCase (see `Product` in src/lib/types.ts)
 *   - category: trim + lowercase  ("  HOME" -> "home")
 *   - description: null/undefined -> ""
 *   - stock: null/undefined -> 0
 *   - rating: undefined -> null (keep null as null — "no reviews" ≠ "0 stars")
 *   - reviewCount: undefined -> 0
 *   - imageUrl: undefined -> null
 *   - salePriceCents: keep only if it's a number AND strictly less than
 *     priceCents; otherwise null (a "sale" that costs more is bad data)
 *   - createdAt: ISO string -> Date
 */
export function normalizeProduct(raw: RawProduct): Product {
  // TODO(Feature 2): implement
  void raw;
  throw new Error("TODO: implement normalizeProduct in src/lib/normalize.ts");
}

/**
 * Rules for a list:
 *   - drop products where is_active === false
 *   - normalize the rest
 *   - keep the original order
 */
export function normalizeProducts(raw: RawProduct[]): Product[] {
  // TODO(Feature 2): implement
  void raw;
  throw new Error("TODO: implement normalizeProducts in src/lib/normalize.ts");
}

/**
 * Rules for a promo code:
 *   - code: uppercase
 *   - min_subtotal_cents missing -> 0
 *   - category missing -> null
 *   - expires_at missing/null -> null, otherwise a Date
 */
export function normalizePromoCode(raw: RawPromoCode): PromoCode {
  // TODO(Feature 7): implement
  void raw;
  throw new Error("TODO: implement normalizePromoCode in src/lib/normalize.ts");
}
