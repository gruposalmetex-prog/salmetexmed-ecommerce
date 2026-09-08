import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Tags } from "lucide-react";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";
import { AdminCategoryImageSection } from "@/features/admin/categories/components/admin-category-image-section";
import {
  getAdminCategoryById,
  getAdminCategoryEditFormOptions,
} from "@/features/admin/products/services/admin-category.service";
import { UpdateAdminCategoryForm } from "@/features/admin/products/components/update-admin-category-form";

export const metadata: Metadata = {
  title: "Editar categoría",
};

interface EditAdminCategoryPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    updated?: string | string[];
    imageUpdated?: string | string[];
    imageDeleted?: string | string[];
  }>;
}

const categoryIdSchema = z.uuid();

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditAdminCategoryPage({
  params,
  searchParams,
}: EditAdminCategoryPageProps) {
  await requireAdmin();

  const [{ id }, query] = await Promise.all([params, searchParams]);

  const parsedId = categoryIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const [category, options] = await Promise.all([
    getAdminCategoryById(parsedId.data),

    getAdminCategoryEditFormOptions(),
  ]);

  if (!category) {
    notFound();
  }

  const categoryUpdated = firstValue(query.updated) === "1";

  const imageUpdated = firstValue(query.imageUpdated) === "1";

  const imageDeleted = firstValue(query.imageDeleted) === "1";

  return (
    <section>
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <Link href="/admin" className="transition hover:text-sky-700">
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

        <span className="font-medium text-slate-800">{category.name}</span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Tags className="h-6 w-6" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Editar categoría
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                category.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {category.active ? "Activa" : "Inactiva"}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {category.name}
          </h1>

          <p className="mt-2 font-mono text-xs text-slate-400">
            {category.slug}
          </p>
        </div>
      </div>

      {categoryUpdated && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Categoría actualizada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Los cambios se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      {imageUpdated && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Imagen actualizada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La imagen de la categoría se guardó correctamente.
            </p>
          </div>
        </div>
      )}

      {imageDeleted && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Imagen eliminada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La imagen se retiró de la categoría.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <UpdateAdminCategoryForm category={category} areas={options.areas} />

        <AdminCategoryImageSection
          categoryId={category.id}
          categoryName={category.name}
          imageUrl={category.imageUrl}
          imagePublicId={category.imagePublicId}
        />
      </div>
    </section>
  );
}
