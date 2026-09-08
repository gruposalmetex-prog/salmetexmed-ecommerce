import Image from "next/image";
import Link from "next/link";
import { BadgePercent, ShoppingCart } from "lucide-react";

import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import type { PublicProductCard } from "../services/product.service";
import {
  getProductPlaceholderAlt,
  PRODUCT_PLACEHOLDER_IMAGE_URL,
} from "../product-image.constants";

interface ProductCardProps {
  product: PublicProductCard;
  showDescription?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function formatPrice(priceInCents: number | null) {
  if (priceInCents === null) {
    return null;
  }

  return currencyFormatter.format(priceInCents / 100);
}

export function ProductCard({
  product,
  showDescription = true,
}: ProductCardProps) {
  const priceInCents = product.pricing.priceInCents;

  const compareAtPriceInCents = product.pricing.compareAtPriceInCents;

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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Imagen */}
      <div className="relative overflow-hidden bg-white">
        <Link href={`/productos/${product.slug}`} className="block">
          <div className="aspect-4/3 p-5">
            <Image
              src={product.image?.url ?? PRODUCT_PLACEHOLDER_IMAGE_URL}
              alt={
                product.image?.altText || getProductPlaceholderAlt(product.name)
              }
              width={product.image?.width ?? 500}
              height={product.image?.height ?? 500}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {product.featured && (
            <span className="rounded-md bg-slate-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
              Destacado
            </span>
          )}

          {discountPercentage !== null && (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
              <BadgePercent className="h-3 w-3" />
              {discountPercentage}% menos
            </span>
          )}
        </div>
      </div>

      {/* Información */}
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <Link
            href={`/productos?brand=${product.brand.slug}`}
            className="self-start text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 transition hover:text-sky-700"
          >
            {product.brand.name}
          </Link>
        )}

        <Link href={`/productos/${product.slug}`} className="mt-2">
          <h2 className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-slate-950 transition group-hover:text-sky-700">
            {product.name}
          </h2>
        </Link>

        {showDescription && product.shortDescription && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
            {product.shortDescription}
          </p>
        )}

        {/* Información comercial */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {product.pricing.canPurchase ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Disponible para compra
            </span>
          ) : product.saleMode === "quote_only" ? (
            <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
              Bajo cotización
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              Consulta comercial
            </span>
          )}

          {product.pricing.purchasableVariantCount > 1 && (
            <span className="text-xs text-slate-400">
              {product.pricing.purchasableVariantCount} opciones
            </span>
          )}
        </div>

        {/* Precio y acciones */}
        <div className="mt-auto pt-5">
          <div className="min-h-13">
            {product.saleMode === "direct_purchase" ? (
              product.pricing.canPurchase && price ? (
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="text-xl font-semibold tracking-tight text-slate-950">
                    {price}
                  </span>

                  {compareAtPrice && (
                    <span className="pb-0.5 text-sm text-slate-400 line-through">
                      {compareAtPrice}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-semibold text-slate-500">
                  No disponible para compra
                </span>
              )
            ) : product.saleMode === "quote_only" ? (
              <div>
                <span className="block text-lg font-semibold text-sky-700">
                  Precio bajo cotización
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Solicita precio y disponibilidad
                </span>
              </div>
            ) : (
              <div>
                <span className="block text-lg font-semibold text-slate-800">
                  Información comercial
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Consulta condiciones con nuestro equipo
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 justify-center">
            {product.pricing.canPurchase ? (
              <Link
                href={`/productos/${product.slug}`}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                <ShoppingCart className="h-4 w-4" />
                Ver opciones
              </Link>
            ) : (
              <Link
                href={`/productos/${product.slug}`}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-sky-700 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Ver producto
              </Link>
            )}

            <FavoriteButton
              productId={product.id}
              productName={product.name}
              variant="card"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
