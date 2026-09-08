"use client";

import { MapPin, PackageCheck } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const successCases = [
  {
    id: "1",
    title: "Agujas para fístula A.V.",
    location: "Monterrey, Nuevo León",
    description:
      "Entrega de insumos médicos para atención especializada y tratamiento hospitalario.",
    image: "/images/success-cases/agujas-fistula-av.jpeg",
  },
  {
    id: "2",
    title: "Equipo de diagnóstico",
    location: "Zaachila Oaxaca",
    description:
      "Suministro de equipo médico para consultorio y valoración clínica.",
    image: "/images/success-cases/equipo-diagnostico.jpeg",
  },
  {
    id: "3",
    title: "Lámpara Quirúrgica LED",
    location: "Chiautla, Estado de México",
    description:
      "Entrega de Lámpara Quirúrgica LED Recargable de Emergencia Móvil",
    image: "/images/success-cases/lampara-cirugia.jpeg",
  },
  {
    id: "4",
    title: "Mesa de Operaciones Eléctrica",
    location: "Jilotepec Estado de México",
    description:
      "Suministro y envío de equipamiento médico para atención ambulatoria.",
    image: "/images/success-cases/mesa-operaciones.jpeg",
  },
];

export function SuccessCasesCarousel() {
  return (
    <section className="w-full bg-slate-50 py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Entregas realizadas
          </span>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Casos de éxito
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Conoce algunos de los equipos e insumos médicos que hemos enviado a
            clínicas, hospitales y profesionales de la salud en México.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {successCases.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
                  <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur">
                        <PackageCheck className="h-3.5 w-3.5 text-sky-700" />
                        Entrega realizada
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="text-lg font-semibold leading-tight text-white">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {item.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-0 hidden -translate-x-1/2 border-slate-200 bg-white shadow-sm lg:flex" />

          <CarouselNext className="right-0 hidden translate-x-1/2 border-slate-200 bg-white shadow-sm lg:flex" />
        </Carousel>
      </div>
    </section>
  );
}
