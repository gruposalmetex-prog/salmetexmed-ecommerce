import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Layers3 } from "lucide-react";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";
import { UpdateAdminAreaForm } from "@/features/admin/areas/components/update-admin-area-form";
import { getAdminAreaById } from "@/features/admin/products/services/admin-area.service";
import { AdminAreaImageSection } from "@/features/admin/areas/components/admin-area-image-section";

export const metadata: Metadata = {
  title: "Editar área",
};

interface EditAdminAreaPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    updated?: string | string[];
    imageUpdated?: string | string[];
    imageDeleted?: string | string[];
  }>;
}

const areaIdSchema = z.uuid();

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditAdminAreaPage({
  params,
  searchParams,
}: EditAdminAreaPageProps) {
  await requireAdmin();

  const [{ id }, query] = await Promise.all([params, searchParams]);

  const parsedId = areaIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const area = await getAdminAreaById(parsedId.data);

  if (!area) {
    notFound();
  }

  const areaUpdated = firstValue(query.updated) === "1";

  const imageUpdated = firstValue(query.imageUpdated) === "1";

  const imageDeleted = firstValue(query.imageDeleted) === "1";

  return (
    <section>
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <Link href="/admin" className="transition hover:text-sky-700">
          Administración
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <Link href="/admin/areas" className="transition hover:text-sky-700">
          Áreas
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-medium text-slate-800">{area.name}</span>
      </nav>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Layers3 className="h-6 w-6" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Editar área
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                area.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {area.active ? "Activa" : "Inactiva"}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {area.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs text-slate-400">{area.slug}</p>

            <span className="text-xs text-slate-400">
              Orden: {area.sortOrder}
            </span>
          </div>
        </div>
      </div>

      {areaUpdated && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Área actualizada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Los cambios se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      {imageUpdated && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Imagen actualizada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La imagen del área se guardó correctamente.
            </p>
          </div>
        </div>
      )}

      {imageDeleted && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Imagen eliminada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La imagen se retiró del área.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <UpdateAdminAreaForm area={area} />

        <AdminAreaImageSection
          areaId={area.id}
          areaName={area.name}
          imageUrl={area.imageUrl}
          imagePublicId={area.imagePublicId}
        />
      </div>
    </section>
  );
}