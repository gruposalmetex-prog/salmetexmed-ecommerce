import {
  CheckCircle2,
  Download,
  FileBadge,
  FileText,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

import { CreateAdminProductDocumentForm } from "./create-admin-product-document-form";
import { DeleteAdminProductDocumentButton } from "./delete-admin-product-document-button";

type ProductDocumentType =
  | "technical_sheet"
  | "manual"
  | "certificate"
  | "brochure";

interface ProductDocumentItem {
  id: string;
  documentType: ProductDocumentType;
  title: string;
  fileName: string;
  url: string;
}

interface AdminProductDocumentSectionProps {
  productId: string;
  documents: ProductDocumentItem[];
  documentCreated?: boolean;
}

const documentTypeDetails = {
  technical_sheet: {
    label: "Ficha técnica",
    icon: FileText,
    classes: "bg-sky-50 text-sky-700",
  },

  manual: {
    label: "Manual",
    icon: ScrollText,
    classes: "bg-violet-50 text-violet-700",
  },

  certificate: {
    label: "Certificado",
    icon: ShieldCheck,
    classes: "bg-emerald-50 text-emerald-700",
  },

  brochure: {
    label: "Folleto",
    icon: FileBadge,
    classes: "bg-amber-50 text-amber-700",
  },
} as const;

export function AdminProductDocumentSection({
  productId,
  documents,
  documentCreated = false,
}: AdminProductDocumentSectionProps) {
  const sortedDocuments = [...documents].sort((first, second) =>
    first.title.localeCompare(second.title, "es"),
  );

  return (
    <div className="space-y-6">
      {documentCreated && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Documento guardado
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              El PDF se subió y quedó relacionado correctamente con el producto.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Documentos registrados
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Estos documentos podrán consultarse desde la página pública del
            producto.
          </p>
        </div>

        {sortedDocuments.length > 0 ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sortedDocuments.map((document) => {
              const details = documentTypeDetails[document.documentType];

              const Icon = details.icon;

              return (
                <article
                  key={document.id}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${details.classes}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {details.label}
                    </span>

                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-950">
                      {document.title}
                    </h3>

                    <p className="mt-2 truncate font-mono text-xs text-slate-400">
                      {document.fileName}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${document.title}`}
                      title="Abrir documento"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700held"
                    >
                      <Download className="h-4 w-4" />
                    </a>

                    <DeleteAdminProductDocumentButton
                      productId={productId}
                      documentId={document.id}
                      documentTitle={document.title}
                      fileName={document.fileName}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <FileText className="mx-auto h-9 w-9 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              Todavía no hay documentos
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
              Puedes agregar una ficha técnica, manual, certificado o folleto en
              formato PDF.
            </p>
          </div>
        )}
      </section>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-950">
            {documents.length > 0
              ? "Agregar otro documento"
              : "Agregar primer documento"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Cada producto puede tener un documento de cada tipo.
          </p>
        </div>

        <CreateAdminProductDocumentForm
          productId={productId}
          existingTypes={documents.map((document) => document.documentType)}
        />
      </div>
    </div>
  );
}
