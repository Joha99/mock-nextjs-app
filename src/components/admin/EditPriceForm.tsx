"use client";

import { updatePriceAction } from "@/app/admin/actions";

/**
 * 🛠️ FEATURE 12 — a form wired to a Server Action with useActionState.
 *
 *   const [state, formAction, isPending] = useActionState(updatePriceAction, { ok: false });
 *
 *   <form action={formAction}>
 *     <input type="hidden" name="productId" value={productId} />
 *     <input name="price" defaultValue={(currentPriceCents / 100).toFixed(2)} />
 *     <button disabled={isPending}>{isPending ? "Saving…" : "Save"}</button>
 *     {state.fieldErrors?.price && <p role="alert">{state.fieldErrors.price}</p>}
 *   </form>
 *
 * Notice what you DON'T need: no onSubmit, no e.preventDefault(), no fetch,
 * and no useState for loading or errors. useActionState gives you the last
 * result (`state`) and `isPending`. Compare this with the promo code form
 * (Feature 7), where you managed all of that by hand. Which would you choose
 * for which situation?
 *
 * Bonus: the form works even before JavaScript loads (progressive
 * enhancement), because it's a real <form> that POSTs to the server.
 */
export function EditPriceForm({ productId, currentPriceCents }: { productId: number; currentPriceCents: number }) {
  void updatePriceAction;
  void productId;
  void currentPriceCents;
  return <span className="text-zinc-500">TODO (Feature 12): edit price form</span>;
}
