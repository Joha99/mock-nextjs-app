import { Product } from "./types";

type Filters = {
  q?: string;
  category?: string;
  sort?: string;
  inStock?: string;
};

export const filterProducts = (
  products: Product[],
  filters: Filters,
): Product[] => {
  const filteredProducts: Product[] = [];
  const params = new URLSearchParams();

  for (const entry of Object.entries(filters)) {
    params.set(entry[0], entry[1]);
  }

  for (const product of products) {
    const category = params.get("category");
    const inStock = params.get("inStock");
    const query = params.get("q");

    if (category !== null && product.category !== category) {
      continue;
    }

    if (inStock !== null && product.stock === 0) {
      continue;
    }

    if (query !== null) {
      const titleContainsQ = product.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const descContainsQ = product.description
        .toLowerCase()
        .includes(query.toLowerCase());
      if (!titleContainsQ && !descContainsQ) {
        continue;
      }
    }

    filteredProducts.push(product);
  }
  return filteredProducts;
};
