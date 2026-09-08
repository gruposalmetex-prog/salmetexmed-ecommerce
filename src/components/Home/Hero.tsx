import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroItems = [
  {
    id: 1,
    title: "Monitores",
    eyebrow: "Monitoreo de pacientes",
    href: "/productos?category=monitores",
    image: "/images/hero/monitores.png",
    className: "lg:col-start-1 lg:row-start-1",
    variant: "dark",
  },
  {
    id: 2,
    title: "Lámparas de cirugía",
    eyebrow: "Iluminación quirúrgica",
    href: "/productos?category=lamparas-de-cirugia",
    image: "/images/hero/lamparas-cirugia.png",
    className: "lg:col-start-2 lg:row-start-1",
    variant: "dark",
  },
  {
    id: 3,
    title: "Ultrasonidos",
    eyebrow: "Diagnóstico por imagen",
    href: "/productos?category=ultrasonidos",
    image: "/images/hero/ultrasonidos.png",
    className: "lg:col-span-2 lg:col-start-1 lg:row-start-2",
    variant: "dark",
  },
  {
    id: 4,
    title: "Mesas de cirugía",
    eyebrow: "Equipamiento quirúrgico",
    href: "/productos?category=mesas-de-cirugia",
    image: "/images/hero/mesas-cirugia.png",
    className: "lg:col-start-3 lg:row-span-2 lg:row-start-1",
    variant: "dark",
  },
];

export function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-4 lg:h-130 lg:grid-cols-[1fr_1fr_2fr] lg:grid-rows-2">
          {heroItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "group relative h-full min-h-55 overflow-hidden rounded-2xl",
                item.className,
              ].join(" ")}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                preload={item.id === 4}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <div
                className={[
                  "absolute inset-0",
                  item.variant === "dark"
                    ? "bg-linear-to-t from-slate-950/85 via-slate-900/0 to-transparent"
                    : "bg-linear-to-r from-white/95 via-white/65 to-white/10",
                ].join(" ")}
              />

              <div className="relative flex h-full min-h-0 flex-col justify-end p-6 lg:p-7">
                <span
                  className={[
                    "mb-1 text-xs font-semibold uppercase tracking-[0.18em]",
                    item.variant === "dark" ? "text-white/75" : "text-sky-700",
                  ].join(" ")}
                >
                  {item.eyebrow}
                </span>

                <h2
                  className={[
                    "max-w-lg text-xl font-semibold leading-tight tracking-tight sm:text-2xl",
                    item.variant === "dark" ? "text-white" : "text-slate-950",
                  ].join(" ")}
                >
                  {item.title}
                </h2>

                <div
                  className={[
                    "mt-1 flex items-center gap-2 text-sm font-semibold",
                    item.variant === "dark" ? "text-white" : "text-sky-700",
                  ].join(" ")}
                >
                  Ver productos
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
