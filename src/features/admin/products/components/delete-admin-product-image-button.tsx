"use client";

import {
  useActionState,
  useRef,
} from "react";
import {
  LoaderCircle,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  deleteAdminProductImageAction,
  type DeleteAdminProductImageState,
} from "../actions/delete-admin-product-image.action";

interface DeleteAdminProductImageButtonProps {
  productId: string;
  imageId: string;
  imageAltText: string;
}

const initialState:
  DeleteAdminProductImageState = {
    status: "idle",
  };

export function DeleteAdminProductImageButton({
  productId,
  imageId,
  imageAltText,
}: DeleteAdminProductImageButtonProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(null);

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    deleteAdminProductImageAction,
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
    <div className="shrink-0">
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Eliminar ${imageAltText}`}
        className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-image-title-${imageId}`}
        aria-describedby={`delete-image-description-${imageId}`}
        onCancel={(event) => {
          if (pending) {
            event.preventDefault();
          }
        }}
        onClick={(event) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            closeDialog();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-left shadow-2xl backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm"
      >
        <form action={formAction}>
          <input
            type="hidden"
            name="productId"
            value={productId}
          />

          <input
            type="hidden"
            name="imageId"
            value={imageId}
          />

          <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <TriangleAlert className="h-5 w-5" />
              </div>

              <div>
                <h2
                  id={`delete-image-title-${imageId}`}
                  className="text-lg font-semibold text-slate-950"
                >
                  Eliminar imagen
                </h2>

                <p
                  id={`delete-image-description-${imageId}`}
                  className="mt-1 text-sm leading-6 text-slate-500"
                >
                  Esta acción eliminará la
                  imagen del producto y de
                  Cloudinary.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDialog}
              disabled={pending}
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Imagen seleccionada
              </p>

              <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">
                {imageAltText}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Si es la imagen principal y
              existen otras imágenes, la
              siguiente se establecerá como
              principal automáticamente.
            </p>

            {state.message && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">
                  {state.message}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDialog}
              disabled={pending}
              className="inline-flex cursor-pointer h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {pending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Eliminar imagen
                </>
              )}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}