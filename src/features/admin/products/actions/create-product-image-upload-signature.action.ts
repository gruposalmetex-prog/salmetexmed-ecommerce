"use server";

import { randomUUID } from "node:crypto";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  getCloudinaryPublicConfig,
  signCloudinaryUpload,
} from "@/lib/cloudinary";

import {
  findAdminProductImageContext,
} from "../repositories/admin-product-image.repository";

import {
  createAdminProductImageSchema,
} from "../schemas/admin-product-image.schema";

interface ProductImageUploadSignatureInput {
  productId: string;
  altText: string;
  isPrimary: boolean;
}

interface SignedUploadParameters
  extends Record<
    string,
    string | number
  > {
  asset_folder: string;
  public_id: string;
  timestamp: number;
}

export type ProductImageUploadSignatureResult =
  | {
    success: true;
    upload: {
      uploadUrl: string;
      signature: string;
      apiKey: string;
      parameters:
      SignedUploadParameters;
    };
  }
  | {
    success: false;
    error: string;
  };

export async function createProductImageUploadSignature(
  input:
    ProductImageUploadSignatureInput,
): Promise<ProductImageUploadSignatureResult> {
  await requireAdmin();

  const parsedInput =
    createAdminProductImageSchema.safeParse(
      input,
    );

  if (!parsedInput.success) {
    const firstError =
      Object.values(
        parsedInput.error.flatten()
          .fieldErrors,
      )
        .flat()
        .find(Boolean);

    return {
      success: false,
      error:
        firstError ??
        "Los datos de la imagen no son válidos.",
    };
  }

  const product =
    await findAdminProductImageContext(
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
      error:
        "No puedes agregar imágenes a un producto archivado.",
    };
  }

  const assetFolder = [
    "salmetexmed",
    "products",
    parsedInput.data.productId,
    "images",
  ].join("/");

  const parameters:
    SignedUploadParameters = {
    asset_folder:
      assetFolder,

    public_id: [
      assetFolder,
      randomUUID(),
    ].join("/"),

    timestamp:
      Math.floor(
        Date.now() / 1000,
      ),
  };

  const signature =
    signCloudinaryUpload(
      parameters,
    );

  const {
    cloudName,
    apiKey,
  } = getCloudinaryPublicConfig();

  return {
    success: true,

    upload: {
      uploadUrl:
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(
          cloudName,
        )}/image/upload`,

      signature,
      apiKey,
      parameters,
    },
  };
}