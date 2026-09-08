import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Stethoscope } from "lucide-react";

import { getPublicCatalogFilters } from "@/features/catalog/services/catalog-filter.service";

export const metadata: Metadata = {
  title: "Áreas médicas y especialidades | SALMETEXMED",
  description:
    "Explora equipo médico para cardiología, diagnóstico, laboratorio y otras áreas de atención clínica y hospitalaria.",
  alternates: {
    canonical: "/areas",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

export default async function AreasPage() {
  const { areas } = await getPublicCatalogFilters();

  return (
    <main className="w-full bg-white">
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
            Áreas médicas
          </span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Explora por especialidad
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Equipo médico por área de atención
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Encuentra equipos y soluciones organizados según el área médica,
            especialidad o tipo de atención que necesitas cubrir.
          </p>
        </header>

        {areas.length === 0 ? (
          <EmptyAreas />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/productos?area=${area.slug}`}
                  aria-label={`Explorar productos de ${area.name}`}
                  className="group relative block min-h-90 overflow-hidden rounded-2xl bg-slate-100"
                >
                  {area.image ? (
                    <Image
                      src={area.image}
                      alt={area.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-sky-700 via-sky-800 to-slate-950">
                      <Stethoscope
                        aria-hidden="true"
                        className="h-20 w-20 text-white/10"
                      />
                    </div>
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

                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {area.name}
                    </h2>

                    {area.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
                        {area.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                      Explorar área
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section
          aria-labelledby="areas-help-title"
          className="mt-16 max-w-4xl border-t border-slate-200 pt-10"
        >
          <h2
            id="areas-help-title"
            className="text-2xl font-semibold tracking-tight text-slate-950"
          >
            Encuentra el equipo adecuado para tu especialidad
          </h2>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Cada área reúne categorías de productos relacionadas con sus
            necesidades clínicas. Selecciona una especialidad para consultar
            equipos publicados, disponibilidad, opciones de compra y productos
            bajo cotización.
          </p>
        </section>
      </div>
    </main>
  );
}

function EmptyAreas() {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <Stethoscope className="h-9 w-9 text-sky-700" />

      <h2 className="mt-5 text-xl font-semibold text-slate-950">
        No hay áreas disponibles
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Todavía no existen áreas médicas con productos publicados.
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
