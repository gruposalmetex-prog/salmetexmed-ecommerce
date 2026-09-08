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

export type ProductImageStorageErrorCode =
  | "file_too_large"
  | "unsupported_type"
  | "asset_not_found"
  | "invalid_asset"
  | "upload_failed";

export class ProductImageStorageError extends Error {
  constructor(
    public readonly code:
      ProductImageStorageErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "ProductImageStorageError";
  }
}

export interface VerifiedProductImageAsset {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

function getExpectedImagePrefix(
  productId: string,
) {
  return `salmetexmed/products/${productId}/images/`;
}

export function isProductImagePublicId(
  publicId: string,
  productId: string,
) {
  return publicId.startsWith(
    getExpectedImagePrefix(productId),
  );
}

export async function verifyUploadedProductImage(
  publicId: string,
  productId: string,
): Promise<VerifiedProductImageAsset> {
  if (
    !isProductImagePublicId(
      publicId,
      productId,
    )
  ) {
    throw new ProductImageStorageError(
      "invalid_asset",
      "La imagen no pertenece al producto indicado.",
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

    throw new ProductImageStorageError(
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
    throw new ProductImageStorageError(
      "unsupported_type",
      "La imagen debe estar en formato JPG, PNG, WebP o AVIF.",
    );
  }

  if (
    typeof asset.bytes !== "number" ||
    asset.bytes <= 0
  ) {
    throw new ProductImageStorageError(
      "invalid_asset",
      "Cloudinary devolvió un tamaño de imagen inválido.",
    );
  }

  if (asset.bytes > MAX_IMAGE_SIZE) {
    throw new ProductImageStorageError(
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
    throw new ProductImageStorageError(
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
    throw new ProductImageStorageError(
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

export async function deleteProductImage(
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