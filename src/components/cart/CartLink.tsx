"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

/**
 * ✅ ALREADY IMPLEMENTED — header cart link with a badge.
 * It will start showing a count as soon as CartProvider's itemCount works.
 */
export function CartLink() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" className="relative text-sm text-zinc-600 hover:text-zinc-900">
      Cart
      {itemCount > 0 && (
        <span className="ml-1 rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white">{itemCount}</span>
      )}
    </Link>
  );
}
