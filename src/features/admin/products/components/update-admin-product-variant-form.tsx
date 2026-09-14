"use client";

import { LoaderCircle, Pencil, Save, X } from "lucide-react";
import { useActionState, useState } from "react";

import {
  updateAdminProductVariantAction,
  type UpdateAdminProductVariantState,
} from "../actions/update-admin-product-variant.action";

import { AdminFieldError } from "./admin-field-error";

type ProductSaleMode = "direct_purchase" | "quote_only" | "contact_only";

export interface EditableAdminProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  model: string | null;
  priceInCents: number | null;
  compareAtPriceInCents: number | null;
  purchaseEnabled: boolean;
  trackInventory: boolean;
  stock: number;
  allowBackorder: boolean;
  active: boolean;
  isDefault: boolean;
}

interface UpdateAdminProductVariantFormProps {
  productId: string;
  saleMode: ProductSaleMode;
  variant: EditableAdminProductVariant;
}

const initialState: UpdateAdminProductVariantState = {
  status: "idle",
};

function formatPriceInput(priceInCents: number | null) {
  if (priceInCents === null) {
    return "";
  }

  return (priceInCents / 100).toFixed(2);
}

export function UpdateAdminProductVariantForm({
  productId,
  saleMode,
  variant,
}: UpdateAdminProductVariantFormProps) {
  const [editing, setEditing] = useState(false);

  const [state, formAction, pending] = useActionState(
    updateAdminProductVariantAction,
    initialState,
  );

  const [trackInventory, setTrackInventory] = useState(variant.trackInventory);

  if (!editing) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex cursor-pointer h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar variante
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-3 rounded-xl border border-sky-200 bg-sky-50/40 p-4 sm:p-5"
    >
      <input type="hidden" name="productId" value={productId} />

      <input type="hidden" name="variantId" value={variant.id} />

      {variant.isDefault && <input type="hidden" name="isDefault" value="on" />}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-950">Editar variante</h4>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Actualiza la presentación, precio, inventario y disponibilidad.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={pending}
          aria-label="Cerrar edición"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 transition hover:text-slate-900 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.message && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible actualizar la variante
          </p>

          <p className="mt-1 text-sm text-red-700">{state.message}</p>
        </div>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor={`variant-name-${variant.id}`}
            className="text-sm font-semibold text-slate-800"
          >
            Nombre de la variante
          </label>

          <input
            id={`variant-name-${variant.id}`}
            name="name"
            type="text"
            defaultValue={variant.name}
            required
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <AdminFieldError errors={state.fieldErrors?.name} />
        </div>

        <div>
          <label
            htmlFor={`variant-sku-${variant.id}`}
            className="text-sm font-semibold text-slate-800"
          >
            SKU
          </label>

          <input
            id={`variant-sku-${variant.id}`}
            name="sku"
            type="text"
            defaultValue={variant.sku}
            required
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 font-mono text-sm uppercase text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <AdminFieldError errors={state.fieldErrors?.sku} />
        </div>

        <div>
          <label
            htmlFor={`variant-model-${variant.id}`}
            className="text-sm font-semibold text-slate-800"
          >
            Modelo
            <span className="ml-1 font-normal text-slate-400">opcional</span>
          </label>

          <input
            id={`variant-model-${variant.id}`}
            name="model"
            type="text"
            defaultValue={variant.model ?? ""}
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <AdminFieldError errors={state.fieldErrors?.model} />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`variant-barcode-${variant.id}`}
            className="text-sm font-semibold text-slate-800"
          >
            Código de barras
            <span className="ml-1 font-normal text-slate-400">opcional</span>
          </label>

          <input
            id={`variant-barcode-${variant.id}`}
            name="barcode"
            type="text"
            defaultValue={variant.barcode ?? ""}
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 font-mono text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
          />

          <AdminFieldError errors={state.fieldErrors?.barcode} />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h5 className="text-sm font-semibold text-slate-950">
          Precio y compra
        </h5>

        {saleMode !== "direct_purchase" && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            Puedes preparar estos datos antes de cambiar el producto a compra
            directa. Mientras conserve su modalidad actual, la tienda no
            habilitará la compra en línea.
          </p>
        )}

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`variant-price-${variant.id}`}
              className="text-sm font-semibold text-slate-800"
            >
              Precio de venta
            </label>

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>

              <input
                id={`variant-price-${variant.id}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={formatPriceInput(variant.priceInCents)}
                placeholder="0.00"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-8 pr-14 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                MXN
              </span>
            </div>

            <AdminFieldError errors={state.fieldErrors?.priceInCents} />
          </div>

          <div>
            <label
              htmlFor={`variant-compare-price-${variant.id}`}
              className="text-sm font-semibold text-slate-800"
            >
              Precio anterior
              <span className="ml-1 font-normal text-slate-400">opcional</span>
            </label>

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>

              <input
                id={`variant-compare-price-${variant.id}`}
                name="compareAtPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={formatPriceInput(variant.compareAtPriceInCents)}
                placeholder="0.00"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-8 pr-14 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                MXN
              </span>
            </div>

            <AdminFieldError
              errors={state.fieldErrors?.compareAtPriceInCents}
            />
          </div>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <input
            type="checkbox"
            name="purchaseEnabled"
            defaultChecked={variant.purchaseEnabled}
            className="mt-1 h-4 w-4 accent-sky-700"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Habilitar compra en línea
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500">
              Requiere un precio de venta. Solo se aplicará públicamente cuando
              el producto sea de compra directa.
            </span>
          </span>
        </label>

        <AdminFieldError errors={state.fieldErrors?.purchaseEnabled} />
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h5 className="text-sm font-semibold text-slate-950">
          Inventario y configuración
        </h5>

        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
              type="checkbox"
              name="trackInventory"
              checked={trackInventory}
              onChange={(event) => setTrackInventory(event.target.checked)}
              className="mt-1 h-4 w-4 accent-sky-700"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Controlar inventario
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Limita las unidades disponibles de esta variante.
              </span>
            </span>
          </label>

          {trackInventory ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`variant-stock-${variant.id}`}
                  className="text-sm font-semibold text-slate-800"
                >
                  Existencia
                </label>

                <input
                  id={`variant-stock-${variant.id}`}
                  name="stock"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  defaultValue={variant.stock}
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                />

                <AdminFieldError errors={state.fieldErrors?.stock} />
              </div>

              <label className="flex cursor-pointer items-start gap-3 self-end rounded-xl border border-slate-200 bg-white p-4">
                <input
                  type="checkbox"
                  name="allowBackorder"
                  defaultChecked={variant.allowBackorder}
                  className="mt-1 h-4 w-4 accent-sky-700"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Permitir sobrepedido
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Aceptar pedidos sin existencia.
                  </span>
                </span>
              </label>
            </div>
          ) : (
            <input type="hidden" name="stock" value="0" />
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
              type="checkbox"
              name="active"
              defaultChecked={variant.active}
              className="mt-1 h-4 w-4 accent-sky-700"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Variante activa
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Podrá utilizarse cuando el producto esté publicado.
              </span>
            </span>
          </label>

          {variant.isDefault ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Variante predeterminada
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Para cambiarla, marca otra variante como predeterminada.
              </p>
            </div>
          ) : (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <input
                type="checkbox"
                name="isDefault"
                className="mt-1 h-4 w-4 accent-sky-700"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Variante predeterminada
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Será la opción inicial del producto.
                </span>
              </span>
            </label>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Cancelar
        </button>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
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
    </form>
  );
}
