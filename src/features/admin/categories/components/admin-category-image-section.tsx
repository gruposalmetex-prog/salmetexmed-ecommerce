"use client";
import Image from "next/image";
import {
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { createCategoryImageUploadSignature } from "../actions/create-category-image-upload-signature.action";

import {
  saveAdminCategoryImageAction,
  type SaveAdminCategoryImageState,
} from "../actions/save-admin-category-image.action";

import {
  deleteAdminCategoryImageAction,
  type DeleteAdminCategoryImageState,
} from "../actions/delete-admin-category-image.action";

interface AdminCategoryImageSectionProps {
  categoryId: string;
  categoryName: string;
  imageUrl: string | null;
  imagePublicId: string | null;
}

interface CloudinaryUploadResponse {
  public_id?: string;

  error?: {
    message?: string;
  };
}

const initialSaveState: SaveAdminCategoryImageState = {
  status: "idle",
};

const initialDeleteState: DeleteAdminCategoryImageState = {
  status: "idle",
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export function AdminCategoryImageSection({
  categoryId,
  categoryName,
  imageUrl,
  imagePublicId,
}: AdminCategoryImageSectionProps) {
  const [saveState, saveAction, savePending] = useActionState(
    saveAdminCategoryImageAction,
    initialSaveState,
  );

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteAdminCategoryImageAction,
    initialDeleteState,
  );

  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const [clientError, setClientError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const busy = uploading || savePending || deletePending;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    setClientError(null);

    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.has(selectedFile.type)) {
      setFile(null);
      setPreviewUrl(null);

      setClientError("Selecciona una imagen JPG, PNG, WebP o AVIF.");

      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      setFile(null);
      setPreviewUrl(null);

      setClientError("La imagen no puede superar 8 MB.");

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    if (!file) {
      setClientError("Selecciona una imagen antes de guardar.");

      return;
    }

    setUploading(true);

    try {
      const signatureResult = await createCategoryImageUploadSignature({
        categoryId,
      });

      if (!signatureResult.success) {
        throw new Error(signatureResult.error);
      }

      const cloudinaryFormData = new FormData();

      cloudinaryFormData.set("file", file);

      cloudinaryFormData.set("api_key", signatureResult.upload.apiKey);

      cloudinaryFormData.set("signature", signatureResult.upload.signature);

      for (const [key, value] of Object.entries(
        signatureResult.upload.parameters,
      )) {
        cloudinaryFormData.set(key, String(value));
      }

      const response = await fetch(signatureResult.upload.uploadUrl, {
        method: "POST",
        body: cloudinaryFormData,
      });

      const uploadResult = (await response.json()) as CloudinaryUploadResponse;

      if (!response.ok) {
        throw new Error(
          uploadResult.error?.message ?? "Cloudinary rechazó la imagen.",
        );
      }

      if (!uploadResult.public_id) {
        throw new Error(
          "Cloudinary no devolvió el identificador de la imagen.",
        );
      }

      const actionFormData = new FormData();

      actionFormData.set("categoryId", categoryId);

      actionFormData.set("publicId", uploadResult.public_id);

      setUploading(false);

      startTransition(() => {
        saveAction(actionFormData);
      });
    } catch (error) {
      setUploading(false);

      setClientError(
        error instanceof Error
          ? error.message
          : "No fue posible subir la imagen.",
      );
    }
  }

  function openDeleteDialog() {
    deleteDialogRef.current?.showModal();
  }

  function closeDeleteDialog() {
    if (!deletePending) {
      deleteDialogRef.current?.close();
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <ImagePlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Imagen de la categoría
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Utiliza una imagen representativa para las secciones públicas del
              catálogo.
            </p>
          </div>
        </div>

        {imageUrl && (
          <button
            type="button"
            onClick={openDeleteDialog}
            disabled={busy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar imagen
          </button>
        )}
      </div>

      {(saveState.status === "error" ||
        deleteState.status === "error" ||
        clientError) && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible actualizar la imagen
          </p>

          <p className="mt-1 text-sm text-red-700">
            {clientError ?? saveState.message ?? deleteState.message}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">Imagen actual</p>

          <div className="relative mt-2 flex aspect-16/10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={categoryName}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="px-6 text-center">
                <ImagePlus className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  La categoría todavía no tiene imagen.
                </p>
              </div>
            )}
          </div>

          {imagePublicId && (
            <p className="mt-2 break-all font-mono text-[11px] text-slate-400">
              {imagePublicId}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <p className="text-sm font-semibold text-slate-800">
            {imageUrl ? "Reemplazar imagen" : "Agregar imagen"}
          </p>

          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            disabled={busy}
            className="relative mt-2 flex aspect-16/10 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white transition hover:border-sky-400 hover:bg-sky-50/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Vista previa de la nueva imagen"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="px-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-sky-600" />

                <p className="mt-3 text-sm font-semibold text-slate-800">
                  Seleccionar imagen
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  JPG, PNG, WebP o AVIF. Máximo 8 MB.
                </p>
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            disabled={busy}
            className="sr-only"
          />

          {saveState.fieldErrors?.image?.[0] && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {saveState.fieldErrors.image[0]}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !file}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : imageUrl ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Reemplazar imagen
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Guardar imagen
              </>
            )}
          </button>
        </form>
      </div>

      <dialog
        ref={deleteDialogRef}
        onCancel={(event) => {
          if (deletePending) {
            event.preventDefault();
          }
        }}
        onClick={(event) => {
          if (event.target === deleteDialogRef.current) {
            closeDeleteDialog();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="font-semibold text-slate-950">Eliminar imagen</h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              La categoría quedará sin imagen representativa.
            </p>
          </div>

          <button
            type="button"
            onClick={closeDeleteDialog}
            disabled={deletePending}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form action={deleteAction} className="px-5 py-4">
          <input type="hidden" name="categoryId" value={categoryId} />

          <p className="text-sm text-slate-700">
            ¿Quieres eliminar la imagen de <strong>{categoryName}</strong>?
          </p>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDeleteDialog}
              disabled={deletePending}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={deletePending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletePending ? (
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
    </section>
  );
}
