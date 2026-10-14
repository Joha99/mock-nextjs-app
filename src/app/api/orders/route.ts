import type { NextRequest } from "next/server";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * 🛠️ FEATURE 13 — DESIGN and implement the checkout endpoint.
 *
 *   POST /api/orders
 *
 * Unlike the other routes, this one is YOURS. There's no fixed contract:
 * deciding the request body, the response body, and the status codes is the
 * exercise. Write the contract down first (as a comment at the top of this
 * file), THEN implement it. Full requirements and design questions are under
 * Feature 13 in FEATURES.md.
 *
 * Tools you can reuse:
 *   - getDb() from "@/lib/data/db" for products, promo codes, and orders
 *   - normalizeProduct / normalizePromoCode from "@/lib/normalize"
 *   - calculateCartTotals from "@/lib/pricing" (the SAME function the cart
 *     page uses, so the client and server can't disagree on the math)
 *
 * Testing it without any UI (from a second terminal):
 *   curl -i -X POST localhost:3000/api/orders \
 *     -H 'Content-Type: application/json' \
 *     -d '{"your": "body here"}'
 */
export async function POST(request: NextRequest) {
  const failure = await simulateNetwork(request, 300);
  if (failure) return failure;

  // TODO(Feature 13)
  return Response.json({ error: "Not implemented" }, { status: 501 });
}
