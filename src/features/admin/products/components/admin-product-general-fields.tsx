"use client";

import React, { useState } from "react";
import { AdminFieldError } from "./admin-field-error";
import { Star } from "lucide-react";

interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

interface AdminProductGeneralFieldsProps {
  brands: BrandOption[];
  errors?: Record<string, string[] | undefined>;
}

type ProductSaleMode = "direct_purchase" | "quote_only" | "contact_only";

interface AdminProductGeneralDefaultValues {
  name?: string;
  slug?: string;
  brandId?: string | null;
  saleMode?: ProductSaleMode;
  featured?: boolean;
}
interface AdminProductGeneralFieldsProps {
  brands: BrandOption[];
  errors?: Record<string, string[] | undefined>;

  defaultValues?: AdminProductGeneralDefaultValues;

  slugReadOnly?: boolean;
}

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminProductGeneralFields({
  brands,
  errors,
  defaultValues = {},
  slugReadOnly = false,
}: AdminProductGeneralFieldsProps) {
  const [name, setName] = useState(defaultValues.name ?? "");
  const [slug, setSlug] = useState(defaultValues.slug ?? "");

  const [
    slugWasEdited,
    setSlugWasEdited,
  ] = useState(
    slugReadOnly,
  );

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextName = event.target.value;

    setName(nextName);

    if (!slugWasEdited) {
      setSlug(createSlug(nextName));
    }
  }

  function handleSlugChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSlugWasEdited(true);
    setSlug(createSlug(event.target.value));
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Datos generales
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Define la información principal y la forma en que se ofrecerá el
          producto.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label
            htmlFor="product-name"
            className="text-sm font-semibold text-slate-800"
          >
            Nombre del producto
          </label>

          <input
            id="product-name"
            name="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Ej. Monitor de signos vitales"
            autoComplete="off"
            required
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <AdminFieldError errors={errors?.name} />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="product-slug"
            className="text-sm font-semibold text-slate-800"
          >
            Slug
          </label>

          <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-300 bg-white transition focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-600/10">
            <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
              /productos/
            </span>

            <input
              id="product-slug"
              name="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              readOnly={slugReadOnly}
              placeholder="monitor-signos-vitales"
              autoComplete="off"
              required
              className="h-11 min-w-0 flex-1 border-0 bg-white px-3 text-sm text-slate-950 outline-none read-only:cursor-not-allowed read-only:bg-slate-100 read-only:text-slate-500"
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {slugReadOnly
              ? "El slug no puede modificarse mientras el producto está publicado."
              : "Se genera automáticamente, pero puedes modificarlo antes de guardar."}
          </p>

          <AdminFieldError errors={errors?.slug} />
        </div>

        <div>
          <label
            htmlFor="product-brand"
            className="text-sm font-semibold text-slate-800"
          >
            Marca
          </label>

          <select
            id="product-brand"
            name="brandId"
            defaultValue={defaultValues.brandId ?? ""}
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          >
            <option value="">Sin marca</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          <AdminFieldError errors={errors?.brandId} />
        </div>

        <div>
          <label
            htmlFor="product-sale-mode"
            className="text-sm font-semibold text-slate-800"
          >
            Modalidad de venta
          </label>

          <select
            id="product-sale-mode"
            name="saleMode"
            defaultValue={defaultValues.saleMode ?? "quote_only"}
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          >
            <option value="direct_purchase">Compra directa</option>

            <option value="quote_only">Solo cotización</option>

            <option value="contact_only">Contactar para información</option>
          </select>

          <AdminFieldError errors={errors?.saleMode} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={
              defaultValues.featured ?? false
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-700 accent-sky-700"
          />

          <span className="flex-1">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Star className="h-4 w-4 text-amber-500" />
              Producto destacado
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500">
              Permite mostrarlo en las secciones destacadas de la tienda.
            </span>
          </span>
        </label>

        <AdminFieldError errors={errors?.featured} />
      </div>
    </section>
  );
}
