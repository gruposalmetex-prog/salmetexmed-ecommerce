import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { AdminProductFilters } from "@/features/admin/products/components/admin-product-filters";
import { AdminProductPagination } from "@/features/admin/products/components/admin-product-pagination";
import { AdminProductTable } from "@/features/admin/products/components/admin-product-table";
import { getAdminProducts } from "@/features/admin/products/services/admin-product.service";

export const metadata: Metadata = {
  title: "Productos",
};

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string | string[];
    status?: string | string[];
    page?: string | string[];
  }>;
}

function firstValue(
  value:
    | string
    | string[]
    | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  await requireAdmin();

  const params =
    await searchParams;

  const search =
    firstValue(params.search) ?? "";

  const status =
    firstValue(params.status) ?? "all";

  const parsedPage =
    Number.parseInt(
      firstValue(params.page) ?? "1",
      10,
    );

  const result =
    await getAdminProducts({
      search,
      status,
      page: parsedPage,
      pageSize: 20,
    });

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Catálogo
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Productos
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Administra productos publicados, borradores y
            archivados.
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="mt-8">
        <AdminProductFilters
          search={result.filters.search}
          status={result.filters.status}
        />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900">
            {result.pagination.totalItems}
          </strong>{" "}
          {result.pagination.totalItems === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </p>
      </div>

      <div className="mt-4">
        <AdminProductTable
          products={result.products}
        />
      </div>

      <AdminProductPagination
        page={result.pagination.page}
        totalPages={
          result.pagination.totalPages
        }
        hasPreviousPage={
          result.pagination.hasPreviousPage
        }
        hasNextPage={
          result.pagination.hasNextPage
        }
        search={result.filters.search}
        status={result.filters.status}
      />
    </section>
  );
}