import type { NextRequest } from "next/server";
import { getDb } from "@/lib/data/db";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED — used in Feature 14.
 *
 * PUT    /api/favorites/:productId   -> 200 { ids: number[] }   add (no body)
 * DELETE /api/favorites/:productId   -> 200 { ids: number[] }   remove
 *   404 -> { error: "Product not found" }
 *
 * Both are IDEMPOTENT: calling PUT twice leaves the product favorited once,
 * and calling DELETE on a non-favorite is not an error. That's why they're
 * PUT/DELETE on a resource URL rather than a "POST /api/favorites/toggle".
 * (A toggle endpoint breaks if a request is retried or two clicks race.)
 *
 * Default delay is 800ms, long enough to notice a non-optimistic UI.
 * Add `?fail=true` to practice rolling back an optimistic update.
 */
export async function PUT(request: NextRequest, ctx: RouteContext<"/api/favorites/[id]">) {
  return change(request, ctx, "add");
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/favorites/[id]">) {
  return change(request, ctx, "remove");
}

async function change(request: NextRequest, ctx: RouteContext<"/api/favorites/[id]">, action: "add" | "remove") {
  const failure = await simulateNetwork(request, 800);
  if (failure) return failure;

  const db = getDb();
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!db.products.some((p) => p.id === productId && p.is_active)) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  if (action === "add") db.favorites.add(productId);
  else db.favorites.delete(productId);

  return Response.json({ ids: [...db.favorites].sort((a, b) => a - b) });
}
