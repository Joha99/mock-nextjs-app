/**
 * Shared types.
 *
 * There are TWO product shapes on purpose:
 *   - `RawProduct` is what the API sends you. It's messy (snake_case, nulls,
 *     inconsistent casing) — just like real-world APIs.
 *   - `Product` is the clean shape the UI should work with.
 *
 * Converting Raw -> clean is Feature 2 (see FEATURES.md and src/lib/normalize.ts).
 * All money is stored in integer CENTS to avoid floating point bugs
 * (0.1 + 0.2 !== 0.3). Only convert to dollars when displaying.
 */

// ---------- What the API returns ----------

export type RawProduct = {
  id: number;
  title: string;
  description?: string | null;
  /** Inconsistent! e.g. "Electronics", "electronics ", "HOME" */
  category: string;
  price_cents: number;
  /** null/undefined = not on sale. Can (incorrectly) be >= price_cents. */
  sale_price_cents?: number | null;
  /** missing/null should be treated as 0 */
  stock?: number | null;
  /** 0–5, or null if the product has no reviews yet */
  rating?: number | null;
  review_count?: number;
  image_url?: string | null;
  /** ISO 8601 date string */
  created_at: string;
  /** inactive products should never be shown to customers */
  is_active: boolean;
};

export type ProductsResponse = {
  data: RawProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RawPromoCode = {
  code: string;
  type: "percent" | "fixed";
  /** percent: 10 means 10%. fixed: amount in cents. */
  value: number;
  min_subtotal_cents?: number;
  /** if set, the discount only applies to items in this (normalized) category */
  category?: string;
  /** ISO 8601 date string; if in the past, the code is expired */
  expires_at?: string | null;
};

// ---------- What the UI works with ----------

export type Category =
  | "electronics"
  | "home"
  | "outdoors"
  | "books"
  | "apparel";

export type Product = {
  id: number;
  title: string;
  description: string;
  category: Category;
  priceCents: number;
  /** null when not on sale (or when the sale price is invalid) */
  salePriceCents: number | null;
  stock: number;
  rating: number | null;
  reviewCount: number;
  imageUrl: string | null;
  createdAt: Date;
};

export type PromoCode = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotalCents: number;
  category: Category | null;
  expiresAt: Date | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartTotals = {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  /** human readable reason the promo didn't apply, or null */
  promoError: string | null;
};
