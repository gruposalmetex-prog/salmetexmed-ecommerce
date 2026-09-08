"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ChevronDown,
  Grid2X2,
  Menu,
  Stethoscope,
} from "lucide-react";

import type { PublicCatalogFilters } from "@/features/catalog/services/catalog-filter.service";

interface CatalogNavigationProps {
  areas: PublicCatalogFilters["areas"];
  categories:
    PublicCatalogFilters["categories"];
}

export function CatalogNavigation({
  areas,
  categories,
}: CatalogNavigationProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const triggerRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleOutsidePointer(
      event: PointerEvent,
    ) {
      const target =
        event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(
          target,
        )
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        isOpen
      ) {
        setIsOpen(false);

        triggerRef.current?.focus();
      }
    }

    document.addEventListener(
      "pointerdown",
      handleOutsidePointer,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointer,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="catalog-navigation-menu"
        onClick={() =>
          setIsOpen(
            (currentValue) =>
              !currentValue,
          )
        }
        className="flex h-14 items-center gap-2 border-r border-slate-200 pr-6 text-sm font-semibold text-slate-800"
      >
        <Menu className="h-5 w-5 text-sky-700" />

        <span>Todas las categorías</span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="catalog-navigation-menu"
          className="absolute left-0 top-full z-50 mt-2 w-[min(760px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <NavigationSection
              title="Categorías"
              icon={Grid2X2}
              allHref="/categorias"
              allLabel="Ver todas las categorías"
              onNavigate={closeMenu}
            >
              {categories.length === 0 ? (
                <EmptyNavigationMessage />
              ) : (
                categories.map(
                  (category) => (
                    <NavigationLink
                      key={category.slug}
                      href={`/productos?category=${category.slug}`}
                      name={
                        category.name
                      }
                      count={
                        category.count
                      }
                      onNavigate={
                        closeMenu
                      }
                    />
                  ),
                )
              )}
            </NavigationSection>

            <NavigationSection
              title="Áreas médicas"
              icon={Stethoscope}
              allHref="/areas"
              allLabel="Ver todas las áreas"
              onNavigate={closeMenu}
            >
              {areas.length === 0 ? (
                <EmptyNavigationMessage />
              ) : (
                areas.map((area) => (
                  <NavigationLink
                    key={area.slug}
                    href={`/productos?area=${area.slug}`}
                    name={area.name}
                    count={area.count}
                    onNavigate={
                      closeMenu
                    }
                  />
                ))
              )}
            </NavigationSection>
          </div>
        </div>
      )}
    </div>
  );
}

interface NavigationSectionProps {
  title: string;
  icon: ComponentType<{
    className?: string;
  }>;
  allHref: string;
  allLabel: string;
  onNavigate: () => void;
  children: ReactNode;
}

function NavigationSection({
  title,
  icon: Icon,
  allHref,
  allLabel,
  onNavigate,
  children,
}: NavigationSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Icon className="h-4 w-4 text-sky-700" />

        <h2 className="text-sm font-semibold text-slate-950">
          {title}
        </h2>
      </div>

      <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
        {children}
      </div>

      <Link
        href={allHref}
        onClick={onNavigate}
        className="mt-4 inline-flex text-sm font-semibold text-sky-700 transition hover:text-sky-800"
      >
        {allLabel}
      </Link>
    </section>
  );
}

interface NavigationLinkProps {
  href: string;
  name: string;
  count: number;
  onNavigate: () => void;
}

function NavigationLink({
  href,
  name,
  count,
  onNavigate,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
    >
      <span className="font-medium">
        {name}
      </span>

      <span className="text-xs text-slate-400">
        {count}
      </span>
    </Link>
  );
}

function EmptyNavigationMessage() {
  return (
    <p className="px-3 py-2 text-sm text-slate-500">
      No hay opciones disponibles.
    </p>
  );
}