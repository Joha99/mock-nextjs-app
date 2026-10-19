import type {
  Category,
  Product,
  PromoCode,
  RawProduct,
  RawPromoCode,
} from "@/lib/types";

/**
 * 🛠️ FEATURE 2 — turn messy API data into clean UI data.
 *
 * Tests: src/lib/__tests__/normalize.test.ts   (run `npm test`)
 *
 * Why this exists: if every component has to remember "category might have
 * trailing spaces" and "stock might be null", bugs creep in everywhere. Clean
 * the data ONCE at the boundary and the rest of the app can trust the types.
 */

export const CATEGORIES: Category[] = [
  "electronics",
  "home",
  "outdoors",
  "books",
  "apparel",
];

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
  const normalized: Product = {
    id: raw.id,
    title: raw.title,
    category: raw.category.trim().toLowerCase() as Category,
    description: raw.description ?? "",
    stock: raw.stock ?? 0,
    rating: raw.rating === undefined ? null : raw.rating,
    reviewCount: raw.review_count ?? 0,
    imageUrl: raw.image_url === undefined ? null : raw.image_url,
    salePriceCents:
      typeof raw.sale_price_cents === "number" &&
      raw.sale_price_cents < raw.price_cents
        ? raw.sale_price_cents
        : null,
    createdAt: new Date(raw.created_at),
    priceCents: raw.price_cents,
  };

  return normalized;
}

/**
 * Rules for a list:
 *   - drop products where is_active === false
 *   - normalize the rest
 *   - keep the original order
 */
export function normalizeProducts(raw: RawProduct[]): Product[] {
  const normalized: Product[] = raw
    .filter((product) => product.is_active)
    .map((product) => normalizeProduct(product));

  return normalized;
}

/**
 * Rules for a promo code:
 *   - code: uppercase
 *   - min_subtotal_cents missing -> 0
 *   - category missing -> null
 *   - expires_at missing/null -> null, otherwise a Date
 */
export function normalizePromoCode(raw: RawPromoCode): PromoCode {
  const code = raw.code.toUpperCase();
  const expiresAt =
    raw.expires_at == undefined ? null : new Date(raw.expires_at);
  const category =
    raw.category == undefined
      ? null
      : (raw.category.trim().toLowerCase() as Category);

  return {
    code,
    type: raw.type,
    value: raw.value,
    minSubtotalCents: raw.min_subtotal_cents ?? 0,
    category,
    expiresAt,
  };
}
