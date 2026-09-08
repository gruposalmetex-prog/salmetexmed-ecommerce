"use server";

import { randomUUID } from "node:crypto";

import { requireAdmin } from "@/features/admin/require-admin";
import {
  getCloudinaryPublicConfig,
  signCloudinaryUpload,
} from "@/lib/cloudinary";

import {
  findAdminAreaImageContext,
} from "../repositories/admin-area-image.repository";

import {
  adminAreaImageSchema,
} from "../schemas/admin-area-image.schema";

interface AreaImageUploadSignatureInput {
  areaId: string;
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

export type AreaImageUploadSignatureResult =
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

export async function createAreaImageUploadSignature(
  input:
    AreaImageUploadSignatureInput,
): Promise<AreaImageUploadSignatureResult> {
  await requireAdmin();

  const parsedInput =
    adminAreaImageSchema.safeParse(
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

  const area =
    await findAdminAreaImageContext(
      parsedInput.data.areaId,
    );

  if (!area) {
    return {
      success: false,
      error:
        "El área no existe.",
    };
  }

  const assetFolder = [
    "salmetexmed",
    "areas",
    area.id,
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
