"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AreaCarouselItem {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  count: number;
}

interface AreasCarouselProps {
  areas: AreaCarouselItem[];
}

export function AreasCarousel({ areas }: AreasCarouselProps) {
  if (areas.length === 0) {
    return null;
  }

  const showDesktopControls = areas.length > 3;

  return (
    <section
      aria-labelledby="areas-carousel-title"
      className="w-full bg-white py-14 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Explora por especialidad
            </span>

            <h2
              id="areas-carousel-title"
              className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            >
              Áreas médicas
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Encuentra equipos y soluciones organizados según el área médica
              que necesitas atender.
            </p>
          </div>

          <Link
            href="/areas"
            className="hidden items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 sm:inline-flex"
          >
            Ver todas las áreas
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
            {areas.map((area) => (
              <CarouselItem
                key={area.slug}
                className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link
                  href={`/productos?area=${area.slug}`}
                  aria-label={`Explorar productos de ${area.name}`}
                  className="group relative block h-90 overflow-hidden rounded-2xl bg-slate-100"
                >
                  {area.image ? (
                    <Image
                    src={area.image}
                    alt={area.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-sky-700 via-sky-800 to-slate-950" />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                        Área médica
                      </span>

                      <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                        {area.count}{" "}
                        {area.count === 1 ? "producto" : "productos"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {area.name}
                    </h3>

                    {area.description && (
                      <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-6 text-white/70">
                        {area.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                      Explorar área
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
          href="/areas"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 sm:hidden"
        >
          Ver todas las áreas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
