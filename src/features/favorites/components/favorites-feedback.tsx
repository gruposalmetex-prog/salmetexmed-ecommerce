import {
    AlertTriangle,
    LoaderCircle,
    RefreshCw,
  } from "lucide-react";

  export function FavoritesLoading() {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-sky-700" />

          <p className="mt-4 text-sm text-slate-500">
            Consultando tus favoritos…
          </p>
        </div>
      </div>
    );
  }

  export function FavoritesUpdating() {
    return (
      <p className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Actualizando favoritos…
      </p>
    );
  }

  interface FavoritesErrorProps {
    message: string;
    onRetry: () => void;
  }

  export function FavoritesError({
    message,
    onRetry,
  }: FavoritesErrorProps) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center">
        <AlertTriangle className="h-8 w-8 text-red-700" />

        <p className="mt-4 text-sm text-red-800">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    );
  }