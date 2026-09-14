"use server";

import { randomUUID } from "node:crypto";

import {
  getCloudinaryPublicConfig,
  signCloudinaryUpload,
} from "@/lib/cloudinary";

import { findAdminCategoryImageContext } from "../repositories/admin-category-image.repository";

import { adminCategoryImageSchema } from "../schemas/admin-category-image.schema";
import { checkAdminUploadRateLimit } from "../../check-admin-upload-rate-limit";

interface CategoryImageUploadSignatureInput {
  categoryId: string;
}

interface SignedUploadParameters extends Record<string, string | number> {
  asset_folder: string;
  public_id: string;
  timestamp: number;
}

export type CategoryImageUploadSignatureResult =
  | {
      success: true;

      upload: {
        uploadUrl: string;
        signature: string;
        apiKey: string;

        parameters: SignedUploadParameters;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function createCategoryImageUploadSignature(
  input: CategoryImageUploadSignatureInput,
): Promise<CategoryImageUploadSignatureResult> {
  const rateLimit = await checkAdminUploadRateLimit();

  if (!rateLimit) {
    return {
      success: false,
      error:
        "Has solicitado demasiadas cargas. Espera unos minutos e inténtalo nuevamente.",
    };
  }

  const parsedInput = adminCategoryImageSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError = Object.values(parsedInput.error.flatten().fieldErrors)
      .flat()
      .find(Boolean);

    return {
      success: false,

      error: firstError ?? "Los datos de la imagen no son válidos.",
    };
  }

  const category = await findAdminCategoryImageContext(
    parsedInput.data.categoryId,
  );

  if (!category) {
    return {
      success: false,
      error: "La categoría no existe.",
    };
  }

  const assetFolder = ["salmetexmed", "categories", category.id, "images"].join(
    "/",
  );

  const parameters: SignedUploadParameters = {
    asset_folder: assetFolder,

    public_id: [assetFolder, randomUUID()].join("/"),

    timestamp: Math.floor(Date.now() / 1000),
  };

  const signature = signCloudinaryUpload(parameters);

  const { cloudName, apiKey } = getCloudinaryPublicConfig();

  return {
    success: true,

    upload: {
      uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        cloudName,
      )}/image/upload`,

      signature,
      apiKey,
      parameters,
    },
  };
}
