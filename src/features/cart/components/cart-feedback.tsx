import {
    AlertTriangle,
    LoaderCircle,
    RefreshCw,
  } from "lucide-react";

  import type { ResolvedCart } from "../services/cart.service";

  interface CartIssuesProps {
    issues: ResolvedCart["issues"];
    onRemove: (variantId: string) => void;
  }

  export function CartIssues({
    issues,
    onRemove,
  }: CartIssuesProps) {
    return (
      <div className="mb-6 space-y-3">
        {issues.map((issue) => (
          <div
            key={`${issue.variantId}-${issue.code}`}
            className="flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <p className="text-sm leading-6 text-amber-900">
                {issue.message}
              </p>
            </div>

            {issue.code !==
              "quantity_adjusted" && (
              <button
                type="button"
                onClick={() =>
                  onRemove(issue.variantId)
                }
                className="shrink-0 text-sm font-semibold text-amber-900 underline underline-offset-2"
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  export function CartLoading() {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-sky-700" />

          <p className="mt-4 text-sm text-slate-500">
            Validando productos y existencias…
          </p>
        </div>
      </div>
    );
  }

  export function CartUpdating() {
    return (
      <p className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Actualizando disponibilidad…
      </p>
    );
  }

  interface CartErrorProps {
    message: string;
    onRetry: () => void;
    compact?: boolean;
  }

  export function CartError({
    message,
    onRetry,
    compact = false,
  }: CartErrorProps) {
    return (
      <div
        className={`rounded-xl border border-red-200 bg-red-50 p-4 ${
          compact
            ? "mb-6"
            : "min-h-60"
        }`}
      >
        <div
          className={
            compact
              ? "flex items-center justify-between gap-4"
              : "flex h-full flex-col items-center justify-center text-center"
          }
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-700" />

            <p className="text-sm text-red-800">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100 sm:mt-0"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }