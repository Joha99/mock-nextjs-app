import { cacheLife, cacheTag } from "next/cache";
import type { Product } from "@/lib/types";

/**
 * 🛠️ FEATURE 11 — server-side caching with "use cache".
 *
 * Right now every visit to /products calls the API (watch the
 * `[api #n] GET /api/products` lines in your terminal). The catalog rarely
 * changes, so that's wasted work and 600ms of waiting for every visitor.
 *
 * Build cached versions of your data functions here, and switch the pages to
 * use them.
 *
 *   export async function getCatalog(): Promise<Product[]> {
 *     "use cache";              // must be the FIRST statement in the function
 *     cacheLife("minutes");     // how long it stays fresh (see table below)
 *     cacheTag("products");     // a label you can invalidate later (Feature 12)
 *     ...call getProducts() + normalizeProducts()
 *   }
 *
 * How "use cache" works, in plain words:
 *   - Next stores the function's RETURN VALUE on the server, keyed by the
 *     function plus its arguments. The next call with the same arguments gets
 *     the stored value back and your function body doesn't run at all.
 *   - The cache is SHARED BY EVERY VISITOR. Never cache per-user data
 *     (favorites, cart, anything behind a login) in here.
 *   - Arguments become part of the key: getCatalogProduct(1) and
 *     getCatalogProduct(2) are cached separately.
 *   - Return values must be serializable (plain data, arrays, Dates: fine).
 *
 * cacheLife profiles: "seconds" | "minutes" | "hours" | "days" | "weeks" | "max"
 *   ("minutes" = fresh for ~1 min, then refreshed in the background.)
 *
 * Requirements:
 *   1. getCatalog(): cached product list. Use it in /products.
 *      ✅ Reloading /products no longer prints a new `[api] GET /api/products`.
 *   2. getCatalogProduct(id): cached single product. Tag it with BOTH
 *      "products" and `product-${id}` so you can invalidate one product or all.
 *      Return null on 404 instead of throwing (see the gotcha below). Use it in
 *      /products/[id].
 *   3. Stock should be fresh, not cached: on the detail page, render a small
 *      async <StockStatus id={...} /> component that calls getProductStock()
 *      (NOT cached), wrapped in <Suspense fallback="Checking stock…">. Product
 *      details render instantly from the cache, and stock streams in a moment
 *      later. This "mostly cached page with a few fresh bits" pattern is the
 *      main idea behind Cache Components.
 *   4. Explain what happens to the ProductCard's out-of-stock badge on the
 *      LIST page, since it comes from cached data. Is that acceptable? What
 *      would you do? (No single right answer. Discuss trade-offs.)
 *
 * Gotchas:
 *   - Errors are not cached. If the API fails, the next request tries again.
 *     Good, but it also means a cached function that THROWS for 404 will hit
 *     the API on every request for a missing product. Returning null (which
 *     IS cached) avoids that. Call notFound() in the page, outside the cache.
 *   - In dev, editing a file can reset the cache. Don't be confused by an
 *     extra API call right after saving.
 *   - `npm run build` tries to pre-render cached data, but our mock API isn't
 *     running during a build. Practice with `npm run dev`, or run the build
 *     while the dev server is up on port 3000.
 */

export async function getCatalog(): Promise<Product[]> {
  // TODO(Feature 11)
  void cacheLife;
  void cacheTag;
  throw new Error("TODO: implement getCatalog in src/lib/catalog.ts");
}

export async function getCatalogProduct(id: number): Promise<Product | null> {
  // TODO(Feature 11)
  void id;
  throw new Error("TODO: implement getCatalogProduct in src/lib/catalog.ts");
}
