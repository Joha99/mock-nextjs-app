"use server";

/**
 * 🛠️ FEATURE 12 — a Server Action that edits data, then invalidates the cache.
 *
 * "use server" at the top of a file makes every exported async function a
 * SERVER ACTION: a function that runs on the server but that a Client
 * Component can call directly, as if it were local. Under the hood Next turns
 * the call into a POST request, so you don't have to write a route handler.
 * You can also pass it straight to a <form action={...}>.
 *
 * The problem this solves: after Feature 11, /products is cached. If an admin
 * changes a price, customers keep seeing the OLD price until the cache expires.
 *
 * Build `updatePriceAction(prevState, formData)`, used with React's
 * useActionState in the EditPriceForm component:
 *   1. Read `productId` and `price` (in DOLLARS, e.g. "149.99") from formData.
 *   2. Validate on the server. Never trust the client, because anyone can
 *      call a server action with any data:
 *        - price must be a number > 0 with at most 2 decimal places
 *        - return { ok: false, fieldErrors: { price: "..." } } instead of
 *          throwing, so the form can show the message next to the input
 *   3. Convert dollars to cents WITHOUT float bugs:
 *        Math.round(Number("19.99") * 100)  -> 1999 ✅
 *        Number("19.99") * 100              -> 1998.9999999999998 ❌
 *   4. Call updateProduct(id, { price_cents }) from src/lib/api.ts.
 *   5. Invalidate the cache:
 *        updateTag(`product-${id}`)  and  updateTag("products")
 *      (import { updateTag } from "next/cache")
 *   6. Return { ok: true, message: "Saved" }.
 *
 * Acceptance:
 *   ✅ Change a price on /admin, open /products: the new price shows
 *      immediately, and the terminal shows exactly one fresh API call.
 *   ✅ "abc", "-5", "0" and "1.999" show a validation error, and no PATCH
 *      request is sent (check the terminal logs).
 *   ✅ If the API fails, the form shows an error and the old price stays.
 *
 * Discuss:
 *   - updateTag vs revalidateTag. updateTag expires the cache IMMEDIATELY
 *     (read-your-own-writes: the admin must see their change). revalidateTag
 *     serves the stale value once more while refreshing in the background,
 *     which is fine for customers but confusing for the person who just
 *     clicked Save.
 *   - Tag granularity: why tag both "products" AND `product-${id}`?
 *   - Server Action vs calling PATCH /api/products/:id from the browser.
 *     (Who can call what? Where does validation live? Where can you
 *     invalidate the Next cache?)
 */

export type PriceFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: { price?: string };
};

export async function updatePriceAction(prevState: PriceFormState, formData: FormData): Promise<PriceFormState> {
  // TODO(Feature 12)
  void prevState;
  void formData;
  return { ok: false, message: "TODO: implement updatePriceAction in src/app/admin/actions.ts" };
}
