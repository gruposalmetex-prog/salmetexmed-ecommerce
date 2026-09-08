"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { AdminFieldError } from "./admin-field-error";

interface AdminProductSeoDefaultValues {
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface AdminProductSeoFieldsProps {
  errors?: Record<string, string[] | undefined>;

  defaultValues?: AdminProductSeoDefaultValues;
}

export function AdminProductSeoFields({
  errors,
  defaultValues = {},
}: AdminProductSeoFieldsProps) {
  const [seoTitle, setSeoTitle] = useState(defaultValues.seoTitle ?? "");

  const [seoDescription, setSeoDescription] = useState(
    defaultValues.seoDescription ?? "",
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Search className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Posicionamiento SEO
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Personaliza cómo podría aparecer el producto en los resultados de
            búsqueda.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-end justify-between gap-4">
            <label
              htmlFor="product-seo-title"
              className="text-sm font-semibold text-slate-800"
            >
              Título SEO
            </label>

            <span
              className={`text-xs ${
                seoTitle.length > 60
                  ? "font-semibold text-amber-600"
                  : "text-slate-400"
              }`}
            >
              {seoTitle.length}/70
            </span>
          </div>

          <input
            id="product-seo-title"
            name="seoTitle"
            type="text"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            maxLength={70}
            placeholder="Ej. Oxímetro de pulso portátil | SALMETEXMED"
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Si lo dejas vacío, utilizaremos el nombre del producto.
          </p>

          <AdminFieldError errors={errors?.seoTitle} />
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label
              htmlFor="product-seo-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción SEO
            </label>

            <span
              className={`text-xs ${
                seoDescription.length > 160
                  ? "font-semibold text-amber-600"
                  : "text-slate-400"
              }`}
            >
              {seoDescription.length}/170
            </span>
          </div>

          <textarea
            id="product-seo-description"
            name="seoDescription"
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            maxLength={170}
            rows={4}
            placeholder="Describe el producto con claridad para los resultados de búsqueda."
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Si la dejas vacía, utilizaremos la descripción corta.
          </p>

          <AdminFieldError errors={errors?.seoDescription} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">
            Vista previa aproximada
          </p>

          <p className="mt-3 truncate text-base font-medium text-blue-700">
            {seoTitle || "Nombre del producto | SALMETEXMED"}
          </p>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
            {seoDescription ||
              "La descripción corta del producto se utilizará como descripción SEO."}
          </p>
        </div>
      </div>
    </section>
  );
}
