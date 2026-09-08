import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, PackageSearch, Search } from "lucide-react";

import type { PublicProductSearchSuggestion } from "@/features/catalog/services/product.service";
import {
  getProductPlaceholderAlt,
  PRODUCT_PLACEHOLDER_IMAGE_URL,
} from "@/features/catalog/product-image.constants";

interface SearchSuggestionsPanelProps {
  query: string;
  suggestions: PublicProductSearchSuggestion[];
  activeIndex: number;
  isLoading: boolean;
  error: string | null;
  listId: string;
  onActiveIndexChange: (index: number) => void;
  onNavigate: () => void;
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function SearchSuggestionsPanel({
  query,
  suggestions,
  activeIndex,
  isLoading,
  error,
  listId,
  onActiveIndexChange,
  onNavigate,
}: SearchSuggestionsPanelProps) {
  const normalizedQuery = query.trim();

  return (
    <div className="absolute left-0 right-0 top-full z-60 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">
      {isLoading ? (
        <div className="flex items-center gap-3 px-4 py-6 text-sm text-slate-500">
          <LoaderCircle className="h-5 w-5 animate-spin text-sky-700" />
          Buscando productos…
        </div>
      ) : error ? (
        <div className="px-4 py-6 text-sm text-red-700">{error}</div>
      ) : suggestions.length === 0 ? (
        <div className="px-4 py-7 text-center">
          <PackageSearch className="mx-auto h-7 w-7 text-slate-300" />

          <p className="mt-3 text-sm font-semibold text-slate-800">
            No encontramos productos
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Intenta buscar por nombre, marca, categoría, SKU o modelo.
          </p>
        </div>
      ) : (
        <div
          id={listId}
          role="listbox"
          aria-label="Sugerencias de productos"
          className="max-h-105 overflow-y-auto p-2"
        >
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              href={`/productos/${suggestion.slug}`}
              onMouseEnter={() => onActiveIndexChange(index)}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg p-3 transition ${
                index === activeIndex ? "bg-sky-50" : "hover:bg-slate-50"
              }`}
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={suggestion.image?.url ?? PRODUCT_PLACEHOLDER_IMAGE_URL}
                  alt={
                    suggestion.image?.altText ||
                    getProductPlaceholderAlt(suggestion.name)
                  }
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>

              <div className="min-w-0 flex-1">
                {suggestion.brand && (
                  <span className="block truncate text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    {suggestion.brand.name}
                  </span>
                )}

                <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                  {suggestion.name}
                </p>

                <SuggestionPrice suggestion={suggestion} />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href={{
          pathname: "/productos",
          query: {
            search: normalizedQuery,
          },
        }}
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
      >
        <Search className="h-4 w-4" />
        Ver todos los resultados para “{normalizedQuery}”
      </Link>
    </div>
  );
}

interface SuggestionPriceProps {
  suggestion: PublicProductSearchSuggestion;
}

function SuggestionPrice({ suggestion }: SuggestionPriceProps) {
  if (suggestion.saleMode === "quote_only") {
    return (
      <span className="mt-1 block text-xs font-semibold text-sky-700">
        Precio bajo cotización
      </span>
    );
  }

  if (
    suggestion.pricing.priceInCents !== null &&
    suggestion.pricing.canPurchase
  ) {
    return (
      <span className="mt-1 block text-xs font-semibold text-slate-700">
        {currencyFormatter.format(suggestion.pricing.priceInCents / 100)}
      </span>
    );
  }

  return (
    <span className="mt-1 block text-xs text-slate-500">Ver producto</span>
  );
}
