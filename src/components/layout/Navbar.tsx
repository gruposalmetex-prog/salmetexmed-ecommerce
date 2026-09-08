import Image from "next/image";
import Link from "next/link";
import { CartNavbarLink } from "@/features/cart/components/cart-navbar-link";
import { FavoritesNavbarLink } from "@/features/favorites/components/favorites-navbar-link";
import { getPublicCatalogFilters } from "@/features/catalog/services/catalog-filter.service";
import { CatalogNavigation } from "./catalog-navigation";
import { SearchBox } from "./search/search-box";
import { CreditCard, MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";

const navItems = [
  {
    label: "Promociones",
    href: "/productos?promotion=true",
  },
  {
    label: "Equipo médico",
    href: "/productos",
  },
  {
    label: "Destacados",
    href: "/productos?featured=true",
  },
  {
    label: "Cardiología",
    href: "/productos?area=cardiologia",
  },
  {
    label: "Laboratorio",
    href: "/productos?area=laboratorio",
  },
  {
    label: "Cotizaciones",
    href: "/productos?saleMode=quote_only",
  },
];

export async function Navbar() {
  const { areas, categories } = await getPublicCatalogFilters();

  const whatsappNumber = siteConfig.contact.whatsappNumber.replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    "Hola, me interesa recibir una cotización de equipo médico.",
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <header className="w-full bg-white">
      {/* Barra promocional */}
      <div className="bg-slate-950 text-white">
        <div className="mx-auto flex min-h-10 w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <CreditCard className="h-4 w-4 shrink-0 text-sky-400" />

            <p className="truncate text-xs font-medium sm:text-sm">
              <span className="sm:hidden">Meses sin intereses</span>

              <span className="hidden sm:inline">
                Meses sin intereses en productos y tarjetas participantes
              </span>
            </p>
          </div>

          {whatsappNumber && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Solicitar una cotización por WhatsApp"
              className="group flex shrink-0 items-center gap-2 border-l border-white/15 pl-4 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" />

              <span className="hidden sm:inline">Cotizar por WhatsApp</span>

              <span className="sm:hidden">Cotizar</span>

              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Logo + buscador + acciones */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-5 lg:px-8">
          <Link href="/" className="shrink-0">
            <div className="leading-none">
              <Image
                src="/image.webp"
                alt="Logo SALMETEXMED"
                width={256}
                height={232}
                sizes="76px"
                preload
                className="h-17 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Buscador */}
          <SearchBox
            className="hidden flex-1 md:block"
            placeholder="Buscar equipos, marcas o categorías..."
          />

          {/* Acciones */}
          <div className="ml-auto flex items-center gap-2">
            <FavoritesNavbarLink />
            <CartNavbarLink />
          </div>
        </div>

        {/* Buscador móvil */}
        <div className="px-6 pb-4 md:hidden">
          <SearchBox placeholder="Buscar productos..." />
        </div>
      </div>

      {/* Navegación principal */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center px-6 lg:px-8">
          <CatalogNavigation areas={areas} categories={categories} />

          <nav className="hidden h-14 items-center gap-7 overflow-x-auto lg:flex px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-semibold text-slate-700 transition hover:text-sky-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
