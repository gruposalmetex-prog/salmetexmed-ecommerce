import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

const catalogLinks = [
  { label: "Productos", href: "/productos" },
  { label: "Áreas médicas", href: "/areas" },
  { label: "Categorías", href: "/categorias" },
  { label: "Marcas", href: "/marcas" },
  { label: "Promociones", href: "/promociones" },
];

const companyLinks = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
  { label: "Cotizaciones", href: "/cotizaciones" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
];

const legalLinks = [
  { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { label: "Política de envíos", href: "/politica-de-envios" },
  { label: "Política de devoluciones", href: "/politica-de-devoluciones" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-white">
      {/* CTA superior */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Atención especializada
            </span>

            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              ¿Necesitas equipo médico para tu clínica, hospital o consultorio?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Nuestro equipo puede ayudarte a encontrar la solución adecuada
              según tus necesidades y presupuesto.
            </p>
          </div>

          <Link
            href="/contacto"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Solicitar cotización
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <Link
              href="/"
              className="inline-flex flex-col leading-none"
              aria-label="Ir al inicio"
            >
              <Image
  src="/image.webp"
  alt="Logo SALMETEXMED"
  width={256}
  height={232}
  sizes="76px"
  className="h-17 w-auto object-contain"
/>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Equipo médico y soluciones para hospitales, clínicas,
              consultorios y profesionales de la salud.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="tel:+525500000000"
                className="flex items-start gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>+52 55 0000 0000</span>
              </a>

              <a
                href="mailto:ventas@salmetexmed.com.mx"
                className="flex items-start gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>ventas@salmetexmed.com.mx</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />

                <span>
                  Estado de México, México
                </span>
              </div>
            </div>
          </div>

          {/* Catálogo */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Catálogo
            </h3>

            <ul className="mt-5 space-y-3">
              {catalogLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Empresa
            </h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Información
            </h3>

            <ul className="mt-5 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer inferior */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {currentYear} SALMETEXMED. Todos los derechos reservados.
          </p>

          <p>
            Equipo médico y soluciones para el sector salud en México.
          </p>
        </div>
      </div>
    </footer>
  );
}