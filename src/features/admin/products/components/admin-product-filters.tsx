import { Search, X } from "lucide-react";
import Link from "next/link";

interface AdminProductFilterProps {
  search: string;
  status: string;
}

export function AdminProductFilters({
  search,
  status,
}: AdminProductFilterProps) {
  const hasFilters = Boolean(search) || status !== "all";

  return (
    <form
      action="/admin/productos"
      method="get"
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Buscar por nombre, marca, SKU o modelo..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
        />
      </div>

      <select
        name="status"
        defaultValue={status}
        aria-label="Filtrar por estado"
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
      >
        <option value="all">Todos los estados</option>

        <option value="published">Publicados</option>

        <option value="draft">Borradores</option>

        <option value="archived">Archivados</option>
      </select>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Aplicar filtros
      </button>

      {hasFilters && (
        <Link
          href="/admin/productos"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <X className="h-4 w-4" />
          Limpiar
        </Link>
      )}
    </form>
  );
}
