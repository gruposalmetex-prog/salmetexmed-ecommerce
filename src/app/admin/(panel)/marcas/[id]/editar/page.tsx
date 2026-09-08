import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Tag,
} from "lucide-react";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";
import { UpdateAdminBrandForm } from "@/features/admin/brands/components/update-admin-brand-form";
import { getAdminBrandById } from "@/features/admin/products/services/admin-brand.service";


export const metadata: Metadata = {
  title: "Editar marca",
};

interface EditAdminBrandPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    updated?: string | string[];
  }>;
}

const brandIdSchema = z.uuid();

function firstValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export default async function EditAdminBrandPage({
  params,
  searchParams,
}: EditAdminBrandPageProps) {
  await requireAdmin();

  const [
    { id },
    query,
  ] = await Promise.all([
    params,
    searchParams,
  ]);

  const parsedId =
    brandIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const brand =
    await getAdminBrandById(
      parsedId.data,
    );

  if (!brand) {
    notFound();
  }

  const brandUpdated =
    firstValue(query.updated) === "1";

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
          {brand.name}
        </span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Tag className="h-6 w-6" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Editar marca
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                brand.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {brand.active
                ? "Activa"
                : "Inactiva"}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {brand.name}
          </h1>

          <p className="mt-2 font-mono text-xs text-slate-400">
            {brand.slug}
          </p>
        </div>
      </div>

      {brandUpdated && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Marca actualizada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Los cambios se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <UpdateAdminBrandForm
          brand={brand}
        />
      </div>
    </section>
  );
}