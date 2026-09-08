import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  FileText,
  BadgePercent,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type {
  PublicProduct,
  PublicProductCard,
} from "../services/product.service";
import { ProductPaymentMethods } from "./product-payment-methods";
import { ProductFaq } from "./product-faq";

import { RelatedProducts } from "./related-products";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { ProductShare } from "./product-share";
import {
  getProductPlaceholderAlt,
  PRODUCT_PLACEHOLDER_IMAGE_URL,
} from "../product-image.constants";

interface ProductDetailProps {
  product: PublicProduct;
  relatedProducts: PublicProductCard[];
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
export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const primaryImage =
    product.images.find((image) => image.isPrimary) ??
    product.images[0] ??
    null;

  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0] ??
    null;

  const priceInCents = defaultVariant?.priceInCents ?? null;

  const compareAtPriceInCents = defaultVariant?.compareAtPriceInCents ?? null;

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

  const canPurchase = defaultVariant?.canPurchase ?? false;

  const isDirectPurchase = product.saleMode === "direct_purchase";

  const isInStock =
    defaultVariant !== null &&
    (!defaultVariant.trackInventory || defaultVariant.stock > 0);

  const isBackorder =
    defaultVariant !== null &&
    defaultVariant.trackInventory &&
    defaultVariant.stock <= 0 &&
    defaultVariant.allowBackorder;

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-sky-700">
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <Link href="/productos" className="transition hover:text-sky-700">
            Productos
          </Link>

          {product.categories[0] && (
            <>
              <ChevronRight className="h-4 w-4 text-slate-300" />

              <Link
                href={`/productos?category=${product.categories[0].slug}`}
                className="transition hover:text-sky-700"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span className="text-slate-700">{product.name}</span>
        </nav>

        {/* Principal */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] xl:gap-16">
          {/* Galería */}
          <div>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-8 lg:p-12">
              <Image
                src={primaryImage?.url ?? PRODUCT_PLACEHOLDER_IMAGE_URL}
                alt={
                  primaryImage?.altText ||
                  getProductPlaceholderAlt(product.name)
                }
                width={primaryImage?.width ?? 500}
                height={primaryImage?.height ?? 500}
                sizes="(min-width: 1024px) 55vw, 100vw"
                preload
                className="h-full w-full object-contain"
              />

              {product.featured && (
                <span className="absolute left-5 top-5 rounded-md bg-slate-950 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Destacado
                </span>
              )}

              {isDirectPurchase && discountPercentage !== null && (
                <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white">
                  <BadgePercent className="h-3.5 w-3.5" />
                  {discountPercentage}% de descuento
                </span>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {product.images.map((image) => (
                  <div
                    key={image.url}
                    className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      width={image.width}
                      height={image.height}
                      sizes="120px"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col">
            {product.brand && (
              <Link
                href={`/productos?brand=${product.brand.slug}`}
                className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700"
              >
                {product.brand.name}
              </Link>
            )}

            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h1>

            {defaultVariant && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {defaultVariant.model && (
                  <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    Modelo:{" "}
                    <strong className="ml-1 font-semibold text-slate-800">
                      {defaultVariant.model}
                    </strong>
                  </span>
                )}

                {defaultVariant.sku && (
                  <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    SKU:{" "}
                    <strong className="ml-1 font-semibold text-slate-800">
                      {defaultVariant.sku}
                    </strong>
                  </span>
                )}
              </div>
            )}

            {product.shortDescription && (
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {product.shortDescription}
              </p>
            )}

            <div className="my-3 border-t border-slate-200" />

            {/* Precio */}
            {isDirectPurchase ? (
              price ? (
                <div className={hasDiscount ? "rounded-2xl  p-2" : ""}>
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
                        Antes{" "}
                        <span className="line-through">{compareAtPrice}</span>
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
                      ? defaultVariant?.trackInventory
                        ? `${defaultVariant.stock} disponibles`
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
            ) : product.saleMode === "quote_only" ? (
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
                  Nuestro equipo puede ayudarte con información, disponibilidad
                  y condiciones comerciales.
                </p>
              </div>
            )}

            {defaultVariant && (
              <div className="mt-3">
                <span className="text-sm font-semibold text-slate-950">
                  Presentación seleccionada
                </span>

                <div className="mt-2 rounded-xl border border-sky-600 bg-sky-50/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {defaultVariant.name}
                      </p>

                      {defaultVariant.model && (
                        <p className="mt-1 text-xs text-slate-500">
                          Modelo {defaultVariant.model}
                        </p>
                      )}
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-700 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="mt-7 flex gap-3">
              {canPurchase && defaultVariant ? (
                <AddToCartButton
                  variantId={defaultVariant.id}
                  productName={product.name}
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
                productId={product.id}
                productName={product.name}
                variant="detail"
              />
            </div>

            {isDirectPurchase && <ProductPaymentMethods />}

            <ProductShare
              productName={product.name}
              shortDescription={product.shortDescription}
            />

            {/* Beneficios */}
            <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
              <Benefit
                icon={Truck}
                title="Envíos"
                description="Cobertura nacional"
              />

              <Benefit
                icon={ShieldCheck}
                title="Compra segura"
                description="Atención especializada"
              />

              <Benefit
                icon={PackageCheck}
                title="Disponibilidad"
                description="Consulta existencias"
              />
            </div>
          </div>
        </section>

        {/* Información inferior */}
        <section className="mt-16 border-t border-slate-200 pt-10 lg:mt-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Descripción del producto
              </h2>

              {product.description ? (
                <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                  {product.description}
                </p>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  La descripción detallada estará disponible próximamente.
                </p>
              )}

              {/* Categorías */}
              {product.categories.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-sm font-semibold text-slate-950">
                    Categorías
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/productos?category=${category.slug}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Documentos */}
            {product.documents.length > 0 && (
              <aside>
                <h2 className="text-lg font-semibold text-slate-950">
                  Documentación
                </h2>

                <div className="mt-4 space-y-3">
                  {product.documents.map((document) => (
                    <a
                      key={document.url}
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <FileText className="h-5 w-5 text-sky-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {document.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {document.type}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>

        <ProductFaq />

        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}

interface BenefitProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}

function Benefit({ icon: Icon, title, description }: BenefitProps) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />

      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
