"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Boxes, LoaderCircle, Save } from "lucide-react";

import {
  createAdminProductVariantAction,
  type CreateAdminProductVariantState,
} from "../actions/create-admin-product-variant.action";

import { AdminFieldError } from "./admin-field-error";
import Link from "next/link";

type ProductSaleMode = "direct_purchase" | "quote_only" | "contact_only";

interface CreateAdminProductVariantFormProps {
  productId: string;
  saleMode: ProductSaleMode;
  hasVariants: boolean;
}

const initialVariantState: CreateAdminProductVariantState = {
  status: "idle",
};

export function CreateAdminProductVariantForm({
  productId,
  saleMode,
  hasVariants,
}: CreateAdminProductVariantFormProps) {
  const [state, formAction, pending] = useActionState(
    createAdminProductVariantAction,
    initialVariantState,
  );

  const [trackInventory, setTrackInventory] = useState(true);

  const [purchaseEnabled, setPurchaseEnabled] = useState(false);

  const supportsDirectPurchase = saleMode === "direct_purchase";

  const canContinueWithoutSaving = hasVariants || !supportsDirectPurchase;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="productId" value={productId} />

      {!hasVariants && <input type="hidden" name="isDefault" value="on" />}

      {state.message && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible guardar la variante
          </p>

          <p className="mt-1 text-sm text-red-700">{state.message}</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Boxes className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Información de la variante
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Registra la presentación, SKU y modelo que identifican esta opción
              del producto.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="variant-name"
              className="text-sm font-semibold text-slate-800"
            >
              Nombre de la variante
            </label>

            <input
              id="variant-name"
              name="name"
              type="text"
              placeholder="Ej. Presentación estándar"
              autoComplete="off"
              required
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
            />

            <AdminFieldError errors={state.fieldErrors?.name} />
          </div>

          <div>
            <label
              htmlFor="variant-sku"
              className="text-sm font-semibold text-slate-800"
            >
              SKU
            </label>

            <input
              id="variant-sku"
              name="sku"
              type="text"
              placeholder="TERM-INF-001"
              autoComplete="off"
              required
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 font-mono text-sm uppercase text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
            />

            <p className="mt-2 text-xs text-slate-500">
              Debe ser único en todo el catálogo.
            </p>

            <AdminFieldError errors={state.fieldErrors?.sku} />
          </div>

          <div>
            <label
              htmlFor="variant-model"
              className="text-sm font-semibold text-slate-800"
            >
              Modelo
              <span className="ml-1 font-normal text-slate-400">opcional</span>
            </label>

            <input
              id="variant-model"
              name="model"
              type="text"
              placeholder="Ej. IR-200"
              autoComplete="off"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
            />

            <AdminFieldError errors={state.fieldErrors?.model} />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="variant-barcode"
              className="text-sm font-semibold text-slate-800"
            >
              Código de barras
              <span className="ml-1 font-normal text-slate-400">opcional</span>
            </label>

            <input
              id="variant-barcode"
              name="barcode"
              type="text"
              placeholder="Ej. 7501234567890"
              inputMode="numeric"
              autoComplete="off"
              className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 font-mono text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
            />

            <AdminFieldError errors={state.fieldErrors?.barcode} />
          </div>
        </div>
      </section>

      {supportsDirectPurchase ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Precio y compra
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Los importes se capturan en pesos mexicanos.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="variant-price"
                className="text-sm font-semibold text-slate-800"
              >
                Precio de venta
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  id="variant-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-slate-300 pl-8 pr-14 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  MXN
                </span>
              </div>

              <AdminFieldError errors={state.fieldErrors?.priceInCents} />
            </div>

            <div>
              <label
                htmlFor="variant-compare-price"
                className="text-sm font-semibold text-slate-800"
              >
                Precio anterior
                <span className="ml-1 font-normal text-slate-400">
                  opcional
                </span>
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  id="variant-compare-price"
                  name="compareAtPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-slate-300 pl-8 pr-14 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
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

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              name="purchaseEnabled"
              checked={purchaseEnabled}
              onChange={(event) => setPurchaseEnabled(event.target.checked)}
              className="mt-1 h-4 w-4 accent-sky-700"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Habilitar compra en línea
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                El cliente podrá agregar esta variante al carrito cuando tenga
                precio y disponibilidad.
              </span>
            </span>
          </label>

          <AdminFieldError errors={state.fieldErrors?.purchaseEnabled} />
        </section>
      ) : (
        <input type="hidden" name="purchaseEnabled" value="" />
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Inventario y disponibilidad
        </h2>

        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
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
                Actualiza y limita las unidades disponibles de esta variante.
              </span>
            </span>
          </label>

          {trackInventory ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="variant-stock"
                  className="text-sm font-semibold text-slate-800"
                >
                  Existencia
                </label>

                <input
                  id="variant-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                />

                <AdminFieldError errors={state.fieldErrors?.stock} />
              </div>

              <label className="flex cursor-pointer items-start gap-3 self-end rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="allowBackorder"
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
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">Configuración</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              name="active"
              defaultChecked
              className="mt-1 h-4 w-4 accent-sky-700"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Variante activa
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Podrá utilizarse cuando el producto sea publicado.
              </span>
            </span>
          </label>

          {hasVariants ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
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
          ) : (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-sm font-semibold text-sky-900">
                Primera variante
              </p>

              <p className="mt-1 text-xs leading-5 text-sky-700">
                Se establecerá automáticamente como predeterminada.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
        {canContinueWithoutSaving && (
          <div className="flex justify-end">
            <Link
              href={`/admin/productos/${productId}/editar?step=images`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 hover:underline"
            >
              {hasVariants
                ? "Continuar sin agregar otra variante"
                : "Omitir variantes y continuar"}

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
          <button
            type="submit"
            name="intent"
            value="stay"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            Guardar variante
          </button>

          <button
            type="submit"
            name="intent"
            value="continue"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {pending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                Guardar y continuar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
