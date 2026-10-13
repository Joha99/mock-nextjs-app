import Link from "next/link";

/**
 * ✅ ALREADY IMPLEMENTED — rendered when the detail page calls `notFound()`.
 */
export default function ProductNotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Product not found</h1>
      <p className="text-zinc-600">It may have been removed or never existed.</p>
      <Link href="/products" className="text-blue-600 hover:underline">
        ← Back to products
      </Link>
    </div>
  );
}
