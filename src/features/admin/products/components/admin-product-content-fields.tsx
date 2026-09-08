"use client";

import { useState } from "react";
import { AlignLeft } from "lucide-react";

import { AdminFieldError } from "./admin-field-error";

interface AdminProductContentFieldsProps {
  errors?: Record<string, string[] | undefined>;
}

interface AdminProductContentDefaultValues {
  shortDescription?: string;
  description?: string;
}

interface AdminProductContentFieldsProps {
  errors?: Record<string, string[] | undefined>;

  defaultValues?: AdminProductContentDefaultValues;
}

export function AdminProductContentFields({
  errors,
  defaultValues = {},
}: AdminProductContentFieldsProps) {
  const [shortDescription, setShortDescription] = useState(
    defaultValues.shortDescription ?? "",
  );

  const [description, setDescription] = useState(
    defaultValues.description ?? "",
  );
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <AlignLeft className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Información comercial
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Describe claramente qué es el producto y para qué tipo de necesidad
            está indicado.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-end justify-between gap-4">
            <label
              htmlFor="product-short-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción corta
            </label>

            <span
              className={`text-xs ${
                shortDescription.length > 320
                  ? "font-semibold text-red-600"
                  : "text-slate-400"
              }`}
            >
              {shortDescription.length}/320
            </span>
          </div>

          <textarea
            id="product-short-description"
            name="shortDescription"
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            rows={3}
            maxLength={320}
            placeholder="Resumen breve que aparecerá en tarjetas, resultados de búsqueda y encabezados."
            required
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Resume las características principales sin copiar el nombre completo
            del producto.
          </p>

          <AdminFieldError errors={errors?.shortDescription} />
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label
              htmlFor="product-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción completa
            </label>

            <span className="text-xs text-slate-400">
              {description.length} caracteres
            </span>
          </div>

          <textarea
            id="product-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={8}
            placeholder="Explica sus funciones, beneficios, aplicaciones y cualquier información importante para el comprador."
            required
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Posteriormente podremos incorporar un editor enriquecido; por ahora
            se guardará como texto seguro.
          </p>

          <AdminFieldError errors={errors?.description} />
        </div>
      </div>
    </section>
  );
}
