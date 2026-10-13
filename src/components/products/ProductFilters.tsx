"use client";

/**
 * 🛠️ FEATURE 3 — search, category filter, sort. State lives in the URL.
 *
 * Why the URL and not useState? A filtered view becomes shareable and
 * bookmarkable, survives refresh, and the back button works. Say this out loud.
 *
 * URL shape:  /products?q=tent&category=outdoors&sort=price-asc
 *   q         free text, case-insensitive match on title OR description
 *   category  one of CATEGORIES (src/lib/normalize.ts) or absent for "All"
 *   sort      "featured" (default — API order) | "price-asc" | "price-desc"
 *             | "rating" (highest first, nulls LAST) | "newest"
 *             Price sorting uses the EFFECTIVE price (sale price if on sale).
 *   inStock   "1" to hide out-of-stock products
 *
 * This component only UPDATES the URL. The page (a Server Component) reads
 * searchParams and does the actual filtering. Put that filtering/sorting in a
 * pure function (e.g. src/lib/filterProducts.ts) and test it.
 *
 * Hooks you'll need (from "next/navigation"):
 *   const router = useRouter();
 *   const pathname = usePathname();
 *   const searchParams = useSearchParams();
 *
 * Updating one param while keeping the others:
 *   const params = new URLSearchParams(searchParams);
 *   value ? params.set(key, value) : params.delete(key);
 *   router.replace(`${pathname}?${params.toString()}`);
 *
 * Details that interviewers notice:
 *   - Debounce the search input (~300ms) so you don't navigate on every key.
 *   - Use router.replace (not push) for typing, so Back doesn't step through
 *     every keystroke.
 *   - Initialize the inputs FROM the URL so a refreshed page shows the
 *     current filters.
 *   - A "Clear filters" button when any filter is active.
 *   - Bonus: useTransition() to show a subtle pending state while the server
 *     re-renders the list.
 *
 * Gotcha: a component that calls useSearchParams() must be inside a
 * <Suspense> boundary, or the build fails with a "missing Suspense boundary"
 * error. products/loading.tsx already provides one for the whole page, but
 * know that the error exists.
 */
export function ProductFilters() {
  return <div className="text-zinc-500">TODO (Feature 3): search / category / sort controls</div>;
}
