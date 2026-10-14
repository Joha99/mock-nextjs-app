import type { NextRequest } from "next/server";
import { getDb } from "@/lib/data/db";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED
 *
 * GET /api/products/:id
 *   200 -> RawProduct
 *   404 -> { error: "Product not found" }   (also for inactive products)
 *   400 -> { error: "Invalid id" }
 *
 * PATCH /api/products/:id          (admin — used in Feature 12)
 *   Body (all fields optional, at least one required):
 *     { "price_cents"?: number, "sale_price_cents"?: number | null, "stock"?: number }
 *   200 -> the updated RawProduct
 *   400 -> { error: string, fieldErrors?: Record<string, string> }
 *   404 -> { error: "Product not found" }
 *
 * Both support `?fail=true` and `?delay=ms`.
 *
 * `[id]` in the folder name is a dynamic segment. In Next 15+ `params` is a
 * Promise, so you must `await ctx.params`.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/products/[id]">) {
  const failure = await simulateNetwork(request);
  if (failure) return failure;

  const found = await findProduct(ctx);
  if (found instanceof Response) return found;
  return Response.json(found);
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/products/[id]">) {
  const failure = await simulateNetwork(request, 300);
  if (failure) return failure;

  const found = await findProduct(ctx);
  if (found instanceof Response) return found;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be valid JSON" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};
  const isNonNegativeInt = (v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= 0;

  if ("price_cents" in input && (!isNonNegativeInt(input.price_cents) || input.price_cents === 0)) {
    fieldErrors.price_cents = "Must be a positive integer number of cents";
  }
  if ("sale_price_cents" in input && input.sale_price_cents !== null && !isNonNegativeInt(input.sale_price_cents)) {
    fieldErrors.sale_price_cents = "Must be a non-negative integer number of cents, or null";
  }
  if ("stock" in input && !isNonNegativeInt(input.stock)) {
    fieldErrors.stock = "Must be a non-negative integer";
  }
  const known = ["price_cents", "sale_price_cents", "stock"].filter((k) => k in input);
  if (known.length === 0) {
    return Response.json({ error: "Provide at least one of price_cents, sale_price_cents, stock" }, { status: 400 });
  }
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ error: "Validation failed", fieldErrors }, { status: 400 });
  }

  if ("price_cents" in input) found.price_cents = input.price_cents as number;
  if ("sale_price_cents" in input) found.sale_price_cents = input.sale_price_cents as number | null;
  if ("stock" in input) found.stock = input.stock as number;
  return Response.json(found);
}

async function findProduct(ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }
  const product = getDb().products.find((p) => p.id === numericId && p.is_active);
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return product;
}
