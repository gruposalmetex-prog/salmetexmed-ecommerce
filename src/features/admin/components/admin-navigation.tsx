"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers3, LayoutDashboard, Package, Tag, Tags } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  description?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: "General",
    items: [
      {
        label: "Resumen",
        href: "/admin",
        icon: LayoutDashboard,
        description: "Estado general del catálogo",
      },
    ],
  },
  {
    title: "Catálogo",
    items: [
      {
        label: "Productos",
        href: "/admin/productos",
        icon: Package,
        description: "Alta y edición de productos",
      },
      {
        label: "Categorías",
        href: "/admin/categorias",
        icon: Tags,
        description: "Organización del catálogo",
      },
      {
        label: "Áreas",
        href: "/admin/areas",
        icon: Layers3,
        description: "Áreas médicas del catálogo",
      },
      {
        label: "Marcas",
        href: "/admin/marcas",
        icon: Tag,
        description: "Marcas y fabricantes",
      },
    ],
  },
];

interface AdminNavigationProps {
  variant?: "sidebar" | "mobile";
}

function isItemActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminNavigation({ variant = "sidebar" }: AdminNavigationProps) {
  const pathname = usePathname();

  if (variant === "mobile") {
    const items = navigationSections.flatMap((section) => section.items);

    return (
      <nav
        aria-label="Navegación administrativa"
        className="flex min-w-max gap-2 px-4 py-3"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Navegación administrativa" className="space-y-7">
      {navigationSections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-200/50">
            {section.title}
          </p>

          <ul className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                      isActive
                        ? "bg-white text-blue-950 shadow-sm"
                        : "text-blue-100/70 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={[
                        "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-400 transition-opacity",
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-40",
                      ].join(" ")}
                    />

                    <Icon
                      className={[
                        "h-4.5 w-4.5 shrink-0",
                        isActive ? "text-blue-600" : "text-blue-200/60",
                      ].join(" ")}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.label}</span>
                      {item.description && (
                        <span
                          className={[
                            "block truncate text-[11px] font-normal",
                            isActive ? "text-slate-500" : "text-blue-200/40",
                          ].join(" ")}
                        >
                          {item.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
