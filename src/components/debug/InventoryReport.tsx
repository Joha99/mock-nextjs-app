"use client";
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect --
   Lint is off in this file so it doesn't hand you the answers. Removing this
   line and running `npm run lint` is a legit debugging move! */

import { useEffect, useState } from "react";
import { formatCents } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * 🐛 FEATURE 8 — DEBUG LAB.
 *
 * This component "works" but has 4 planted bugs. The symptoms are described
 * in FEATURES.md (Feature 8). Your job is to reproduce each one, explain the
 * ROOT CAUSE out loud, and fix it with the smallest sensible change.
 *
 * Don't read the code top-to-bottom hunting for bugs — that's not how it goes
 * in an interview. Practice the process: reproduce → form a hypothesis →
 * verify (console.log, React DevTools, breakpoints) → fix → re-test.
 */
export function InventoryReport({ products }: { products: Product[] }) {
  const [threshold, setThreshold] = useState(5);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    setLowStockCount(products.filter((p) => p.stock <= threshold).length);
  }, []);

  const lowestStock = products.sort((a, b) => a.stock - b.stock).slice(0, 5);

  const visible = hideOutOfStock ? products.filter((p) => p.stock > 0) : products;

  const inventoryValueCents = products.reduce((sum, p) => sum + p.priceCents * p.stock, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total inventory value" value={formatCents(inventoryValueCents / 100)} />
        <Stat label={`Products with stock ≤ ${threshold}`} value={String(lowStockCount)} />
        <label className="rounded-lg border border-zinc-200 bg-white p-4 text-sm">
          <span className="text-zinc-500">Low-stock threshold</span>
          <input
            type="number"
            min={0}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1"
          />
        </label>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">5 lowest-stock products</h2>
        <ul className="list-inside list-disc text-sm">
          {lowestStock.map((p) => (
            <li key={p.id}>
              {p.title} — {p.stock} left
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">All products (by ID)</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hideOutOfStock} onChange={(e) => setHideOutOfStock(e.target.checked)} />
            Hide out of stock
          </label>
        </div>
        <table className="w-full rounded-lg border border-zinc-200 bg-white text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Reorder?</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p, index) => (
              <Row key={index} product={p} />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Row({ product }: { product: Product }) {
  const [markedForReorder, setMarkedForReorder] = useState(false);
  return (
    <tr className="border-t border-zinc-100">
      <td className="p-2 font-mono">{product.id}</td>
      <td className="p-2">{product.title}</td>
      <td className="p-2">{product.stock}</td>
      <td className="p-2">
        <input type="checkbox" checked={markedForReorder} onChange={(e) => setMarkedForReorder(e.target.checked)} />
      </td>
    </tr>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
