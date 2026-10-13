import type { NextRequest } from "next/server";
import { RAW_PRODUCTS } from "@/lib/data/products";
import type { ProductsResponse } from "@/lib/types";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED — this is the "backend" you'll consume.
 *
 * GET /api/products
 *
 * Query params (all optional):
 *   page   number, 1-based           default 1
 *   limit  number, max 50            default 50 (i.e. everything)
 *   fail   "true" -> always return 500 (use this to test your error UI)
 *   delay  ms of fake latency        default 600
 *
 * Returns ProductsResponse. NOTE: it returns RAW data, including inactive
 * products. Filtering/cleaning is the frontend's job in this exercise.
 *
 * Try it: open http://localhost:3000/api/products in your browser.
 *
 * About this file: a `route.ts` inside `app/` is a "Route Handler" — Next's
 * way to define API endpoints. The exported function name is the HTTP method.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const failure = await simulateNetwork(params);
  if (failure) return failure;

  const limit = clamp(Number(params.get("limit") ?? 50), 1, 50);
  const total = RAW_PRODUCTS.length;
  const totalPages = Math.ceil(total / limit);
  const page = clamp(Number(params.get("page") ?? 1), 1, totalPages);
  const start = (page - 1) * limit;

  const body: ProductsResponse = {
    data: RAW_PRODUCTS.slice(start, start + limit),
    page,
    limit,
    total,
    totalPages,
  };
  return Response.json(body);
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}
