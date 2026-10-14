import type { NextRequest } from "next/server";
import { getDb } from "@/lib/data/db";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED — used in Feature 11.
 *
 * GET /api/products/:id/stock
 *   200 -> { id: number, stock: number, checked_at: string }
 *   404 -> { error: "Product not found" }
 *
 * A small, FAST endpoint (150ms default) for the one piece of product data
 * that changes constantly. The idea: cache the slow, rarely-changing product
 * details for a long time, but always fetch stock fresh.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/products/[id]/stock">) {
  const failure = await simulateNetwork(request, 150);
  if (failure) return failure;

  const { id } = await ctx.params;
  const product = getDb().products.find((p) => p.id === Number(id) && p.is_active);
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json({ id: product.id, stock: product.stock ?? 0, checked_at: new Date().toISOString() });
}
