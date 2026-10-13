import Link from "next/link";

/**
 * Home page ("/"). Nothing to build here — it's a map of the exercises.
 * Full details for each feature live in FEATURES.md at the project root.
 */

const FEATURES = [
  { n: 0, title: "Orientation", where: "README.md", href: "/api/products" },
  { n: 1, title: "Fetch & render the product list", where: "src/lib/api.ts, src/app/products/page.tsx", href: "/products" },
  { n: 2, title: "Normalize messy API data", where: "src/lib/normalize.ts", href: null },
  { n: 3, title: "Search, filter & sort (synced to the URL)", where: "src/components/products/ProductFilters.tsx", href: "/products" },
  { n: 4, title: "Product detail page", where: "src/app/products/[id]/page.tsx", href: "/products/1" },
  { n: 5, title: "Cart state", where: "src/components/cart/CartProvider.tsx", href: "/cart" },
  { n: 6, title: "Pricing business logic", where: "src/lib/pricing.ts", href: "/cart" },
  { n: 7, title: "Promo codes", where: "src/components/cart/PromoCodeForm.tsx", href: "/cart" },
  { n: 8, title: "Debug lab (find 4 planted bugs)", where: "src/components/debug/InventoryReport.tsx", href: "/debug" },
  { n: 9, title: "Stretch goals", where: "FEATURES.md", href: null },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Next.js interview practice</h1>
        <p className="mt-1 text-zinc-600">
          Work through the features in order. Specs are in <code>FEATURES.md</code>; run <code>npm test</code> to check the
          business logic.
        </p>
      </div>
      <ol className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {FEATURES.map((f) => (
          <li key={f.n} className="flex items-center gap-4 px-4 py-3">
            <span className="w-6 text-right font-mono text-sm text-zinc-400">{f.n}</span>
            <div className="flex-1">
              <div className="font-medium">{f.title}</div>
              <div className="font-mono text-xs text-zinc-500">{f.where}</div>
            </div>
            {f.href && (
              <Link href={f.href} className="text-sm text-blue-600 hover:underline">
                Open →
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
