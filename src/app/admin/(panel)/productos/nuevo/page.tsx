import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  PackagePlus,
} from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { getAdminProductFormOptions } from "@/features/admin/products/services/admin-product.service";
import { CreateAdminProductForm } from "@/features/admin/products/components/create-admin-product-form";

export const metadata: Metadata = {
  title: "Nuevo producto",
};

export default async function NewAdminProductPage() {
  await requireAdmin();

  const options =
    await getAdminProductFormOptions();

  return (
    <section>
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <Link
          href="/admin"
          className="transition hover:text-sky-700"
        >
          Administración
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <Link
          href="/admin/productos"
          className="transition hover:text-sky-700"
        >
          Productos
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-medium text-slate-800">
          Nuevo producto
        </span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <PackagePlus className="h-6 w-6" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Catálogo
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Nuevo producto
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Registra la información general del producto.
            Después podrás agregar variantes, inventario,
            imágenes y documentos.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CreateAdminProductForm
          brands={options.brands}
          categories={options.categories}
        />
      </div>
    </section>
  );
}