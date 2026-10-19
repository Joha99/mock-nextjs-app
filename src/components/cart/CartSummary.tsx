import { formatCents } from "@/lib/format";
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

const LabelValuePair = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex gap-1">
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
};

export function CartSummary({ totals }: { totals: CartTotals }) {
  const subTotal = formatCents(totals.subtotalCents);
  const discount =
    totals.discountCents > 0 ? formatCents(totals.discountCents) : undefined;
  const shipping =
    totals.shippingCents === 0 ? "Free" : formatCents(totals.shippingCents);
  const tax = formatCents(totals.taxCents);
  const total = formatCents(totals.totalCents);

  return (
    <div className="flex flex-col gap-2">
      <LabelValuePair label="Subtotal" value={subTotal} />
      {discount && <LabelValuePair label="Discount" value={`-${discount}`} />}
      <LabelValuePair label="Shipping" value={shipping} />
      <LabelValuePair label="Tax" value={tax} />
      <div className="border-gray-400 border-bs-1 border-solid py-1 font-bold">
        <LabelValuePair label="Total" value={total} />
      </div>
    </div>
  );
}
