import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Layers3,
} from "lucide-react";

import { requireAdmin } from "@/features/admin/require-admin";
import { CreateAdminAreaForm } from "@/features/admin/products/components/create-admin-area-form";


export const metadata: Metadata = {
  title: "Nueva área",
};

export default async function NewAdminAreaPage() {
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
          href="/admin/areas"
          className="transition hover:text-sky-700"
        >
          Áreas
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-medium text-slate-800">
          Nueva área
        </span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Layers3 className="h-6 w-6" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Organización del catálogo
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Nueva área
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Registra un área médica para organizar categorías y
            productos relacionados.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CreateAdminAreaForm />
      </div>
    </section>
  );
}