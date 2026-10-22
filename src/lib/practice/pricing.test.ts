import { describe, expect, it } from "vitest";
import {
  FLAT_SHIPPING_CENTS,
  calculateCartTotals,
  clampQuantity,
  getSubtotalCents,
  getUnitPriceCents,
} from "@/lib/practice/pricing";
import type { CartItem, Category, Product, PromoCode } from "@/lib/types";

const NOW = new Date("2026-10-13T12:00:00Z");

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: "Thing",
    description: "",
    category: "home",
    priceCents: 1000,
    salePriceCents: null,
    stock: 10,
    rating: null,
    reviewCount: 0,
    imageUrl: null,
    createdAt: new Date("2026-01-01"),
    ...overrides,
  };
}

function item(priceCents: number, quantity: number, category: Category = "home", salePriceCents: number | null = null): CartItem {
  return { product: product({ priceCents, salePriceCents, category }), quantity };
}

function promo(overrides: Partial<PromoCode>): PromoCode {
  return { code: "X", type: "percent", value: 10, minSubtotalCents: 0, category: null, expiresAt: null, ...overrides };
}

describe("getUnitPriceCents", () => {
  it("uses the regular price when not on sale", () => {
    expect(getUnitPriceCents(product({ priceCents: 1000 }))).toBe(1000);
  });
  it("uses the sale price when present", () => {
    expect(getUnitPriceCents(product({ priceCents: 1000, salePriceCents: 750 }))).toBe(750);
  });
});

describe("getSubtotalCents", () => {
  it("is 0 for an empty cart", () => {
    expect(getSubtotalCents([])).toBe(0);
  });
  it("sums unit price × quantity", () => {
    expect(getSubtotalCents([item(1000, 2), item(2000, 1, "home", 1500)])).toBe(3500);
  });
});

describe("calculateCartTotals", () => {
  it("returns all zeros for an empty cart", () => {
    expect(calculateCartTotals([], null, NOW)).toEqual({
      subtotalCents: 0,
      discountCents: 0,
      shippingCents: 0,
      taxCents: 0,
      totalCents: 0,
      promoError: null,
    });
  });

  it("charges flat shipping under the threshold and taxes the subtotal", () => {
    const t = calculateCartTotals([item(2000, 1)], null, NOW);
    expect(t.subtotalCents).toBe(2000);
    expect(t.shippingCents).toBe(FLAT_SHIPPING_CENTS);
    expect(t.taxCents).toBe(165); // 2000 * 0.0825 = 165
    expect(t.totalCents).toBe(2000 + 599 + 165);
  });

  it("gives free shipping at exactly the threshold", () => {
    expect(calculateCartTotals([item(5000, 1)], null, NOW).shippingCents).toBe(0);
  });

  it("rounds tax to the nearest cent", () => {
    // 1999 * 0.0825 = 164.9175 -> 165
    expect(calculateCartTotals([item(1999, 1)], null, NOW).taxCents).toBe(165);
  });

  it("applies a percent promo to the whole subtotal", () => {
    const t = calculateCartTotals([item(10000, 1)], promo({ type: "percent", value: 10 }), NOW);
    expect(t.discountCents).toBe(1000);
    expect(t.taxCents).toBe(Math.round(9000 * 0.0825));
    expect(t.totalCents).toBe(10000 - 1000 + 0 + 743);
    expect(t.promoError).toBeNull();
  });

  it("applies a fixed promo but never below zero", () => {
    const t = calculateCartTotals([item(1500, 1)], promo({ type: "fixed", value: 2000 }), NOW);
    expect(t.discountCents).toBe(1500);
    expect(t.taxCents).toBe(0);
  });

  it("discount can push the cart back under the free-shipping threshold", () => {
    const t = calculateCartTotals([item(5000, 1)], promo({ type: "percent", value: 10 }), NOW);
    expect(t.shippingCents).toBe(FLAT_SHIPPING_CENTS);
  });

  it("rejects an expired promo", () => {
    const t = calculateCartTotals([item(5000, 1)], promo({ expiresAt: new Date("2025-01-01") }), NOW);
    expect(t.discountCents).toBe(0);
    expect(t.promoError).toBe("This code has expired");
  });

  it("rejects a promo under the minimum spend, saying how much more to spend", () => {
    const t = calculateCartTotals([item(8000, 1)], promo({ type: "fixed", value: 2000, minSubtotalCents: 10000 }), NOW);
    expect(t.discountCents).toBe(0);
    expect(t.promoError).toBe("Spend $20.00 more to use this code");
  });

  it("applies a category promo only to matching items", () => {
    const t = calculateCartTotals(
      [item(10000, 1, "electronics"), item(4000, 1, "books")],
      promo({ type: "percent", value: 15, category: "electronics" }),
      NOW,
    );
    expect(t.discountCents).toBe(1500);
  });

  it("rejects a category promo when no items match", () => {
    const t = calculateCartTotals([item(4000, 1, "books")], promo({ category: "electronics" }), NOW);
    expect(t.discountCents).toBe(0);
    expect(t.promoError).toBe("This code only applies to electronics items");
  });
});

describe("clampQuantity", () => {
  const p = product({ stock: 3 });
  it("passes through valid quantities", () => expect(clampQuantity(2, p)).toBe(2));
  it("caps at stock", () => expect(clampQuantity(10, p)).toBe(3));
  it("never goes below 0", () => expect(clampQuantity(-1, p)).toBe(0));
  it("floors non-integers", () => expect(clampQuantity(2.7, p)).toBe(2));
});
