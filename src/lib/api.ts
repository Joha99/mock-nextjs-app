import type { ProductsResponse, RawProduct, RawPromoCode } from "@/lib/types";

/**
 * 🛠️ FEATURE 1 (and used again in 4 & 7) — the data-fetching layer.
 *
 * Keep ALL `fetch` calls in this one file so components never deal with URLs,
 * status codes, or JSON parsing directly. This is a pattern worth saying out
 * loud in an interview: "I'll put fetching behind a small API module so the
 * UI just calls getProducts()".
 *
 * Requirements for every function:
 *   - Build the URL from API_BASE_URL.
 *   - Check `res.ok`. `fetch` does NOT throw on 404/500 — only on network
 *     failure. If you forget this you'll try to render `{ error: "..." }` as data.
 *   - Throw an `ApiError` (below) with the status so callers can tell a 404
 *     (show "not found") from a 500 (show "something went wrong, retry").
 *   - Return RAW data. Normalizing is a separate concern (src/lib/normalize.ts).
 *
 * Why a base URL? Server Components run on the server, where a relative URL
 * like "/api/products" has no host to resolve against. In the browser
 * (Client Components) a relative URL works fine. Using an absolute base URL
 * works in both. In a real app this would point at another service.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * GET /api/products
 *
 * Tip: while building your error UI, temporarily pass `{ fail: true }` and
 * add `fail=true` to the query string.
 *
 * Tip: pass `{ cache: "no-store" }` to fetch so you always see fresh data
 * while developing.
 */
export async function getProducts(
  options: { page?: number; limit?: number; fail?: boolean } = {},
): Promise<ProductsResponse> {
  const { page, limit, fail } = options;

  const searchParams = new URLSearchParams();
  if (page !== undefined) {
    searchParams.append("page", String(page));
  }
  if (limit !== undefined) {
    searchParams.append("limit", String(limit));
  }
  if (fail !== undefined) {
    searchParams.append("fail", String(fail));
  }

  const url = `${API_BASE_URL}/api/products?${searchParams.toString()}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new ApiError("Fetching products failed.", response.status);
  }

  return response.json();
}

/**
 * GET /api/products/:id
 * Should throw ApiError with status 404 when the product doesn't exist so the
 * page can call Next's `notFound()`.
 */
export async function getProduct(id: number | string): Promise<RawProduct> {
  const url = `${API_BASE_URL}/api/products/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new ApiError(`GET /products/${id} failed`, res.status);
  }

  return res.json();
}

/**
 * GET /api/promo-codes/:code
 * Remember to `encodeURIComponent(code)` — users type anything into inputs.
 */
export async function getPromoCode(code: string): Promise<RawPromoCode> {
  const encoded = encodeURIComponent(code);

  const url = `${API_BASE_URL}/api/promo-codes/${encoded}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new ApiError(`GET /api/promo-codes/${encoded} failed`, res.status);
  }

  return res.json();
}

// ─────────────────────────── Part 2 endpoints ───────────────────────────
// Same rules as above: check res.ok, throw ApiError with the status.
// Once you have 3+ copies of that check, consider extracting a small
// `request<T>(path, init)` helper and say why out loud.

export type StockResponse = { id: number; stock: number; checked_at: string };

/** GET /api/products/:id/stock (Feature 11). Never cache this one. */
export async function getProductStock(
  id: number | string,
): Promise<StockResponse> {
  // TODO(Feature 11): implement
  void id;
  throw new Error("TODO: implement getProductStock in src/lib/api.ts");
}

export type ProductUpdate = {
  price_cents?: number;
  sale_price_cents?: number | null;
  stock?: number;
};

/**
 * PATCH /api/products/:id (Feature 12).
 * Send JSON: method "PATCH", header "Content-Type: application/json",
 * body JSON.stringify(update). On a 400 the body has { error, fieldErrors? }.
 * Consider putting fieldErrors on the thrown error so the form can show them
 * next to the right input.
 */
export async function updateProduct(
  id: number,
  update: ProductUpdate,
): Promise<RawProduct> {
  // TODO(Feature 12): implement
  void id;
  void update;
  throw new Error("TODO: implement updateProduct in src/lib/api.ts");
}

/** GET /api/favorites -> { ids } (Feature 14). Per-user data: never cache. */
export async function getFavorites(): Promise<number[]> {
  // TODO(Feature 14): implement
  throw new Error("TODO: implement getFavorites in src/lib/api.ts");
}

/** PUT /api/favorites/:id (favorite: true) or DELETE /api/favorites/:id (favorite: false). Returns the new ids. */
export async function setFavorite(
  productId: number,
  favorite: boolean,
): Promise<number[]> {
  // TODO(Feature 14): implement
  void productId;
  void favorite;
  throw new Error("TODO: implement setFavorite in src/lib/api.ts");
}
