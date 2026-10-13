/**
 * 🛠️ FEATURE 4 (optional polish) — loading UI for /products/:id.
 *
 * Required in spirit: with Cache Components on, the detail page awaits
 * uncached data, so it needs a Suspense boundary. This file is that boundary.
 *
 * TODO: make it a skeleton shaped like the detail page (title bar, price
 * line, paragraph lines, button) using `animate-pulse`.
 */
export default function Loading() {
  return <p className="text-zinc-500">Loading product…</p>;
}
