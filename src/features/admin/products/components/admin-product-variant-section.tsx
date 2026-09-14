import { CheckCircle2, CircleOff, Package, Star } from "lucide-react";

import {
  UpdateAdminProductVariantForm,
  type EditableAdminProductVariant,
} from "./update-admin-product-variant-form";

import { CreateAdminProductVariantForm } from "./create-admin-product-variant-form";

type ProductSaleMode = "direct_purchase" | "quote_only" | "contact_only";

interface AdminProductVariantSectionProps {
  productId: string;
  saleMode: ProductSaleMode;
  variants: EditableAdminProductVariant[];
  variantCreated?: boolean;
  variantUpdated?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "code",
});

function formatPrice(priceInCents: number | null) {
  if (priceInCents === null) {
    return "Sin precio";
  }

  return currencyFormatter.format(priceInCents / 100);
}

export function AdminProductVariantSection({
  productId,
  saleMode,
  variants,
  variantCreated = false,
  variantUpdated = false,
}: AdminProductVariantSectionProps) {
  return (
    <div className="space-y-6">
      {variantCreated && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Variante guardada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La variante se agregó correctamente al producto.
            </p>
          </div>
        </div>
      )}

      {variantUpdated && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Variante actualizada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Los cambios de la variante se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Variantes registradas
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Cada variante representa una presentación, modelo o configuración
            disponible.
          </p>
        </div>

        {variants.length > 0 ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <div className="hidden grid-cols-[minmax(0,1fr)_160px_130px_110px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:grid">
              <span>Variante</span>
              <span>Precio</span>
              <span>Inventario</span>
              <span>Estado</span>
            </div>

            <div className="divide-y divide-slate-200">
              {variants.map((variant) => (
                <article
                  key={variant.id}
                  className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_160px_130px_110px] lg:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                      <Package className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-950">
                          {variant.name}
                        </h3>

                        {variant.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            <Star className="h-3 w-3" />
                            Predeterminada
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate font-mono text-xs text-slate-500">
                        {variant.sku}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-slate-400 lg:hidden">
                      Precio
                    </span>

                    <p className="mt-1 text-sm font-semibold text-slate-800 lg:mt-0">
                      {formatPrice(variant.priceInCents)}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-slate-400 lg:hidden">
                      Inventario
                    </span>

                    <p className="mt-1 text-sm font-semibold text-slate-800 lg:mt-0">
                      {variant.stock} unidades
                    </p>
                  </div>

                  <div>
                    {variant.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <CircleOff className="h-3.5 w-3.5" />
                        Inactiva
                      </span>
                    )}
                  </div>

                  <div className="lg:col-span-full">
                    <UpdateAdminProductVariantForm
                      productId={productId}
                      saleMode={saleMode}
                      variant={variant}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Package className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              Todavía no hay variantes
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Registra la primera presentación de este producto utilizando el
              formulario.
            </p>
          </div>
        )}
      </section>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-950">
            {variants.length > 0
              ? "Agregar otra variante"
              : "Agregar primera variante"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Los cambios se guardarán en el borrador del producto.
          </p>
        </div>

        <CreateAdminProductVariantForm
          productId={productId}
          saleMode={saleMode}
          hasVariants={variants.length > 0}
        />
      </div>
    </div>
  );
}
