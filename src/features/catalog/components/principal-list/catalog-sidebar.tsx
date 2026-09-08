"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PublicCatalogFilters } from "../../services/catalog-filter.service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CatalogFilterName = "area" | "category" | "brand";

interface SelectedCatalogFilters {
  area: string[];
  category: string[];
  brand: string[];
  inStock: boolean;
  minPrice: string;
  maxPrice: string;
}

interface CatalogSidebarProps {
  filters: PublicCatalogFilters;
  selectedFilters: SelectedCatalogFilters;
}

export function CatalogSidebar({
  filters,
  selectedFilters,
}: CatalogSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceDraft, setPriceDraft] = useState(() => ({
    sourceMinPrice: selectedFilters.minPrice,

    sourceMaxPrice: selectedFilters.maxPrice,

    minPrice: selectedFilters.minPrice,

    maxPrice: selectedFilters.maxPrice,
  }));

  const priceDraftIsCurrent =
    priceDraft.sourceMinPrice === selectedFilters.minPrice &&
    priceDraft.sourceMaxPrice === selectedFilters.maxPrice;

  const minPrice = priceDraftIsCurrent
    ? priceDraft.minPrice
    : selectedFilters.minPrice;

  const maxPrice = priceDraftIsCurrent
    ? priceDraft.maxPrice
    : selectedFilters.maxPrice;

  function updateMinPrice(value: string) {
    setPriceDraft({
      sourceMinPrice: selectedFilters.minPrice,

      sourceMaxPrice: selectedFilters.maxPrice,

      minPrice: value,
      maxPrice,
    });
  }

  function updateMaxPrice(value: string) {
    setPriceDraft({
      sourceMinPrice: selectedFilters.minPrice,

      sourceMaxPrice: selectedFilters.maxPrice,

      minPrice,
      maxPrice: value,
    });
  }

  function updateFilter(
    name: CatalogFilterName,
    value: string,
    checked: boolean,
  ) {
    const parameters = new URLSearchParams(searchParams.toString());

    const currentValues = parameters
      .getAll(name)
      .filter((currentValue) => currentValue !== value);

    parameters.delete(name);

    for (const currentValue of currentValues) {
      parameters.append(name, currentValue);
    }

    if (checked) {
      parameters.append(name, value);
    }

    parameters.delete("page");

    const query = parameters.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function updateAvailability(checked: boolean) {
    const parameters = new URLSearchParams(searchParams.toString());

    if (checked) {
      parameters.set("inStock", "true");
    } else {
      parameters.delete("inStock");
    }

    parameters.delete("page");

    const query = parameters.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clearFilters() {
    const parameters = new URLSearchParams(searchParams.toString());

    parameters.delete("area");
    parameters.delete("category");
    parameters.delete("brand");
    parameters.delete("page");
    parameters.delete("inStock");

    parameters.delete("minPrice");
    parameters.delete("maxPrice");

    setPriceDraft({
      sourceMinPrice: selectedFilters.minPrice,

      sourceMaxPrice: selectedFilters.maxPrice,

      minPrice: "",
      maxPrice: "",
    });

    const query = parameters.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function applyPriceFilter() {
    const parameters = new URLSearchParams(searchParams.toString());

    if (minPrice) {
      parameters.set("minPrice", minPrice);
    } else {
      parameters.delete("minPrice");
    }

    if (maxPrice) {
      parameters.set("maxPrice", maxPrice);
    } else {
      parameters.delete("maxPrice");
    }

    parameters.delete("page");

    const query = parameters.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
        </div>

        {/* Disponibilidad */}
        <div className="border-b border-slate-200 pb-8">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={selectedFilters.inStock}
              onChange={(event) => updateAvailability(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
            />
            En existencia
          </label>
        </div>

        {/* Precio */}
        <div className="border-b border-slate-200 pb-8">
          <h3 className="mb-4 text-sm font-semibold text-slate-950">Precio</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs text-slate-500">Desde</label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => updateMinPrice(event.target.value)}
                  placeholder="0"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-500">Hasta</label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => updateMaxPrice(event.target.value)}
                  placeholder="50000"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={applyPriceFilter}
            className="mt-3 w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Aplicar precio
          </button>
        </div>

        {/* Áreas */}

        <FilterSection title="Áreas médicas">
          <div className="space-y-3">
            {filters.areas.map((area) => (
              <FilterCheckbox
                key={area.slug}
                name="area"
                value={area.slug}
                label={area.name}
                count={area.count}
                checked={selectedFilters.area.includes(area.slug)}
                onCheckedChange={(checked) =>
                  updateFilter("area", area.slug, checked)
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Categorías */}
        <FilterSection title="Categorías">
          <div className="space-y-3">
            {filters.categories.map((category) => (
              <FilterCheckbox
                key={category.slug}
                name="category"
                value={category.slug}
                label={category.name}
                count={category.count}
                checked={selectedFilters.category.includes(category.slug)}
                onCheckedChange={(checked) =>
                  updateFilter("category", category.slug, checked)
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Marcas */}
        <FilterSection title="Marcas">
          <div className="space-y-3">
            {filters.brands.map((brand) => (
              <FilterCheckbox
                key={brand.slug}
                name="brand"
                value={brand.slug}
                label={brand.name}
                count={brand.count}
                checked={selectedFilters.brand.includes(brand.slug)}
                onCheckedChange={(checked) =>
                  updateFilter("brand", brand.slug, checked)
                }
              />
            ))}
          </div>
        </FilterSection>

        <button
          type="button"
          onClick={clearFilters}
          className="w-full cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="border-b border-slate-200 pb-8">
      <button
        type="button"
        className="mb-4 flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold text-slate-950">{title}</span>

        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {children}
    </div>
  );
}

interface FilterCheckboxProps {
  name: CatalogFilterName;
  value: string;
  label: string;
  count: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function FilterCheckbox({
  name,
  value,
  label,
  count,
  checked,
  onCheckedChange,
}: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-sky-700 focus:ring-sky-600"
        />

        <span className="truncate text-sm text-slate-700">{label}</span>
      </div>

      <span className="text-xs text-slate-400">{count}</span>
    </label>
  );
}
