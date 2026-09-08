import type { Metadata } from "next";
import Link from "next/link";

import { CatalogSidebar } from "@/features/catalog/components/principal-list/catalog-sidebar";
import { CatalogToolbar } from "@/features/catalog/components/principal-list/catalog-toolbar";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import {
  getPublicAreaMetadataBySlug,
  getPublicCatalogFilters,
  getPublicCategoryMetadataBySlug,
} from "@/features/catalog/services/catalog-filter.service";
import {
  getPublicProducts,
  isProductSort,
} from "@/features/catalog/services/product.service";

const DEFAULT_CATALOG_DESCRIPTION =
  "Compra y cotiza equipo médico, mobiliario hospitalario e insumos para hospitales, clínicas y consultorios en México. Recibe asesoría especializada.";

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string | string[];
    area?: string | string[];
    category?: string | string[];
    brand?: string | string[];
    inStock?: string | string[];
    minPrice?: string | string[];
    maxPrice?: string | string[];
    search?: string | string[];
    featured?: string | string[];
    promotion?: string | string[];
    saleMode?: string | string[];
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const parameters = await searchParams;

  const categorySlugs = normalizeSearchParameter(parameters.category);

  const areaSlugs = normalizeSearchParameter(parameters.area);

  const categorySlug =
    categorySlugs.length === 1 ? categorySlugs[0] : undefined;

  const areaSlug = areaSlugs.length === 1 ? areaSlugs[0] : undefined;

  const [category, area] = await Promise.all([
    categorySlug
      ? getPublicCategoryMetadataBySlug(categorySlug)
      : Promise.resolve(null),

    !categorySlug && areaSlug
      ? getPublicAreaMetadataBySlug(areaSlug)
      : Promise.resolve(null),
  ]);

  const hasGeneralFilters =
    normalizeSearchParameter(parameters.brand).length > 0 ||
    normalizeSearchText(parameters.search).length > 0 ||
    normalizeSearchParameter(parameters.saleMode).length > 0 ||
    parameters.inStock === "true" ||
    parameters.featured === "true" ||
    parameters.promotion === "true" ||
    typeof parameters.minPrice === "string" ||
    typeof parameters.maxPrice === "string" ||
    (typeof parameters.sort === "string" && parameters.sort !== "featured");

  if (category) {
    const description =
      category.summary ??
      `Explora productos de ${category.name} para hospitales, clínicas y consultorios.`;

    return {
      title: category.title,
      description,

      alternates: {
        canonical: `/productos?category=${encodeURIComponent(category.slug)}`,
      },

      robots: {
        index: areaSlugs.length === 0 && !hasGeneralFilters,
        follow: true,
      },
    };
  }

  if (area) {
    const description =
      area.summary ??
      `Explora equipo médico para ${area.name}. Compra o solicita una cotización especializada.`;

    return {
      title: area.title,
      description,

      alternates: {
        canonical: `/productos?area=${encodeURIComponent(area.slug)}`,
      },

      robots: {
        index: categorySlugs.length === 0 && !hasGeneralFilters,
        follow: true,
      },
    };
  }

  const hasAnyFilters =
    categorySlugs.length > 0 || areaSlugs.length > 0 || hasGeneralFilters;

  return {
    title: "Equipo médico y mobiliario hospitalario",

    description: DEFAULT_CATALOG_DESCRIPTION,

    alternates: {
      canonical: "/productos",
    },

    robots: {
      index: !hasAnyFilters,
      follow: true,
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const parameters = await searchParams;

  const search = normalizeSearchText(parameters.search);

  const minPrice =
    typeof parameters.minPrice === "string" ? parameters.minPrice : "";

  const maxPrice =
    typeof parameters.maxPrice === "string" ? parameters.maxPrice : "";

  const selectedFilters = {
    search,

    areas: normalizeSearchParameter(parameters.area),

    categories: normalizeSearchParameter(parameters.category),

    brands: normalizeSearchParameter(parameters.brand),

    inStock: parameters.inStock === "true",

    minPrice,
    maxPrice,

    minPriceInCents: parsePriceInCents(parameters.minPrice),

    maxPriceInCents: parsePriceInCents(parameters.maxPrice),

    featured: parameters.featured === "true" ? true : undefined,

    promotion: parameters.promotion === "true",

    saleModes: normalizeSearchParameter(parameters.saleMode).filter(
      isProductSaleMode,
    ),
  };

  const sort = isProductSort(parameters.sort) ? parameters.sort : "featured";

  const selectedCategorySlug =
    selectedFilters.categories.length === 1
      ? selectedFilters.categories[0]
      : undefined;

  const selectedAreaSlug =
    selectedFilters.areas.length === 1 ? selectedFilters.areas[0] : undefined;

  const [products, filterOptions, selectedCategory, selectedArea] =
    await Promise.all([
      getPublicProducts({
        sort,
        filters: selectedFilters,
      }),

      getPublicCatalogFilters(),

      selectedCategorySlug
        ? getPublicCategoryMetadataBySlug(selectedCategorySlug)
        : Promise.resolve(null),

      !selectedCategorySlug && selectedAreaSlug
        ? getPublicAreaMetadataBySlug(selectedAreaSlug)
        : Promise.resolve(null),
    ]);

  const selectedCatalogGroup = selectedCategory ?? selectedArea;

  const pageTitle = search
    ? `Resultados para “${search}”`
    : (selectedCatalogGroup?.name ?? "Equipo médico");

  let pageDescription =
    "Explora nuestro catálogo de equipo médico para hospitales, clínicas y consultorios.";

  if (selectedCatalogGroup) {
    pageDescription =
      selectedCatalogGroup.shortDescription ??
      selectedCatalogGroup.description ??
      `Explora nuestros productos de ${selectedCatalogGroup.name}.`;
  }

  if (search) {
    pageDescription =
      products.length === 0
        ? "No encontramos productos que coincidan con tu búsqueda."
        : `Encontramos ${products.length} ${
            products.length === 1 ? "producto" : "productos"
          } relacionado${products.length === 1 ? "" : "s"} con tu búsqueda.`;
  }

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-sky-700">
            Inicio
          </Link>

          <span className="mx-2">/</span>

          <Link href="/productos" className="transition hover:text-sky-700">
            Productos
          </Link>

          {selectedCatalogGroup && (
            <>
              <span className="mx-2">/</span>

              <span className="font-medium text-slate-700">
                {selectedCatalogGroup.name}
              </span>
            </>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <CatalogSidebar
            filters={filterOptions}
            selectedFilters={{
              area: selectedFilters.areas,

              category: selectedFilters.categories,

              brand: selectedFilters.brands,

              inStock: selectedFilters.inStock,

              minPrice: selectedFilters.minPrice,

              maxPrice: selectedFilters.maxPrice,
            }}
          />

          <div className="min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {pageTitle}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {pageDescription}
              </p>

              {search && (
                <Link
                  href="/productos"
                  className="mt-3 inline-flex text-sm font-semibold text-sky-700 transition hover:text-sky-800"
                >
                  Limpiar búsqueda
                </Link>
              )}
            </div>

            <CatalogToolbar productCount={products.length} sort={sort} />

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeSearchParameter(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function parsePriceInCents(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return undefined;
  }

  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    return undefined;
  }

  return Math.round(price * 100);
}

function normalizeSearchText(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, 100);
}

const PRODUCT_SALE_MODES = [
  "direct_purchase",
  "quote_only",
  "contact_only",
] as const;

type ProductSaleMode = (typeof PRODUCT_SALE_MODES)[number];

function isProductSaleMode(value: string): value is ProductSaleMode {
  return PRODUCT_SALE_MODES.includes(value as ProductSaleMode);
}
