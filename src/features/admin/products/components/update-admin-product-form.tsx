"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  ArrowRight,
  LoaderCircle,
  Save,
} from "lucide-react";

import {
  updateAdminProductAction,
  type UpdateAdminProductState,
} from "../actions/update-admin-product.action";

import { AdminProductGeneralFields } from "./admin-product-general-fields";
import { AdminProductCategoryFields } from "./admin-product-category-fields";
import { AdminProductContentFields } from "./admin-product-content-fields";
import { AdminProductSeoFields } from "./admin-product-seo-fields";

type ProductSaleMode =
  | "direct_purchase"
  | "quote_only"
  | "contact_only";

type ProductStatus =
  | "draft"
  | "published"
  | "archived";

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

interface EditableProduct {
  id: string;
  name: string;
  slug: string;
  brandId: string | null;

  shortDescription: string;
  description: string;

  saleMode: ProductSaleMode;
  featured: boolean;

  seoTitle: string | null;
  seoDescription: string | null;

  status: ProductStatus;
  categoryIds: string[];
}

interface UpdateAdminProductFormProps {
  product: EditableProduct;
  brands: BrandOption[];
  categories: CategoryOption[];
}

const initialUpdateState:
  UpdateAdminProductState = {
    status: "idle",
  };

export function UpdateAdminProductForm({
  product,
  brands,
  categories,
}: UpdateAdminProductFormProps) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    updateAdminProductAction,
    initialUpdateState,
  );

  const archived =
    product.status === "archived";

  const cannotUpdate =
    pending ||
    archived ||
    categories.length === 0;

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="productId"
        value={product.id}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {state.message && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-semibold text-red-800">
                No fue posible actualizar
                el producto
              </p>

              <p className="mt-1 text-sm text-red-700">
                {state.message}
              </p>
            </div>
          )}

          {archived && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-amber-900">
                Producto archivado
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                Debes restaurar el producto
                antes de modificar su
                información.
              </p>
            </div>
          )}

          <AdminProductGeneralFields
            brands={brands}
            errors={state.fieldErrors}
            defaultValues={{
              name: product.name,
              slug: product.slug,
              brandId:
                product.brandId,

              saleMode:
                product.saleMode,

              featured:
                product.featured,
            }}
            slugReadOnly={
              product.status ===
              "published"
            }
          />

          <AdminProductCategoryFields
            categories={categories}
            errors={state.fieldErrors}
            defaultCategoryIds={
              product.categoryIds
            }
          />

          <AdminProductContentFields
            errors={state.fieldErrors}
            defaultValues={{
              shortDescription:
                product.shortDescription,

              description:
                product.description,
            }}
          />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <AdminProductSeoFields
            errors={state.fieldErrors}
            defaultValues={{
              seoTitle:
                product.seoTitle,

              seoDescription:
                product.seoDescription,
            }}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">
              Guardar cambios
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {product.status ===
              "published"
                ? "Los cambios se reflejarán en la tienda después de guardar."
                : "Los cambios permanecerán en el borrador hasta que publiques el producto."}
            </p>

            {product.status ===
              "published" && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs leading-5 text-amber-800">
                  El slug está protegido para
                  evitar romper la dirección
                  pública del producto.
                </p>
              </div>
            )}

            <div className="mt-5 space-y-3">
              <button
                type="submit"
                disabled={cannotUpdate}
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
                    Guardar cambios
                  </>
                )}
              </button>

              <Link
                href={`/admin/productos/${product.id}/editar?step=review`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ir a revisión
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}