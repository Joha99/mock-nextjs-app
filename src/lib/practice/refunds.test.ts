import { describe, expect, it } from "vitest";
import { calculateRefund, type Order } from "@/lib/practice/refunds";

const DAY = 24 * 60 * 60 * 1000;
const PLACED = new Date("2026-10-01T12:00:00Z");
const NOW = new Date("2026-10-15T12:00:00Z");

// subtotal 7500, 10% discount (750), shipping 599, tax 8%
const order: Order = {
  placedAt: PLACED,
  items: [
    { sku: "A", unitPriceCents: 2000, quantity: 2, finalSale: false },
    { sku: "B", unitPriceCents: 1500, quantity: 1, finalSale: false },
    { sku: "C", unitPriceCents: 500, quantity: 4, finalSale: true },
  ],
  discountCents: 750,
  shippingCents: 599,
  taxRate: 0.08,
};

describe("calculateRefund: amounts", () => {
  it("refunds one item with its share of the discount and tax", () => {
    expect(calculateRefund(order, [{ sku: "A", quantity: 1 }], NOW)).toEqual({
      ok: true, itemsCents: 1800, taxCents: 144, shippingCents: 0, totalCents: 1944,
    });
  });

  it("refunds several items; no shipping while something is kept", () => {
    expect(
      calculateRefund(order, [{ sku: "A", quantity: 2 }, { sku: "B", quantity: 1 }], NOW),
    ).toEqual({ ok: true, itemsCents: 4950, taxCents: 396, shippingCents: 0, totalCents: 5346 });
  });

  it("refunds shipping when everything is returned", () => {
    const small: Order = {
      placedAt: PLACED,
      items: [
        { sku: "X", unitPriceCents: 1000, quantity: 1, finalSale: false },
        { sku: "Y", unitPriceCents: 3000, quantity: 1, finalSale: false },
      ],
      discountCents: 0,
      shippingCents: 599,
      taxRate: 0.1,
    };
    expect(
      calculateRefund(small, [{ sku: "X", quantity: 1 }, { sku: "Y", quantity: 1 }], NOW),
    ).toEqual({ ok: true, itemsCents: 4000, taxCents: 400, shippingCents: 599, totalCents: 4999 });
  });

  it("rounds the discount share and the tax", () => {
    const odd: Order = {
      placedAt: PLACED,
      items: [
        { sku: "P", unitPriceCents: 333, quantity: 1, finalSale: false },
        { sku: "Q", unitPriceCents: 333, quantity: 2, finalSale: false },
      ],
      discountCents: 100,
      shippingCents: 0,
      taxRate: 0.0825,
    };
    expect(calculateRefund(odd, [{ sku: "P", quantity: 1 }], NOW)).toEqual({
      ok: true, itemsCents: 300, taxCents: 25, shippingCents: 0, totalCents: 325,
    });
  });

  it("combines repeated skus", () => {
    const result = calculateRefund(order, [{ sku: "A", quantity: 1 }, { sku: "A", quantity: 1 }], NOW);
    expect(result).toEqual(calculateRefund(order, [{ sku: "A", quantity: 2 }], NOW));
  });

  it("does not mutate the inputs", () => {
    const requests = [{ sku: "A", quantity: 1 }];
    const before = JSON.stringify({ order, requests });
    calculateRefund(order, requests, NOW);
    expect(JSON.stringify({ order, requests })).toBe(before);
  });
});

describe("calculateRefund: errors", () => {
  it("allows exactly 30 days, rejects anything later", () => {
    const at30 = new Date(PLACED.getTime() + 30 * DAY);
    expect(calculateRefund(order, [{ sku: "A", quantity: 1 }], at30).ok).toBe(true);
    const after = new Date(at30.getTime() + 1);
    expect(calculateRefund(order, [{ sku: "A", quantity: 1 }], after)).toEqual({
      ok: false, error: "Return window has closed",
    });
  });

  it("checks the window before anything else", () => {
    const late = new Date(PLACED.getTime() + 31 * DAY);
    expect(calculateRefund(order, [{ sku: "Z", quantity: 1 }], late)).toEqual({
      ok: false, error: "Return window has closed",
    });
  });

  it("rejects an empty request", () => {
    expect(calculateRefund(order, [], NOW)).toEqual({ ok: false, error: "Nothing to return" });
  });

  it("rejects unknown items", () => {
    expect(calculateRefund(order, [{ sku: "Z", quantity: 1 }], NOW)).toEqual({
      ok: false, error: "Unknown item: Z",
    });
  });

  it("rejects quantities that aren't positive integers", () => {
    for (const quantity of [0, -1, 1.5]) {
      expect(calculateRefund(order, [{ sku: "A", quantity }], NOW)).toEqual({
        ok: false, error: "Invalid quantity for A",
      });
    }
  });

  it("rejects returning more than was bought (after combining)", () => {
    expect(calculateRefund(order, [{ sku: "A", quantity: 2 }, { sku: "A", quantity: 1 }], NOW)).toEqual({
      ok: false, error: "Only 2 of A can be returned",
    });
  });

  it("rejects final-sale items", () => {
    expect(calculateRefund(order, [{ sku: "C", quantity: 1 }], NOW)).toEqual({
      ok: false, error: "C is final sale",
    });
  });
});
