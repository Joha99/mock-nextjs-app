/**
 * 🛠️ FEATURE 12 — a tiny admin page at "/admin" for editing prices.
 *
 * Build:
 *   - Load products with getCatalog() (the CACHED version from Feature 11).
 *     That's the point: you're editing data that's cached, and you'll see it
 *     update.
 *   - A table with one row per product: title, current price (formatCents),
 *     and an <EditPriceForm productId={...} currentPriceCents={...} />.
 *
 * Note: there's no auth. In a real app, both this page AND the server action
 * must check that the user is an admin. Checking only the page isn't enough,
 * because server actions are public POST endpoints. Worth saying out loud.
 */
export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin · Prices</h1>
      <p className="rounded border border-dashed border-zinc-300 bg-white p-6 text-zinc-500">
        TODO (Feature 12): list products with an edit-price form for each.
      </p>
    </div>
  );
}
