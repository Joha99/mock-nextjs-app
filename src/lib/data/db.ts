import { RAW_PRODUCTS, RAW_PROMO_CODES } from "@/lib/data/products";
import type { RawProduct, RawPromoCode } from "@/lib/types";

/**
 * ✅ ALREADY IMPLEMENTED — the mock backend's mutable in-memory "database".
 *
 * Only the API routes (src/app/api/**) should import this. Your frontend code
 * must go through HTTP (src/lib/api.ts), the same as with a real backend.
 *
 * Why globalThis? In dev, each route can be bundled separately, so a plain
 * module-level variable could exist in several copies (one per route). Hanging
 * the store off globalThis guarantees every route sees the same data, and it
 * survives hot reloads. Restarting `npm run dev` resets everything.
 */

export type StoredOrder = {
  id: string;
  createdAt: string;
  idempotencyKey: string | null;
  // The rest of the shape is up to you (Feature 13).
  [key: string]: unknown;
};

type Db = {
  products: RawProduct[];
  promoCodes: RawPromoCode[];
  favorites: Set<number>;
  orders: StoredOrder[];
  requestCount: number;
};

const globalForDb = globalThis as unknown as { __shoplyDb?: Db };

export function getDb(): Db {
  globalForDb.__shoplyDb ??= {
    products: structuredClone(RAW_PRODUCTS),
    promoCodes: structuredClone(RAW_PROMO_CODES),
    favorites: new Set<number>(),
    orders: [],
    requestCount: 0,
  };
  return globalForDb.__shoplyDb;
}
