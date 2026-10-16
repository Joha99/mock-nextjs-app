"use client";

import { CATEGORIES } from "@/lib/normalize";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

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
 * This component only updates the URL. The page (a Server Component) reads
 * searchParams and does the actual filtering. Put that filtering/sorting in a
 * pure function (e.g. src/lib/filterProducts.ts) and test it.
 */

type QueryParam = "q" | "category" | "sort" | "inStock";
type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const INPUT_DEBOUNCE_MS = 300;

const InputGroup = ({ children }: PropsWithChildren) => {
  return (
    <div className="border-gray-400 border-solid outline rounded-2xl px-3 py-1 flex align-center gap-1">
      {children}
    </div>
  );
};

export function ProductFilters() {
  // Let's you programmatically change routes inside client components
  const router = useRouter();

  // Let's you read the current URL's pathname
  const pathname = usePathname();

  // Let's you read the current URL's query string;
  const searchParams = useSearchParams();

  const defaultCategory = searchParams.get("category") ?? "";
  const defaultSort = searchParams.get("sort") ?? "featured";
  const defaultInStock = searchParams.get("inStock") === "1";

  const defaultSearchInput = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState<string>(defaultSearchInput);

  const updateQueryParams = (queryParam: QueryParam, newValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === "") {
      params.delete(queryParam);
    } else {
      params.set(queryParam, newValue);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput === (searchParams.get("q") ?? "")) return;
      updateQueryParams("q", searchInput);
    }, INPUT_DEBOUNCE_MS);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchInput, searchParams]);

  return (
    <div className="flex gap-3">
      <InputGroup>
        <label htmlFor="search">Search:</label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Product name"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.currentTarget.value);
          }}
        />
      </InputGroup>

      <InputGroup>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={defaultCategory}
          onChange={(e) => {
            const newCategory = e.currentTarget.value;
            updateQueryParams("category", newCategory);
          }}
        >
          <option value="">All</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </InputGroup>

      <InputGroup>
        <label htmlFor="sort">Sort:</label>
        <select
          id="sort"
          name="sort"
          value={defaultSort}
          onChange={(e) => {
            const newSort = e.currentTarget.value;
            updateQueryParams("sort", newSort);
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price ascending</option>
          <option value="price-desc">Price descending</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </InputGroup>

      <InputGroup>
        <input
          id="in-stock"
          name="in-stock"
          type="checkbox"
          checked={defaultInStock}
          onChange={(e) => {
            const newChecked = e.currentTarget.checked;
            updateQueryParams("inStock", newChecked === true ? "1" : "");
          }}
        />
        <label htmlFor="in-stock">In stock</label>
      </InputGroup>

      {searchParams.size > 0 && (
        <button
          className="rounded-2xl border border-red-600 border-solid px-3 py-1"
          onClick={() => {
            router.replace(pathname);
            setSearchInput("");
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
