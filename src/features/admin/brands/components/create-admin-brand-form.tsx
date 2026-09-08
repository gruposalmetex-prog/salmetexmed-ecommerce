"use client";

import Link from "next/link";
import {
  LoaderCircle,
  Save,
  Tag,
} from "lucide-react";
import {
  useActionState,
  useState,
  type ChangeEvent,
} from "react";
import { createAdminBrandAction, CreateAdminBrandState } from "../../products/actions/create-admin-brand.action";



const initialState: CreateAdminBrandState = {
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

export function CreateAdminBrandForm() {
  const [state, formAction, pending] =
    useActionState(
      createAdminBrandAction,
      initialState,
    );

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [slugWasEdited, setSlugWasEdited] =
    useState(false);

  function handleNameChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const nextName =
      event.target.value;

    setName(nextName);

    if (!slugWasEdited) {
      setSlug(
        createSlug(nextName),
      );
    }
  }

  function handleSlugChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const nextSlug =
      event.target.value;

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
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible guardar la marca
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
              Registra la marca que podrá asignarse a los
              productos del catálogo.
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
              onChange={handleNameChange}
              required
              maxLength={120}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.name)
              }
              placeholder="Ej. Mindray"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <FieldError
              errors={state.fieldErrors?.name}
            />
          </div>

          <div>
            <label
              htmlFor="brand-slug"
              className="text-sm font-semibold text-slate-800"
            >
              Slug
            </label>

            <input
              id="brand-slug"
              name="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              required
              maxLength={140}
              disabled={pending}
              aria-invalid={
                Boolean(state.fieldErrors?.slug)
              }
              placeholder="mindray"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Se utilizará como identificador público de la
              marca.
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
            defaultChecked
            disabled={pending}
            className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Marca activa
            </span>

            <span className="block text-xs text-slate-500">
              Podrá seleccionarse al registrar productos.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/marcas"
            className="inline-flex cursor-pointer h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar marca
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}