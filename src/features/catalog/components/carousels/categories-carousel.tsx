"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tags } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type { PublicCatalogFilters } from "../../services/catalog-filter.service";

interface CategoriesCarouselProps {
  categories: PublicCatalogFilters["categories"];
}

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
  if (categories.length === 0) {
    return null;
  }
  const showDesktopControls = categories.length > 3;

  return (
    <section
      aria-labelledby="categories-carousel-title"
      className="w-full bg-slate-50 py-14 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Explora por producto
            </span>

            <h2
              id="categories-carousel-title"
              className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            >
              Categorías destacadas
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Accede rápidamente a las principales categorías de equipo médico
              disponibles en nuestro catálogo.
            </p>
          </div>

          <Link
            href="/categorias"
            className="hidden items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 sm:inline-flex"
          >
            Ver todas las categorías
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
            {categories.map((category) => (
              <CarouselItem
                key={category.slug}
                className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/5"
              >
                <Link
                  href={`/productos?category=${category.slug}`}
                  aria-label={`Ver productos de ${category.name}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-sky-50 via-slate-100 to-sky-100">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                          <Tags className="h-7 w-7 text-sky-700" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent" />

                    <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                      {category.count}{" "}
                      {category.count === 1 ? "producto" : "productos"}
                    </span>
                  </div>

                  <div className="flex min-h-47.5 flex-col p-5">
                    <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                      Categoría
                    </span>

                    <h3 className="text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-sky-700">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {category.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-sky-700">
                      Ver productos
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
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
          href="/categorias"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 sm:hidden"
        >
          Ver todas las categorías
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
