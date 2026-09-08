"use client";

import Link from "next/link";
import {
  ChevronRight,
  Trash2,
} from "lucide-react";

import { ProductCard } from "@/features/catalog/components/product-card";

import { useResolvedFavorites } from "../hooks/use-resolved-favorites";
import { FavoritesEmpty } from "./favorites-empty";
import {
  FavoritesError,
  FavoritesLoading,
  FavoritesUpdating,
} from "./favorites-feedback";
import { useFavorites } from "../favorites-provider";

export function FavoritesView() {
  const {
    productIds,
    isReady,
    clearFavorites,
  } = useFavorites();

  const {
    favorites,
    error,
    isLoading,
    retry,
  } = useResolvedFavorites();
  const products =
    favorites?.products.filter(
      (product) =>
        productIds.includes(product.id),
    ) ?? [];

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="transition hover:text-sky-700"
          >
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span className="font-medium text-slate-800">
            Favoritos
          </span>
        </nav>

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Tus favoritos
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {productIds.length === 0
                ? "Todavía no has guardado ningún producto."
                : `${productIds.length} ${
                    productIds.length === 1
                      ? "producto guardado"
                      : "productos guardados"
                  }.`}
            </p>
          </div>

          {productIds.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:self-auto"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar favoritos
            </button>
          )}
        </div>

        {isLoading && favorites && (
          <FavoritesUpdating />
        )}

        {!isReady ||
        (isLoading && !favorites) ? (
          <FavoritesLoading />
        ) : error && !favorites ? (
          <FavoritesError
            message={error}
            onRetry={retry}
          />
        ) : products.length === 0 ? (
          <FavoritesEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}