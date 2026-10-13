import type { NextRequest } from "next/server";
import { RAW_PRODUCTS } from "@/lib/data/products";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED
 *
 * GET /api/products/:id
 *
 * 200 -> RawProduct
 * 404 -> { error: "Product not found" }   (also for inactive products)
 * 400 -> { error: "Invalid id" }
 *
 * Supports the same `?fail=true` and `?delay=ms` params as /api/products.
 *
 * `[id]` in the folder name is a dynamic segment. In Next 15+ `params` is a
 * Promise, so you must `await ctx.params`.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/products/[id]">) {
  const failure = await simulateNetwork(request.nextUrl.searchParams);
  if (failure) return failure;

  const { id } = await ctx.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const product = RAW_PRODUCTS.find((p) => p.id === numericId && p.is_active);
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product);
}
