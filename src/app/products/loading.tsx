/**
 * 🛠️ FEATURE 1 — loading UI for /products.
 *
 * Special file: Next automatically wraps page.tsx in a <Suspense> boundary and
 * shows THIS component while the async page is still fetching. Since the mock
 * API waits ~600ms, you'll see it on every load.
 *
 * TODO: Replace the text with a skeleton grid (e.g. 6 grey boxes with the same
 * size as a ProductCard, using Tailwind's `animate-pulse`). Matching the real
 * layout avoids the page "jumping" when data arrives.
 */
export default function Loading() {
  return <p className="text-zinc-500">Loading products…</p>;
}
