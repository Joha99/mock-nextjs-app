import { describe, expect, it } from "vitest";
import { normalizeProduct, normalizeProducts, normalizePromoCode } from "@/lib/normalize";
import { RAW_PRODUCTS } from "@/lib/data/products";
import type { RawProduct } from "@/lib/types";

const base: RawProduct = {
  id: 1,
  title: "Thing",
  description: "A thing",
  category: "Electronics",
  price_cents: 1000,
  sale_price_cents: 800,
  stock: 5,
  rating: 4.5,
  review_count: 10,
  image_url: "https://example.com/a.png",
  created_at: "2026-01-01T00:00:00Z",
  is_active: true,
};

describe("normalizeProduct", () => {
  it("maps snake_case to camelCase", () => {
    const p = normalizeProduct(base);
    expect(p).toEqual({
      id: 1,
      title: "Thing",
      description: "A thing",
      category: "electronics",
      priceCents: 1000,
      salePriceCents: 800,
      stock: 5,
      rating: 4.5,
      reviewCount: 10,
      imageUrl: "https://example.com/a.png",
      createdAt: new Date("2026-01-01T00:00:00Z"),
    });
  });

  it("trims and lowercases category", () => {
    expect(normalizeProduct({ ...base, category: "  HOME " }).category).toBe("home");
  });

  it("fills in defaults for missing fields", () => {
    const p = normalizeProduct({
      id: 2,
      title: "Bare",
      category: "books",
      price_cents: 500,
      created_at: "2026-01-01T00:00:00Z",
      is_active: true,
    });
    expect(p.description).toBe("");
    expect(p.stock).toBe(0);
    expect(p.rating).toBeNull();
    expect(p.reviewCount).toBe(0);
    expect(p.imageUrl).toBeNull();
    expect(p.salePriceCents).toBeNull();
  });

  it("treats null stock as 0 and keeps null rating as null", () => {
    const p = normalizeProduct({ ...base, stock: null, rating: null });
    expect(p.stock).toBe(0);
    expect(p.rating).toBeNull();
  });

  it("drops a sale price that is not lower than the regular price", () => {
    expect(normalizeProduct({ ...base, sale_price_cents: 1200 }).salePriceCents).toBeNull();
    expect(normalizeProduct({ ...base, sale_price_cents: 1000 }).salePriceCents).toBeNull();
  });
});

describe("normalizeProducts", () => {
  it("removes inactive products and keeps order", () => {
    const result = normalizeProducts(RAW_PRODUCTS);
    expect(result.find((p) => p.id === 8)).toBeUndefined();
    expect(result.find((p) => p.id === 17)).toBeUndefined();
    expect(result).toHaveLength(RAW_PRODUCTS.length - 2);
    expect(result.map((p) => p.id).slice(0, 3)).toEqual([1, 2, 3]);
  });

  it("produces only known categories from the real data", () => {
    const categories = new Set(normalizeProducts(RAW_PRODUCTS).map((p) => p.category));
    expect([...categories].sort()).toEqual(["apparel", "books", "electronics", "home", "outdoors"]);
  });
});

describe("normalizePromoCode", () => {
  it("fills in defaults", () => {
    expect(normalizePromoCode({ code: "save10", type: "percent", value: 10 })).toEqual({
      code: "SAVE10",
      type: "percent",
      value: 10,
      minSubtotalCents: 0,
      category: null,
      expiresAt: null,
    });
  });

  it("parses expiry and keeps category", () => {
    const promo = normalizePromoCode({
      code: "TECH15",
      type: "percent",
      value: 15,
      category: "electronics",
      expires_at: "2025-01-01T00:00:00Z",
    });
    expect(promo.category).toBe("electronics");
    expect(promo.expiresAt).toEqual(new Date("2025-01-01T00:00:00Z"));
  });
});
