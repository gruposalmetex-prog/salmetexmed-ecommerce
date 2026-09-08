"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ImagePlus,
  LoaderCircle,
  Save,
  Upload,
} from "lucide-react";

import {
  createAdminProductImageAction,
  type CreateAdminProductImageState,
} from "../actions/create-admin-product-image.action";

import { createProductImageUploadSignature } from "../actions/create-product-image-upload-signature.action";

import { AdminFieldError } from "./admin-field-error";

interface CreateAdminProductImageFormProps {
  productId: string;
  productName: string;
  hasImages: boolean;
}

interface CloudinaryImageUploadResponse {
  public_id?: string;

  error?: {
    message?: string;
  };
}

type UploadStage = "idle" | "validating" | "signing" | "uploading" | "saving";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const initialImageState: CreateAdminProductImageState = {
  status: "idle",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getProgressLabel(stage: UploadStage) {
  switch (stage) {
    case "validating":
      return "Validando imagen...";

    case "signing":
      return "Preparando carga...";

    case "uploading":
      return "Subiendo a Cloudinary...";

    case "saving":
      return "Guardando imagen...";

    default:
      return "Guardando...";
  }
}

export function CreateAdminProductImageForm({
  productId,
  productName,
  hasImages,
}: CreateAdminProductImageFormProps) {
  const [state, finalizeImage, pending] = useActionState(
    createAdminProductImageAction,
    initialImageState,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [altText, setAltText] = useState(productName);

  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const busy = pending || uploadStage !== "idle";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) {
      return;
    }

    const form = event.currentTarget;

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const intent = submitter?.value === "continue" ? "continue" : "stay";

    const initialFormData = new FormData(form);

    const isPrimary = initialFormData.get("isPrimary") === "on";

    setLocalError(null);
    setUploadStage("validating");

    try {
      if (!selectedFile) {
        throw new Error("Selecciona una imagen.");
      }

      if (!ACCEPTED_IMAGE_TYPES.has(selectedFile.type)) {
        throw new Error(
          "La imagen debe estar en formato JPG, PNG, WebP o AVIF.",
        );
      }

      if (selectedFile.size <= 0) {
        throw new Error("La imagen está vacía.");
      }

      if (selectedFile.size > MAX_IMAGE_SIZE) {
        throw new Error("La imagen no puede superar 8 MB.");
      }

      const normalizedAltText = altText.trim();

      if (normalizedAltText.length < 5) {
        throw new Error(
          "El texto alternativo debe tener al menos 5 caracteres.",
        );
      }

      if (normalizedAltText.length > 180) {
        throw new Error(
          "El texto alternativo no puede superar 180 caracteres.",
        );
      }

      setUploadStage("signing");

      const signatureResult = await createProductImageUploadSignature({
        productId,
        altText: normalizedAltText,
        isPrimary,
      });

      if (!signatureResult.success) {
        throw new Error(signatureResult.error);
      }

      setUploadStage("uploading");

      const cloudinaryFormData = new FormData();

      cloudinaryFormData.set("file", selectedFile);

      cloudinaryFormData.set("api_key", signatureResult.upload.apiKey);

      cloudinaryFormData.set("signature", signatureResult.upload.signature);

      Object.entries(signatureResult.upload.parameters).forEach(
        ([name, value]) => {
          cloudinaryFormData.set(name, String(value));
        },
      );

      const uploadResponse = await fetch(signatureResult.upload.uploadUrl, {
        method: "POST",
        body: cloudinaryFormData,
      });

      const uploadResult =
        (await uploadResponse.json()) as CloudinaryImageUploadResponse;

      if (!uploadResponse.ok || !uploadResult.public_id) {
        throw new Error(
          uploadResult.error?.message ?? "Cloudinary rechazó la imagen.",
        );
      }

      if (
        uploadResult.public_id !== signatureResult.upload.parameters.public_id
      ) {
        throw new Error("Cloudinary devolvió un identificador inesperado.");
      }

      setUploadStage("saving");

      const finalFormData = new FormData();

      finalFormData.set("productId", productId);

      finalFormData.set("publicId", uploadResult.public_id);

      finalFormData.set("altText", normalizedAltText);

      finalFormData.set("intent", intent);

      if (isPrimary) {
        finalFormData.set("isPrimary", "on");
      }
      setUploadStage("idle");

      startTransition(() => {
        finalizeImage(finalFormData);
      });
    } catch (error) {
      setUploadStage("idle");

      setLocalError(
        error instanceof Error
          ? error.message
          : "No fue posible subir la imagen.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="productId" value={productId} />

      {!hasImages && <input type="hidden" name="isPrimary" value="on" />}

      {(localError || state.message) && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible guardar la imagen
          </p>

          <p className="mt-1 text-sm text-red-700">
            {localError ?? state.message}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <ImagePlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Agregar imagen
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              La imagen se subirá directamente a Cloudinary sin atravesar el
              servidor de Next.js.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <label
              htmlFor="product-image"
              className="group relative flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-sky-400 hover:bg-sky-50/40"
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Vista previa de la imagen seleccionada"
                    fill
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    unoptimized
                    className="object-contain p-4"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-4 py-3 text-xs font-medium text-white backdrop-blur-sm">
                    Haz clic para seleccionar otra imagen
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                    <Upload className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Selecciona una imagen
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                    JPG, PNG, WebP o AVIF. Tamaño máximo de 8 MB.
                  </p>
                </>
              )}

              <input
                id="product-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  setSelectedFile(file);

                  setPreviewUrl(file ? URL.createObjectURL(file) : null);

                  setLocalError(null);
                }}
                className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </label>

            {selectedFile && (
              <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Seleccionada
                </span>
              </div>
            )}

            <AdminFieldError errors={state.fieldErrors?.image} />
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-end justify-between gap-3">
                <label
                  htmlFor="product-image-alt"
                  className="text-sm font-semibold text-slate-800"
                >
                  Texto alternativo
                </label>

                <span className="text-xs text-slate-400">
                  {altText.length}/180
                </span>
              </div>

              <textarea
                id="product-image-alt"
                name="altText"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                maxLength={180}
                rows={5}
                required
                disabled={busy}
                placeholder="Describe el producto que aparece en la imagen"
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Describe lo que aparece en la imagen sin escribir “imagen de”.
              </p>

              <AdminFieldError errors={state.fieldErrors?.altText} />
            </div>

            {hasImages ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="isPrimary"
                  disabled={busy}
                  className="mt-1 h-4 w-4 accent-sky-700"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Establecer como principal
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Reemplazará la imagen principal actual.
                  </span>
                </span>
              </label>
            ) : (
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-sm font-semibold text-sky-900">
                  Primera imagen
                </p>

                <p className="mt-1 text-xs leading-5 text-sky-700">
                  Se establecerá automáticamente como imagen principal.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
        <Link
          href={`/admin/productos/${productId}/editar?step=documents`}
          aria-disabled={busy}
          className={`inline-flex items-center justify-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 hover:underline ${
            busy ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {hasImages
            ? "Continuar sin agregar otra imagen"
            : "Usar imagen predeterminada y continuar"}

          <ArrowRight className="h-4 w-4" />
        </Link>

        <button
          type="submit"
          name="intent"
          value="stay"
          disabled={busy || !selectedFile}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Guardar imagen
        </button>

        <button
          type="submit"
          name="intent"
          value="continue"
          disabled={busy || !selectedFile}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {getProgressLabel(uploadStage)}
            </>
          ) : (
            <>
              Guardar y continuar
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
