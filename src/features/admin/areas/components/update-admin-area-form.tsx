"use client";

import Link from "next/link";
import {
  Layers3,
  LoaderCircle,
  RefreshCw,
  Save,
} from "lucide-react";
import {
  useActionState,
  useState,
} from "react";
import { updateAdminAreaAction, UpdateAdminAreaState } from "../../products/actions/update-admin-area.action";



interface EditableAdminArea {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  active: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface UpdateAdminAreaFormProps {
  area: EditableAdminArea;
}

const initialState: UpdateAdminAreaState = {
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

export function UpdateAdminAreaForm({
  area,
}: UpdateAdminAreaFormProps) {
  const [state, formAction, pending] =
    useActionState(
      updateAdminAreaAction,
      initialState,
    );

  const [name, setName] =
    useState(area.name);

  const [slug, setSlug] =
    useState(area.slug);

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
        value={area.id}
      />

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible actualizar el área
          </p>

          <p className="mt-1 text-sm text-red-700">
            {state.message}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Layers3 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Información del área
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Actualiza la información utilizada para organizar
              el catálogo.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="area-name"
              className="text-sm font-semibold text-slate-800"
            >
              Nombre
            </label>

            <input
              id="area-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              required
              maxLength={140}
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
                htmlFor="area-slug"
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
              id="area-slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
              }}
              required
              maxLength={160}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.slug)
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs leading-5 text-amber-700">
              Cambiar el slug modifica la dirección pública del
              área.
            </p>

            <FieldError
              errors={state.fieldErrors?.slug}
            />
          </div>

          <div>
            <label
              htmlFor="area-sort-order"
              className="text-sm font-semibold text-slate-800"
            >
              Orden de aparición
            </label>

            <input
              id="area-sort-order"
              name="sortOrder"
              type="number"
              min={0}
              max={9999}
              step={1}
              defaultValue={area.sortOrder}
              required
              disabled={pending}
              aria-invalid={
                Boolean(
                  state.fieldErrors?.sortOrder,
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Los números menores aparecen primero.
            </p>

            <FieldError
              errors={state.fieldErrors?.sortOrder}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="area-short-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción corta
            </label>

            <textarea
              id="area-short-description"
              name="shortDescription"
              rows={3}
              maxLength={320}
              defaultValue={
                area.shortDescription ?? ""
              }
              disabled={pending}
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
              htmlFor="area-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción completa
            </label>

            <textarea
              id="area-description"
              name="description"
              rows={6}
              defaultValue={
                area.description ?? ""
              }
              disabled={pending}
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={state.fieldErrors?.description}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Posicionamiento SEO
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Actualiza la información utilizada por los buscadores.
        </p>

        <div className="mt-5 grid gap-5">
          <div>
            <label
              htmlFor="area-seo-title"
              className="text-sm font-semibold text-slate-800"
            >
              Título SEO
            </label>

            <input
              id="area-seo-title"
              name="seoTitle"
              type="text"
              maxLength={70}
              defaultValue={
                area.seoTitle ?? ""
              }
              disabled={pending}
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={state.fieldErrors?.seoTitle}
            />
          </div>

          <div>
            <label
              htmlFor="area-seo-description"
              className="text-sm font-semibold text-slate-800"
            >
              Descripción SEO
            </label>

            <textarea
              id="area-seo-description"
              name="seoDescription"
              rows={3}
              maxLength={170}
              defaultValue={
                area.seoDescription ?? ""
              }
              disabled={pending}
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

      <section className="flex flex-col-reverse gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={area.active}
            disabled={pending}
            className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Área activa
            </span>

            <span className="block text-xs text-slate-500">
              Las áreas inactivas no se muestran en el catálogo.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/areas"
            className="inline-flex cursor-pointer h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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