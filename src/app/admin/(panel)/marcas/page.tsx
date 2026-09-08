import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Pencil, Plus, Tag } from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { getAdminBrands } from "@/features/admin/products/services/admin-brand.service";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Marcas",
};

interface AdminBrandsPageProps {
  searchParams: Promise<{
    created?: string | string[];
  }>;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminBrandsPage({
  searchParams,
}: AdminBrandsPageProps) {
  await requireAdmin();

  const [brands, query] = await Promise.all([getAdminBrands(), searchParams]);

  const brandCreated = firstValue(query.created) === "1";

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Organización del catálogo
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Marcas
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Administra las marcas y fabricantes disponibles para los productos.
          </p>
        </div>

        <Link
          href="/admin/marcas/nueva"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800"
        >
          <Plus className="h-4 w-4" />
          Nueva marca
        </Link>
      </div>

      {brandCreated && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Marca guardada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La marca se registró correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {brands.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Marca
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estado
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Productos
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-50 text-sky-700">
                          {brand.logoUrl ? (
                            <Image
                              src={brand.logoUrl}
                              alt={`Logo de ${brand.name}`}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <Tag className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {brand.name}
                          </p>

                          <p className="mt-1 font-mono text-xs text-slate-400">
                            {brand.slug}
                          </p>

                          {brand.description && (
                            <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
                              {brand.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          brand.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {brand.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {brand.productCount}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/marcas/${brand.id}/editar`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <Tag className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              No hay marcas
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Registra la primera marca para poder asignarla a los productos del
              catálogo.
            </p>

            <Link
              href="/admin/marcas/nueva"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              <Plus className="h-4 w-4" />
              Nueva marca
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
