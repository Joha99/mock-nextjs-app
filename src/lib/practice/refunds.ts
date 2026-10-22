/**
 * Practice (Thu Oct 22, ~25 min): order refunds
 * Tests: npx vitest run practice/refunds
 *
 * A customer returns some items from an order. Work out the refund.
 * All money is integer cents. Pure function: `now` is passed in.
 *
 * Rules, checked in this order (return the FIRST error):
 *   1. Return window: if now is more than 30 days after placedAt
 *      → "Return window has closed"   (exactly 30 days is still OK)
 *   2. No items requested → "Nothing to return"
 *   3. For each requested sku (combine repeated skus first):
 *      - not in the order                 → "Unknown item: <sku>"
 *      - quantity not a positive integer  → "Invalid quantity for <sku>"
 *      - more than was bought             → "Only <n> of <sku> can be returned"
 *      - item is final sale               → "<sku> is final sale"
 *
 * Amounts:
 *   4. returnedGross = Σ unitPriceCents × returned quantity
 *      subtotal      = Σ unitPriceCents × quantity for the WHOLE order
 *      itemsCents    = returnedGross − Math.round(discountCents × returnedGross / subtotal)
 *      (the order discount is shared proportionally)
 *   5. taxCents      = Math.round(itemsCents × taxRate)
 *   6. shippingCents = order.shippingCents only if EVERY unit of EVERY item is
 *                      being returned; otherwise 0
 *   7. totalCents    = itemsCents + taxCents + shippingCents
 *
 * Don't mutate the inputs.
 */

export type LineItem = {
  sku: string;
  unitPriceCents: number;
  quantity: number;
  finalSale: boolean;
};

export type Order = {
  placedAt: Date;
  items: LineItem[];
  discountCents: number;
  shippingCents: number;
  taxRate: number;
};

// sku: unique code for one specific product variant
export type ReturnRequest = { sku: string; quantity: number };

export type RefundResult =
  | {
      ok: true;
      itemsCents: number;
      taxCents: number;
      shippingCents: number;
      totalCents: number;
    }
  | { ok: false; error: string };

export function calculateRefund(
  order: Order,
  requests: ReturnRequest[],
  now: Date,
): RefundResult {
  // check if it's been > 30 days after order was placed
  const msPerDay = 1000 * 60 * 60 * 24;
  const msDiff = Math.round(now.getTime() - order.placedAt.getTime());
  if (msDiff > msPerDay * 30) {
    return { ok: false, error: "Return window has closed" };
  }

  // no items were requested to return
  if (requests.length === 0) {
    return { ok: false, error: "Nothing to return" };
  }

  const normalizedOrderItems: Record<LineItem["sku"], LineItem> = {};
  let subtotal = 0;
  for (const item of order.items) {
    normalizedOrderItems[item.sku] = item;
    subtotal += item.unitPriceCents * item.quantity;
  }

  // clean the sku data
  const consolidated: Record<ReturnRequest["sku"], ReturnRequest["quantity"]> =
    {};
  for (const req of requests) {
    if (consolidated[req.sku] !== undefined) {
      consolidated[req.sku] += req.quantity;
    } else {
      consolidated[req.sku] = req.quantity;
    }
  }

  for (const [sku, quantity] of Object.entries(consolidated)) {
    if (normalizedOrderItems[sku] === undefined) {
      return { ok: false, error: `Unknown item: ${sku}` };
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return { ok: false, error: `Invalid quantity for ${sku}` };
    }
    if (quantity > normalizedOrderItems[sku].quantity) {
      return {
        ok: false,
        error: `Only ${normalizedOrderItems[sku].quantity} of ${sku} can be returned`,
      };
    }
    if (normalizedOrderItems[sku].finalSale) {
      return { ok: false, error: `${sku} is final sale` };
    }
  }

  // calculate returnedGross, subtotal, itemCents, taxCents, shippingCents, totalCents
  let returnedGross = 0;

  for (const [sku, quantity] of Object.entries(consolidated)) {
    const originalOrder = normalizedOrderItems[sku];
    const unitPriceCents = originalOrder.unitPriceCents;
    returnedGross += unitPriceCents * quantity;
  }

  let shippingCents = order.shippingCents;
  for (const item of order.items) {
    if (consolidated[item.sku] === undefined) {
      shippingCents = 0;
      break;
    }
    if (consolidated[item.sku] !== item.quantity) {
      shippingCents = 0;
      break;
    }
  }

  const itemsCents =
    returnedGross -
    Math.round((order.discountCents * returnedGross) / subtotal);
  const taxCents = Math.round(itemsCents * order.taxRate);
  const totalCents = itemsCents + taxCents + shippingCents;

  return {
    ok: true,
    itemsCents,
    taxCents,
    shippingCents,
    totalCents,
  };
}
