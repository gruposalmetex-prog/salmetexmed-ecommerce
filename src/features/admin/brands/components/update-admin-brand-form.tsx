"use client";

import Link from "next/link";
import {
  LoaderCircle,
  RefreshCw,
  Save,
  Tag,
} from "lucide-react";
import {
  useActionState,
  useState,
} from "react";
import { updateAdminBrandAction, UpdateAdminBrandState } from "../../products/actions/update-admin-brand.action";



interface EditableAdminBrand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
}

interface UpdateAdminBrandFormProps {
  brand: EditableAdminBrand;
}

const initialState: UpdateAdminBrandState = {
  status: "idle",
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface FieldErrorProps {
  errors?: string[];
}

function FieldError({
  errors,
}: FieldErrorProps) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p className="mt-2 text-xs font-medium text-red-600">
      {errors[0]}
    </p>
  );
}

export function UpdateAdminBrandForm({
  brand,
}: UpdateAdminBrandFormProps) {
  const [state, formAction, pending] =
    useActionState(
      updateAdminBrandAction,
      initialState,
    );

  const [name, setName] =
    useState(brand.name);

  const [slug, setSlug] =
    useState(brand.slug);

  function regenerateSlug() {
    setSlug(
      createSlug(name),
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="id"
        value={brand.id}
      />

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible actualizar la marca
          </p>

          <p className="mt-1 text-sm text-red-700">
            {state.message}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Tag className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Información de la marca
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Actualiza la información utilizada para identificar
              la marca en el catálogo.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="brand-name"
              className="text-sm font-semibold text-slate-800"
            >
              Nombre
            </label>

            <input
              id="brand-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              required
              maxLength={120}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.name)
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={state.fieldErrors?.name}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="brand-slug"
                className="text-sm font-semibold text-slate-800"
              >
                Slug
              </label>

              <button
                type="button"
                onClick={regenerateSlug}
                disabled={
                  pending ||
                  name.trim().length === 0
                }
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-sky-700 transition hover:text-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerar desde el nombre
              </button>
            </div>

            <input
              id="brand-slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
              }}
              required
              maxLength={140}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.slug)
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs leading-5 text-amber-700">
              Cambiar el slug modifica el identificador público
              de la marca.
            </p>

            <FieldError
              errors={state.fieldErrors?.slug}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="brand-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción
            </label>

            <textarea
              id="brand-description"
              name="description"
              rows={6}
              defaultValue={
                brand.description ?? ""
              }
              disabled={pending}
              placeholder="Describe brevemente al fabricante o la marca."
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={
                state.fieldErrors?.description
              }
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col-reverse gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={brand.active}
            disabled={pending}
            className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Marca activa
            </span>

            <span className="block text-xs text-slate-500">
              Las marcas inactivas no se ofrecen para nuevos
              productos.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/marcas"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}