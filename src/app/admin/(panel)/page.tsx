import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CircleDashed,
  Package,
  Plus,
  Store,
} from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { getAdminDashboardSummary } from "@/features/admin/products/services/admin-product.service";

export const metadata: Metadata = {
  title: "Resumen",
};

export default async function AdminPage() {
  await requireAdmin();

  const summary = await getAdminDashboardSummary();

  const metrics = [
    {
      label: "Productos totales",
      value: summary.totalProducts,
      description: "Todos los productos registrados",
      icon: Package,
      iconClasses: "bg-sky-50 text-sky-700",
    },
    {
      label: "Publicados",
      value: summary.publishedProducts,
      description: "Visibles actualmente en la tienda",
      icon: Store,
      iconClasses: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Borradores",
      value: summary.draftProducts,
      description: "Pendientes de revisión o publicación",
      icon: CircleDashed,
      iconClasses: "bg-amber-50 text-amber-700",
    },
    {
      label: "Variantes",
      value: summary.variantCount,
      description: "Presentaciones y opciones registradas",
      icon: Boxes,
      iconClasses: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Vista general
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Resumen
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Consulta el estado general del catálogo de SALMETEXMED.
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    metric.iconClasses,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="text-3xl font-semibold tracking-tight text-slate-950">
                  {metric.value}
                </span>
              </div>

              <h2 className="mt-5 font-semibold text-slate-950">
                {metric.label}
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Catálogo
          </span>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Administra tus productos
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Consulta productos publicados, prepara borradores y mantén
            actualizados precios, variantes e inventario.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/admin/productos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800"
            >
              Ir a productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>

        <article className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-300/40">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
            Flujo recomendado
          </span>

          <h2 className="mt-2 text-xl font-semibold">
            Trabaja primero como borrador
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Completa la información, variantes, imágenes y SEO antes de publicar
            un producto en la tienda.
          </p>

          {summary.archivedProducts > 0 && (
            <p className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Tienes{" "}
              <strong className="text-white">{summary.archivedProducts}</strong>{" "}
              {summary.archivedProducts === 1
                ? "producto archivado"
                : "productos archivados"}
              .
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
