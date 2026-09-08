"use client";

import { useActionState, useRef } from "react";
import {
  unpublishAdminProductAction,
  UnpublishAdminProductState,
} from "../actions/unpublish-admin-product.action";
import { EyeOff, LoaderCircle, TriangleAlert, X } from "lucide-react";

interface UnpublishAdminProductFormProps {
  productId: string;
  productName: string;
}

const initialState: UnpublishAdminProductState = {
  status: "idle",
};

export function UnpublishAdminProductForm({
  productId,
  productName,
}: UnpublishAdminProductFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [state, formAction, pending] = useActionState(
    unpublishAdminProductAction,
    initialState,
  );

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!pending) {
      dialogRef.current?.close();
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-sm font-semibold text-amber-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 sm:w-auto"
      >
        <EyeOff className="h-4 w-4" />
        Retirar publicación
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="unpublish-product-title"
        aria-describedby="unpublish-product-description"
        onCancel={(event) => {
          if (pending) {
            event.preventDefault();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-left shadow-2xl backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm"
      >
        <form action={formAction}>
          <input type="hidden" name="productId" value={productId} />

          <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <TriangleAlert className="h-5 w-5" />
              </div>

              <div>
                <h2
                  id="unpublish-product-title"
                  className="text-lg font-semibold text-slate-950"
                >
                  Retirar publicación
                </h2>

                <p
                  id="unpublish-product-description"
                  className="mt-1 text-sm leading-6 text-slate-500"
                >
                  El producto dejará de estar disponible para los clientes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDialog}
              disabled={pending}
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Producto
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {productName}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              El producto regresará a borrador y desaparecerá del catálogo
              público. Sus variantes, imágenes y documentos se conservarán.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Podrás volver a publicarlo cuando lo necesites.
            </p>

            {state.status === "error" && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-red-800">
                  No fue posible retirar la publicación
                </p>

                <p className="mt-1 text-sm text-red-700">{state.message}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDialog}
              disabled={pending}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
            >
              {pending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Retirando...
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  Retirar publicación
                </>
              )}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
