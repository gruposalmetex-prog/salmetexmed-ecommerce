import type { PublicProductCard } from "../services/product.service";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  products: PublicProductCard[];
}

export function RelatedProducts({
  products,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-products-title"
      className="mt-16 border-t border-slate-200 pt-12"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
          También te puede interesar
        </p>

        <h2
          id="related-products-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
        >
          Productos relacionados
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Conoce otros productos disponibles dentro de las mismas categorías.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}