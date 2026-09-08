"use client";

import Link from "next/link";
import {
  LoaderCircle,
  Save,
  Tags,
} from "lucide-react";
import {
  useActionState,
  useState,
} from "react";

import {
  createAdminCategoryAction,
  type CreateAdminCategoryState,
} from "../actions/create-admin-category.action";

interface AdminAreaOption {
  id: string;
  name: string;
  slug: string;
}

interface CreateAdminCategoryFormProps {
  areas: AdminAreaOption[];
}

const initialState: CreateAdminCategoryState = {
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

export function CreateAdminCategoryForm({
  areas,
}: CreateAdminCategoryFormProps) {
  const [state, formAction, pending] =
    useActionState(
      createAdminCategoryAction,
      initialState,
    );

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [slugWasEdited, setSlugWasEdited] =
    useState(false);

  function handleNameChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const nextName = event.target.value;

    setName(nextName);

    if (!slugWasEdited) {
      setSlug(createSlug(nextName));
    }
  }

  function handleSlugChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const nextSlug = event.target.value;

    setSlug(nextSlug);
    setSlugWasEdited(
      nextSlug.trim().length > 0,
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      {state.status === "error" && (
        <div
          role="alert"
          className="roundedاندې-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible guardar la categoría
          </p>

          <p className="mt-1 text-sm text-red-700">
            {state.message}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Tags className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Información de la categoría
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Define cómo se identificará y mostrará la categoría
              en el catálogo.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="category-name"
              className="text-sm font-semibold text-slate-800"
            >
              Nombre
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              required
              maxLength={140}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.name)
              }
              placeholder="Ej. Monitores de paciente"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={state.fieldErrors?.name}
            />
          </div>

          <div>
            <label
              htmlFor="category-slug"
              className="text-sm font-semibold text-slate-800"
            >
              Slug
            </label>

            <input
              id="category-slug"
              name="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              required
              maxLength={160}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.slug)
              }
              placeholder="monitores-de-paciente"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Se utiliza en la dirección pública de la categoría.
            </p>

            <FieldError
              errors={state.fieldErrors?.slug}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="category-short-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción corta
            </label>

            <textarea
              id="category-short-description"
              name="shortDescription"
              rows={3}
              maxLength={320}
              disabled={pending}
              placeholder="Resumen breve de los productos incluidos en esta categoría."
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={
                state.fieldErrors
                  ?.shortDescription
              }
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="category-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción completa
            </label>

            <textarea
              id="category-description"
              name="description"
              rows={6}
              disabled={pending}
              placeholder="Describe con mayor detalle esta categoría."
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Áreas relacionadas
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Puedes relacionar la categoría con una o varias áreas
          médicas. Este campo es opcional.
        </p>

        {areas.length > 0 ? (
          <fieldset className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <legend className="sr-only">
              Seleccionar áreas
            </legend>

            {areas.map((area) => (
              <label
                key={area.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-sky-300 hover:bg-sky-50/50"
              >
                <input
                  type="checkbox"
                  name="areaIds"
                  value={area.id}
                  disabled={pending}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    {area.name}
                  </span>

                  <span className="mt-1 block font-mono text-xs text-slate-400">
                    {area.slug}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        ) : (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No hay áreas activas disponibles.
          </div>
        )}

        <FieldError
          errors={state.fieldErrors?.areaIds}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Posicionamiento SEO
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Estos campos son opcionales y ayudan a describir la
          categoría en los buscadores.
        </p>

        <div className="mt-5 grid gap-5">
          <div>
            <label
              htmlFor="category-seo-title"
              className="text-sm font-semibold text-slate-800"
            >
              Título SEO
            </label>

            <input
              id="category-seo-title"
              name="seoTitle"
              type="text"
              maxLength={70}
              disabled={pending}
              placeholder="Título para buscadores"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={state.fieldErrors?.seoTitle}
            />
          </div>

          <div>
            <label
              htmlFor="category-seo-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción SEO
            </label>

            <textarea
              id="category-seo-description"
              name="seoDescription"
              rows={3}
              maxLength={170}
              disabled={pending}
              placeholder="Descripción para resultados de búsqueda"
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={
                state.fieldErrors?.seoDescription
              }
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            disabled={pending}
            className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Categoría activa
            </span>

            <span className="block text-xs text-slate-500">
              Podrá mostrarse en las opciones públicas del catálogo.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/categorias"
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
                Guardar categoría
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}