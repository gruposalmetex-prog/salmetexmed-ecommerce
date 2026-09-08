import "server-only";

import { getCloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE =
  8 * 1024 * 1024;

const ACCEPTED_IMAGE_FORMATS =
  new Set([
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
  ]);

export type CatalogImageStorageErrorCode =
  | "file_too_large"
  | "unsupported_type"
  | "asset_not_found"
  | "invalid_asset";

export class CatalogImageStorageError extends Error {
  constructor(
    public readonly code:
      CatalogImageStorageErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "CatalogImageStorageError";
  }
}

export interface VerifiedCatalogImageAsset {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function verifyUploadedCatalogImage(
  publicId: string,
  expectedPrefix: string,
): Promise<VerifiedCatalogImageAsset> {
  if (
    !publicId.startsWith(
      expectedPrefix,
    )
  ) {
    throw new CatalogImageStorageError(
      "invalid_asset",
      "La imagen no pertenece al registro indicado.",
    );
  }

  const cloudinary =
    getCloudinary();

  let asset;

  try {
    asset =
      await cloudinary.api.resource(
        publicId,
        {
          resource_type: "image",
          type: "upload",
        },
      );
  } catch (error) {
    console.error(
      "No fue posible consultar la imagen en Cloudinary:",
      error,
    );

    throw new CatalogImageStorageError(
      "asset_not_found",
      "La imagen no existe en Cloudinary o ya no está disponible.",
    );
  }

  const format =
    typeof asset.format === "string"
      ? asset.format.toLowerCase()
      : "";

  if (
    asset.public_id !== publicId ||
    asset.resource_type !== "image" ||
    !ACCEPTED_IMAGE_FORMATS.has(format)
  ) {
    throw new CatalogImageStorageError(
      "unsupported_type",
      "La imagen debe estar en formato JPG, PNG, WebP o AVIF.",
    );
  }

  if (
    typeof asset.bytes !== "number" ||
    asset.bytes <= 0
  ) {
    throw new CatalogImageStorageError(
      "invalid_asset",
      "Cloudinary devolvió un tamaño de imagen inválido.",
    );
  }

  if (
    asset.bytes >
    MAX_IMAGE_SIZE
  ) {
    throw new CatalogImageStorageError(
      "file_too_large",
      "La imagen no puede superar 8 MB.",
    );
  }

  if (
    typeof asset.width !== "number" ||
    asset.width <= 0 ||
    typeof asset.height !== "number" ||
    asset.height <= 0
  ) {
    throw new CatalogImageStorageError(
      "invalid_asset",
      "Cloudinary devolvió dimensiones de imagen inválidas.",
    );
  }

  if (
    typeof asset.secure_url !== "string" ||
    !asset.secure_url.startsWith(
      "https://",
    )
  ) {
    throw new CatalogImageStorageError(
      "invalid_asset",
      "Cloudinary devolvió una dirección de imagen inválida.",
    );
  }

  return {
    publicId: asset.public_id,
    url: asset.secure_url,
    width: asset.width,
    height: asset.height,
    format,
    bytes: asset.bytes,
  };
}

export async function deleteCatalogImage(
  publicId: string,
) {
  const cloudinary =
    getCloudinary();

  await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
      invalidate: true,
    },
  );
}
