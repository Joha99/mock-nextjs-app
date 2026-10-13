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

export default function ProductDetailPage(props: PageProps<"/products/[id]">) {
  void props;
  return (
    <p className="rounded border border-dashed border-zinc-300 bg-white p-6 text-zinc-500">
      TODO (Feature 4): fetch and render a single product.
    </p>
  );
}
