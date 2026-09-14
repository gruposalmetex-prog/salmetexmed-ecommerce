import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Boxes,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Images,
  PackageCheck,
} from "lucide-react";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";
import {
  getAdminProductById,
  getAdminProductFormOptions,
  getAdminProductPublicationReadiness,
  type AdminProductPublicationReadiness,
} from "@/features/admin/products/services/admin-product.service";
import {
  AdminProductEditorSteps,
  type AdminProductEditorStep,
} from "@/features/admin/products/components/admin-product-editor-steps";
import { AdminProductVariantSection } from "@/features/admin/products/components/admin-product-variant-section";
import { AdminProductImageSection } from "@/features/admin/components/admin-product-image-section";
import { AdminProductDocumentSection } from "@/features/admin/products/components/admin-product-document-section";
import { PublishAdminProductForm } from "@/features/admin/products/components/publish-admin-product-form";
import { UpdateAdminProductForm } from "@/features/admin/products/components/update-admin-product-form";
import { UnpublishAdminProductForm } from "@/features/admin/products/components/unpublish-admin-product-form";

export const metadata: Metadata = {
  title: "Editar producto",
};

interface EditAdminProductPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    step?: string | string[];
    variantCreated?: string | string[];
    variantUpdated?: string | string[];
    imageCreated?: string | string[];
    documentCreated?: string | string[];
    updated?: string | string[];
    unpublished?: string | string[];
  }>;
}

const productIdSchema = z.uuid();

const editorSteps: AdminProductEditorStep[] = [
  "general",
  "variants",
  "images",
  "documents",
  "review",
];

const statusLabels = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
} as const;

const statusClasses = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
} as const;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseEditorStep(
  value: string | string[] | undefined,
): AdminProductEditorStep {
  const step = firstValue(value);

  if (step && editorSteps.includes(step as AdminProductEditorStep)) {
    return step as AdminProductEditorStep;
  }

  return "general";
}

export default async function EditAdminProductPage({
  params,
  searchParams,
}: EditAdminProductPageProps) {
  await requireAdmin();

  const [{ id }, query] = await Promise.all([params, searchParams]);

  const parsedId = productIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const activeStep = parseEditorStep(query.step);

  const [product, formOptions] = await Promise.all([
    getAdminProductById(parsedId.data),

    activeStep === "general"
      ? getAdminProductFormOptions()
      : Promise.resolve(null),
  ]);

  if (!product) {
    notFound();
  }

  const productUpdated = firstValue(query.updated) === "1";

  const variantCreated = firstValue(query.variantCreated) === "1";

  const variantUpdated = firstValue(query.variantUpdated) === "1";

  const imageCreated = firstValue(query.imageCreated) === "1";

  const documentCreated = firstValue(query.documentCreated) === "1";

  const publicationReadiness = getAdminProductPublicationReadiness(product);

  const variantCheck = publicationReadiness.checks.find(
    (check) => check.key === "variant",
  );

  const completion = {
    general: true,

    variants: variantCheck?.required ? variantCheck.complete : true,

    images: true,

    documents: true,

    review: product.status === "published",
  };

  const productUnpublished =
    firstValue(query.unpublished) === "1" && product.status === "draft";

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

        <Link href="/admin/productos" className="transition hover:text-sky-700">
          Productos
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-medium text-slate-800">{product.name}</span>
      </nav>

      <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                statusClasses[product.status]
              }`}
            >
              {statusLabels[product.status]}
            </span>

            <span className="font-mono text-xs text-slate-400">
              {product.slug}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {product.name}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {product.shortDescription}
          </p>
        </div>

        {product.status === "published" && (
          <Link
            href={`/productos/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ver en la tienda
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Estado"
          value={statusLabels[product.status]}
          icon={PackageCheck}
        />

        <SummaryCard
          label="Variantes"
          value={String(product.variants.length)}
          icon={Boxes}
        />

        <SummaryCard
          label="Imágenes"
          value={String(product.images.length)}
          icon={Images}
        />

        <SummaryCard
          label="Documentos"
          value={String(product.documents.length)}
          icon={FileText}
        />
      </div>

      <div className="mt-8">
        <AdminProductEditorSteps
          productId={product.id}
          activeStep={activeStep}
          completion={completion}
        />

        {productUnpublished && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Publicación retirada
              </p>

              <p className="mt-1 text-sm leading-6 text-emerald-700">
                El producto regresó a borrador y ya no está disponible en la
                tienda.
              </p>
            </div>
          </div>
        )}

        {productUpdated && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Producto actualizado
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                La información general se guardó correctamente.
              </p>
            </div>
          </div>
        )}
      </div>

      {variantCreated && activeStep !== "variants" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Variante guardada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La variante se agregó correctamente. Puedes continuar con la
              siguiente etapa.
            </p>
          </div>
        </div>
      )}

      {imageCreated && activeStep !== "images" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Imagen guardada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La imagen se subió correctamente. Puedes continuar con los
              documentos.
            </p>
          </div>
        </div>
      )}

      {documentCreated && activeStep !== "documents" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Documento guardado
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              El documento se subió correctamente. Puedes revisar la información
              del producto.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        {activeStep === "general" && formOptions && (
          <UpdateAdminProductForm
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,

              brandId: product.brandId,

              shortDescription: product.shortDescription,

              description: product.description,

              saleMode: product.saleMode,

              featured: product.featured,

              seoTitle: product.seoTitle,

              seoDescription: product.seoDescription,

              status: product.status,

              categoryIds: product.categoryLinks.map((link) => link.categoryId),
            }}
            brands={formOptions.brands}
            categories={formOptions.categories}
          />
        )}

        {activeStep === "variants" && (
          <AdminProductVariantSection
            productId={product.id}
            saleMode={product.saleMode}
            variants={product.variants}
            variantCreated={variantCreated}
            variantUpdated={variantUpdated}
          />
        )}

        {activeStep === "images" && (
          <AdminProductImageSection
            productId={product.id}
            productName={product.name}
            images={product.images}
            imageCreated={imageCreated}
          />
        )}

        {activeStep === "documents" && (
          <AdminProductDocumentSection
            productId={product.id}
            documents={product.documents}
            documentCreated={documentCreated}
          />
        )}

        {activeStep === "review" && (
          <ReviewStep product={product} readiness={publicationReadiness} />
        )}
      </div>
    </section>
  );
}

interface ReviewStepProps {
  product: NonNullable<Awaited<ReturnType<typeof getAdminProductById>>>;
  readiness: AdminProductPublicationReadiness;
}

function ReviewStep({ product, readiness }: ReviewStepProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <FileCheck2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Revisión del producto
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Verifica los requisitos antes de mostrar el producto en la tienda.
          </p>
        </div>
      </div>

      <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
        {readiness.checks.map((check) => (
          <div
            key={check.key}
            className="flex flex-col justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-800">
                  {check.label}
                </span>

                {!check.required && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    Opcional
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {check.description}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                check.complete
                  ? "bg-emerald-50 text-emerald-700"
                  : check.required
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {check.complete
                ? "Completo"
                : check.required
                  ? "Pendiente"
                  : "Sin agregar"}
            </span>
          </div>
        ))}
      </div>

      {product.status === "published" ? (
        <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Producto publicado
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700">
              Este producto ya está disponible en el catálogo público.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href={`/productos/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
            >
              Ver en la tienda
            </Link>

            <UnpublishAdminProductForm
              productId={product.id}
              productName={product.name}
            />
          </div>
        </div>
      ) : readiness.canPublish ? (
        <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-900">
              Producto listo para publicar
            </p>

            <p className="mt-1 text-sm leading-6 text-sky-700">
              Al publicarlo aparecerá en el catálogo y su página será accesible
              para los clientes.
            </p>
          </div>

          <PublishAdminProductForm
            productId={product.id}
            canPublish={readiness.canPublish}
          />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Producto incompleto
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-700">
            Completa los requisitos marcados como pendientes antes de publicar.
          </p>
        </div>
      )}
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

function SummaryCard({ label, value, icon: Icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
