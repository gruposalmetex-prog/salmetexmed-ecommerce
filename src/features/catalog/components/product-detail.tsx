import Link from "next/link";
import {
  ChevronRight,
  FileText,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { ProductVariantPurchasePanel } from "./product-variant-purchase-panel";

import type {
  PublicProduct,
  PublicProductCard,
} from "../services/product.service";
import { ProductFaq } from "./product-faq";
import { RelatedProducts } from "./related-products";
import { ProductShare } from "./product-share";
import { ProductImageGallery } from "./product-image-gallery";
interface ProductDetailProps {
  product: PublicProduct;
  relatedProducts: PublicProductCard[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
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
          <ProductImageGallery
            productName={product.name}
            featured={product.featured}
            images={product.images}
          />

          {/* Información */}

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

            {product.shortDescription && (
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                {product.shortDescription}
              </p>
            )}

            <ProductVariantPurchasePanel
              productId={product.id}
              productName={product.name}
              saleMode={product.saleMode}
              variants={product.variants}
            />

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
