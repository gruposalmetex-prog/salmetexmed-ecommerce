import "server-only";

import type {
  CreateAdminProductDocumentInput,
} from "../schemas/admin-product-document.schema";

import {
  deleteAdminProductDocumentRecord,
  findAdminProductDocumentByPublicId,
  findAdminProductDocumentContext,
  insertAdminProductDocument,
} from "../repositories/admin-product-document.repository";

import {
  deleteProductDocument,
  verifyUploadedProductDocument,
} from "./product-document-storage.service";

interface CreateAdminProductDocumentCommand
  extends CreateAdminProductDocumentInput {
  publicId: string;
  fileName: string;
}

export type AdminProductDocumentErrorCode =
  | "product_not_found"
  | "product_archived"
  | "document_not_found"
  | "document_already_registered";

export class AdminProductDocumentError extends Error {
  constructor(
    public readonly code:
      AdminProductDocumentErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "AdminProductDocumentError";
  }
}

function normalizeFileName(
  fileName: string,
) {
  const normalized =
    fileName
      .split(/[\\/]/)
      .pop()
      ?.trim() ||
    "documento.pdf";

  return normalized.slice(0, 255);
}

export async function createAdminProductDocument(
  command: CreateAdminProductDocumentCommand,
) {
  const product =
    await findAdminProductDocumentContext(
      command.productId,
    );

  if (!product) {
    throw new AdminProductDocumentError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (
    product.status === "archived"
  ) {
    throw new AdminProductDocumentError(
      "product_archived",
      "No puedes agregar documentos a un producto archivado.",
    );
  }

  const registeredDocument =
    await findAdminProductDocumentByPublicId(
      command.publicId,
    );

  if (registeredDocument) {
    throw new AdminProductDocumentError(
      "document_already_registered",
      "El documento ya fue registrado.",
    );
  }

  let verifiedDocument;

  try {
    verifiedDocument =
      await verifyUploadedProductDocument(
        command.publicId,
        command.productId,
      );
  } catch (verificationError) {
    try {
      await deleteProductDocument(
        command.publicId,
      );
    } catch (cleanupError) {
      console.error(
        "No fue posible limpiar el documento rechazado:",
        cleanupError,
      );
    }

    throw verificationError;
  }

  try {
    return await insertAdminProductDocument({
      productId:
        command.productId,

      documentType:
        command.documentType,

      title:
        command.title,

      fileName:
        normalizeFileName(
          command.fileName,
        ),

      publicId:
        verifiedDocument.publicId,

      url:
        verifiedDocument.url,

      mimeType:
        verifiedDocument.mimeType,

      bytes:
        verifiedDocument.bytes,
    });
  } catch (databaseError) {
    try {
      await deleteProductDocument(
        verifiedDocument.publicId,
      );
    } catch (cleanupError) {
      console.error(
        "No fue posible limpiar el documento de Cloudinary:",
        cleanupError,
      );
    }

    throw databaseError;
  }
}

interface DeleteAdminProductDocumentCommand {
  productId: string;
  documentId: string;
}

export async function removeAdminProductDocument(
  command:
    DeleteAdminProductDocumentCommand,
) {
  const product =
    await findAdminProductDocumentContext(
      command.productId,
    );

  if (!product) {
    throw new AdminProductDocumentError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (
    product.status === "archived"
  ) {
    throw new AdminProductDocumentError(
      "product_archived",
      "No puedes eliminar documentos de un producto archivado.",
    );
  }

  const deletedDocument =
    await deleteAdminProductDocumentRecord(
      command.productId,
      command.documentId,
    );

  if (!deletedDocument) {
    throw new AdminProductDocumentError(
      "document_not_found",
      "El documento no existe o ya fue eliminado.",
    );
  }

  try {
    await deleteProductDocument(
      deletedDocument.publicId,
    );
  } catch (cleanupError) {
    console.error(
      "El documento se eliminó de PostgreSQL, pero no fue posible limpiarlo de Cloudinary:",
      cleanupError,
    );
  }

  return {
    productId: product.id,
    productSlug: product.slug,

    documentId:
      deletedDocument.id,

    documentType:
      deletedDocument.documentType,
  };
}