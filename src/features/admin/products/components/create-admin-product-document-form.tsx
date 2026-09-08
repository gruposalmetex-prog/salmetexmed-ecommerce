"use client";

import {
  startTransition,
  useActionState,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  FilePlus2,
  FileText,
  LoaderCircle,
  Save,
} from "lucide-react";

import {
  createAdminProductDocumentAction,
  type CreateAdminProductDocumentState,
} from "../actions/create-admin-product-document.action";

import {
  createProductDocumentUploadSignature,
} from "../actions/create-product-document-upload-signature.action";

import { AdminFieldError } from "./admin-field-error";

type ProductDocumentType =
  | "technical_sheet"
  | "manual"
  | "certificate"
  | "brochure";

type UploadStage =
  | "idle"
  | "validating"
  | "signing"
  | "uploading"
  | "saving";

interface CreateAdminProductDocumentFormProps {
  productId: string;
  existingTypes: ProductDocumentType[];
}

interface CloudinaryUploadResponse {
  public_id?: string;

  error?: {
    message?: string;
  };
}

const MAX_DOCUMENT_SIZE =
  10 * 1024 * 1024;

const initialDocumentState:
  CreateAdminProductDocumentState = {
    status: "idle",
  };

const documentTypeOptions: Array<{
  value: ProductDocumentType;
  label: string;
}> = [
  {
    value: "technical_sheet",
    label: "Ficha técnica",
  },
  {
    value: "manual",
    label: "Manual",
  },
  {
    value: "certificate",
    label: "Certificado",
  },
  {
    value: "brochure",
    label: "Folleto",
  },
];

function formatFileSize(
  bytes: number,
) {
  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes / (1024 * 1024)
  ).toFixed(1)} MB`;
}

function getProgressLabel(
  stage: UploadStage,
) {
  switch (stage) {
    case "validating":
      return "Validando PDF...";

    case "signing":
      return "Preparando carga...";

    case "uploading":
      return "Subiendo a Cloudinary...";

    case "saving":
      return "Guardando documento...";

    default:
      return "Guardando...";
  }
}

export function CreateAdminProductDocumentForm({
  productId,
  existingTypes,
}: CreateAdminProductDocumentFormProps) {
  const [
    state,
    finalizeDocument,
    pending,
  ] = useActionState(
    createAdminProductDocumentAction,
    initialDocumentState,
  );

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null,
  );

  const [
    uploadStage,
    setUploadStage,
  ] = useState<UploadStage>(
    "idle",
  );

  const [
    localError,
    setLocalError,
  ] = useState<string | null>(
    null,
  );

  const existingTypeSet =
    new Set(existingTypes);

  const availableTypes =
    documentTypeOptions.filter(
      (option) =>
        !existingTypeSet.has(
          option.value,
        ),
    );

  const busy =
    pending ||
    uploadStage !== "idle";

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (busy) {
      return;
    }

    const form =
      event.currentTarget;

    const submitter =
      (
        event.nativeEvent as SubmitEvent
      ).submitter as
        | HTMLButtonElement
        | null;

    const intent =
      submitter?.value === "continue"
        ? "continue"
        : "stay";

    const initialFormData =
      new FormData(form);

    const title =
      String(
        initialFormData.get(
          "title",
        ) ?? "",
      ).trim();

    const documentType =
      String(
        initialFormData.get(
          "documentType",
        ) ?? "",
      );

    setLocalError(null);
    setUploadStage("validating");

    try {
      if (!selectedFile) {
        throw new Error(
          "Selecciona un documento PDF.",
        );
      }

      if (
        selectedFile.type !==
          "application/pdf" ||
        !selectedFile.name
          .toLowerCase()
          .endsWith(".pdf")
      ) {
        throw new Error(
          "El documento debe estar en formato PDF.",
        );
      }

      if (selectedFile.size <= 0) {
        throw new Error(
          "El documento está vacío.",
        );
      }

      if (
        selectedFile.size >
        MAX_DOCUMENT_SIZE
      ) {
        throw new Error(
          "El documento no puede superar 10 MB.",
        );
      }

      const fileSignature =
        await selectedFile
          .slice(0, 5)
          .text();

      if (
        fileSignature !== "%PDF-"
      ) {
        throw new Error(
          "El archivo seleccionado no contiene un PDF válido.",
        );
      }

      setUploadStage("signing");

      const signatureResult =
        await createProductDocumentUploadSignature({
          productId,
          documentType,
          title,
        });

      if (!signatureResult.success) {
        throw new Error(
          signatureResult.error,
        );
      }

      setUploadStage("uploading");

      const cloudinaryFormData =
        new FormData();

      cloudinaryFormData.set(
        "file",
        selectedFile,
      );

      cloudinaryFormData.set(
        "asset_folder",
        signatureResult.upload.assetFolder,
      );

      cloudinaryFormData.set(
        "api_key",
        signatureResult.upload.apiKey,
      );

      cloudinaryFormData.set(
        "timestamp",
        String(
          signatureResult.upload.timestamp,
        ),
      );

      cloudinaryFormData.set(
        "signature",
        signatureResult.upload.signature,
      );

      cloudinaryFormData.set(
        "public_id",
        signatureResult.upload.publicId,
      );

      const uploadResponse =
        await fetch(
          signatureResult.upload.uploadUrl,
          {
            method: "POST",
            body:
              cloudinaryFormData,
          },
        );

      const uploadResult =
        await uploadResponse.json() as
          CloudinaryUploadResponse;

      if (
        !uploadResponse.ok ||
        !uploadResult.public_id
      ) {
        throw new Error(
          uploadResult.error?.message ??
          "Cloudinary rechazó el documento.",
        );
      }

      if (
        uploadResult.public_id !==
        signatureResult.upload.publicId
      ) {
        throw new Error(
          "Cloudinary devolvió un identificador inesperado.",
        );
      }

      setUploadStage("saving");

      const finalFormData =
        new FormData();

      finalFormData.set(
        "productId",
        productId,
      );

      finalFormData.set(
        "documentType",
        documentType,
      );

      finalFormData.set(
        "title",
        title,
      );

      finalFormData.set(
        "publicId",
        uploadResult.public_id,
      );

      finalFormData.set(
        "fileName",
        selectedFile.name,
      );

      finalFormData.set(
        "intent",
        intent,
      );

      setUploadStage("idle");

      startTransition(() => {
        finalizeDocument(
          finalFormData,
        );
      });
    } catch (error) {
      setUploadStage("idle");

      setLocalError(
        error instanceof Error
          ? error.message
          : "No fue posible subir el documento.",
      );
    }
  }

  if (
    availableTypes.length === 0
  ) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">
            Documentación completa
          </p>

          <p className="mt-1 text-sm leading-6 text-emerald-700">
            El producto ya tiene una ficha técnica, manual, certificado y folleto registrados.
          </p>
        </div>

        <div className="flex justify-end">
          <Link
            href={`/admin/productos/${productId}/editar?step=review`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 hover:underline"
          >
            Continuar a revisión
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="productId"
        value={productId}
      />

      {(localError ||
        state.message) && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible guardar el documento
          </p>

          <p className="mt-1 text-sm text-red-700">
            {localError ??
              state.message}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <FilePlus2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Agregar documento
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              El PDF se subirá directamente a Cloudinary sin atravesar el servidor de Next.js.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="product-document-type"
                className="text-sm font-semibold text-slate-800"
              >
                Tipo de documento
              </label>

              <select
                id="product-document-type"
                name="documentType"
                defaultValue={
                  availableTypes[0].value
                }
                required
                disabled={busy}
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
              >
                {documentTypeOptions.map(
                  (option) => {
                    const registered =
                      existingTypeSet.has(
                        option.value,
                      );

                    return (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={
                          registered
                        }
                      >
                        {option.label}
                        {registered
                          ? " — registrado"
                          : ""}
                      </option>
                    );
                  },
                )}
              </select>

              <AdminFieldError
                errors={
                  state.fieldErrors
                    ?.documentType
                }
              />
            </div>

            <div>
              <label
                htmlFor="product-document-title"
                className="text-sm font-semibold text-slate-800"
              >
                Título
              </label>

              <input
                id="product-document-title"
                name="title"
                type="text"
                maxLength={160}
                required
                disabled={busy}
                placeholder="Ej. Ficha técnica del termómetro IR-200"
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:bg-slate-100"
              />

              <AdminFieldError
                errors={
                  state.fieldErrors?.title
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="product-document"
              className="relative flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-sky-400 hover:bg-sky-50/40"
            >
              {selectedFile ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FileText className="h-6 w-6" />
                  </div>

                  <p className="mt-4 max-w-full truncate text-sm font-semibold text-slate-900">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatFileSize(
                      selectedFile.size,
                    )}
                  </p>

                  <p className="mt-4 text-xs font-semibold text-sky-700">
                    Haz clic para seleccionar otro PDF
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                    <FilePlus2 className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Selecciona un documento
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Archivos PDF de hasta 10 MB.
                  </p>
                </>
              )}

              <input
                id="product-document"
                name="document"
                type="file"
                accept="application/pdf,.pdf"
                required
                disabled={busy}
                onChange={(event) => {
                  const file =
                    event.target.files?.[0] ??
                    null;

                  setSelectedFile(file);
                  setLocalError(null);
                }}
                className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </label>

            <AdminFieldError
              errors={
                state.fieldErrors?.document
              }
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
        <button
          type="submit"
          name="intent"
          value="stay"
          disabled={
            busy ||
            !selectedFile
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Guardar documento
        </button>

        <button
          type="submit"
          name="intent"
          value="continue"
          disabled={
            busy ||
            !selectedFile
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />

              {getProgressLabel(
                uploadStage,
              )}
            </>
          ) : (
            <>
              Guardar y revisar
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}