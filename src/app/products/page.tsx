/**
 * 🛠️ FEATURE 1 (+ 3) — the product list page, at URL "/products".
 *
 * This file is a SERVER COMPONENT (the default in the App Router — there's no
 * "use client" at the top). That means:
 *   ✅ it can be `async` and `await` data directly
 *   ✅ it runs on the server, so its code never ships to the browser
 *   ❌ it can't use useState / useEffect / onClick
 *
 * Feature 1 — what to build:
 *   1. Make this function `async`.
 *   2. Call `getProducts()` from src/lib/api.ts, then `normalizeProducts()`
 *      from src/lib/normalize.ts (you can stub normalize as `return raw as any`
 *      at first and come back for Feature 2 — say so out loud if you do).
 *   3. Render a responsive grid of <ProductCard /> (src/components/products/ProductCard.tsx).
 *   4. Show "{n} products" above the grid.
 *   5. Handle the empty state ("No products found").
 *   6. Loading UI: fill in ./loading.tsx — Next shows it automatically while
 *      this async page is waiting.
 *   7. Error UI: fill in ./error.tsx — Next shows it automatically if this
 *      page throws. Test with getProducts({ fail: true }).
 *
 * Feature 3 — search/filter/sort:
 *   This page receives `searchParams` (the ?q=...&category=... part of the URL)
 *   as a Promise. Read them here, filter + sort the normalized list on the
 *   server, and render <ProductFilters /> (a Client Component) above the grid
 *   to let the user change them. See FEATURES.md for the exact rules.
 *
 * Typing: `PageProps<"/products">` is a global helper Next generates for you.
 */

import { ProductCard } from "@/components/products/ProductCard";
import { getProducts } from "@/lib/api";
import { normalizeProducts } from "@/lib/normalize";

import styles from "./page.module.css";
import { ProductFilters } from "@/components/products/ProductFilters";
import { filterProducts, sortProducts } from "@/lib/filterProducts";
import { Filters } from "@/lib/types";

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;

  const filters: Filters = {
    q:
      searchParams.q && typeof searchParams.q === "string"
        ? searchParams.q
        : undefined,
    category:
      searchParams.category && typeof searchParams.category === "string"
        ? searchParams.category
        : undefined,
    sort:
      searchParams.sort && typeof searchParams.sort === "string"
        ? searchParams.sort
        : undefined,
    inStock:
      searchParams.inStock && typeof searchParams.inStock === "string"
        ? searchParams.inStock
        : undefined,
  };

  const products = await getProducts();
  const normalized = normalizeProducts(products.data);
  const filtered = filterProducts(normalized, filters);
  const sorted = sortProducts(filtered, filters);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <p>
        {sorted.length} {sorted.length === 1 ? "product" : "products"}
      </p>
      <ProductFilters />
      {sorted.length === 0 ? (
        <h2>No products found.</h2>
      ) : (
        <div className={styles.grid}>
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
