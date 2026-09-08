import Link from "next/link";
import {
  Check,
  FileCheck2,
  FileText,
  Images,
  Info,
  PackageSearch,
} from "lucide-react";

export type AdminProductEditorStep =
  | "general"
  | "variants"
  | "images"
  | "documents"
  | "review";

interface StepCompletion {
  general: boolean;
  variants: boolean;
  images: boolean;
  documents: boolean;
  review: boolean;
}

interface AdminProductEditorStepsProps {
  productId: string;
  activeStep: AdminProductEditorStep;
  completion: StepCompletion;
}

const steps = [
  {
    id: "general",
    label: "Información",
    icon: Info,
  },
  {
    id: "variants",
    label: "Variantes",
    icon: PackageSearch,
  },
  {
    id: "images",
    label: "Imágenes",
    icon: Images,
  },
  {
    id: "documents",
    label: "Documentos",
    icon: FileText,
  },
  {
    id: "review",
    label: "Revisión",
    icon: FileCheck2,
  },
] satisfies Array<{
  id: AdminProductEditorStep;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}>;

export function AdminProductEditorSteps({
  productId,
  activeStep,
  completion,
}: AdminProductEditorStepsProps) {
  return (
    <nav
      aria-label="Etapas de edición del producto"
      className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
    >
      <ol className="flex min-w-max items-center">
        {steps.map((step, index) => {
          const active =
            step.id === activeStep;

          const completed =
            completion[step.id];

          const Icon = step.icon;

          return (
            <li
              key={step.id}
              className="flex items-center"
            >
              {index > 0 && (
                <div
                  aria-hidden="true"
                  className={`mx-1 h-px w-5 sm:w-8 ${
                    completed || active
                      ? "bg-sky-300"
                      : "bg-slate-200"
                  }`}
                />
              )}

              <Link
                href={`/admin/productos/${productId}/editar?step=${step.id}`}
                aria-current={
                  active
                    ? "step"
                    : undefined
                }
                className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                  active
                    ? "bg-sky-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-700"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    active
                      ? "bg-white/15 text-white"
                      : completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-700"
                  }`}
                >
                  {completed &&
                  !active ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>

                <span>{step.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}