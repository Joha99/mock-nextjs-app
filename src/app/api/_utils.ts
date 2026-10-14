import type { NextRequest } from "next/server";
import { getDb } from "@/lib/data/db";

/**
 * Helpers shared by the mock API routes.
 * (Only `route.ts` and `page.tsx` files become URLs, so a plain helper file
 * like this one inside `app/` is safe. The "_" prefix is just a convention
 * signalling "private, not a route".)
 */

const DEFAULT_DELAY_MS = 600;

/**
 * 1. Logs every request to the terminal, e.g. `[api #12] GET /api/products`.
 *    Use these logs to SEE caching: if a page reload doesn't print a new line,
 *    the data came from a cache (Features 10–12).
 * 2. Adds fake latency so you can see your loading states.
 * 3. Returns a 500 response when `?fail=true` is passed so you can test error
 *    states. Returns null when the request should proceed normally.
 */
export async function simulateNetwork(request: NextRequest, defaultDelayMs = DEFAULT_DELAY_MS): Promise<Response | null> {
  const db = getDb();
  db.requestCount += 1;
  const { pathname, search } = request.nextUrl;
  console.log(`[api #${db.requestCount}] ${request.method} ${pathname}${search}`);

  const params = request.nextUrl.searchParams;
  const delay = Number(params.get("delay") ?? defaultDelayMs);
  await new Promise((resolve) => setTimeout(resolve, Number.isNaN(delay) ? defaultDelayMs : delay));

  if (params.get("fail") === "true") {
    return Response.json({ error: "Internal server error (simulated)" }, { status: 500 });
  }
  return null;
}
