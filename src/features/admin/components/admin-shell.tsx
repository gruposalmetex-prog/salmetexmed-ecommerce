import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { AdminNavigation } from "./admin-navigation";
import { AdminSignOutButton } from "./admin-sign-out-button";

interface AdminShellProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
  };
}

export function AdminShell({ children, user }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <aside className="hidden h-screen flex-col bg-gradient-to-b from-blue-950 via-blue-950 to-blue-900 lg:sticky lg:top-0 lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15">
              <Image
                src="/image.webp"
                alt="Logo SALMETEXMED"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </span>

            <div className="min-w-0">
              <p className="truncate font-semibold tracking-wide text-white">
                SALMETEXMED
              </p>
              <p className="text-xs text-blue-200/60">Administración</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <AdminNavigation />
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold uppercase text-white">
                {user.name.charAt(0)}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-blue-200/60">
                  {user.email}
                </p>
              </div>
            </div>

            <span className="mt-3 inline-flex rounded-full bg-blue-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300 ring-1 ring-blue-400/20">
              Administrador
            </span>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-18 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 p-1">
                <Image
                  src="/image.webp"
                  alt="Logo SALMETEXMED"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                  priority
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  SALMETEXMED
                </p>
                <p className="text-xs text-slate-500">Administración</p>
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-950">
                Centro de administración
              </p>
              <p className="text-xs text-slate-500">
                Gestión del catálogo y contenido
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Ver tienda</span>
              </Link>

              <AdminSignOutButton />
            </div>
          </div>

          <div className="overflow-x-auto border-t border-slate-100 lg:hidden">
            <AdminNavigation variant="mobile" />
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
