import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCents } from "@/lib/format";
import { Badge } from "./ProductBadge";

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
  const { salePriceCents, priceCents, reviewCount, rating, stock, category } =
    product;

  const isOnSale = salePriceCents !== null;
  const isOutOfStock = stock === 0;

  const displayedPrice = formatCents(salePriceCents ?? priceCents);
  const displayedRating =
    rating === null
      ? "No reviews yet"
      : `★ ${rating.toFixed(1)} (${reviewCount})`;

  return (
    <Link
      href={`/products/${product.id}`}
      className={`block rounded-lg border border-zinc-200 bg-white p-4 ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="flex gap-1">
        <span className="grow">{product.title}</span>
        <Badge text={category} variant="info" />
        {isOnSale && <Badge text="sale" variant="success" />}
        {isOutOfStock && <Badge text="out of stock" variant="warning" />}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-1">
          {isOnSale && (
            <span className="line-through">{formatCents(priceCents)}</span>
          )}
          <span>{displayedPrice}</span>
        </div>
        <span>{displayedRating}</span>
      </div>
    </Link>
  );
}
