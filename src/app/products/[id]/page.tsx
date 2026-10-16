/**
 * 🛠️ FEATURE 4 — product detail page, at URL "/products/:id".
 *
 * The folder name `[id]` makes this a DYNAMIC ROUTE: /products/1, /products/42
 * all render this file, with `params.id` set to "1", "42", ... (always a
 * string!). In Next 15+ `params` is a Promise: `const { id } = await props.params`.
 *
 * What to build:
 *   1. Make the component async, await params, call getProduct(id) and
 *      normalizeProduct().
 *   2. If the API returns 404 (ApiError with status 404), call `notFound()`
 *      from "next/navigation". That renders ./not-found.tsx. Any other error
 *      should be re-thrown so the nearest error.tsx handles it.
 *   3. Render: title, category, description, price (strike through the
 *      regular price when on sale, show "% off"), rating (or "No reviews yet"
 *      when rating is null — NOT "0 stars"), stock status:
 *         stock === 0      -> "Out of stock"
 *         stock <= 5       -> "Only {n} left"
 *         otherwise        -> "In stock"
 *   4. A "← Back to products" <Link>.
 *   5. <AddToCartButton product={product} /> (Feature 5). It's a Client
 *      Component rendered inside this Server Component — that's allowed, as
 *      long as the props are serializable. (Heads-up: a Date is fine to pass
 *      in React 19, but a function is not.)
 *   6. Bonus: export `generateMetadata` so the browser tab shows the product title.
 *
 * Try: /products/1 (on sale), /products/6 (no reviews), /products/3 (out of
 * stock), /products/8 (inactive -> 404), /products/abc (400 -> ?).
 */

import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Badge } from "@/components/products/ProductBadge";
import { ApiError, getProduct } from "@/lib/api";
import { formatCents } from "@/lib/format";
import { normalizeProduct } from "@/lib/normalize";
import { Product } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const getStockStatus = (stock: Product["stock"]) => {
  if (stock === 0) {
    return "Out of stock";
  }
  if (stock <= 5) {
    return `Only ${stock} left`;
  }
  return "In stock";
};

const getPrice = (
  priceCents: Product["priceCents"],
  salePriceCents: Product["salePriceCents"],
): { finalPrice: string; originalPrice?: string; percentDiscount?: string } => {
  if (salePriceCents === null) {
    return { finalPrice: formatCents(priceCents) };
  }

  const percentDiscount = ((priceCents - salePriceCents) / priceCents) * 100;

  return {
    finalPrice: formatCents(salePriceCents),
    originalPrice: formatCents(priceCents),
    percentDiscount: `${Math.round(percentDiscount)}%`,
  };
};

export default async function ProductDetailPage(
  props: PageProps<"/products/[id]">,
) {
  const { id } = await props.params;
  let product;

  try {
    product = await getProduct(id);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      notFound();
    }
    throw err;
  }

  const normalized = normalizeProduct(product);
  const {
    priceCents,
    salePriceCents,
    rating,
    stock,
    title,
    description,
    category,
  } = normalized;

  const { finalPrice, originalPrice, percentDiscount } = getPrice(
    priceCents,
    salePriceCents,
  );

  const stockStatus = getStockStatus(stock);

  const displayedRating =
    rating === null ? "No reviews yet" : `${rating.toFixed(1)} ★`;

  return (
    <div className="flex flex-col gap-4">
      <Link href="/products" className="text-blue-700 font-bold">
        ← Back to products
      </Link>
      <div className="border border-solid border-black rounded-xl p-3 ">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <h2 className="text-2xl font-semibold p-0 m-0">{title}</h2>
            <Badge text={category} variant="info" />
            <Badge text={stockStatus} variant="info" />
          </div>

          <span className="h-fit">{displayedRating}</span>
        </div>

        <p className="text-xl">{description}</p>

        {percentDiscount ? (
          <div className="flex gap-2">
            <div className="font-bold line-through">{originalPrice}</div>
            <div className="font-bold text-red-600">
              {finalPrice} ({percentDiscount} off)
            </div>
          </div>
        ) : (
          <div>{finalPrice}</div>
        )}

        <div className="mbs-6">
          <AddToCartButton product={normalized} />
        </div>
      </div>
    </div>
  );
}
