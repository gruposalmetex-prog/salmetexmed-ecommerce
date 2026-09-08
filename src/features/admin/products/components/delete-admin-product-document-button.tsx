"use client";

import { useActionState, useRef } from "react";
import { FileX2, LoaderCircle, Trash2, X } from "lucide-react";

import {
  deleteAdminProductDocumentAction,
  type DeleteAdminProductDocumentState,
} from "../actions/delete-admin-product-document.action";

interface DeleteAdminProductDocumentButtonProps {
  productId: string;
  documentId: string;
  documentTitle: string;
  fileName: string;
}

const initialState: DeleteAdminProductDocumentState = {
  status: "idle",
};

export function DeleteAdminProductDocumentButton({
  productId,
  documentId,
  documentTitle,
  fileName,
}: DeleteAdminProductDocumentButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [state, formAction, pending] = useActionState(
    deleteAdminProductDocumentAction,
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
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Eliminar ${documentTitle}`}
        title="Eliminar documento"
        className="flex h-9 w-9 cursor-pointer shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-document-title-${documentId}`}
        aria-describedby={`delete-document-description-${documentId}`}
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

          <input type="hidden" name="documentId" value={documentId} />

          <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FileX2 className="h-5 w-5" />
              </div>

              <div>
                <h2
                  id={`delete-document-title-${documentId}`}
                  className="text-lg font-semibold text-slate-950"
                >
                  Eliminar documento
                </h2>

                <p
                  id={`delete-document-description-${documentId}`}
                  className="mt-1 text-sm leading-6 text-slate-500"
                >
                  Esta acción eliminará el documento del producto y de
                  Cloudinary.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDialog}
              disabled={pending}
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {documentTitle}
              </p>

              <p className="mt-2 truncate font-mono text-xs text-slate-500">
                {fileName}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Después de eliminarlo podrás cargar otro documento del mismo tipo.
            </p>

            {state.message && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">{state.message}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDialog}
              disabled={pending}
              className="inline-flex cursor-pointer h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300"
            >
              {pending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Eliminar documento
                </>
              )}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
