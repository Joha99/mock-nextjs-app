import type { NextRequest } from "next/server";
import { RAW_PROMO_CODES } from "@/lib/data/products";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED
 *
 * GET /api/promo-codes/:code      (case-insensitive lookup)
 *
 * 200 -> RawPromoCode
 * 404 -> { error: "Promo code not found" }
 *
 * IMPORTANT: this endpoint only checks that the code EXISTS. It happily
 * returns expired codes and does not know about your cart. Deciding whether
 * a code actually applies (expiry, minimum spend, category) is business logic
 * you implement in src/lib/pricing.ts (Feature 6).
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/promo-codes/[code]">) {
  const failure = await simulateNetwork(request.nextUrl.searchParams);
  if (failure) return failure;

  const { code } = await ctx.params;
  const promo = RAW_PROMO_CODES.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
  if (!promo) {
    return Response.json({ error: "Promo code not found" }, { status: 404 });
  }
  return Response.json(promo);
}
