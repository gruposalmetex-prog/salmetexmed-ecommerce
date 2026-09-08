import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminProductPaginationProps {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  search: string;
  status: string;
}

function createPageUrl({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status: string;
}) {
  const params =
    new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (
    status &&
    status !== "all"
  ) {
    params.set("status", status);
  }

  if (page > 1) {
    params.set(
      "page",
      String(page),
    );
  }

  const query =
    params.toString();

  return query
    ? `/admin/productos?${query}`
    : "/admin/productos";
}

export function AdminProductPagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  search,
  status,
}: AdminProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginación de productos"
      className="mt-5 flex items-center justify-between"
    >
      {hasPreviousPage ? (
        <Link
          href={createPageUrl({
            page: page - 1,
            search,
            status,
          })}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Link>
      ) : (
        <span />
      )}

      <p className="text-sm text-slate-500">
        Página{" "}
        <strong className="text-slate-800">
          {page}
        </strong>{" "}
        de{" "}
        <strong className="text-slate-800">
          {totalPages}
        </strong>
      </p>

      {hasNextPage ? (
        <Link
          href={createPageUrl({
            page: page + 1,
            search,
            status,
          })}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}