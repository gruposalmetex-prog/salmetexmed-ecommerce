import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Tags,
} from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { CreateAdminCategoryForm } from "@/features/admin/products/components/create-admin-category-form";
import { getAdminCategoryFormOptions } from "@/features/admin/products/services/admin-category.service";


export const metadata: Metadata = {
  title: "Nueva categoría",
};

export default async function NewAdminCategoryPage() {
  await requireAdmin();

  const options =
    await getAdminCategoryFormOptions();

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
          href="/admin/categorias"
          className="transition hover:text-sky-700"
        >
          Categorías
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-medium text-slate-800">
          Nueva categoría
        </span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Tags className="h-6 w-6" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Organización del catálogo
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Nueva categoría
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Crea una categoría para organizar los productos y
            relacionarla con las áreas correspondientes.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CreateAdminCategoryForm
          areas={options.areas}
        />
      </div>
    </section>
  );
}