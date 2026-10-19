/**
 * Suspense boundary for /cart. The cart page reads the clock (promo expiry),
 * so it must render per visit, not in the prerendered shell.
 */
export default function Loading() {
  return <p className="text-zinc-500">Loading cart…</p>;
}
