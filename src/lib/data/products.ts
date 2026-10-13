import type { RawProduct, RawPromoCode } from "@/lib/types";

/**
 * Pretend database. You normally WON'T touch this file — treat it like data
 * living on someone else's server. The API routes in src/app/api read from it.
 *
 * Notice the messiness on purpose (Feature 2 cleans it up):
 *   - category casing/whitespace is inconsistent
 *   - some fields are null or missing
 *   - one sale price is higher than the regular price (invalid)
 *   - some products are inactive
 */
export const RAW_PRODUCTS: RawProduct[] = [
  { id: 1, title: "Noise-Cancelling Headphones", description: "Over-ear, 30h battery.", category: "Electronics", price_cents: 19999, sale_price_cents: 14999, stock: 12, rating: 4.6, review_count: 842, image_url: null, created_at: "2026-03-02T10:00:00Z", is_active: true },
  { id: 2, title: "Mechanical Keyboard", description: "Hot-swappable, brown switches.", category: "electronics ", price_cents: 12900, sale_price_cents: null, stock: 3, rating: 4.4, review_count: 311, image_url: null, created_at: "2026-05-14T10:00:00Z", is_active: true },
  { id: 3, title: "USB-C Hub", description: null, category: "ELECTRONICS", price_cents: 4599, stock: 0, rating: 3.9, review_count: 77, image_url: null, created_at: "2025-11-20T10:00:00Z", is_active: true },
  { id: 4, title: "4K Webcam", description: "Auto-focus with privacy shutter.", category: "Electronics", price_cents: 8999, sale_price_cents: 9999, stock: 8, rating: 4.1, review_count: 120, image_url: null, created_at: "2026-07-01T10:00:00Z", is_active: true },
  { id: 5, title: "Ceramic Pour-Over Set", description: "Dripper, carafe, and two mugs.", category: "Home", price_cents: 5400, sale_price_cents: 3900, stock: 25, rating: 4.8, review_count: 59, image_url: null, created_at: "2026-01-09T10:00:00Z", is_active: true },
  { id: 6, title: "Linen Throw Blanket", description: "Stonewashed linen, 50x60in.", category: "home", price_cents: 7800, stock: 2, rating: null, review_count: 0, image_url: null, created_at: "2026-09-30T10:00:00Z", is_active: true },
  { id: 7, title: "Cast Iron Skillet", description: "Pre-seasoned 12in.", category: " HOME", price_cents: 3499, sale_price_cents: null, stock: 40, rating: 4.9, review_count: 2210, image_url: null, created_at: "2024-08-18T10:00:00Z", is_active: true },
  { id: 8, title: "Discontinued Lamp", description: "You should never see this.", category: "Home", price_cents: 2999, stock: 100, rating: 2.1, review_count: 12, image_url: null, created_at: "2023-02-02T10:00:00Z", is_active: false },
  { id: 9, title: "Ultralight Tent", description: "2-person, 1.1kg.", category: "Outdoors", price_cents: 34900, sale_price_cents: 29900, stock: 4, rating: 4.7, review_count: 188, image_url: null, created_at: "2026-04-22T10:00:00Z", is_active: true },
  { id: 10, title: "Insulated Water Bottle", description: "32oz, keeps cold 24h.", category: "outdoors", price_cents: 3200, stock: null, rating: 4.5, review_count: 960, image_url: null, created_at: "2025-06-11T10:00:00Z", is_active: true },
  { id: 11, title: "Trail Running Shoes", description: "Grippy outsole, 8mm drop.", category: "Apparel", price_cents: 13500, sale_price_cents: 10800, stock: 9, rating: 4.3, review_count: 402, image_url: null, created_at: "2026-02-27T10:00:00Z", is_active: true },
  { id: 12, title: "Merino Wool Beanie", description: null, category: "apparel", price_cents: 2800, stock: 60, rating: 4.0, review_count: 33, image_url: null, created_at: "2026-10-01T10:00:00Z", is_active: true },
  { id: 13, title: "Rain Shell Jacket", description: "Packable, 20k waterproof rating.", category: "APPAREL ", price_cents: 18900, sale_price_cents: null, stock: 1, rating: 4.6, review_count: 145, image_url: null, created_at: "2025-12-05T10:00:00Z", is_active: true },
  { id: 14, title: "Designing Data-Intensive Applications", description: "The big ideas behind reliable systems.", category: "Books", price_cents: 4499, sale_price_cents: 3599, stock: 15, rating: 4.9, review_count: 5120, image_url: null, created_at: "2024-01-15T10:00:00Z", is_active: true },
  { id: 15, title: "Refactoring UI", description: "Design tips for developers.", category: "books", price_cents: 7900, stock: 0, rating: 4.7, review_count: 870, image_url: null, created_at: "2025-03-03T10:00:00Z", is_active: true },
  { id: 16, title: "The Pragmatic Programmer", description: "20th anniversary edition.", category: "Books", price_cents: 3999, sale_price_cents: null, stock: 22, rating: 4.8, review_count: 3301, image_url: null, created_at: "2025-09-09T10:00:00Z", is_active: true },
  { id: 17, title: "Beta Smartwatch", description: "Not launched yet.", category: "Electronics", price_cents: 24900, stock: 50, rating: null, review_count: 0, image_url: null, created_at: "2026-10-10T10:00:00Z", is_active: false },
  { id: 18, title: "Camping Hammock", description: "Includes tree straps.", category: "Outdoors", price_cents: 5900, sale_price_cents: 4900, stock: 18, rating: 4.4, review_count: 275, image_url: null, created_at: "2026-06-06T10:00:00Z", is_active: true },
];

export const RAW_PROMO_CODES: RawPromoCode[] = [
  { code: "SAVE10", type: "percent", value: 10 },
  { code: "TAKE20", type: "fixed", value: 2000, min_subtotal_cents: 10000 },
  { code: "TECH15", type: "percent", value: 15, category: "electronics" },
  { code: "OLDDEAL", type: "percent", value: 50, expires_at: "2025-01-01T00:00:00Z" },
];
