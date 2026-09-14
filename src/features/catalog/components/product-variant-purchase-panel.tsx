"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgePercent, Check } from "lucide-react";

import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

import { FavoriteButton } from "@/features/favorites/components/favorite-button";

import type { PublicProduct } from "../services/product.service";

import { ProductPaymentMethods } from "./product-payment-methods";

interface ProductVariantPurchasePanelProps {
  productId: string;
  productName: string;
  saleMode: PublicProduct["saleMode"];
  variants: PublicProduct["variants"];
}

function formatPrice(priceInCents: number | null) {
  if (priceInCents === null) {
    return null;
  }

  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(priceInCents / 100);

  return `${formattedPrice} MXN`;
}

export function ProductVariantPurchasePanel({
  productId,
  productName,
  saleMode,
  variants,
}: ProductVariantPurchasePanelProps) {
  const initialVariant =
    variants.find((variant) => variant.isDefault) ?? variants[0] ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id ?? null,
  );

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    initialVariant;

  const priceInCents = selectedVariant?.priceInCents ?? null;

  const compareAtPriceInCents = selectedVariant?.compareAtPriceInCents ?? null;

  const price = formatPrice(priceInCents);

  const hasDiscount =
    priceInCents !== null &&
    compareAtPriceInCents !== null &&
    compareAtPriceInCents > priceInCents;

  const compareAtPrice = hasDiscount
    ? formatPrice(compareAtPriceInCents)
    : null;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((compareAtPriceInCents - priceInCents) / compareAtPriceInCents) * 100,
      )
    : null;

  const savings = hasDiscount
    ? formatPrice(compareAtPriceInCents - priceInCents)
    : null;

  const canPurchase = selectedVariant?.canPurchase ?? false;

  const isDirectPurchase = saleMode === "direct_purchase";

  const isInStock =
    selectedVariant !== null &&
    (!selectedVariant.trackInventory || selectedVariant.stock > 0);

  const isBackorder =
    selectedVariant !== null &&
    selectedVariant.trackInventory &&
    selectedVariant.stock <= 0 &&
    selectedVariant.allowBackorder;

  return (
    <>
      {selectedVariant && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selectedVariant.model && (
            <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              Modelo:{" "}
              <strong className="ml-1 font-semibold text-slate-800">
                {selectedVariant.model}
              </strong>
            </span>
          )}

          {selectedVariant.sku && (
            <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              SKU:{" "}
              <strong className="ml-1 font-semibold text-slate-800">
                {selectedVariant.sku}
              </strong>
            </span>
          )}
        </div>
      )}

      <div className="my-4 border-t border-slate-200" />

      {isDirectPurchase ? (
        price ? (
          <div className={hasDiscount ? "rounded-2xl p-2" : ""}>
            {hasDiscount && discountPercentage !== null && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                  <BadgePercent className="h-3.5 w-3.5" />
                  Oferta
                </span>

                <span className="text-sm font-semibold text-rose-700">
                  Ahorras {discountPercentage}%
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
              <span className="block text-3xl font-semibold tracking-tight text-slate-950">
                {price}
              </span>

              {compareAtPrice && (
                <span className="pb-1 text-sm text-slate-500">
                  Antes <span className="line-through">{compareAtPrice}</span>
                </span>
              )}
            </div>

            {savings && (
              <p className="mt-2 text-sm font-semibold text-rose-700">
                Ahorras {savings}
              </p>
            )}

            <p
              className={`mt-3 text-sm font-semibold ${
                isInStock
                  ? "text-emerald-700"
                  : isBackorder
                    ? "text-amber-700"
                    : "text-red-700"
              }`}
            >
              {isInStock
                ? selectedVariant?.trackInventory
                  ? `${selectedVariant.stock} disponibles`
                  : "Disponible"
                : isBackorder
                  ? "Disponible sobre pedido"
                  : "Sin existencias"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Compra directa
            </span>

            <p className="mt-1 text-xl font-semibold text-slate-950">
              Precio no disponible
            </p>
          </div>
        )
      ) : saleMode === "quote_only" ? (
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
            Venta especializada
          </span>

          <p className="mt-1 text-xl font-semibold text-slate-950">
            Precio bajo cotización
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Solicita información y nuestro equipo comercial te ayudará con
            disponibilidad, precio y condiciones de entrega.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Información comercial
          </span>

          <p className="mt-1 text-xl font-semibold text-slate-950">
            Contáctanos para conocer más
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Nuestro equipo puede ayudarte con información, disponibilidad y
            condiciones comerciales.
          </p>
        </div>
      )}

      {variants.length > 0 && (
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-slate-950">
            {variants.length > 1
              ? "Selecciona una presentación"
              : "Presentación seleccionada"}
          </legend>

          <div className="mt-2 grid gap-3">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedVariant?.id;

              return (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-sky-600 bg-sky-50/50"
                      : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {variant.name}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                        {variant.model && <span>Modelo {variant.model}</span>}

                        {variant.sku && <span>SKU {variant.sku}</span>}

                        {isDirectPurchase && variant.priceInCents !== null && (
                          <span>{formatPrice(variant.priceInCents)}</span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-7 flex gap-3">
        {canPurchase && selectedVariant ? (
          <AddToCartButton
            key={selectedVariant.id}
            variantId={selectedVariant.id}
            productName={productName}
          />
        ) : (
          <Link
            href="/contacto"
            className="flex h-12 flex-1 items-center justify-center rounded-lg bg-sky-700 px-6 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            Solicitar cotización
          </Link>
        )}

        <FavoriteButton
          productId={productId}
          productName={productName}
          variant="detail"
        />
      </div>

      {isDirectPurchase && <ProductPaymentMethods />}
    </>
  );
}
