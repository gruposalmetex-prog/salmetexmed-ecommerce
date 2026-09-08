import { Tags } from "lucide-react";

import { AdminFieldError } from "./admin-field-error";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AdminProductCategoryFieldsProps {
  categories: CategoryOption[];
  errors?: Record<string, string[] | undefined>;
  defaultCategoryIds?: string[];
}

export function AdminProductCategoryFields({
  categories,
  errors,
  defaultCategoryIds = [],
}: AdminProductCategoryFieldsProps) {
  const selectedCategoryIds = new Set(defaultCategoryIds);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Tags className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">Categorías</h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Selecciona al menos una categoría para organizar el producto en la
            tienda.
          </p>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/50"
            >
              <input
                type="checkbox"
                name="categoryIds"
                value={category.id}
                defaultChecked={selectedCategoryIds.has(category.id)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-sky-700"
              />

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">
                  {category.name}
                </span>

                <span className="mt-1 block truncate text-xs text-slate-500">
                  {category.slug}
                </span>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            No hay categorías activas disponibles.
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            Debes registrar al menos una categoría antes de crear productos.
          </p>
        </div>
      )}

      <AdminFieldError errors={errors?.categoryIds} />
    </section>
  );
}
