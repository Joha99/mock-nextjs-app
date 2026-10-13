/**
 * Helpers shared by the mock API routes.
 * (Only `route.ts` and `page.tsx` files become URLs, so a plain helper file
 * like this one inside `app/` is safe. The "_" prefix is just a convention
 * signalling "private, not a route".)
 */

const DEFAULT_DELAY_MS = 600;

/**
 * Adds fake latency so you can see your loading states, and returns a 500
 * response when `?fail=true` is passed so you can test your error states.
 * Returns null when the request should proceed normally.
 */
export async function simulateNetwork(params: URLSearchParams): Promise<Response | null> {
  const delay = Number(params.get("delay") ?? DEFAULT_DELAY_MS);
  await new Promise((resolve) => setTimeout(resolve, Number.isNaN(delay) ? DEFAULT_DELAY_MS : delay));

  if (params.get("fail") === "true") {
    return Response.json({ error: "Internal server error (simulated)" }, { status: 500 });
  }
  return null;
}
