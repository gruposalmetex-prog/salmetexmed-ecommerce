"use client";

import { useActionState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
  Save,
} from "lucide-react";
import Link from "next/link";

import {
  createAdminProductAction,
  type CreateAdminProductState,
} from "../actions/create-admin-product.action";

import { AdminProductGeneralFields } from "./admin-product-general-fields";
import { AdminProductCategoryFields } from "./admin-product-category-fields";
import { AdminProductContentFields } from "./admin-product-content-fields";
import { AdminProductSeoFields } from "./admin-product-seo-fields";

const initialCreateAdminProductState:
  CreateAdminProductState = {
    status: "idle",
  };

interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface CreateAdminProductFormProps {
  brands: BrandOption[];
  categories: CategoryOption[];
}

export function CreateAdminProductForm({
  brands,
  categories,
}: CreateAdminProductFormProps) {
  const [state, formAction, pending] =
    useActionState(
      createAdminProductAction,
      initialCreateAdminProductState,
    );

  const cannotCreate =
    pending || categories.length === 0;

  return (
    <form action={formAction}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {state.message && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-semibold text-red-800">
                No fue posible crear el producto
              </p>

              <p className="mt-1 text-sm text-red-700">
                {state.message}
              </p>
            </div>
          )}

          <AdminProductGeneralFields
            brands={brands}
            errors={state.fieldErrors}
          />

          <AdminProductCategoryFields
            categories={categories}
            errors={state.fieldErrors}
          />

          <AdminProductContentFields
            errors={state.fieldErrors}
          />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <AdminProductSeoFields
            errors={state.fieldErrors}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">
              Guardar producto
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              El producto se creará como borrador. No será
              visible en la tienda hasta que lo publiques.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="submit"
                disabled={cannotCreate}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar borrador
                  </>
                )}
              </button>

              <Link
                href="/admin/productos"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a productos
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}