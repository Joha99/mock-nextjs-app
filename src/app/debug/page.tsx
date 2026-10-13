import { RAW_PRODUCTS } from "@/lib/data/products";
import type { Category, Product } from "@/lib/types";
import { InventoryReport } from "@/components/debug/InventoryReport";

/**
 * 🐛 FEATURE 8 — Debug lab page, at URL "/debug".
 *
 * ✅ This page itself is fine. It reads the data directly (instead of via the
 * API) so the lab works even before you've built Features 1–2.
 * The bugs are in src/components/debug/InventoryReport.tsx.
 */
export default function DebugPage() {
  const products: Product[] = RAW_PRODUCTS.filter((p) => p.is_active).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    category: p.category.trim().toLowerCase() as Category,
    priceCents: p.price_cents,
    salePriceCents: null,
    stock: p.stock ?? 0,
    rating: p.rating ?? null,
    reviewCount: p.review_count ?? 0,
    imageUrl: null,
    createdAt: new Date(p.created_at),
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Debug lab — Inventory report</h1>
        <p className="text-zinc-600">There are 4 bugs on this page. Symptoms are listed under Feature 8 in FEATURES.md.</p>
      </div>
      <InventoryReport products={products} />
    </div>
  );
}
