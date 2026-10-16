import { Filters, Product } from "./types";

export const filterProducts = (
  products: Product[],
  filters: Filters,
): Product[] => {
  const { q, category, inStock } = filters;
  const filteredProducts: Product[] = [];

  for (const product of products) {
    if (category !== undefined && product.category !== category) {
      continue;
    }

    if (inStock !== undefined && product.stock === 0) {
      continue;
    }

    if (q !== undefined) {
      const titleContainsQ = product.title
        .toLowerCase()
        .includes(q.toLowerCase());
      const descContainsQ = product.description
        .toLowerCase()
        .includes(q.toLowerCase());
      if (!titleContainsQ && !descContainsQ) {
        continue;
      }
    }

    filteredProducts.push(product);
  }
  return filteredProducts;
};

export const sortProducts = (
  products: Product[],
  filters: Filters,
): Product[] => {
  const { sort } = filters;
  let sortedProducts: Product[] = [...products];

  if (!sort) {
    return products;
  }

  if (sort === "price-asc") {
    sortedProducts.sort(
      (a, b) =>
        (a.salePriceCents ?? a.priceCents) - (b.salePriceCents ?? b.priceCents),
    );
  } else if (sort === "price-desc") {
    sortedProducts.sort(
      (a, b) =>
        (b.salePriceCents ?? b.priceCents) - (a.salePriceCents ?? a.priceCents),
    );
  } else if (sort === "rating") {
    const ratings = products.filter((product) => product.rating !== null);
    const sortedRatings = [...ratings].sort((a, b) => b.rating! - a.rating!);
    const noRatings = products.filter((product) => product.rating === null);
    sortedProducts = [...sortedRatings, ...noRatings];
  } else if (sort === "newest") {
    sortedProducts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  return sortedProducts;
};
