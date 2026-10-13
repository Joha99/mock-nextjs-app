import type { CartTotals } from "@/lib/types";

/**
 * 🛠️ FEATURE 6 — presentational order summary.
 *
 * "Presentational" = it only receives already-calculated numbers and renders
 * them. No math in here; that lives in src/lib/pricing.ts. Keeping UI and
 * business logic apart is a great thing to call out in an interview.
 *
 * Render rows for: Subtotal, Discount (only when > 0, shown as "−$X.XX"),
 * Shipping ("Free" when 0), Tax, and a bold Total. Use formatCents.
 *
 * No "use client" needed — it has no state or event handlers. It becomes part
 * of the client bundle anyway because it's imported by a Client Component
 * (the cart page). That's fine.
 */
export function CartSummary({ totals }: { totals: CartTotals }) {
  void totals;
  return <div className="text-zinc-500">TODO (Feature 6): order summary</div>;
}
