/**
 * ✅ ALREADY IMPLEMENTED — small display helpers.
 */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** formatCents(14999) -> "$149.99". Always pass CENTS, never dollars. */
export function formatCents(cents: number): string {
  return usd.format(cents / 100);
}

/** formatDate(new Date("2026-03-02")) -> "Mar 2, 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
