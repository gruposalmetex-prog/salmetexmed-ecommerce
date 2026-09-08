import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Tags } from "lucide-react";

import { getPublicCatalogFilters } from "@/features/catalog/services/catalog-filter.service";

export const metadata: Metadata = {
  title: "Categorías de equipo médico | SALMETEXMED",
  description:
    "Consulta categorías de equipo médico para hospitales, clínicas y consultorios, con opciones de compra directa y cotización.",
  alternates: {
    canonical: "/categorias",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

export default async function CategoriesPage() {
  const { categories } = await getPublicCatalogFilters();

  return (
    <main className="w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-sky-700">
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span aria-current="page" className="font-medium text-slate-800">
            Categorías
          </span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Explora por tipo de producto
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Categorías de equipo médico
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Encuentra rápidamente equipos, instrumentos y soluciones médicas
            organizados por tipo de producto.
          </p>
        </header>

        {categories.length === 0 ? (
          <EmptyCategories />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/productos?category=${category.slug}`}
                  aria-label={`Ver productos de ${category.name}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

                  <div className="flex min-h-52.5 flex-1 flex-col p-5">
                    <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                      Categoría
                    </span>

                    <h2 className="text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-sky-700">
                      {category.name}
                    </h2>

                    {category.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {category.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-sky-700">
                      Ver productos
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section
          aria-labelledby="categories-help-title"
          className="mt-16 max-w-4xl border-t border-slate-200 pt-10"
        >
          <h2
            id="categories-help-title"
            className="text-2xl font-semibold tracking-tight text-slate-950"
          >
            Explora nuestro catálogo de equipo médico
          </h2>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Cada categoría contiene productos publicados con información de
            variantes, disponibilidad, precios y modalidades de venta. Puedes
            aplicar filtros adicionales desde el catálogo para encontrar la
            opción adecuada.
          </p>
        </section>
      </div>
    </main>
  );
}

function EmptyCategories() {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <Tags className="h-9 w-9 text-sky-700" />

      <h2 className="mt-5 text-xl font-semibold text-slate-950">
        No hay categorías disponibles
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Todavía no existen categorías con productos publicados.
      </p>

      <Link
        href="/productos"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
      >
        Ver catálogo
      </Link>
    </div>
  );
}
