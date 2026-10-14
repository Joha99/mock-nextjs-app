import type { NextRequest } from "next/server";
import { getDb } from "@/lib/data/db";
import { simulateNetwork } from "@/app/api/_utils";

/**
 * ✅ ALREADY IMPLEMENTED — used in Feature 14.
 *
 * GET /api/favorites
 *   200 -> { ids: number[] }   (sorted ascending)
 *
 * There's no login in this app, so there's a single shared favorites list.
 * Pretend it belongs to the signed-in user, which means it must NEVER be
 * cached and shared between users (a good thing to point out).
 */
export async function GET(request: NextRequest) {
  const failure = await simulateNetwork(request, 300);
  if (failure) return failure;

  const ids = [...getDb().favorites].sort((a, b) => a - b);
  return Response.json({ ids });
}
