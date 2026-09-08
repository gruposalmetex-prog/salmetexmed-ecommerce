"use client";

import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import type { ProductSort } from "../../services/product.service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

interface CatalogToolbarProps {
  productCount: number;
  sort: ProductSort;
}

export function CatalogToolbar({ productCount, sort }: CatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextSort = event.target.value;
    const parameters = new URLSearchParams(searchParams.toString());

    if (nextSort === "featured") {
      parameters.delete("sort");
    } else {
      parameters.set("sort", nextSort);
    }

    const query = parameters.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }
  return (
    <div className="mb-6 flex flex-col gap-4 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700">
          <span className="font-semibold text-slate-950">{productCount}</span>{" "}
          {productCount === 1 ? "producto" : "productos"}
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-1 rounded-lg border border-slate-200 p-1 sm:flex">
          <button
            type="button"
            aria-label="Vista en cuadrícula"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-700 text-white"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Vista en lista"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          <label
            htmlFor="catalog-sort"
            className="hidden text-sm text-slate-500 md:block"
          >
            Ordenar por
          </label>

          <select
            id="catalog-sort"
            value={sort}
            onChange={handleSortChange}
            className="h-10 min-w-45 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 sm:flex-none"
          >
            <option value="featured">Destacados</option>
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
