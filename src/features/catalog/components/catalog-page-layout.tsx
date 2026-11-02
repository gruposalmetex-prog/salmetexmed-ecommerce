import Link from "next/link";

import type { PublicCatalogFilters } from "../services/catalog-filter.service";
import type {
  ProductSort,
  PublicProductCard,
} from "../services/product.service";
import { CatalogSidebar } from "./principal-list/catalog-sidebar";
import { CatalogToolbar } from "./principal-list/catalog-toolbar";
import { ProductGrid } from "./product-grid";

type CatalogSelectedFilters = React.ComponentProps<
  typeof CatalogSidebar
>["selectedFilters"];

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CatalogPageLayoutProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  filters: PublicCatalogFilters;
  selectedFilters: CatalogSelectedFilters;
  products: PublicProductCard[];
  sort: ProductSort;
  children?: React.ReactNode;
  basePath?: string;
}

export function CatalogPageLayout({
  title,
  description,
  breadcrumbs,
  filters,
  selectedFilters,
  products,
  sort,
  children,
  basePath,
}: CatalogPageLayoutProps) {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`}>
              {index > 0 && <span className="mx-2">/</span>}

              {item.href ? (
                <Link
                  href={item.href}
                  className="transition hover:text-sky-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-700">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <CatalogSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            basePath={basePath}
          />

          <div className="min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
              </p>

              {children}
            </div>

            <CatalogToolbar productCount={products.length} sort={sort} />

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
