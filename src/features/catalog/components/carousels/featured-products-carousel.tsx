"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ProductCard } from "../product-card";
import type { PublicProductCard } from "../../services/product.service";

interface FeaturedProductsCarouselProps {
  products: PublicProductCard[];
}

export function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  if (products.length === 0) {
    return null;
  }

  const showDesktopControls =
    products.length > 4;

  return (
    <section className="w-full bg-white py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Selección recomendada
            </span>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Productos destacados
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Descubre algunos de nuestros
              equipos médicos más destacados
              para clínicas, hospitales y
              consultorios.
            </p>
          </div>

          <Link
            href="/productos?sort=featured"
            className="hidden items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 sm:flex"
          >
            Ver todos los productos

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ProductCard
                  product={product}
                  showDescription={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {showDesktopControls && (
            <>
              <CarouselPrevious className="left-0 hidden -translate-x-1/2 border-slate-200 bg-white shadow-sm lg:flex" />

              <CarouselNext className="right-0 hidden translate-x-1/2 border-slate-200 bg-white shadow-sm lg:flex" />
            </>
          )}
        </Carousel>

        <Link
          href="/productos?sort=featured"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 sm:hidden"
        >
          Ver todos los productos

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}