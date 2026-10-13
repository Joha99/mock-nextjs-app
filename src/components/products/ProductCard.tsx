import Link from "next/link";
import type { Product } from "@/lib/types";

/**
 * 🛠️ FEATURE 1 — one product tile in the grid.
 *
 * Show:
 *   - title (the whole card links to /products/{id} via next/link <Link>)
 *   - category as a small pill
 *   - price via formatCents. If on sale: sale price + the regular price with
 *     a line-through + a "Sale" badge.
 *   - rating like "★ 4.6 (842)"; if rating is null, "No reviews yet"
 *   - "Out of stock" badge when stock === 0 (and visually dim the card)
 *
 * This can stay a Server Component (no "use client") — it has no state or
 * event handlers; <Link> works fine in Server Components.
 *
 * Interview tip: say why you chose <Link> over <a>: client-side navigation
 * (no full page reload) + automatic prefetching.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block rounded-lg border border-zinc-200 bg-white p-4">
      {/* TODO (Feature 1): flesh this out */}
      {product.title}
    </Link>
  );
}
