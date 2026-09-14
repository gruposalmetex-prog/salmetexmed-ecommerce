"use server";

import { randomUUID } from "node:crypto";

import {
  getCloudinaryPublicConfig,
  signCloudinaryUpload,
} from "@/lib/cloudinary";

import { createAdminProductDocumentSchema } from "../schemas/admin-product-document.schema";

import {
  findAdminProductDocumentByType,
  findAdminProductDocumentContext,
} from "../repositories/admin-product-document.repository";
import { checkAdminUploadRateLimit } from "../../check-admin-upload-rate-limit";

interface ProductDocumentUploadSignatureInput {
  productId: string;
  documentType: string;
  title: string;
}

export type ProductDocumentUploadSignatureResult =
  | {
      success: true;
      upload: {
        uploadUrl: string;
        publicId: string;
        assetFolder: string;
        timestamp: number;
        signature: string;
        apiKey: string;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function createProductDocumentUploadSignature(
  input: ProductDocumentUploadSignatureInput,
): Promise<ProductDocumentUploadSignatureResult> {
  const rateLimit = await checkAdminUploadRateLimit();

  if (!rateLimit) {
    return {
      success: false,

      error:
        "Has solicitado demasiadas cargas. Espera unos minutos e inténtalo nuevamente.",
    };
  }

  const parsedInput = createAdminProductDocumentSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError = Object.values(parsedInput.error.flatten().fieldErrors)
      .flat()
      .find(Boolean);

    return {
      success: false,

      error: firstError ?? "Los datos del documento no son válidos.",
    };
  }

  const product = await findAdminProductDocumentContext(
    parsedInput.data.productId,
  );

  if (!product) {
    return {
      success: false,
      error: "El producto no existe.",
    };
  }

  if (product.status === "archived") {
    return {
      success: false,

      error: "No puedes agregar documentos a un producto archivado.",
    };
  }

  const existingDocument = await findAdminProductDocumentByType(
    parsedInput.data.productId,
    parsedInput.data.documentType,
  );

  if (existingDocument) {
    return {
      success: false,

      error: "Este producto ya tiene un documento de ese tipo.",
    };
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const assetFolder = [
    "salmetexmed",
    "products",
    parsedInput.data.productId,
    "documents",
  ].join("/");

  const publicId = [assetFolder, `${randomUUID()}.pdf`].join("/");

  const signature = signCloudinaryUpload({
    asset_folder: assetFolder,
    public_id: publicId,
    timestamp,
  });
  const { cloudName, apiKey } = getCloudinaryPublicConfig();

  return {
    success: true,

    upload: {
      uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        cloudName,
      )}/raw/upload`,

      publicId,
      assetFolder,
      timestamp,
      signature,
      apiKey,
    },
  };
}
