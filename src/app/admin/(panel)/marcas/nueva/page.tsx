import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Tag,
} from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { CreateAdminBrandForm } from "@/features/admin/brands/components/create-admin-brand-form";

export const metadata: Metadata = {
  title: "Nueva marca",
};

export default async function NewAdminBrandPage() {
  await requireAdmin();

  return (
    <section>
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <Link
          href="/admin"
          className="transition hover:text-sky-700"
        >
          Administración
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <Link
          href="/admin/marcas"
          className="transition hover:text-sky-700"
        >
          Marcas
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-medium text-slate-800">
          Nueva marca
        </span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Tag className="h-6 w-6" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Organización del catálogo
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Nueva marca
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Registra una marca o fabricante para asignarlo a los
            productos del catálogo.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CreateAdminBrandForm />
      </div>
    </section>
  );
}