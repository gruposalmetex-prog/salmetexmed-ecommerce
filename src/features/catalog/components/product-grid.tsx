import type { PublicProductCard } from "../services/product.service";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: PublicProductCard[];
}

export function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-slate-950">
          No hay productos disponibles
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          El catálogo todavía no tiene productos publicados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}